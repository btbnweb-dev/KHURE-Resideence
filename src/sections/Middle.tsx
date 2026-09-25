import { useId, useRef, useState } from 'react'
import { gsap, useGsap } from '../lib/hooks'
import { Fade, Lines, Picture } from '../components/Reveal'
import { LOCATION, RESIDENCES, src, srcSet } from '../content'

/**
 * 04 — LOCATION
 *
 * A conceptual proximity diagram rather than a map. Deliberately abstract: there is no
 * address, pin or travel time, because inventing one for a fictional development would be
 * a factual claim the project cannot support. The rings read as "closer / further" only,
 * and the note under them says so.
 */
export function Location({ motion }: { motion: boolean }) {
  const scope = useGsap(() => {
    if (!motion) return
    const rings = gsap.utils.toArray<SVGCircleElement>('[data-ring]')
    rings.forEach(ring => {
      const length = ring.getTotalLength?.() ?? 600
      gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length })
    })
    gsap.to(rings, {
      strokeDashoffset: 0,
      duration: 1.6,
      stagger: 0.14,
      ease: 'expo.out',
      scrollTrigger: { trigger: '[data-diagram]', start: 'top 78%', once: true },
    })
    gsap.from('[data-ring-label]', {
      opacity: 0, x: -10, duration: 0.9, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '[data-diagram]', start: 'top 72%', once: true },
    })
    // The rings draw once and then hold, which left the chapter static for most of its
    // height. A slow scrubbed drift keeps the diagram answering the wheel while it is read.
    gsap.to('[data-diagram]', {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: { trigger: '[data-diagram]', start: 'top bottom', end: 'bottom top', scrub: 0.3 },
    })
  }, [motion])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="location"
      className="relative bg-[var(--stone)] px-[1.5rem] py-[16vh] sm:px-[2.5rem]"
      data-nav="light"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-x-[5rem] gap-y-[4rem] lg:grid-cols-2">
        <div>
          <Fade><p className="meta mb-[2.5rem]">{LOCATION.eyebrow}</p></Fade>
          <Lines
            id="location-heading"
            lines={LOCATION.headline}
            className="display mb-[2.25rem] max-w-[13ch] text-[clamp(30px,4.6vw,66px)]"
          />
          <Fade delay={0.08}>
            <p className="body-copy mt-[2.5rem] max-w-[40ch]">{LOCATION.body}</p>
          </Fade>

          <ul className="mt-[3.5rem] max-w-[420px]">
            {LOCATION.rings.map((ring, i) => (
              <Fade key={ring.label} delay={i * 0.06}>
                <li
                  data-ring-label
                  className="flex items-baseline justify-between border-t border-[var(--charcoal)]/15 py-[1rem]"
                >
                  <span className="text-[15px]">{ring.label}</span>
                  <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                </li>
              </Fade>
            ))}
          </ul>

          <Fade delay={0.1}>
            <p className="meta mt-[2.25rem] max-w-[46ch] !normal-case !tracking-normal !text-[11.5px] leading-relaxed">
              {LOCATION.note}
            </p>
          </Fade>
        </div>

        {/* Concentric rings: nearest need at the centre, city at the edge. Decorative —
            the same order is written in the list above. */}
        <div data-diagram className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[520px]">
          <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
            <g fill="none" stroke="var(--charcoal)" strokeOpacity="0.28" strokeWidth="0.6">
              {LOCATION.rings.map(ring => (
                <circle key={ring.r} data-ring cx="110" cy="110" r={ring.r} />
              ))}
            </g>
            <g stroke="var(--charcoal)" strokeOpacity="0.14" strokeWidth="0.5">
              <line x1="110" y1="6" x2="110" y2="214" />
              <line x1="6" y1="110" x2="214" y2="110" />
            </g>
            <circle cx="110" cy="110" r="4.5" fill="var(--bronze)" />
            {/* Ring labels are drawn inside the viewBox, so their rendered size follows the
                container: readable at the 520px desktop diagram, but under 9px once the
                square shrinks to phone width. The same four labels already exist as DOM
                text in the list beside the diagram, so below `sm` the drawing keeps only
                its geometry and the list carries the wording at a real font size. */}
            <g className="hidden sm:block">
              {LOCATION.rings.map((ring, i) => (
                <text
                  key={ring.label}
                  x="114"
                  y={110 - ring.r + 4}
                  fill="var(--concrete)"
                  fontFamily="var(--font-mono)"
                  fontSize="5.4"
                  letterSpacing="0.6"
                >
                  {String(i + 1).padStart(2, '0')} {ring.label.toUpperCase()}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

/**
 * 05 — RESIDENCES
 *
 * A sticky split: the image column holds while the three type descriptions scroll past it,
 * and the photographs cross-fade as each one takes over. Editorial rather than a carousel —
 * there is no card, no arrow and nothing to click, the scroll position is the control.
 *
 * Without the sticky behaviour (mobile, reduced motion) each type simply becomes its own
 * stacked block with its own image, which suits a narrow screen better anyway.
 */
export function Residences({ sticky }: { sticky: boolean }) {
  const scope = useGsap(() => {
    if (!sticky) return
    const panels = gsap.utils.toArray<HTMLElement>('[data-res-panel]')
    const images = gsap.utils.toArray<HTMLElement>('[data-res-image]')

    gsap.set(images, { autoAlpha: 0 })
    gsap.set(images[0], { autoAlpha: 1 })

    // Each panel owns the image for the span it is the one being read. `start: 'top center'`
    // hands over as a panel's heading reaches the middle of the screen, which is where the
    // eye already is, so the picture changes with the copy rather than after it.
    panels.forEach((panel, i) => {
      const incoming = images[i].querySelector('img')
      gsap.timeline({
        scrollTrigger: { trigger: panel, start: 'top center', end: 'bottom center', toggleActions: 'play none none reverse' },
      })
        // The pair is normalised: whatever is showing leaves while this one arrives, over
        // the same short window, so the column never dips to empty between two types.
        .to(images, { autoAlpha: 0, duration: 0.32, ease: 'power2.inOut' }, 0)
        .to(images[i], { autoAlpha: 1, duration: 0.32, ease: 'power2.inOut' }, 0)
        .fromTo(incoming, { scale: 1.05 }, { scale: 1, duration: 0.7, ease: 'power2.out' }, 0)
    })
  }, [sticky])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="residences"
      className="relative bg-[var(--paper)] px-[1.5rem] py-[14vh] sm:px-[2.5rem]"
      data-nav="light"
      aria-labelledby="residences-heading"
    >
      <div className="mx-auto max-w-[1560px]">
        <Fade><p className="meta mb-[2rem]">05 — RESIDENCES</p></Fade>
        <Lines
          id="residences-heading"
          lines={['Гурван төрлийн', 'орон зай.']}
          className="display mb-[10vh] max-w-[14ch] text-[clamp(30px,4.6vw,66px)]"
        />

        <div className={'grid grid-cols-1 gap-x-[5rem] ' + (sticky ? 'lg:grid-cols-2' : '')}>
          {/* Image column — sticky on desktop, inlined per panel on small screens. */}
          {/* The column is its own sticky context and must be as tall as the text column.
              When it was shorter, sticking ended before the last panel did and the image
              scrolled away while type C was still being read, leaving an empty column. */}
          {sticky && (
            <div className="hidden self-stretch lg:block">
              {/* A sticky box can only hold for (column - its own height - top). Sized to the
                  full viewport it ran out before the last panel, so type C was read against
                  an empty column. At 74svh it stays pinned across all three panels. */}
              <div className="sticky top-[calc(64px+5vh)] h-[74svh] w-full">
                <div className="relative h-full w-full">
                {RESIDENCES.map(residence => (
                  <div
                    key={residence.id}
                    data-res-image
                    className="frame absolute inset-0 h-full w-full"
                  >
                    <img
                      src={src(residence.img)}
                      srcSet={srcSet(residence.img)}
                      sizes="50vw"
                      alt={residence.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
                </div>
              </div>
            </div>
          )}

          <div>
            {RESIDENCES.map((residence, i) => (
              <article
                key={residence.id}
                data-res-panel
                className={
                  'border-t border-[var(--charcoal)]/15 py-[7vh] ' +
                  (sticky ? 'lg:flex lg:min-h-[86vh] lg:flex-col lg:justify-center' : '')
                }
              >
                <div className="mb-[1.75rem] flex items-baseline gap-[1.25rem]">
                  <span className="meta">{String(i + 1).padStart(2, '0')} / 03</span>
                  <span className="meta !text-[var(--bronze)]">{residence.type}</span>
                </div>

                <h3 className="display text-[clamp(28px,3.4vw,46px)]">{residence.title}</h3>
                <p className="meta mt-[0.75rem]">{residence.rooms}</p>

                {/* On narrow screens the image lives inside its own panel. */}
                {!sticky && (
                  <Picture
                    name={residence.img}
                    alt={residence.alt}
                    kind="up"
                    className="mt-[2rem] h-[46vh] w-full"
                    sizes="100vw"
                  />
                )}

                <p className="body-copy mt-[1.75rem] max-w-[40ch]">{residence.body}</p>

                <dl className="mt-[2.25rem] flex flex-wrap gap-x-[3rem] gap-y-[1.25rem]">
                  {residence.spec.map(item => (
                    <div key={item.k}>
                      <dt className="meta mb-[0.25rem]">{item.k}</dt>
                      <dd className="text-[14.5px]">{item.v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Fictional concept plans. Geometry is illustrative, not a construction drawing. */
const PLANS = {
  a: {
    label: '1 өрөө',
    outline: 'M20 20 H150 V120 H20 Z',
    walls: ['M85 20 V70', 'M85 70 H150', 'M20 88 H62', 'M62 88 V120'],
    rooms: [
      { x: 50, y: 48, t: 'ЗОЧИН' },
      { x: 118, y: 46, t: 'УНТЛАГА' },
      { x: 118, y: 98, t: 'ГАЛ ТОГОО' },
      { x: 40, y: 106, t: 'УГААЛГА' },
    ],
    furniture: ['M30 30 h26 v16 h-26 Z', 'M96 30 h30 v18 h-30 Z', 'M96 82 h40 v10 h-40 Z'],
  },
  b: {
    label: '2 өрөө',
    outline: 'M20 20 H185 V120 H20 Z',
    walls: ['M92 20 V72', 'M92 72 H185', 'M140 72 V120', 'M20 88 H58', 'M58 88 V120'],
    rooms: [
      { x: 54, y: 50, t: 'ЗОЧИН' },
      { x: 140, y: 44, t: 'УНТЛАГА 1' },
      { x: 164, y: 98, t: 'УНТЛАГА 2' },
      { x: 112, y: 98, t: 'ГАЛ ТОГОО' },
      { x: 38, y: 106, t: 'УГААЛГА' },
    ],
    furniture: ['M30 30 h30 v18 h-30 Z', 'M102 30 h32 v20 h-32 Z', 'M150 80 h26 v18 h-26 Z', 'M100 82 h30 v10 h-30 Z'],
  },
  c: {
    label: '3 өрөө',
    outline: 'M20 20 H215 V125 H20 Z',
    walls: ['M96 20 V74', 'M96 74 H215', 'M150 74 V125', 'M182 20 V74', 'M20 92 H56', 'M56 92 V125'],
    rooms: [
      { x: 56, y: 52, t: 'ЗОЧИН' },
      { x: 138, y: 44, t: 'УНТЛАГА 1' },
      { x: 198, y: 46, t: 'УНТЛАГА 2' },
      { x: 184, y: 102, t: 'УНТЛАГА 3' },
      { x: 120, y: 102, t: 'ГАЛ ТОГОО' },
      { x: 36, y: 110, t: 'УГААЛГА' },
    ],
    furniture: ['M30 30 h32 v18 h-32 Z', 'M106 30 h34 v20 h-34 Z', 'M190 28 h18 v20 h-18 Z', 'M160 84 h30 v18 h-30 Z', 'M104 84 h34 v12 h-34 Z'],
  },
} as const

type PlanKey = keyof typeof PLANS

/**
 * 06 — FLOOR PLAN
 *
 * An SVG plan drawn on by scroll: outline, then internal walls, then room labels, then
 * furniture hints, then dimension marks. Switching plans replays the same sequence, so the
 * drawing gesture is consistent whichever type is selected.
 *
 * The tabs are real `role="tab"` controls with arrow-key support, because a plan switcher
 * that only responds to a mouse would put the whole section out of reach of a keyboard.
 */
export function FloorPlan({ motion }: { motion: boolean }) {
  const [plan, setPlan] = useState<PlanKey>('a')
  const tabsId = useId()
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const keys = Object.keys(PLANS) as PlanKey[]

  const scope = useGsap(() => {
    if (!motion) {
      gsap.set('[data-plan-el]', { opacity: 1 })
      return
    }
    const strokes = gsap.utils.toArray<SVGPathElement>('[data-plan-stroke]')
    const labels = gsap.utils.toArray<HTMLElement>('[data-plan-label]')
    const marks = gsap.utils.toArray<HTMLElement>('[data-plan-mark]')

    strokes.forEach(stroke => {
      const length = stroke.getTotalLength?.() ?? 400
      gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length })
    })
    gsap.set([labels, marks], { opacity: 0 })

    gsap.timeline({
      scrollTrigger: { trigger: '[data-plan-stage]', start: 'top 72%', once: true },
      defaults: { ease: 'power2.out' },
    })
      .to(strokes, { strokeDashoffset: 0, duration: 1.15, stagger: 0.075 })
      .to(labels, { opacity: 1, duration: 0.5, stagger: 0.05 }, '-=0.4')
      .to(marks, { opacity: 1, duration: 0.5, stagger: 0.05 }, '-=0.25')

    // The drawing finishes early and then holds for the rest of the chapter, which was the
    // longest static stretch on the page. Drifting the stage keeps it reacting to scroll.
    gsap.to('[data-plan-stage]', {
      yPercent: -5,
      ease: 'none',
      scrollTrigger: { trigger: '[data-plan-stage]', start: 'top bottom', end: 'bottom top', scrub: 0.3 },
    })
    // Re-running on `plan` replays the draw for the newly selected layout.
  }, [motion, plan])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = keys.indexOf(plan)
    let next: PlanKey | null = null
    if (event.key === 'ArrowRight') next = keys[(i + 1) % keys.length]
    if (event.key === 'ArrowLeft') next = keys[(i - 1 + keys.length) % keys.length]
    if (event.key === 'Home') next = keys[0]
    if (event.key === 'End') next = keys[keys.length - 1]
    if (!next) return
    event.preventDefault()
    setPlan(next)
    tabRefs.current[next]?.focus()
  }

  const current = PLANS[plan]

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="plans"
      className="relative bg-[var(--stone)] px-[1.5rem] py-[16vh] sm:px-[2.5rem]"
      data-nav="light"
      aria-labelledby="plans-heading"
    >
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-[3rem] flex flex-wrap items-end justify-between gap-[2rem]">
          <div>
            <Fade><p className="meta mb-[2rem]">06 — FLOOR PLAN</p></Fade>
            <Lines
              id="plans-heading"
              lines={['Төлөвлөлт.']}
              className="display text-[clamp(30px,4.6vw,66px)]"
            />
          </div>

          <div
            role="tablist"
            aria-label="Орон сууцны төлөвлөлт сонгох"
            className="flex gap-[2rem]"
            onKeyDown={onKeyDown}
          >
            {keys.map(key => (
              <button
                key={key}
                ref={node => { tabRefs.current[key] = node }}
                role="tab"
                id={`${tabsId}-tab-${key}`}
                aria-selected={plan === key}
                aria-controls={`${tabsId}-panel`}
                tabIndex={plan === key ? 0 : -1}
                className="tab"
                onClick={() => setPlan(key)}
              >
                {PLANS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${plan}`}
          data-plan-stage
          className="relative border border-[var(--charcoal)]/12 bg-[var(--paper)] p-[1.25rem] sm:p-[2.5rem]"
        >
          <svg
            key={plan}
            viewBox="0 0 240 150"
            /* Capped: stretched to a 1500px column the 240-unit viewBox scales strokes and
               labels far past their intended weight. */
            className="mx-auto h-auto w-full max-w-[760px]"
            role="img"
            aria-label={`${current.label} байрны концепц төлөвлөлтийн зураг`}
          >
            {/* Furniture hints sit underneath the walls so strokes stay crisp. */}
            <g data-plan-el fill="var(--concrete)" fillOpacity="0.14">
              {current.furniture.map((d, i) => <path key={i} data-plan-mark d={d} />)}
            </g>

            <g fill="none" stroke="var(--charcoal)" strokeWidth="1.4" strokeLinejoin="miter">
              <path data-plan-stroke data-plan-el d={current.outline} />
            </g>
            <g fill="none" stroke="var(--charcoal)" strokeWidth="0.9" strokeOpacity="0.8">
              {current.walls.map((d, i) => <path key={i} data-plan-stroke data-plan-el d={d} />)}
            </g>

            <g
              fill="var(--charcoal)"
              fontFamily="var(--font-mono)"
              className="text-[9.6px] min-[400px]:text-[8.2px] sm:text-[4.6px]"
              letterSpacing="0.5"
            >
              {current.rooms.map(room => (
                <text key={room.t} data-plan-label data-plan-el x={room.x} y={room.y} textAnchor="middle">
                  {room.t}
                </text>
              ))}
            </g>

            {/* Dimension marks — illustrative only, carrying no measurements. */}
            <g data-plan-el stroke="var(--bronze)" strokeWidth="0.5" opacity="0.9">
              <line data-plan-mark x1="20" y1="136" x2="150" y2="136" />
              <line data-plan-mark x1="20" y1="133" x2="20" y2="139" />
              <line data-plan-mark x1="150" y1="133" x2="150" y2="139" />
            </g>
            <text
              data-plan-mark
              data-plan-el
              x="85" y="145"
              textAnchor="middle"
              fill="var(--bronze)"
              fontFamily="var(--font-mono)"
              className="text-[9.6px] min-[400px]:text-[7.4px] sm:text-[4.2px]"
              letterSpacing="0.6"
            >
              CONCEPT LAYOUT
            </text>
          </svg>

          <p className="meta mt-[1.75rem] !normal-case !tracking-normal !text-[11.5px]">
            Төлөвлөлтийн зураг нь концепцийн дүрслэл бөгөөд барилгын ажлын зураг биш.
          </p>
        </div>
      </div>
    </section>
  )
}
