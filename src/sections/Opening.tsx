import { useRef } from 'react'
import { gsap, useGsap } from '../lib/hooks'
import { Fade, Lines, Picture } from '../components/Reveal'
import { ARCHITECTURE, BRAND, HERO, PHILOSOPHY, src, srcSet } from '../content'

/**
 * 01 — HERO
 *
 * Full-bleed photograph with the headline over it. On load the image settles from 1.06 to
 * 1 while the type is uncovered; on scroll the same image keeps drifting and darkening, so
 * the hero hands over to the next chapter instead of simply scrolling away.
 */
export function Hero({ motion }: { motion: boolean }) {
  const image = useRef<HTMLImageElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)

  const scope = useGsap(root => {
    const spans = gsap.utils.toArray<HTMLElement>('.line > span', root)
    gsap.set(spans, { yPercent: 108 })

    // Entry. Runs regardless of reduced motion, but collapses to a plain fade below.
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
    if (motion) {
      intro
        .fromTo(image.current, { scale: 1.06 }, { scale: 1, duration: 2.2 }, 0)
        .to(spans, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.25)
        .from('[data-hero-meta]', { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 0.9)
        .from('[data-hero-support]', { opacity: 0, y: 14, duration: 0.9 }, 1.0)
    } else {
      gsap.set(spans, { yPercent: 0 })
    }

    if (!motion) return

    // Departure, scrubbed against the hero's own height.
    gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.3 },
    })
      .to(image.current, { scale: 1.14, yPercent: 8, ease: 'none' }, 0)
      .to(veil.current, { opacity: 0.72, ease: 'none' }, 0)
      .to(copy.current, { yPercent: -18, opacity: 0, ease: 'none' }, 0)
  }, [motion])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="hero"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[var(--charcoal)]"
      data-nav="dark"
      aria-labelledby="hero-heading"
    >
      <img
        ref={image}
        src={src('hero')}
        srcSet={srcSet('hero')}
        sizes="100vw"
        alt="Үдшийн гэрэлд харагдах орчин үеийн орон сууцны барилгын фасад"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="sync"
      />
      {/* Two veils: a flat wash for overall contrast and a foot gradient so the copy has a
          dark ground no matter how bright the photograph is at that crop. */}
      <div ref={veil} className="absolute inset-0 bg-[var(--ink)] opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0bd9] via-[#0d0d0b40] to-transparent" />

      <div ref={copy} className="relative flex h-full flex-col justify-end px-[1.5rem] pb-[12vh] sm:px-[2.5rem]">
        <div className="mx-auto w-full max-w-[1560px]">
          <p data-hero-meta className="meta mb-[1.75rem] !text-white/55">
            {BRAND.city} · {BRAND.kind} · {BRAND.year}
          </p>

          <h1 id="hero-heading" className="display max-w-[16ch] text-[var(--paper)] text-[clamp(38px,7.2vw,104px)]">
            {HERO.headline.map((line, i) => (
              <span className="line" key={i}>
                <span>{line}{i < HERO.headline.length - 1 ? ' ' : ''}</span>
              </span>
            ))}
          </h1>

          <div className="mt-[2.5rem] flex flex-wrap items-end justify-between gap-[2rem]">
            <p data-hero-support className="max-w-[38ch] text-[15px] leading-relaxed text-white/70">
              {HERO.support}
            </p>
            <p data-hero-meta className="meta !text-white/40">Доош гүйлгэнэ үү</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 02 — PHILOSOPHY
 *
 * The page's first paper chapter. Editorial type on the left, a tall image entering from
 * the opposite side, and the four principles as technical metadata rather than icon cards.
 */
export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative bg-[var(--stone)] px-[1.5rem] py-[16vh] sm:px-[2.5rem]"
      data-nav="light"
      aria-labelledby="philosophy-heading"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-x-[4rem] gap-y-[4rem] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="lg:pr-[2.5rem]">
          <Fade><p className="meta mb-[2.5rem]">{PHILOSOPHY.eyebrow}</p></Fade>

          <Lines
            id="philosophy-heading"
            lines={PHILOSOPHY.headline}
            className="display mb-[2.25rem] max-w-[15ch] text-[clamp(30px,4.6vw,66px)]"
          />

          <div className="mt-[3rem] max-w-[46ch] space-y-[1.25rem]">
            {PHILOSOPHY.body.map((paragraph, i) => (
              <Fade key={i} delay={i * 0.08}>
                <p className="body-copy">{paragraph}</p>
              </Fade>
            ))}
          </div>

          <dl className="mt-[4rem] grid max-w-[480px] grid-cols-2 gap-x-[2.5rem] gap-y-[1.75rem]">
            {PHILOSOPHY.notes.map((note, i) => (
              <Fade key={note.k} delay={i * 0.06}>
                <div className="border-t border-[var(--charcoal)]/15 pt-[1rem]">
                  <dt className="meta mb-[0.375rem]">{note.k}</dt>
                  <dd className="text-[15px]">{note.v}</dd>
                </div>
              </Fade>
            ))}
          </dl>
        </div>

        <Picture
          name="philosophy"
          alt="Өдрийн гэрэл тусах нээлттэй зочны орон зай"
          kind="wipe"
          className="h-[52vh] w-full lg:h-[76vh] lg:self-start"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      </div>
    </section>
  )
}

/**
 * 03 — ARCHITECTURE
 *
 * A pinned sequence. One photograph holds the frame while a blueprint grid is drawn over
 * it, labels count in around the details, and then the overlay clears so the image is left
 * clean — the chapter reads as a drawing being laid over a building and lifted off again.
 *
 * On mobile and under reduced motion the pin is dropped entirely and the same content is
 * presented as an ordinary image with the labels listed beneath it, which is legible
 * without any of the choreography.
 */
export function Architecture({ pinned }: { pinned: boolean }) {
  const image = useRef<HTMLImageElement>(null)

  const scope = useGsap(root => {
    if (!pinned) return
    const lines = gsap.utils.toArray<SVGPathElement>('[data-blueprint] path, [data-blueprint] line')
    const labels = gsap.utils.toArray<HTMLElement>('[data-arch-label]')

    lines.forEach(line => {
      const length = line.getTotalLength?.() ?? 400
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
    })
    gsap.set(labels, { opacity: 0, y: 10 })

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '+=190%',
        scrub: 0.35,
        pin: '[data-arch-stage]',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      defaults: { ease: 'none' },
    })

    // The camera runs the whole length so the picture answers the very first wheel notch;
    // the overlay is layered on top of that continuous move rather than waiting for it.
    timeline
      .to(image.current, { scale: 1.08, xPercent: -2, duration: 6 }, 0)
      // The grid draws on straight away, as secondary detail behind the copy.
      .to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: 0.03, ease: 'power1.out' }, 0.15)
      // Labels arrive one at a time; the stagger is wide enough that they read in sequence
      // instead of all competing for attention at once.
      .to(labels, { opacity: 1, y: 0, duration: 0.5, stagger: 0.3, ease: 'power2.out' }, 1.1)
      // The overlay lifts and leaves the photograph clean before the section hands over.
      .to(labels, { opacity: 0, y: -8, duration: 0.45, stagger: 0.08 }, 4.1)
      .to(lines, { strokeDashoffset: (_i: number, t: SVGPathElement) => -(t.getTotalLength?.() ?? 400), duration: 1, stagger: 0.025 }, 4.3)
      .to(image.current, { scale: 1, xPercent: 0, duration: 1.4 }, 4.6)
  }, [pinned])

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      id="architecture"
      className="relative bg-[var(--charcoal)]"
      data-nav="dark"
      aria-labelledby="architecture-heading"
    >
      <div data-arch-stage className="relative h-[100svh] min-h-[520px] w-full overflow-hidden">
        <img
          ref={image}
          src={src('architecture')}
          srcSet={srcSet('architecture')}
          sizes="100vw"
          alt="Доороос харсан орчин үеийн орон сууцны барилгын фасад"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[var(--ink)]/45" />

        {/* Blueprint overlay. Decorative: every label is also written in the list below. */}
        <svg
          data-blueprint
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Secondary detail: thin and low-contrast so it reads under the copy, not with it. */}
          <g stroke="var(--bronze-light)" strokeWidth="0.07" opacity="0.42" fill="none" vectorEffect="non-scaling-stroke">
            <line x1="14" y1="0" x2="14" y2="100" />
            <line x1="38" y1="0" x2="38" y2="100" />
            <line x1="62" y1="0" x2="62" y2="100" />
            <line x1="86" y1="0" x2="86" y2="100" />
            <line x1="0" y1="22" x2="100" y2="22" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="78" x2="100" y2="78" />
            <path d="M14 22 L38 22 L38 50 L14 50 Z" strokeWidth="0.13" />
            <path d="M62 50 L86 50 L86 78 L62 78 Z" strokeWidth="0.13" />
          </g>
        </svg>

        {ARCHITECTURE.labels.map(label => (
          <div
            key={label.id}
            data-arch-label
            className="pointer-events-none absolute hidden -translate-x-1/2 md:block"
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
            aria-hidden="true"
          >
            <span className="block h-6 w-px bg-[var(--bronze-light)]/45" />
            <span className="mt-[0.45rem] block whitespace-nowrap font-mono text-[9.5px] tracking-[0.2em] text-[var(--paper)]/70">
              {label.en}
            </span>
          </div>
        ))}

        <div className="relative flex h-full flex-col justify-end px-[1.5rem] pb-[10vh] sm:px-[2.5rem]">
          <div className="mx-auto w-full max-w-[1560px]">
            <p className="meta mb-[1.5rem] !text-white/50">{ARCHITECTURE.eyebrow}</p>
            <Lines
              id="architecture-heading"
              lines={ARCHITECTURE.headline}
              className="display mb-[1.75rem] max-w-[14ch] text-[var(--paper)] text-[clamp(30px,5vw,72px)]"
            />
            <Fade delay={0.1}>
              <p className="mt-[1.75rem] max-w-[42ch] text-[15px] leading-relaxed text-white/65">
                {ARCHITECTURE.body}
              </p>
            </Fade>
          </div>
        </div>
      </div>

      {/* Text equivalent of the overlay, and the only version shown on small screens. */}
      <div className="mx-auto max-w-[1560px] px-[1.5rem] pb-[12vh] sm:px-[2.5rem] md:sr-only">
        <ul className="grid grid-cols-2 gap-x-[2rem] gap-y-[1.25rem] pt-[2.5rem] sm:grid-cols-3">
          {ARCHITECTURE.labels.map(label => (
            <li key={label.id} className="border-t border-white/15 pt-[0.75rem]">
              <p className="meta !text-white/45">{label.en}</p>
              <p className="mt-[0.25rem] text-[14px] text-[var(--paper)]">{label.mn}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
