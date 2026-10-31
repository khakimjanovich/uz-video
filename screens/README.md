# Product screens

Real screenshots of ecom-front (merchant portal, bank console, payment page) for the course's "watch the product" parts.

- The front runs from a private clone at its `origin/main` (`~/Library/Caches/uz-video-screens`), on port **5181**; 5180 is never used.
- Every `/api` call is answered from fixtures (`fixtures/`, `shots/`); a call no fixture answers is listed after its screenshot.
- Sign-in is faked: a stored session the app takes as signed in; the role comes from the `GET /api/v1/session` fixture.
- The card form is the card zone's own frame (page, script and style from the cards repository) on a stand-in origin; only its API answers are fixtures.
- `overrides.ts`: the front's strings that still name a processing centre or a card scheme, replaced by generic wording. Delete it once the front's strings are generic.

Sample data is generic: a shop called "Toy Corner", amounts in cents, `example.com` hosts.

```bash
bun screens/shots/proof.ts   # writes .screens-out/proof/*.png (git-ignored)
```

Needs Bun, Google Chrome, and `~/Documents/acquiring` with `ecom-front` (its `node_modules` installed), `contracts` and `cards`.
