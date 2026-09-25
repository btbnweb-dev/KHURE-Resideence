import { useRef } from 'react'
import { gsap, useGsap, ScrollTrigger } from '../lib/hooks'
import { src, srcSet } from '../content'

/**
 * Heading revealed line by line from behind a mask.
 *
 * Each line is its own clipped block, so the type appears to be uncovered rather than to
 * slide in. Reduced motion renders the lines in place: the mask stays (it is structural)
 * but nothing moves.
 */
export function Lines({
  lines, className = '', as = 'h2', delay = 0, id,
}: {
  lines: readonly string[]
  className?: string
  as?: 'h1' | 'h2' | 'p'
  delay?: number
  id?: string
}) {
  const Tag = as
  const scope = useGsap(root => {
    const spans = gsap.utils.toArray<HTMLElement>('.line > span', root)
    if (!spans.length) return

    // `start: 'top 86%'` only fires while scrolling *down through* that point. An anchor
    // jump, a mid-page refresh or a browser restoring scroll position all land past it, so
    // the trigger never runs and the heading stays parked off-screen forever.
    // `onRefresh` covers exactly that: if the element is already above the start line when
    // ScrollTrigger measures, the text is placed in its final position immediately.
    gsap.set(spans, { yPercent: 108 })
    const reveal = gsap.to(spans, {
      yPercent: 0,
      duration: 0.8,
      delay,
      ease: 'expo.out',
      stagger: 0.06,
      paused: true,
    })
    ScrollTrigger.create({
      trigger: root,
      start: 'top 93%',
      once: true,
      onEnter: () => reveal.play(),
      onRefresh: self => { if (self.progress > 0) reveal.progress(1) },
    })
  }, [])

  return (
    <Tag id={id} ref={scope as React.Ref<never>} className={className}>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span>
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/** Supporting copy: a short rise with a fade, staggered when several are grouped. */
export function Fade({
  children, className = '', delay = 0, y = 16,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const scope = useGsap(root => {
    // Same reasoning as `Lines`: an element already past the start line when ScrollTrigger
    // measures is shown immediately rather than left at opacity 0.
    const reveal = gsap.from(root, {
      opacity: 0, y, duration: 0.7, delay, ease: 'expo.out', paused: true,
    })
    ScrollTrigger.create({
      trigger: root,
      start: 'top 90%',
      once: true,
      onEnter: () => reveal.play(),
      onRefresh: self => { if (self.progress > 0) reveal.progress(1) },
    })
  }, [])
  return <div ref={scope as React.Ref<HTMLDivElement>} className={className}>{children}</div>
}

type RevealKind = 'up' | 'wipe' | 'scale'

/**
 * Image revealed behind a clipping frame.
 *
 * Three variants so the page does not repeat one gesture: `up` uncovers vertically, `wipe`
 * horizontally, and `scale` grows the frame while the image counter-scales — the frame and
 * the picture move in opposite directions, which reads as a camera settling rather than a
 * box growing. Only transform and clip-path are animated.
 */
export function Picture({
  name, alt, kind = 'up', className = '', imgClassName = '', priority = false, sizes = '100vw',
}: {
  name: string
  alt: string
  kind?: RevealKind
  className?: string
  imgClassName?: string
  /** The hero image is the LCP element: it loads eagerly and is never lazy. */
  priority?: boolean
  sizes?: string
}) {
  const frame = useRef<HTMLDivElement>(null)
  const scope = useGsap(() => {
    const node = frame.current
    const image = node?.querySelector('img')
    if (!node || !image) return

    const reveal = gsap.timeline({ paused: true })
    if (kind === 'wipe') {
      reveal
        .fromTo(node, { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.inOut' }, 0)
        .fromTo(image, { scale: 1.12 }, { scale: 1, duration: 1, ease: 'power3.out' }, 0)
    } else if (kind === 'scale') {
      reveal
        .fromTo(node, { scale: 0.93 }, { scale: 1, duration: 0.95, ease: 'power3.out' }, 0)
        .fromTo(image, { scale: 1.14 }, { scale: 1, duration: 0.95, ease: 'power3.out' }, 0)
    } else {
      reveal
        .fromTo(node, { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 0.85, ease: 'power3.inOut' }, 0)
        .fromTo(image, { scale: 1.12, yPercent: 4 },
          { scale: 1, yPercent: 0, duration: 1, ease: 'power3.out' }, 0)
    }
    // An image that is already on screen at measure time must not stay clipped to nothing.
    ScrollTrigger.create({
      trigger: node,
      start: 'top 92%',
      once: true,
      onEnter: () => reveal.play(),
      onRefresh: self => { if (self.progress > 0) reveal.progress(1) },
    })
  }, [kind])

  return (
    <div ref={scope as React.Ref<HTMLDivElement>} className={className}>
      <div ref={frame} className="frame h-full w-full">
        <img
          src={src(name)}
          srcSet={srcSet(name)}
          sizes={sizes}
          alt={alt}
          className={imgClassName}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
      </div>
    </div>
  )
}
