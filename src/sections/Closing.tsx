import { useRef } from 'react'
import { gsap, useGsap } from '../lib/hooks'
import { Fade, Lines, Picture } from '../components/Reveal'
import { AMENITIES, CONTACT, FACTS, FOOTER, GALLERY, src, srcSet } from '../content'

/**
 * 07 — AMENITIES
 *
 * Alternating full-bleed editorial rows rather than an icon grid: oversized type on one
 * side, a masked photograph on the other, sides swapping each row so the eye zig-zags down
 * the page instead of scanning a table of cards.
 *
 * The rows are revealed on a **scrub** rather than with the shared `Picture` primitive.
 * `Picture` fires once at `top 92%` and is over in under a second, so by the time a row was
 * actually in view it had already settled — the section read as static. Here each row's
 * reveal is tied to its own position in the viewport, so the picture opens *while* it is
 * being scrolled into place and the movement is visible at normal wheel speed.
 */
export function Amenities({ motion }: { motion: boolean }) {
  const scope = useGsap(() => {
    const rows = gsap.utils.toArray<HTMLElement>('[data-amenity]')

    if (!motion) {
      // Reduced motion keeps the composition, without the choreography.
      rows.forEach(row => {
        gsap.set(row.querySelector('[data-amenity-frame]'), { clipPath: 'inset(0% 0px 0px)' })
        gsap.set(row.querySelectorAll('[data-amenity-copy]'), { opacity: 1, y: 0 })
      })
      return
    }

    rows.forEach((row, i) => {
      const frame = row.querySelector<HTMLElement>('[data-amenity-frame]')
      const image = row.querySelector<HTMLElement>('img')
      const copy = row.querySelectorAll<HTMLElement>('[data-amenity-copy]')
      if (!frame || !image) return

      // Odd rows open from the opposite edge, matching the side the row sits on.
      const flip = i % 2 === 1
      const from = flip ? 'inset(0px 100% 0px 0px)' : 'inset(100% 0px 0px)'
      const to = flip ? 'inset(0px 0% 0px 0px)' : 'inset(0% 0px 0px)'

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: row,
          // Starts as the row's top crosses the lower edge and completes around the middle
          // of the screen, so the whole reveal happens in plain sight.
          start: 'top 88%',
          end: 'top 42%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(frame, { clipPath: from }, { clipPath: to, duration: 1 }, 0)
        .fromTo(image, { yPercent: 8, scale: 1.05 }, { yPercent: 0, scale: 1, duration: 1 }, 0)
        .fromTo(copy, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, 0.45)

      // A slow drift after the reveal keeps the row alive while it crosses the screen.
      gsap.fromTo(image,
        { yPercent: 0 },
        {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 42%', end: 'bottom top', scrub: 0.4 },
        })
    })
  }, [motion])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="amenities"
      className="relative bg-[var(--paper)] px-[1.5rem] py-[14vh] sm:px-[2.5rem]"
      data-nav="light"
      aria-labelledby="amenities-heading"
    >
      <div className="mx-auto max-w-[1560px]">
        <Fade><p className="meta mb-[2rem]">07 — AMENITIES</p></Fade>
        <Lines
          id="amenities-heading"
          lines={['Өдөр тутмын', 'орчин.']}
          className="display mb-[8vh] max-w-[14ch] text-[clamp(30px,4.6vw,66px)]"
        />

        <div>
          {AMENITIES.map((item, i) => {
            const flip = i % 2 === 1
            return (
              <article
                key={item.id}
                data-amenity
                className="grid grid-cols-1 items-center gap-x-[4rem] gap-y-[2rem] border-t border-[var(--charcoal)]/12 py-[7vh] md:grid-cols-2"
              >
                <div className={flip ? 'md:order-2 md:pl-[1.5rem]' : 'md:pr-[1.5rem]'}>
                  <div data-amenity-copy className="mb-[1.25rem] flex items-baseline gap-[1.25rem]">
                    <span className="meta">{String(i + 1).padStart(2, '0')} / 06</span>
                    <span className="meta !text-[var(--bronze)]">{item.en}</span>
                  </div>
                  <h3 data-amenity-copy className="display text-[clamp(26px,3.2vw,44px)]">{item.mn}</h3>
                  <p data-amenity-copy className="body-copy mt-[1.25rem] max-w-[36ch]">{item.body}</p>
                </div>

                <div className={'h-[42vh] w-full md:h-[56vh] ' + (flip ? 'md:order-1' : '')}>
                  <div data-amenity-frame className="frame h-full w-full">
                    <img
                      src={src(item.img)}
                      srcSet={srcSet(item.img)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * 08 — GALLERY
 *
 * Desktop pins the section and converts vertical scroll into horizontal travel across a
 * strip of varied-format photographs. The pin distance is derived from the strip's actual
 * width, so the sequence always ends exactly as the last frame arrives — no dead scroll at
 * either end.
 *
 * Touch and reduced motion get a plain vertical stack instead. Driving a horizontal pin
 * from a touch scroll fights the user's own gesture, which is exactly the scroll trap the
 * brief warns about.
 */
export function Gallery({ horizontal }: { horizontal: boolean }) {
  const track = useRef<HTMLDivElement>(null)

  const scope = useGsap(() => {
    if (!horizontal || !track.current) return
    const strip = track.current
    const distance = () => strip.scrollWidth - innerWidth

    gsap.to(strip, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-gallery-stage]',
        start: 'top top',
        // Scrolled at 0.8x the strip's own width: the pictures travel slightly faster than
        // the wheel, so the section clears sooner without feeling snatched away.
        end: () => '+=' + distance() * 0.8,
        scrub: 0.3,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
  }, [horizontal])

  const ratio = (kind: string) =>
    kind === 'portrait' ? 'h-[76vh] w-[58vw] md:w-[30vw]'
      : kind === 'square' ? 'h-[62vh] w-[62vw] md:w-[34vw]'
        : 'h-[66vh] w-[86vw] md:w-[46vw]'

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="gallery"
      className="relative bg-[var(--charcoal)] py-[9vh]"
      data-nav="dark"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto mb-[8vh] max-w-[1560px] px-[1.5rem] sm:px-[2.5rem]">
        <Fade><p className="meta mb-[2rem] !text-white/45">08 — GALLERY</p></Fade>
        <Lines
          id="gallery-heading"
          lines={['Төслийн', 'дүрслэл.']}
          className="display max-w-[14ch] text-[var(--paper)] text-[clamp(30px,4.6vw,66px)]"
        />
      </div>

      {/* The stage fills the pinned viewport and centres the strip inside it, so the
          pictures sit optically in the middle instead of leaving a dead band beneath. */}
      {horizontal ? (
        <div data-gallery-stage className="relative flex h-[100svh] items-center overflow-hidden">
          <div ref={track} className="flex items-center gap-[2rem] px-[1.5rem] will-change-transform sm:px-[2.5rem]">
            {GALLERY.map((item, i) => (
              <figure key={item.img} className={'relative shrink-0 ' + ratio(item.ratio)} data-cursor="view">
                <div className="frame h-full w-full">
                  <img
                    src={src(item.img)}
                    srcSet={srcSet(item.img)}
                    sizes="50vw"
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="meta mt-[1rem] !text-white/45">
                  {String(i + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
                </figcaption>
              </figure>
            ))}
            {/* Tail spacer so the final frame can clear the right edge. */}
            <div className="w-[10vw] shrink-0" aria-hidden="true" />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1560px] space-y-[2rem] px-[1.5rem] sm:px-[2.5rem]">
          {GALLERY.map((item, i) => (
            <figure key={item.img}>
              <Picture
                name={item.img}
                alt={item.alt}
                kind={i % 2 ? 'wipe' : 'up'}
                className="h-[44vh] w-full"
                sizes="100vw"
              />
              <figcaption className="meta mt-[0.75rem] !text-white/45">
                {String(i + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * 09 — PROJECT FACTS
 *
 * Design counts only — residence types, shared spaces, the concept year. No sales figures,
 * completion dates or commercial claims, because none of those exist for a fictional
 * project and inventing them would misrepresent it.
 *
 * The numbers count up on entry; reduced motion shows the final value immediately.
 */
export function Facts({ motion }: { motion: boolean }) {
  const scope = useGsap(() => {
    if (!motion) return
    gsap.utils.toArray<HTMLElement>('[data-fact-n]').forEach(node => {
      const target = node.dataset.factN ?? ''
      // Only numeric facts count; a year counts too, but from a nearby value so it does
      // not spin through four centuries.
      const value = Number(target)
      if (!Number.isFinite(value)) return
      const from = target.length === 4 ? value - 12 : 0
      const counter = { v: from }
      gsap.to(counter, {
        v: value,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        onUpdate: () => {
          node.textContent = target.length === 4
            ? String(Math.round(counter.v))
            : String(Math.round(counter.v)).padStart(target.length, '0')
        },
      })
    })
  }, [motion])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="facts"
      className="relative bg-[var(--charcoal)] px-[1.5rem] py-[16vh] sm:px-[2.5rem]"
      data-nav="dark"
      aria-labelledby="facts-heading"
    >
      <div className="mx-auto max-w-[1560px]">
        <Fade><p className="meta mb-[2rem] !text-white/45">09 — PROJECT</p></Fade>
        <Lines
          id="facts-heading"
          lines={['Концепцийн', 'үзүүлэлт.']}
          className="display mb-[10vh] max-w-[14ch] text-[var(--paper)] text-[clamp(30px,4.6vw,66px)]"
        />

        <dl className="grid grid-cols-2 gap-x-[2.5rem] gap-y-[3.5rem] lg:grid-cols-4">
          {FACTS.map(fact => (
            <Fade key={fact.k}>
              <div className="border-t border-white/15 pt-[1.5rem]">
                <dd
                  data-fact-n={fact.n}
                  className="display text-[var(--paper)] text-[clamp(44px,6vw,86px)] tabular-nums"
                >
                  {fact.n}
                </dd>
                <dt className="mt-[1.25rem]">
                  <span className="meta block !text-[var(--bronze-light)]">{fact.k}</span>
                  <span className="mt-[0.375rem] block text-[14px] text-white/60">{fact.mn}</span>
                </dt>
              </div>
            </Fade>
          ))}
        </dl>
      </div>
    </section>
  )
}

/**
 * 10 — FINAL CTA + FOOTER
 *
 * Closes on photography, mirroring the hero. The buttons are in-page navigation rather than
 * a sales funnel: there is no phone number, form or address, because the development does
 * not exist. The concept status is stated plainly here.
 */
export function Contact({ motion }: { motion: boolean }) {
  const image = useRef<HTMLImageElement>(null)

  const scope = useGsap(root => {
    if (!motion || !image.current) return
    gsap.fromTo(image.current, { scale: 1.16, yPercent: -4 }, {
      scale: 1, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.3 },
    })
  }, [motion])

  return (
    <>
      <section
        ref={scope as React.Ref<HTMLElement>}
        id="contact"
        className="relative min-h-[96svh] overflow-hidden bg-[var(--charcoal)]"
        data-nav="dark"
        aria-labelledby="contact-heading"
      >
        <img
          ref={image}
          src={src('night-city')}
          srcSet={srcSet('night-city')}
          sizes="100vw"
          alt="Шөнийн хотын гэрэл бүхий харагдац"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/62" />

        <div className="relative flex min-h-[96svh] flex-col justify-end px-[1.5rem] pt-[104px] pb-[12vh] sm:px-[2.5rem]">
          <div className="mx-auto w-full max-w-[1560px]">
            <Fade><p className="meta mb-[2rem] !text-white/45">{CONTACT.eyebrow}</p></Fade>

            <Lines
              id="contact-heading"
              lines={CONTACT.headline}
              className="display mb-[2.25rem] max-w-[14ch] text-[var(--paper)] text-[clamp(34px,6vw,90px)]"
            />

            <Fade delay={0.08}>
              <p className="mt-[2.25rem] max-w-[40ch] text-[15.5px] leading-relaxed text-white/70">
                {CONTACT.body}
              </p>
            </Fade>

            <Fade delay={0.14}>
              <div className="mt-[3rem] flex flex-wrap items-center gap-[1rem]">
                <a className="btn btn-solid" href="#philosophy">{CONTACT.primary}</a>
                <a className="btn btn-ghost" href="#plans">{CONTACT.secondary}</a>
                <span className="meta w-full sm:ml-[0.5rem] sm:w-auto !text-white/45">CONCEPT PROJECT</span>
              </div>
            </Fade>

            <Fade delay={0.18}>
              <p className="meta mt-[2.5rem] max-w-[52ch] !normal-case !tracking-normal !text-[11.5px] leading-relaxed !text-white/45">
                {CONTACT.disclosure}
              </p>
            </Fade>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--charcoal)] px-[1.5rem] pb-[3.5rem] sm:px-[2.5rem]" data-nav="dark">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-end justify-between gap-[2rem] border-t border-white/12 pt-[2.5rem]">
          <div>
            {FOOTER.lines.map((line, i) => (
              <p
                key={line}
                className={i === 0
                  ? 'font-serif text-[20px] tracking-[0.1em] text-[var(--paper)]'
                  : 'meta mt-[0.375rem] !text-white/45'}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="meta !text-white/35">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
