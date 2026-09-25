import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Reads a media query and keeps it live. */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia(query).matches : false)
  useEffect(() => {
    const media = matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
/** Below this width the pinned, horizontal and parallax choreography is stood down. */
export const useIsMobile = () => useMedia('(max-width: 900px)')
export const useIsTouch = () => useMedia('(pointer: coarse)')

/**
 * Runs a GSAP setup function inside a scoped context.
 *
 * `gsap.context` collects every tween and ScrollTrigger created inside it, so the whole
 * scene is reverted in one call. That is what makes StrictMode's double mount safe: the
 * first pass is fully undone before the second builds again, and no duplicate pins are
 * left behind to fight each other.
 *
 * The effect is layout-phase so pins are measured before the browser paints, which avoids
 * a flash of unpinned content on first load.
 */
export function useGsap(
  setup: (root: HTMLElement, context: gsap.Context) => void,
  deps: React.DependencyList = [],
) {
  const scope = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    // The root element is handed to the callback rather than read back off the ref, so a
    // setup function never has to reach through the ref it is being defined alongside.
    const context = gsap.context(self => setup(root, self), scope)
    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return scope
}

/**
 * Recomputes ScrollTrigger measurements once fonts and images have settled.
 *
 * Pin distances are calculated from element heights. Those heights change when a webfont
 * swaps in or a lazy image finally lays out, so without this every pin below the fold is
 * measured against stale geometry and the whole page drifts out of sync.
 */
export function useScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    const timer = setTimeout(refresh, 260)
    document.fonts?.ready.then(refresh).catch(() => {})
    addEventListener('load', refresh)
    return () => {
      clearTimeout(timer)
      removeEventListener('load', refresh)
    }
  }, [])
}

export { gsap, ScrollTrigger }
