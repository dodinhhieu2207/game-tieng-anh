# PixiUI — Toy Detective only

Pinned 2026-10-16. Lazy loaded after existing PixiJS 8.22.0; no app framework migration.

- `pixi-ui.js`: @pixi/ui 2.4.1, https://cdn.jsdelivr.net/npm/@pixi/ui@2.4.1/dist/pixi-ui.js ; MIT original `LICENSE`; peer Pixi ^8.6.2.
- SHA-256: 2FA30EDA3E76EBC86937C6343928C450E69538D2E8F2EF1675B6135B737CD216.
- `tweedle.js`: required browser UMD dependency tweedle.js 2.1.0, https://cdn.jsdelivr.net/npm/tweedle.js@2.1.0/dist/tweedle.umd.min.js ; original MIT `TWEEDLE-LICENSE` from package LICENSE.md. SHA-256 A8A54967709BDB0B9A007D6EDAB5AC0E1E086FFC0BC535566AA5324F311A8E03.
- Published namespace is `PIXI.ui`, dependency `tweedle_js`. Use the UMD distribution, not the CJS dist/tweedle.js.
- Scene FancyButton owns down/up/out events and visual state; destruction removes its listeners/ticker. Custom opening/retrieval choreography remains owned GSAP. HTML supplies equivalent accessible actions. No example artwork copied.
