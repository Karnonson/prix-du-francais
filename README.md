# Le prix du français

A one-page tool for people who don't code: write the same sentence in English and in French and see how
many tokens an AI counts for each, cut into visible pieces. It opens on an example, with three examples to
pick from, and a French/English switch for the page itself.

- **Counting runs in the browser.** It uses [`gpt-tokenizer`](https://github.com/niieani/gpt-tokenizer)
  2.9.0 from jsDelivr, with two tokenizers: `o200k_base` (GPT-4o, GPT-5) and `cl100k_base` (GPT-4, within
  about 1% of Llama 3, Qwen 3 and DeepSeek V3 on French). Stay on 2.9.0: in the 3.x `dist/` builds,
  `cl100k_base.js` is actually `o200k_base`.
- **Claude isn't in the live counter.** Its tokenizer isn't public, and the exact `count_tokens` endpoint
  needs an API key. The page says so.
- **Translate button:** it only shows when the page is open in a Claude viewer that allows the `sample`
  capability. It spends the visitor's own Claude usage, after they agree. Everywhere else it stays hidden
  and the page works without it.
- **"Et sur de vrais textes longs ?" chart:** the numbers are fixed. They come from
  `tools/token_estimate.py` in `workflow-skills`, run on 2026-09-12 on the six CADRER skills, English
  against a working French translation. Re-run that script and edit `MEASURED` in `index.html` when the
  real French twin exists.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page, written as a page body — the form Claude Artifacts publish |
| `build.sh` | Wraps `index.html` into `dist/index.html`, a full document for any other static host |
| `deploy.sh` | Builds, then force-pushes `dist/` as the `gh-pages` branch |

## Publish

- **GitHub Pages** — https://karnonson.github.io/prix-du-francais/ — run `./deploy.sh` after committing.
  Pages serves the `gh-pages` branch, so `main` stays source only. No translate button there.
- **Claude Artifact** — publish `index.html` with `capabilities: {sample: {}}` so the translate button can
  appear.
