import { useEffect, useRef, useState } from 'react'
import { BRAND, CHAPTERS, NAV } from '../content'

/** Wordmark: KHURE with the sub-label locked to its baseline. */
export function Logo({ tone = 'auto' }: { tone?: 'auto' | 'light' | 'dark' }) {
  const color = tone === 'light' ? 'text-[var(--paper)]' : tone === 'dark' ? 'text-[var(--charcoal)]' : ''
  return (
    <span className={'flex items-baseline gap-[0.625rem] ' + color}>
      <span className="font-serif text-[22px] leading-none tracking-[0.14em]">{BRAND.name}</span>
      <span className="font-mono text-[8.5px] tracking-[0.3em] opacity-60">{BRAND.suffix}</span>
    </span>
  )
}

/**
 * Fixed navigation.
 *
 * The bar sits over photography in the hero and over paper further down, so it carries an
 * explicit theme rather than `mix-blend-mode` — blend modes invert unpredictably over
 * mid-tone images and would make the wordmark unreadable at exactly the wrong moment.
 * `data-nav-theme` is written onto <html> by whichever section is in view.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    // `useNavTheme` writes `data-nav-theme` from its own rAF, so reading it straight out of
    // a scroll handler samples the value from the *previous* frame and the bar ends up
    // dressed for the section it has just left. Measuring the section directly here keeps
    // the ground, the type and the page underneath in the same frame.
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'))
    let frame = 0
    const update = () => {
      frame = 0
      setScrolled(scrollY > 40)
      const probe = scrollY + 92
      let tone = 'dark'
      for (const section of sections) {
        if (section.offsetTop <= probe) tone = section.dataset.nav ?? 'dark'
      }
      setDark(tone !== 'light')
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [])

  // `dark` describes the section under the bar. Over a dark chapter the glass takes a dark
  // ground and light type; over paper it does the reverse, so it always sits *with* the
  // page rather than inverting it. The mobile sheet covers everything, so it is always dark.
  const tone = open || dark ? 'light' : 'dark'
  const light = tone === 'light'

  // A contained panel inset from the edges rather than a full-width slab. It gains ground
  // once scrolling starts; at the very top it stays lighter so the hero reads uninterrupted.
  const glass = open
    ? 'bg-[var(--charcoal)] border-transparent'
    : dark
      ? (scrolled ? 'bg-[#141412a0] border-white/10' : 'bg-[#14141266] border-white/[0.07]')
      : (scrolled ? 'bg-[#f5f2ebb8] border-[#1a1a18]/10' : 'bg-[#f5f2eb7a] border-[#1a1a18]/[0.07]')

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[200] px-[0.75rem] pt-[0.75rem] sm:px-[1.25rem] sm:pt-[1rem]">
      <div
        className={
          'pointer-events-auto mx-auto flex h-[58px] max-w-[1560px] items-center justify-between '
          + 'rounded-[14px] border px-[1rem] backdrop-blur-[18px] sm:px-[1.5rem] md:h-[64px] '
          + 'shadow-[0_6px_28px_-12px_rgba(20,20,18,0.35)] '
          + 'transition-[background-color,border-color] duration-500 ' + glass
        }
      >
        <a href="#top" aria-label={`${BRAND.full} — эхлэл`}>
          <Logo tone={tone} />
        </a>

        <nav
          className={'hidden items-center gap-[2rem] lg:flex ' + (light ? 'text-[var(--paper)]' : 'text-[var(--charcoal)]')}
          aria-label="Үндсэн цэс"
        >
          {NAV.map((item, i) => {
            // The last entry is the closing call to action. It keeps a thin border and full
            // strength instead of the resting dimness the others carry.
            const cta = i === NAV.length - 1
            return (
              <a
                key={item.href}
                href={item.href}
                className={
                  'group relative text-[13px] tracking-[0.02em] transition-colors duration-300 '
                  + 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current '
                  + (cta
                    // Bordered, never dimmed: this one was disappearing over pale sections.
                    ? 'rounded-[8px] border px-[0.85rem] py-[0.45rem] '
                      + (light
                        ? 'border-white/30 hover:border-white/60 hover:bg-white/10'
                        : 'border-[#1a1a18]/25 hover:border-[#1a1a18]/50 hover:bg-[#1a1a18]/[0.06]')
                    // 0.82 rather than 0.65: the old resting state washed out on paper.
                    : 'opacity-[0.82] hover:opacity-100')
                }
              >
                {item.label}
                {!cta && (
                  <span className="absolute -bottom-[5px] left-0 block h-px w-0 bg-current transition-[width] duration-300 group-hover:w-full" />
                )}
              </a>
            )
          })}
        </nav>

        <div className={'flex items-center gap-[1.25rem] ' + (light ? 'text-[var(--paper)]' : 'text-[var(--charcoal)]')}>
          <span className="meta hidden !text-current opacity-70 xl:block">
            {BRAND.city} / {BRAND.year}
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
            onClick={() => setOpen(v => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? 6 : 1, transform: open ? 'rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? 6 : 10, transform: open ? 'rotate(-45deg)' : 'none' }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Sits inside the header, which is `pointer-events-none`, so the sheet has to opt
          back in or its links cannot be tapped. */}
      <nav
        id="mobile-nav"
        hidden={!open}
        aria-label="Гар утасны цэс"
        className="pointer-events-auto mx-auto mt-[0.5rem] max-w-[1560px] rounded-[14px] border border-white/10 bg-[var(--charcoal)] px-[1.25rem] pb-[1.5rem] text-[var(--paper)] lg:hidden"
      >
        {NAV.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-[1.25rem] border-t border-white/10 py-[1rem] text-[19px]"
          >
            <span className="meta !text-white/40">{String(i + 1).padStart(2, '0')}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

/**
 * Custom cursor. Desktop, fine-pointer and motion-safe only.
 *
 * Position is written straight to the node inside a rAF, so pointer movement never enters
 * React. The label comes from the nearest `data-cursor` ancestor, which keeps the states
 * to the few places that earn one rather than every link on the page.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    const fine = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!fine.matches) return

    let x = innerWidth / 2, y = innerHeight / 2
    let cx = x, cy = y
    let frame = 0
    let current = ''

    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      const host = (event.target as Element)?.closest?.('[data-cursor]')
      const next = host?.getAttribute('data-cursor') ?? ''
      if (next !== current) {
        current = next
        setLabel(next)
        ring.current?.classList.toggle('is-on', Boolean(next))
      }
    }
    const loop = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      if (ring.current) ring.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('pointermove', move)
    }
  }, [])

  return <div ref={ring} className="cursor-ring" aria-hidden="true">{label}</div>
}

/**
 * Chapter rule: a thin vertical line with the current section index.
 *
 * Only the active index enters React state, so scrolling costs one small integer update
 * rather than a render per frame.
 */
export function ChapterRule() {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setShown(scrollY > innerHeight * 0.75)
      setDark(document.documentElement.dataset.navTheme !== 'light')
      const middle = scrollY + innerHeight / 2
      let active = 0
      CHAPTERS.forEach((chapter, i) => {
        const node = document.getElementById(chapter.id)
        if (node && node.offsetTop <= middle) active = i
      })
      setIndex(previous => (previous === active ? previous : active))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-[2rem] top-1/2 z-[150] hidden -translate-y-1/2 flex-col gap-[0.75rem] transition-opacity duration-700 2xl:flex"
      style={{ opacity: shown ? 1 : 0, color: dark ? 'var(--paper)' : 'var(--charcoal)' }}
      aria-hidden="true"
    >
      {CHAPTERS.map((chapter, i) => (
        <div key={chapter.id} className="flex items-center gap-[0.75rem]">
          <span
            className="h-px transition-all duration-500"
            style={{ width: i === index ? 26 : 9, background: 'currentColor', opacity: i === index ? 0.95 : 0.3 }}
          />
          <span
            className="font-mono text-[9.5px] tracking-[0.18em] transition-opacity duration-500"
            style={{ opacity: i === index ? 0.95 : 0 }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  )
}
