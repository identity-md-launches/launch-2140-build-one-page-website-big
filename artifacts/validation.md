# Worker validation and design review

## Scope and assumptions

The brief “big weenies unite” is implemented as a one-page dachshund appreciation site. Its visual idea is a long illustrated dog, warm yellow and brown, and bold friendly type. The primary product interaction is a personalized downloadable badge. No owner identity, account, recipient, contract, or external service was needed. The badge is expressly local to the current tab; there is no fake registration, global membership count, or shared state.

The review covers the final React/TypeScript source and its Vite export in `dist/`, served at `/preview/`. Both the supplied browser tool and a foreground Playwright validation script inspected that production export. No development build was used as evidence. The source, lockfile, complete static export, and documentation are included for submission; Git metadata was not modified.

## Result

| Area | Result |
| --- | --- |
| Brief deliverables | 7 locally met; 0 missing implementations; 0 faked features |
| Broken primary interactions | 0 observed after fixes |
| Product and main action at 390px | Yes; CTA y=339.25, height=56 at 390 × 844 |
| Production build and typecheck | Both exit 0 |
| Interaction validation | 24 passed, 0 failed; 1 unavailable browser runtime |
| taste@1 | 16/16 passed |
| Automated accessibility | 0 axe violations in page and dialog scans |
| Open copy findings | 0 |
| Share card | Local PNG, 1200 × 630, metadata and favicon present |

These are worker observations, not independent certification. The unavailable WebKit run is not counted as a pass.

## Acceptance coverage

| Brief requirement | Evidence |
| --- | --- |
| “a usable website exists with working primary interactions and responsive layouts” | Navigation, FAQs, form validation, preview, download, error/retry, modal dismissal and focus checked; six viewport widths checked |
| “dist/index.html and its assets … alongside the source and lockfile” | Complete `dist/`, `src/`, `package.json`, and `package-lock.json`; Vite `base: "./"`; real subpath and offline request checks |
| “runs the production build, typecheck and useful interaction validation” | Actual commands and results below; machine-readable summaries retained |
| “applies the pinned Better Interface guide … six domains … fixes applicable findings” | Six-domain coverage and six repaired findings below |
| “first screen at 390 … product and its main action … title, favicon, description, og:title and og:image” | Browser screenshot `mobile-390.png`, measured button position, passing probe `share` check and local image response |
| “DESIGN.md … implemented tokens, typography, components and responsive behavior” | Root `DESIGN.md`, extracted after final source changes |
| “README explains how to install, preview and rebuild” | Root `README.md`, scripts and actual result summary |

## Six-domain Better Interface review

The pinned workflow and core principles of accessibility, layout, writing, typography, colors, and UI were read before implementation. Relevant form, modal, focus, reduced-motion, wrapping, and documentation sections were consulted. The pinned wallet reference was considered inapplicable: this is a regular site with nothing to sign.

| Domain | Coverage and evidence | Explicit limits |
| --- | --- | --- |
| Accessibility — Checked | Native buttons, links, radio group, select, details and dialog; one main/h1, skip link, descriptive names, form labels, error descriptions, stable live status; keyboard walk, Tab containment, Escape/focus restoration, and zero-violation page/dialog axe scans | No screen-reader speech session or physical-device/forced-colors manual session; computed names and automated scans are not substitutes |
| Layout — Checked | Shared containers, logical spacing, reading order; production page/dialog at 320/390/768/1024/1440/1920; 200% text enlargement at 390; first action measured and screenshot inspected; tablet overflow repaired | Native 200% browser zoom and RTL mirror not verified; only stated widths were tested |
| Writing — Checked | Headline has 3 words, description explains the club, controls name actions, errors explain recovery; privacy and badge limitations match actual behavior; repetitive fragment copy reduced | English copy only; no localization claim |
| Typography — Checked | Two locally loaded families and three weights; six size tokens; descending heading scale, limited prose measure, body line-height; wrapping inspected on mobile/desktop; 18-wide-character SVG name checked | Font subsets are Latin; international name shaping across operating systems not comprehensively verified |
| Colors — Checked | Token/source audit, rendered solid-background pairs measured, error and both light/dark-surface focus states inspected; probe contrast and axe scans pass | One supported light theme; no dark theme to audit. SVG decorative colors and every browser state were not exhaustively measured |
| UI — Checked | Rest, hover definitions, keyboard focus, press definitions, selected coats, empty-name error, valid preview, successful download, simulated download failure/retry, disclosure open/closed, and overlay dismissal reviewed; motion limited to 150ms and guarded for reduced motion | No loading/pending state for synchronous local work; no empty feed/backend state. Animations-panel replay at 10% speed not performed |

## Findings and fixes

All locations below point to the **final source**, not minified output. No applicable finding remains open.

1. **Medium — tablet illustration caused horizontal scroll.** `src/styles.css:833` and `src/styles.css:886`, `.hero-dog` responsive widths. At 768px its bounding box reached x=781.07; at 1024px it reached x=1030.74. Reduced the tablet SVG width to 110% / 115% and adjusted its inset rather than hiding page overflow. Recheck: page and modal have no horizontal overflow at all six tested widths.

2. **Medium — native modal traversal briefly left its controls.** `src/BadgeMaker.tsx:179`, `onKeyDown`. Starting at close, five forward Tabs reached the body/browser boundary before cycling back. Retained native modal/inert behavior and added explicit forward/reverse wrapping between the first and last controls, skipping unchecked radios in the boundary list. Recheck: ten Tab steps remained inside, and Escape returned focus to the actual trigger.

3. **High — enlarged values text overflowed.** `src/styles.css:1056`, `.belief-strip > div > span`. At 390px with root text enlarged to 200%, “Even bigger love” extended to x=438. Added shrinkable flex text and wrapping instead of clipping. Recheck: 200% text enlargement has no horizontal scroll.

4. **Medium — repetitive fragment copy weakened hierarchy.** `src/App.tsx:172`, `src/App.tsx:293`, `src/App.tsx:430`. The probe reported six two-beat entries across measured widths, including the hero note, circular stamp and FAQ introduction. Replaced these with “No signups, just a little weenie pride.”, a continuous stamp label, and a plain FAQ explanation. Recheck: the probe reports two retained two-beat lines and passes `slogans`; first-screen prose is 19 words at 390px.

5. **Medium — default focus color was unsuitable on the brown banner.** `src/styles.css:503`, `.badge-banner .button:focus-visible`. The default blue against brown computes to 1.36:1. Added a local yellow focus outline, retaining its 3px width and 5px offset. Recheck: actual focused styles were yellow on brown, 9.26:1; a keyboard-focused screenshot was inspected. The hero uses blue on yellow, 6.80:1.

6. **Low — mobile dialog left its action unnecessarily far down.** `src/styles.css:1159`, mobile `.badge-layout` and `.badge-preview`. The initial 220px preview and spacing pushed the download below the opening dialog viewport at 390 × 844. Reduced the preview to 180px and tightened its layout/group gaps. Recheck: the final mobile screenshot shows the full download control; at every tested width it remains reachable by normal dialog scrolling.

An initial build also revealed a Node-oriented React rendering import unsuitable for the browser. The final exporter at `src/BadgeMaker.tsx:144` uses `XMLSerializer` on the safely rendered SVG DOM. The final build has no externalized Node module or unresolved dependency warnings. Download tests parse the result as SVG, paint it independently, verify chosen content, and test escaped markup characters.

## Commands and actual results

Dependencies were installed outside the repository. Package manifests remained in the repository; the lockfile was generated with `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`, then the exact manifest and lockfile were installed with `npm ci --prefix /tmp/bwu-toolchain --ignore-scripts --no-audit --no-fund`. Package caches and browser binaries were outside the repository. Any tool-generated build cache under an ignored dependency path is excluded from delivery. A fresh exact-lockfile external install passed before the final checks.

The worker ran:

```sh
PATH=/tmp/bwu-toolchain/node_modules/.bin:$PATH npm run typecheck -- --project test/scratch/tsconfig.check.json
BWU_DEPENDENCY_ROOT=/tmp/bwu-toolchain PATH=/tmp/bwu-toolchain/node_modules/.bin:$PATH npm run build
BWU_DEPENDENCY_ROOT=/tmp/bwu-toolchain PLAYWRIGHT_BROWSERS_PATH=/tmp/bwu-browsers npm run validate
PLAYWRIGHT_BROWSERS_PATH=/tmp/bwu-browsers IMD_PLAYWRIGHT=/tmp/bwu-toolchain/node_modules/playwright/index.mjs node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline
```

The temporary typecheck project extended the root `tsconfig.json` without weakening any compiler option; it only pointed `baseUrl`, `typeRoots`, and React type declaration paths at the external installation. Normal local `npm ci` uses the root `npm run typecheck` directly. The scratch project is not a delivery/build dependency.

Final typecheck: **exit 0**. Final production build: **exit 0**, 31 modules, approximately 214.82kB JS and 19.07kB CSS before compression, no warnings. Interaction script: **exit 0, 24 passed, 0 failed**. Probe: **exit 0, 16/16 passed**. Application source/export changes were completed before these final checks; subsequent work documented results, retained screenshots, and set the packaging rules.

The interaction suite ran Chromium on `/preview/` while rejecting requests outside its origin. It verified the initial action, navigation, FAQ keyboard behavior, modal containment/return, linked form errors, selected coat/title preview, SVG download content/filename, long names, escaped user text, simulated download failure/retry, persistence until refresh, all six responsive widths, native backdrop/close/Escape behavior, reduced motion and enlarged text. There were no runtime exceptions or missing resources. Axe scans of the page and modal had no violations.

Actual rendered contrast samples:

| Foreground / rendered background | WCAG contrast |
| --- | --- |
| `#582d23` / `#f6e884` | 9.26:1 |
| `#fff9ed` / `#582d23` | 11.04:1 |
| `#713e2d` / `#fff9ed` | 8.24:1 |
| `#713e2d` / `#f6f0e3` | 7.61:1 |
| `#a02620` / `#fff9ed` | 7.17:1 |
| Focus `#304c80` / `#f6e884` | 6.80:1 |
| Focus `#304c80` / `#fff9ed` | 8.10:1 |

Each pair was obtained from rendered styles, with ratios calculated using sRGB relative luminance. Text in SVG artwork was excluded by the probe and is not covered by its typography counts.

## Evidence and limitations

Retained final evidence:

- [390px first screen](mobile-390.png): final product description, primary action and dog artwork.
- [390px badge maker](mobile-badge.png): “Pickles”, Midnight coat and chosen job, with a visible download action.
- [1440px full page](desktop-1440.png): final page layout and copy.
- [Interaction results](validation-results.json): 24 named passes, measurements, and exact WebKit launch limitation.
- [Probe results](taste-results.json): all 16 checks and their reported values.

The probe also generated screenshots at 320, 390 and 1440 in `test/scratch/taste/shots/`. Interaction runs generated additional viewport and enlarged-text images in `test/scratch/validation/`. Those scratch files are temporary and are removed before submission; the three listed images are the retained final screenshots. Screenshots of keyboard focus on the hero and banner were viewed through the browser tool but are not retained delivery artifacts.

WebKit was installed but did not launch because host libraries were missing (`libgtk-4`, `libgraphene`, WOFF2, GStreamer, and others listed in the retained runtime result). It was not used to certify Safari. No requester input is needed for that limitation. There was no physical-device test, screen-reader speech session, native zoom check, RTL mirror, or Animations-panel slow replay. These omissions are explicit limits, not passing checks.

## Completion

**Complete for the stated implementation and worker-check scope**, with the browser and manual-check limitations above. The checked static export is included, all observed applicable defects were repaired and rechecked, and the final design is documented. Delivery files contain no dependency/cache directories, npm archives, submodules, or publishing integration. A final byte inventory is retained with the delivery.

The explicit path budget for the added `.gitignore` is **256 bytes**. `dist/` and retained `artifacts/` each have a **1 MiB** local budget. Generated `**/node_modules/`, `**/.vite/`, `**/.cache/`, `test/scratch/`, and `.playwright-mcp/` each have a **zero-byte submission budget**. The ignore file excludes generated paths and explicitly includes `dist/` and `artifacts/`; the final inventory checks these budgets as well as the overall 8 MiB cap. No required asset was removed to satisfy the budget.
