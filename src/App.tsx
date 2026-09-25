import { useEffect } from 'react'
import { ChapterRule, Cursor, Navbar } from './components/Chrome'
import { useIsMobile, useIsTouch, useReducedMotion, useScrollRefresh, ScrollTrigger } from './lib/hooks'
import { Architecture, Hero, Philosophy } from './sections/Opening'
import { FloorPlan, Location, Residences } from './sections/Middle'
import { Amenities, Contact, Facts, Gallery } from './sections/Closing'
import { BRAND } from './content'

/**
 * Tracks which chapter owns the viewport and writes its tone onto <html>.
 *
 * The navbar sits over photography in some chapters and over paper in others, so it reads
 * this instead of guessing from scroll position. A data attribute rather than React state
 * keeps the update out of the render path entirely.
 */
function useNavTheme() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'))
    if (!sections.length) return

    let frame = 0
    const update = () => {
      frame = 0
      // The floating bar is inset ~16px and 64px tall; sample just below its lower edge so
      // the theme flips as a section passes under it rather than when it enters the viewport.
      const probe = scrollY + 92
      let tone = 'dark'
      for (const section of sections) {
        if (section.offsetTop <= probe) tone = section.dataset.nav ?? 'dark'
      }
      if (document.documentElement.dataset.navTheme !== tone) {
        document.documentElement.dataset.navTheme = tone
      }
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
}

/**
 * Keeps pinned sections measured correctly when the viewport changes.
 *
 * Mobile browsers fire `resize` as the URL bar collapses, which would re-measure every pin
 * mid-scroll and make the page jump. Width-only changes are the ones that matter.
 */
function useResizeRefresh() {
  useEffect(() => {
    let width = innerWidth
    let timer = 0
    const onResize = () => {
      if (innerWidth === width) return
      width = innerWidth
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 180)
    }
    addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      removeEventListener('resize', onResize)
    }
  }, [])
}

export default function App() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const touch = useIsTouch()

  // One flag decides every piece of choreography: scrubbed parallax, pins, masks and the
  // horizontal gallery all stand down together, so reduced motion never leaves the page
  // half-animated.
  const motion = !reduced
  const pinned = motion && !mobile
  const horizontal = motion && !mobile && !touch

  useNavTheme()
  useScrollRefresh()
  useResizeRefresh()

  return (
    <>
      <a href="#content" className="skip-link">Үндсэн агуулга руу очих</a>
      <Navbar />
      {!touch && <Cursor />}
      <ChapterRule />

      <main id="content">
        <div id="top" />
        <Hero motion={motion} />
        <Philosophy />
        <Architecture pinned={pinned} />
        <Location motion={motion} />
        <Residences sticky={pinned} />
        <FloorPlan motion={motion} />
        <Amenities motion={motion} />
        <Gallery horizontal={horizontal} />
        <Facts motion={motion} />
        <Contact motion={motion} />
      </main>

      {/* Stated in text as well as in the footer, so the concept status survives with CSS
          or images unavailable. */}
      <p className="sr-only">
        {BRAND.full} — энэ бол зохиомол орон сууцны концепц. Портфолиод зориулан бүтээсэн
        демо төсөл бөгөөд бодит бүтээгдэхүүн, борлуулалт, хаяг байхгүй.
      </p>
    </>
  )
}
