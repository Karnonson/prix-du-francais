// Le point d'entrée de la comparaison : monter() branche la page — les deux cases, le verdict, les
// mesures, la langue, le bouton « Traduire » — sur le document. Le DOM n'est touché qu'à l'appel.
import { TOKENIZERS } from "./decoupeurs.js";
import { MEASURED } from "./mesures.js";
import { TEMPLATES } from "./exemples.js";
import { STRINGS } from "./textes.js";

export function monter() {
  const $ = (id) => document.getElementById(id);
  const state = { ui: "fr", tok: "o200k", template: "skill", ready: {}, failed: false };
  const text = { en: $("text-en"), fr: $("text-fr") };
  let sample = null;

  const t = (key) => STRINGS[state.ui][key];
  const locale = () => (state.ui === "fr" ? "fr-CA" : "en-CA");
  const fmt = (n, digits = 0) => new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
  const pct = (r) => new Intl.NumberFormat(locale(), { style: "percent", maximumFractionDigits: 0 }).format(Math.abs(r - 1));
  const times = (r) => `${fmt(r, 2)}×`;

  // Decode token by token. A character split over several tokens decodes as "" until its last
  // byte arrives, so empty pieces fold into the next one and the chip keeps the real count.
  function cut(enc, value) {
    const ids = enc.encode(value);
    const pieces = [];
    let pending = 0;
    for (const id of ids) {
      const piece = enc.decode([id]);
      pending += 1;
      if (piece === "") continue;
      pieces.push({ text: piece, n: pending });
      pending = 0;
    }
    if (pending) pieces.push({ text: "", n: pending });
    return { count: ids.length, pieces };
  }

  const CHIP_LIMIT = 700;
  function renderChips(el, result) {
    el.classList.remove("loading");
    el.replaceChildren();
    if (!result.count) {
      el.classList.add("loading");
      el.textContent = t("empty");
      return;
    }
    let shown = 0;
    let index = 0;
    for (const p of result.pieces) {
      if (shown >= CHIP_LIMIT) break;
      const chip = document.createElement("span");
      chip.className = (index++) % 2 ? "chip alt" : "chip";
      const parts = p.text.split(/( |\n)/);
      let breaks = 0;
      for (const part of parts) {
        if (part === " ") {
          const s = document.createElement("span");
          s.className = "sp";
          s.textContent = "·";
          chip.append(s);
        } else if (part === "\n") {
          const s = document.createElement("span");
          s.className = "sp";
          s.textContent = "↵";
          chip.append(s);
          breaks += 1;
        } else if (part) {
          chip.append(part);
        }
      }
      if (p.n > 1) {
        const sub = document.createElement("sub");
        sub.textContent = p.n;
        sub.title = t("multi");
        chip.append(sub);
      }
      el.append(chip);
      for (let i = 0; i < breaks; i++) el.append(document.createElement("br"));
      shown += p.n;
    }
    if (result.count > shown) {
      const more = document.createElement("span");
      more.className = "chips-more";
      more.textContent = t("more")(fmt(result.count - shown));
      el.append(more);
    }
  }

  function counts(tok) {
    const enc = state.ready[tok];
    if (!enc) return null;
    return { en: cut(enc, text.en.value), fr: cut(enc, text.fr.value) };
  }

  function render() {
    for (const lang of ["en", "fr"]) {
      const n = [...text[lang].value].length;
      $("chars-" + lang).textContent = n ? "· " + t("chars")(fmt(n)) : "";
    }
    if (state.failed) {
      for (const lang of ["en", "fr"]) {
        $("chips-" + lang).className = "chips loading";
        $("chips-" + lang).textContent = t("loadFailed");
      }
      return;
    }
    const main = counts(state.tok);
    if (!main) {
      for (const lang of ["en", "fr"]) {
        $("chips-" + lang).className = "chips loading";
        $("chips-" + lang).textContent = t("loading");
        $("count-" + lang).textContent = "–";
      }
      renderVerdict({});
      return;
    }
    for (const lang of ["en", "fr"]) {
      $("count-" + lang).textContent = fmt(main[lang].count);
      renderChips($("chips-" + lang), main[lang]);
    }
    renderVerdict({ o200k: state.tok === "o200k" ? main : counts("o200k"), cl100k: state.tok === "cl100k" ? main : counts("cl100k") });
  }

  function renderVerdict(all) {
    const main = all[state.tok];
    const big = $("big");
    big.className = "big num";
    if (!main || !main.en.count || !main.fr.count) {
      big.textContent = "–";
      $("verdict-text").textContent = main ? t("waiting") : "";
      $("verdict-scale").textContent = "";
    } else {
      const r = main.fr.count / main.en.count;
      const rounded = Math.round((r - 1) * 100);
      if (rounded > 0) {
        big.classList.add("more");
        big.textContent = `+${pct(r)}`;
        $("verdict-text").innerHTML = t("more_")(pct(r));
      } else if (rounded < 0) {
        big.classList.add("less");
        big.textContent = `−${pct(r)}`;
        $("verdict-text").innerHTML = t("less_")(pct(r));
      } else {
        big.textContent = "±0\u00a0%";
        $("verdict-text").textContent = t("same_");
      }
      $("verdict-scale").textContent = t("scale")(fmt(1000), fmt(Math.round(r * 1000)));
    }

    const bars = $("bars");
    bars.replaceChildren();
    for (const tok of ["o200k", "cl100k"]) {
      const c = all[tok];
      if (!c) continue;
      const max = Math.max(c.en.count, c.fr.count, 1);
      const group = document.createElement("div");
      group.className = "bar-group";
      const ratio = c.en.count && c.fr.count ? times(c.fr.count / c.en.count) : "";
      group.innerHTML = `<div class="bar-title"><span></span><span class="ratio num"></span></div>`;
      group.querySelector(".bar-title span").textContent = t(tok === "o200k" ? "barTitleRecent" : "barTitleOlder");
      group.querySelector(".ratio").textContent = ratio;
      for (const lang of ["en", "fr"]) {
        const row = document.createElement("div");
        row.className = `bar ${lang}`;
        row.innerHTML = `<span class="code">${lang.toUpperCase()}</span><span class="track"><span class="fill" style="display:block"></span></span><span class="val num"></span>`;
        row.querySelector(".fill").style.width = `${(c[lang].count / max) * 100}%`;
        row.querySelector(".val").textContent = fmt(c[lang].count);
        group.append(row);
      }
      bars.append(group);
    }
  }

  function renderPlot() {
    const lo = 1.0, hi = 1.6;
    const x = (r) => `${((r - lo) / (hi - lo)) * 100}%`;
    const current = MEASURED.filter((m) => !m.legacy).map((m) => m.fr / m.en);
    const bandLo = Math.min(...current), bandHi = Math.max(...current);
    const plot = $("plot");
    plot.replaceChildren();
    for (const m of MEASURED) {
      const r = m.fr / m.en;
      const row = document.createElement("div");
      row.className = "plot-row" + (m.legacy ? " legacy" : "");
      const note = m.legacy ? (state.ui === "fr" ? m.noteFr : m.noteEn) : m.note;
      row.innerHTML = `<div class="who"><b></b><span></span></div><div class="lane"><span class="range"></span><span class="dot"></span></div><div class="val num"></div>`;
      row.querySelector(".who b").textContent = m.legacy && state.ui === "en" ? "Claude 1 and 2" : m.name;
      row.querySelector(".who span").textContent = note;
      const range = row.querySelector(".range");
      range.style.left = x(bandLo);
      range.style.width = `calc(${x(bandHi)} - ${x(bandLo)})`;
      row.querySelector(".dot").style.left = x(r);
      row.querySelector(".val").textContent = times(r);
      row.title = `${fmt(m.en)} → ${fmt(m.fr)}`;
      plot.append(row);
    }
    const axis = document.createElement("div");
    axis.className = "plot-axis";
    axis.innerHTML = `<span></span><div class="ticks"></div><span></span>`;
    const ticks = axis.querySelector(".ticks");
    for (let v = lo; v <= hi + 1e-9; v += 0.1) {
      const s = document.createElement("span");
      s.style.left = x(v);
      s.textContent = times(v);
      if (v > hi - 0.05) s.style.transform = "translateX(-100%)";
      ticks.append(s);
    }
    plot.append(axis);
  }

  function renderTemplates() {
    const row = $("template-row");
    row.replaceChildren();
    for (const tpl of TEMPLATES) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "template";
      b.id = "template-" + tpl.id;
      b.setAttribute("aria-pressed", String(state.template === tpl.id));
      b.innerHTML = `<strong></strong><span></span><span class="run"></span>`;
      b.querySelector("strong").textContent = tpl.label[state.ui];
      b.querySelector("span").textContent = tpl.hint[state.ui];
      b.querySelector(".run").textContent = t("run");
      b.addEventListener("click", () => loadTemplate(tpl.id));
      row.append(b);
    }
  }

  function loadTemplate(id) {
    const tpl = TEMPLATES.find((x) => x.id === id);
    state.template = id;
    text.en.value = tpl.en;
    text.fr.value = tpl.fr;
    $("note-en").textContent = "";
    $("note-fr").textContent = "";
    renderTemplates();
    render();
  }

  function applyUi() {
    document.documentElement.lang = state.ui === "fr" ? "fr" : "en";
    document.title = state.ui === "fr" ? "Le prix du français" : "The price of French";
    for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    for (const el of document.querySelectorAll("[data-i18n-html]")) el.innerHTML = t(el.dataset.i18nHtml);
    for (const b of document.querySelectorAll("[data-ui]")) b.setAttribute("aria-pressed", String(b.dataset.ui === state.ui));
    document.querySelector(".ui-lang").setAttribute("aria-label", t("uiGroup"));
    renderTemplates();
    renderPlot();
    render();
  }

  let pendingRender = 0;
  for (const lang of ["en", "fr"]) {
    text[lang].addEventListener("input", () => {
      if (state.template) {
        state.template = null;
        renderTemplates();
      }
      $("note-" + lang).textContent = "";
      clearTimeout(pendingRender);
      pendingRender = setTimeout(render, 90);
    });
  }
  for (const b of document.querySelectorAll("[data-ui]")) {
    b.addEventListener("click", () => { state.ui = b.dataset.ui; applyUi(); });
  }
  for (const b of document.querySelectorAll("[data-tok]")) {
    b.addEventListener("click", () => {
      state.tok = b.dataset.tok;
      for (const o of document.querySelectorAll("[data-tok]")) o.setAttribute("aria-pressed", String(o === b));
      render();
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(src));
      document.head.append(s);
    });
  }
  for (const [name, spec] of Object.entries(TOKENIZERS)) {
    loadScript(spec.src)
      .then(() => {
        state.ready[name] = globalThis[spec.global];
        render();
      })
      .catch(() => {
        if (name === state.tok || !Object.keys(state.ready).length) state.failed = true;
        render();
      });
  }

  // Translation: only inside a Claude viewer that can ask Claude; hidden everywhere else.
  async function setupTranslate() {
    if (!window.claude?.use) return;
    sample = await window.claude.use("sample");
    if (!sample) return;
    for (const lang of ["en", "fr"]) {
      const button = $("translate-" + lang);
      button.hidden = false;
      button.addEventListener("click", () => translate(lang, button));
    }
  }

  async function translate(target, button) {
    const source = target === "fr" ? "en" : "fr";
    const input = text[source].value.trim();
    const note = $("note-" + target);
    note.classList.remove("error");
    if (!input) {
      text[source].focus();
      return;
    }
    const buttons = document.querySelectorAll(".translate");
    buttons.forEach((b) => (b.disabled = true));
    const label = button.textContent;
    button.textContent = t("translating");
    note.textContent = "";
    const instruction = target === "fr"
      ? 'Translate the text inside <text> into natural French, using the informal "tu" register.'
      : "Translate the text inside <text> into natural English.";
    try {
      const { text: out } = await sample(
        `${instruction} Keep the meaning, the tone, the line breaks and any *emphasis* marks. Reply with the translation only: no quotes, no notes.\n\n<text>\n${input}\n</text>`,
        { modelTier: "quick", onText: ({ text: so }) => { text[target].value = so; } },
      );
      text[target].value = out.trim();
      state.template = null;
      renderTemplates();
      note.textContent = t("translateNote");
    } catch (e) {
      note.classList.add("error");
      const errors = t("translateErrors");
      note.textContent = errors[e?.code] ?? errors.default;
      if (e?.code === "not_granted") $("translate-en").hidden = $("translate-fr").hidden = true;
    } finally {
      buttons.forEach((b) => (b.disabled = false));
      button.textContent = label;
      render();
    }
  }

  loadTemplate(state.template);
  applyUi();
  setupTranslate();
}
