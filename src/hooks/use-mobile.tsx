import * as React from "react"

/**
 * Defines the pixel width breakpoint below which a device is considered mobile.
 * This constant is used to determine the `max-width` for the media query.
 */
const MOBILE_BREAKPOINT = 768

/**
 * Custom React hook to determine if the current viewport width corresponds to a mobile device.
 * It uses `window.matchMedia` to reactively update its state when the viewport size changes.
 *
 * @returns {boolean} `true` if the current viewport width is less than `MOBILE_BREAKPOINT`, `false` otherwise.
 *                    Returns `false` during server-side rendering or initial render before hydration.
 */
export function useIsMobile() {
  // State to store whether the device is mobile. Initialized to `undefined` to handle
  // cases where `window` is not available (e.g., during server-side rendering).
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // useEffect hook to set up and tear down the media query listener.
  React.useEffect(() => {
    // Create a MediaQueryList object for the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Event listener callback that updates the `isMobile` state based on the current viewport width.
     * @returns {void}
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add the event listener for changes in the media query status.
    mql.addEventListener("change", onChange)
    // Set the initial state based on the current viewport width.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup function: remove the event listener when the component unmounts or the effect re-runs.
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount.

  // Return the `isMobile` state, coercing `undefined` to `false` if it hasn't been determined yet.
  return !!isMobile
}
