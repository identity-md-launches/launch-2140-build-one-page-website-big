# Big Weenies Unite design

## Overview

The site interprets “big weenies unite” as a playful dachshund fan club. The visual idea is a very long illustrated dog against a butter-yellow field, with heavy, tightly spaced headings and warm brown ink. The page invites visitors to make a free badge, rather than implying that a static page can register members.

The hero pairs the three-word heading “Big weenies unite.” with a plain description and one filled action. Supporting content uses shared alignment edges, generous section spacing, and flat illustration panels. The source of truth is `src/styles.css`; page composition is in `src/App.tsx`.

## Colors

All CSS colors use hexadecimal sRGB values. The cream, yellow, and brown primitives feed the role tokens in `src/styles.css:16`. There is one intentional light theme.

| Token | Value | Implemented use |
| --- | --- | --- |
| `--color-page` | `#fff9ed` | Page, dialog, light text on primary actions |
| `--color-surface` | `#f6f0e3` | Weenie energy section background |
| `--color-hero` | `#f6e884` | Hero, footer, inverse action, decorative accents on brown |
| `--color-art-sun` | `#efdb66` | Circular field behind the hero dog |
| `--color-text` | `#582d23` | Primary ink and strong brown surfaces |
| `--color-text-secondary` | `#713e2d` | Descriptions, hints, field borders |
| `--color-action` | `#582d23` | Primary button fill |
| `--color-action-hover` | `#421f1b` | Primary hover and emphasized hover ink |
| `--color-on-action` | `#fff9ed` | Primary button and banner text |
| `--color-border` | `#c5b5a1` | FAQ separators |
| `--color-focus` | `#304c80` | Keyboard focus on light backgrounds |
| `--color-error` | `#a02620` | Invalid field text and border |
| `--color-art-peach` | `#efc5a5` | Adventurer illustration panel |
| `--color-art-lilac` | `#e3dce9` | Burrower illustration panel |

The banner action overrides its focus outline to `--color-hero` against the brown surface. Header/mobile navigation and footer separators use `#c4ae63`. The backdrop is translucent `#29160f99`. Dog colors are artwork values in the `coats` array, separate from UI statuses.

Measured from rendered foreground/background styles: brown on yellow 9.26:1; cream on brown 11.04:1; secondary brown on cream 8.24:1; secondary brown on the energy section 7.61:1; error red on cream 7.17:1. The blue focus perimeter has 6.80:1 contrast against yellow and 8.10:1 against cream. The banner's yellow focus perimeter has 9.26:1 against brown. These pairs do not constitute an audit of every SVG artwork color.

## Typography

Headings and the wordmark use **Bricolage Grotesque**, weight 800, with `sans-serif` fallback. Body and controls use **DM Sans**, weights 400 and 600, with `sans-serif` fallback. Both are local WOFF2 Latin subsets in `public/fonts/` with `font-display: swap`; browser font checks confirmed they load. Font licenses are alongside them.

There are six interface size tokens. Values below assume the standard 16px root size.

| Token | Desktop above 1184px | At 390px | Role |
| --- | --- | --- | --- |
| `--text-small` | 14px | 14px | Hints, notes, footer metadata |
| `--text-body` | 16px | 16px | Prose, controls, fields |
| `--text-lead` | 20px | 20px | Wordmark and selected supporting copy |
| `--text-title` | 28px | 24px | Card and dialog headings |
| `--text-section` | 48px | 36px | Section headings |
| `--text-display` | 112px | 68px | Hero heading |

Display size becomes 96px at 74rem, 80px at 58rem, and 58px at 23rem. Section size becomes 44px at 74rem and 40px at 58rem before the 36px mobile value. Title size becomes 24px at 74rem.

Body line height is 1.6; hero supporting copy is 1.5; controls are 1.4. Headings use 1.08, except the mobile hero at 0.98 and compact energy headings at 1.2. Display tracking is −0.065em; other headings and the wordmark use −0.04em. Body copy has natural tracking. Headings balance wrapping; paragraphs use pretty wrapping. Descriptions are generally capped at 29–46ch, with FAQ answers capped at 65ch. Important input values are not ellipsized.

The downloadable badge is independent SVG artwork, using portable `Arial, sans-serif`: name size 44 SVG units, or 30 for names longer than 12 characters. The form always displays the full editable name at 16px and accepts up to 18 characters. A wide 18-character name was checked to stay inside the badge border.

## Layout

`--space-1` through `--space-6` are 8, 16, 24, 32, 48, and 80px. At 42rem and below, the largest step becomes 56px. Hero, story, and FAQ sections also use explicitly larger section-specific padding in their own selectors.

`.container` starts at `min(100% - 7rem, 1280px)`. Total horizontal inset becomes 5rem at 74rem, 3rem at 58rem, 2.5rem at 42rem, and 2rem at 23rem. Margins and padding generally use logical properties. Physical geometry is confined to illustration shapes and pointer coordinates.

| Breakpoint | Implemented behavior |
| --- | --- |
| Above 74rem | Hero in two columns; expanded navigation and outlined header action; three illustration columns; split story and FAQ |
| Up to 74rem / 1184px | Smaller display scale and gutters; constrained hero art; tighter card gaps |
| Up to 58rem / 928px | Header badge action hides; hero and story remain split; footer wraps; smaller banner emblem |
| Up to 42rem / 672px | Navigation disclosure replaces desktop links; hero stacks with action above dog; story copy precedes stamp; cards stack; FAQ stacks; banner emblem hides |
| Up to 23rem / 368px | Smaller display type and gutters; values strip wraps and hides decorative flowers |

The mobile badge maker stacks a 180px preview above its fields. On larger widths it uses two columns. The dialog is at most 900px wide, inset at least 16px, and scrolls within `100dvh - 32px`. Text containers grow with content. Heading and values-strip wrapping support text enlargement without hiding overflow.

The exported page and dialog were checked at 320, 390, 768, 1024, 1440, and 1920 CSS px. At 390 × 844, the primary button occupies y=339.25–395.25, above the artwork. Text enlargement to 200% also passed at 390px. Native zoom and RTL rendering were not verified.

## Elevation & Depth

The page is deliberately flat: no card shadows, gradients, or nested panel stacks. Background tones separate regions. FAQ borders communicate structure, while selected radio outlines communicate state. The native dialog uses the browser's top layer and a dimmed backdrop; content behind it is inert. Full-width hero color comes from contained, isolated pseudo-elements, with controls inside the layout margins.

## Shapes

`--radius-control` is 8px for actions and fields. `--radius-panel` is 16px for illustration surfaces and the banner. The modal uses 24px radius, reduced to 20px on mobile. Coat swatches, sun shapes, and stamps are circular. Flat organic SVG dogs, small stars, and linework are the common illustration vocabulary.

## Components

| Component or pattern | Source | Behavior and reuse |
| --- | --- | --- |
| `.button` | `src/styles.css:159` | Minimum 56px height, 24px icons, semibold labels; primary, outline, and light variants; hover only on hover-capable devices; explicit focus ring |
| `Arrow`, `DogMark`, `Flower` | `src/App.tsx` | Decorative inline SVG using current color; arrows accompany a visible text label |
| Navigation | `src/App.tsx:87` | Home logo, hash links, desktop utility; mobile button exposes `aria-expanded` and a navigation region; following a mobile link closes it |
| `Dog` | `src/Dog.tsx` | `coat`: cinnamon/chocolate/midnight; `pose`: stand/sleep/play; decorative SVG used in hero, cards, and badge |
| Energy item | `src/App.tsx` | One flat illustration panel, heading, and paragraph; columns collapse into a vertical list |
| FAQ | `src/App.tsx` | Native `details`/`summary`, visible plus/minus affordance; keyboard activation and expanding content remain in normal flow |
| `BadgeMaker` | `src/BadgeMaker.tsx:99` | Controlled `open`/`onClose`; native modal; initial focus inside; explicit forward/reverse Tab wrap; Escape, close, and backdrop dismissal; focus returns to the actual trigger |
| Badge form | `src/BadgeMaker.tsx:236` | Labeled name, native radio group and select; validates on submit; invalid name is focused and linked to corrective text; SVG preview updates immediately |
| Download status | `src/BadgeMaker.tsx:326` | Stable polite live region; success and recoverable failure text; choices persist only in component state until refresh |

Focus rings are 3px with 5px offset on ordinary controls. Radio focus surrounds the whole label; selected coats also have a checkmark and swatch outline. Reduced-motion users receive immediate state changes and ordinary scrolling. Otherwise, controls use 150ms transitions with `cubic-bezier(.2,0,0,1)` and a 0.96 pressed scale. Nothing animates indefinitely or enters on initial page load. Forced-colors mode preserves system focus and control boundaries.

## Do’s and don’ts

- Start new content with `.container`, `.section`, the existing type tokens, and a clear heading/description pair.
- Keep one filled primary action in a view; use outline or text links for navigation and secondary actions.
- Reuse `Dog` and the existing artwork palette rather than adding a different illustration style.
- Keep user text out of SVG markup strings. The current exporter serializes React's safely rendered DOM.
- Preserve real labels, native controls, visible focus, the reduced-motion guard, and the mobile first-screen action.
- Keep content and status truthful about this tab's local behavior; a static badge is not a registered membership.
- When extending a section, test 320px, a tablet width, and enlarged text before changing the shared sizing rules.

For another section, reuse the container/section classes, an existing heading step, and the current button pattern, then recheck its hash destination, focus treatment on its background, and reflow. This document describes the implemented site; broader accessibility and browser limitations are in `artifacts/validation.md`.
