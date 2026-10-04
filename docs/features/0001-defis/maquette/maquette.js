// La maquette seulement, jamais du code produit : montre l'état nommé après # (le premier sinon), et
// fait passer d'un état à l'autre les contrôles qui portent data-goto="<état>".
(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-state]"));
  if (!sections.length) return;
  function show(name) {
    var found = sections.some(function (s) { return s.dataset.state === name; });
    var current = found ? name : sections[0].dataset.state;
    sections.forEach(function (s) { s.hidden = s.dataset.state !== current; });
    document.querySelectorAll(".maquette-etats a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-goto]");
    if (!el) return;
    e.preventDefault();
    location.hash = el.getAttribute("data-goto");
  });
  document.addEventListener("submit", function (e) {
    var el = e.target.closest("form[data-goto]");
    if (!el) return;
    e.preventDefault();
    location.hash = el.getAttribute("data-goto");
  });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
  show(location.hash.slice(1));
})();
