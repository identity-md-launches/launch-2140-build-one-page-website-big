# Big Weenies Unite

A one-page dachshund appreciation site with original SVG illustrations, responsive navigation, expandable FAQs, and a personalized badge maker. Pick a name, coat, and job title, then download a standalone SVG badge.

The badge is created in the current browser tab. There is no account, mailing list, member database, analytics, wallet, or backend. Refreshing clears the form. Required fonts and images are included locally.

## Install and develop

Use Node.js 24 and npm. From the repository root:

```sh
npm ci
npm run dev
```

Open the local URL Vite prints. `package-lock.json` pins the dependencies. Generated dependency and cache directories are not delivery files.

## Rebuild and preview

```sh
npm run typecheck
npm run build
npm run preview
```

The finished site is already included in `dist/`. Static hosting should serve the **contents of `dist/`**. Vite's `base: "./"`, relative asset paths, and hash links support gateway subpaths without route rewrites. No production server or credentials are needed. Opening the HTML through a local HTTP preview is recommended because browsers restrict JavaScript modules on `file://` URLs.

The favicon, description, Open Graph title and 1200 × 630 PNG share card are present in the export. The share image URL is relative because no public hostname was supplied; a publisher can make it absolute once the final address exists.

## Validate the export

```sh
npx playwright install chromium webkit
npm run validate
```

The validation script owns a temporary HTTP server and tests **`dist/` at `/preview/`**, then closes its browser and server. It checks the primary flow, form errors and recovery, focus containment and restoration, downloads and SVG escaping, navigation, FAQs, reduced motion, accessibility, and responsive layouts. Reports and temporary screenshots go to `test/scratch/validation/`. WebKit is attempted; launch failures are reported as limitations rather than passes. A failing interaction makes the command exit nonzero.

When the pinned review input is available, run its independent style probe from the repository root:

```sh
node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline
```

That pinned input is removed for submission, so the probe itself is not part of this project. Its actual final result is retained in [artifacts/taste-results.json](artifacts/taste-results.json).

## Results from this delivery

| Check | Actual result |
| --- | --- |
| Clean install from the lockfile | Passed, external dependency directory |
| TypeScript `tsc --noEmit` | Passed, exit 0 |
| Production `vite build` | Passed, exit 0; 31 modules, no build warnings |
| Export interaction validation | 24 passed, 0 failed, exit 0 |
| Pinned taste@1 probe | 16/16 checks passed |
| Automated accessibility | Zero axe violations in the default page and open badge dialog |
| Reflow | No horizontal overflow at 320, 390, 768, 1024, 1440, or 1920 CSS px; download reachable at each width |
| First screen at 390 × 844 | Product and primary action visible; action starts at y=339.25 and is 56px tall |
| Runtime requests and console | No external requests, missing local assets, or script errors during validation |

Chromium and the supplied browser tool were used to inspect the production export. WebKit downloaded but could not launch because required host libraries were absent, including GTK 4, Graphene, WOFF2, and GStreamer dependencies. Safari/iOS behavior is therefore **not verified**. Physical devices, assistive technology speech, native browser 200% zoom, RTL mirroring, and slow-motion playback in the browser's Animations panel were not tested. A separate **200% text enlargement** check passed; it is not a native zoom check. Automated scans do not establish full accessibility conformance.

Dependencies were installed outside the repository to respect the assignment's protected paths. The optional `BWU_DEPENDENCY_ROOT` build setting and `scripts/dependencies.mjs` support this; ordinary `npm ci` installations need no setting. Actual worker commands and the external typecheck setup are recorded in [artifacts/validation.md](artifacts/validation.md).

See [DESIGN.md](DESIGN.md) for implemented tokens and components, [artifacts/validation.md](artifacts/validation.md) for the six-domain review and repaired findings, and [artifacts/validation-results.json](artifacts/validation-results.json) for the interaction check list. Final screenshots: [mobile](artifacts/mobile-390.png), [badge maker](artifacts/mobile-badge.png), [desktop](artifacts/desktop-1440.png).

## Edit the site

- `src/App.tsx`: page copy, navigation, FAQ content, and badge triggers.
- `src/Dog.tsx`: original dachshund illustration and three coat palettes.
- `src/BadgeMaker.tsx`: preview, validation, focus behavior, and SVG export.
- `src/styles.css`: typography, color tokens, component states, and responsive rules.
- `public/`: local fonts, licenses, favicon, and share assets.
- `scripts/`: export server, interaction validation, and share-card generation.

To regenerate the share PNG after editing `public/share-card.svg`:

```sh
node scripts/make-share-card.mjs
npm run build
```

This requires the Chromium installation used by Playwright. Keep the finished `dist/` with the source and lockfile. Do not include dependency directories, browser downloads, scratch output, package caches, or registry archives in a submission.

The explicit packaging path budgets are `.gitignore` ≤256 bytes, `dist/` ≤1 MiB, and `artifacts/` ≤1 MiB, within the overall 8 MiB limit. Generated `**/node_modules/`, `**/.vite/`, `**/.cache/`, `test/scratch/`, and `.playwright-mcp/` have a zero-byte submission budget. The ignore file excludes those generated paths and explicitly includes the required export and retained evidence. These local budgets leave the complete source and runtime assets intact.
