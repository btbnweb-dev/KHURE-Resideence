# KHURE Residence

**Scroll-driven architectural concept site** — a long-form landing page for a premium urban
residential development.

KHURE Residence is **fictional**. It is not a real development and nothing on the page
describes one: there is no address, developer, permit, completion date, price, phone number
or sales figure anywhere in the project, and the numbers in the Project Facts section are
design counts rather than commercial claims. It exists as a portfolio piece demonstrating
scroll choreography, editorial typography and image direction.

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Structure

Ten chapters on one continuous scroll: hero, philosophy, architecture, location,
residences, floor plans, amenities, gallery, project facts, contact.

The page is deliberately **not** ten stacked sections. Chapters hand over to one another —
the hero keeps drifting and darkening as the next section is revealed beneath it, and the
background moves through warm stone → charcoal → paper → charcoal so the story reads as
chapters rather than as blocks.

## Scroll system

GSAP + ScrollTrigger. No 3D.

**Three pinned scenes, not ten.** Pinning everything makes a page feel stuck, so only the
sequences that earn it are pinned:

| Scene | Technique |
| --- | --- |
| Architecture | pinned; photo drifts, SVG blueprint draws on, labels arrive, overlay lifts |
| Residences | sticky image column; A → B → C cross-fade driven by panel position |
| Gallery | pinned; vertical scroll converted to horizontal travel across the strip |

Everything else uses ordinary document flow with entry reveals, so the pins stand out.

**Reveals** come in several coherent variants rather than one repeated gesture: line masks
for headings (`translateY 108% → 0` behind `overflow:hidden`), and three image treatments —
vertical uncover, horizontal wipe, and a frame/image counter-scale.

**`useGsap`** wraps every scene in `gsap.context()`, so StrictMode's double mount reverts
cleanly and no duplicate pins survive.

## Performance

- Images are local WebP at two widths with `srcset`; only the hero is eager and preloaded
- Everything below the fold is `loading="lazy"`
- Animation is limited to `transform`, `opacity` and `clip-path`
- Scroll handlers write through refs inside rAF; no React state updates per frame
- GSAP is split into its own chunk

## Responsive

Tested at 1440, 1280, 1024, 768, 390 and 320. No horizontal overflow at any width.

Below 900px the choreography changes rather than shrinking: pins are dropped, the sticky
residence split becomes stacked blocks with their own images, and the horizontal gallery
becomes a vertical one. A horizontal pinned strip driven by a touch scroll fights the
user's own gesture, so it is never used on touch devices.

## Reduced motion

`prefers-reduced-motion: reduce` stands the whole system down together: no pins, no
scrubbed parallax, no masks, no cursor. Every heading and image renders in its final
position — verified as 0 pins, 0 hidden headings and 0 clipped images.

## Accessibility

Semantic landmarks, one `h1`, a skip link first in tab order, visible focus rings,
`lang="mn"`, alt text on every photograph, and decorative SVG marked `aria-hidden`. The
floor-plan switcher is a real tablist with arrow/Home/End key support. The architecture
overlay's labels are also written as text beneath it.

## Imagery

Photographs are from [Unsplash](https://unsplash.com), used under the
[Unsplash License](https://unsplash.com/license), which permits free commercial and
non-commercial use. They are downloaded, converted to WebP at two widths and served from
`public/img/` rather than hotlinked.

The photographs show unrelated real buildings and interiors. They stand in for a concept
that was never built and do not depict any actual KHURE property.

| File | Unsplash photo ID |
| --- | --- |
| hero | `1545324418-cc1a3fa10c00` |
| philosophy | `1600607687939-ce8a6c25118c` |
| architecture | `1486406146926-c627a92ad1ab` |
| city | `1449824913935-59a10b8d2000` |
| res-a | `1737898415581-7dea57a1905b` |
| res-b | `1600566753086-00f18fb6b3ea` |
| res-c | `1776363116182-51694a04a1d5` |
| lobby | `1758448511533-e1502259fff6` |
| fitness | `1571902943202-507ec2618e8f` |
| lounge | `1503174971373-b1f69850bded` |
| facade-detail | `1497604401993-f2e922e5cb0a` |
| stair | `1502005229762-cf1b2da7c5d6` |
| night-city | `1470723710355-95304d8aece4` |
| terrace | `1502672260266-1c1ef2d93688` |
| parking | `1758448721161-7b3df5ec04b3` |
| playground | `1759672909501-ee3f8cde2018` |
| courtyard | `1779447345538-d2c4a1572a77` |
| res-facade | `1617788982734-8ac82b25b8e1` |

Re-fetch any of them with:
`https://images.unsplash.com/photo-<id>?w=1800&q=72&fm=webp&fit=max`

## Typography

Cormorant Garamond (editorial serif) · Inter (interface) · JetBrains Mono (technical
metadata). All three ship Cyrillic subsets, which is why they were chosen — the page is
written in Mongolian and the display face has to render Cyrillic properly.

## Stack

React 19 · TypeScript · Tailwind CSS 4 · GSAP ScrollTrigger · Vite. No 3D library, no
animation framework beyond GSAP, no UI kit.
