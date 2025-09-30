import { useState, useEffect } from "react";

export interface MotionPreferences {
  reducedMotion: boolean;
  prefersSlowAnimations: boolean;
  supportsIntersectionObserver: boolean;
  supportsResizeObserver: boolean;
  devicePixelRatio: number;
}

/**
 * Hook to detect user's motion preferences and device capabilities
 * Respects user's accessibility settings and optimizes animations accordingly
 */
export function useMotionPreferences(): MotionPreferences {
  const [preferences, setPreferences] = useState<MotionPreferences>({
    reducedMotion: false,
    prefersSlowAnimations: false,
    supportsIntersectionObserver: false,
    supportsResizeObserver: false,
    devicePixelRatio: 1,
  });

  useEffect(() => {
    const updatePreferences = () => {
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Check for slow animations (when user prefers reduced motion or slow device)
      const isSlowDevice = navigator.hardwareConcurrency <= 2;
      const prefersSlowAnimations = reducedMotion || isSlowDevice;

      // Check browser support for modern APIs
      const supportsIntersectionObserver = "IntersectionObserver" in window;
      const supportsResizeObserver = "ResizeObserver" in window;

      // Get device pixel ratio for high-DPI optimization
      const devicePixelRatio = window.devicePixelRatio || 1;

      setPreferences({
        reducedMotion,
        prefersSlowAnimations,
        supportsIntersectionObserver,
        supportsResizeObserver,
        devicePixelRatio,
      });
    };

    updatePreferences();

    // Listen for changes in motion preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => updatePreferences();
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return preferences;
}

/**
 * Get optimized animation duration based on user preferences
 */
export function useAnimationDuration(baseDuration: number): number {
  const { reducedMotion, prefersSlowAnimations } = useMotionPreferences();

  if (reducedMotion) return 0;
  if (prefersSlowAnimations) return baseDuration * 1.5;
  return baseDuration;
}

/**
 * Get optimized animation config based on user preferences
 */
export function useAnimationConfig() {
  const preferences = useMotionPreferences();

  return {
    // Disable animations if user prefers reduced motion
    disabled: preferences.reducedMotion,
    // Reduce complexity on slower devices
    simplified: preferences.prefersSlowAnimations,
    // Use optimizations based on device capabilities
    optimized: {
      willChange: preferences.devicePixelRatio > 1 ? 'transform, opacity' : 'auto',
      backfaceVisibility: 'hidden',
      perspective: 1000,
    },
  };
}