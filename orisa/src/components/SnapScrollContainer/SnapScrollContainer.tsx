import React, { useEffect, useRef, useState } from "react";
import styles from "./SnapScrollContainer.module.scss";

interface SnapScrollContainerProps {
  children: React.ReactNode;
  direction?: "y" | "x";
  scrollDelay?: number; // Time in ms to prevent scroll events
}

// Cross-browser way to get the actual viewport height
function setVhVar() {
  if (typeof window !== 'undefined') {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // For iOS Safari, we need to handle the bottom bar
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      // Add extra padding to account for the bottom bar
      document.documentElement.style.setProperty('--ios-bottom-padding', 'env(safe-area-inset-bottom)');
    }
  }
}

// Get the size of each section based on direction
function getSectionSize(direction: 'y' | 'x', containerRef: React.RefObject<HTMLDivElement>) {
  if (typeof window === 'undefined') return 0;
  
  if (direction === 'y') {
    // Use the CSS custom property for reliable height
    const vh = getComputedStyle(document.documentElement).getPropertyValue('--vh');
    return vh ? parseFloat(vh) * 100 : window.innerHeight;
  } else {
    // For horizontal scrolling, use the container's width
    const container = containerRef.current;
    return container ? container.clientWidth : window.innerWidth;
  }
}

// Check if device is a small mobile device
function isSmallMobileDevice() {
  return typeof window !== 'undefined' && window.innerWidth <= 480;
}

const SnapScrollContainer: React.FC<SnapScrollContainerProps> = ({
  children,
  direction = "y",
  scrollDelay = 1000,
  showNavDots = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isSmallMobileDevice());
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Function to scroll to a specific section
  const scrollToSection = (section: number, behavior: ScrollBehavior = "smooth") => {
    if (!containerRef.current) return;
    
    const size = getSectionSize(direction, containerRef);
    const targetScroll = section * size;
    
    if (direction === "y") {
      containerRef.current.scrollTo({ top: targetScroll, behavior });
    } else {
      containerRef.current.scrollTo({ left: targetScroll, behavior });
    }
  };
  
  // Handle section change with debounce 
  const handleSectionChange = (nextSection: number) => {
    if (isScrolling || nextSection === currentSection) return;
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    setIsScrolling(true);
    setCurrentSection(nextSection);
    
    // Scroll to the section
    scrollToSection(nextSection);
    
    // Reset scrolling state after delay
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollTimeoutRef.current = null;
    }, scrollDelay);
  };
  
  // Handle scroll events with debounce
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollTimer: number | null = null;
    
    const handleScroll = () => {
      if (isScrolling || isTouchActive) return;
      
      // Clear previous timer
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
      
      // Set a timer to debounce scroll events
      scrollTimer = window.setTimeout(() => {
        const size = getSectionSize(direction, containerRef);
        const scroll = direction === "y" ? container.scrollTop : container.scrollLeft;
        const newSection = Math.round(scroll / size);
        
        if (newSection !== currentSection) {
          handleSectionChange(newSection);
        }
        
        scrollTimer = null;
      }, 50); // Short debounce for scroll events
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
    };
  }, [isScrolling, currentSection, direction, isTouchActive]);
  
  // Handle wheel events 
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }
      
      const delta = direction === "y" ? e.deltaY : e.deltaX;
      const nextSection = delta > 0 
        ? Math.min(currentSection + 1, childrenArray.length - 1)
        : Math.max(currentSection - 1, 0);
        
      if (nextSection !== currentSection) {
        e.preventDefault();
        handleSectionChange(nextSection);
      }
    };
    
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isScrolling, currentSection, direction, childrenArray.length]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      let nextSection = currentSection;
      
      if (direction === "y") {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          nextSection = Math.min(currentSection + 1, childrenArray.length - 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          nextSection = Math.max(currentSection - 1, 0);
        }
      } else {
        if (e.key === "ArrowRight" || e.key === "PageDown") {
          nextSection = Math.min(currentSection + 1, childrenArray.length - 1);
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
          nextSection = Math.max(currentSection - 1, 0);
        }
      }
      
      if (nextSection !== currentSection) {
        e.preventDefault();
        handleSectionChange(nextSection);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isScrolling, currentSection, direction, childrenArray.length]);
  
  // Handle touch events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // Only handle single touch
      
      setIsTouchActive(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now() // Track time for velocity calculation
      };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default only if we need to handle the scroll event
      if (!touchStartRef.current || isScrolling) return;
      
      const touch = e.touches[0];
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;
      
      // Determine if the user is primarily scrolling in our snap direction
      const isMainDirection = direction === "y" 
        ? Math.abs(deltaY) > Math.abs(deltaX) * 0.8
        : Math.abs(deltaX) > Math.abs(deltaY) * 0.8;
        
      // If scrolling in main direction, prevent default browser behavior
      if (isMainDirection && ((direction === "y" && Math.abs(deltaY) > 10) || 
          (direction === "x" && Math.abs(deltaX) > 10))) {
            
        // On iOS, preventDefault can break momentum scrolling, so we're careful
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (!isIOS || Math.abs(direction === "y" ? deltaY : deltaX) > 30) {
          e.preventDefault();
        }
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      setIsTouchActive(false);
      
      if (!touchStartRef.current || isScrolling) {
        touchStartRef.current = null;
        return;
      }
      
      const touch = e.changedTouches[0];
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;
      const delta = direction === "y" ? deltaY : deltaX;
      
      // Calculate swipe time and velocity
      const timeElapsed = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(delta) / timeElapsed;
      
      // Minimum threshold based on velocity and device
      // Faster swipes need less distance
      const threshold = velocity > 0.8 ? 30 : (isMobile ? 40 : 50);
      
      // Check primary direction of movement
      const isMainDirection = direction === "y" 
        ? Math.abs(deltaY) > Math.abs(deltaX) * 0.8
        : Math.abs(deltaX) > Math.abs(deltaY) * 0.8;
        
      if (Math.abs(delta) > threshold && isMainDirection) {
        const nextSection = delta > 0 
          ? Math.min(currentSection + 1, childrenArray.length - 1)
          : Math.max(currentSection - 1, 0);
          
        if (nextSection !== currentSection) {
          handleSectionChange(nextSection);
        }
      } else if (Math.abs(delta) < 10) {
        // For very small movements, snap back to current section
        scrollToSection(currentSection);
      }
      
      touchStartRef.current = null;
    };
    
    const handleTouchCancel = () => {
      setIsTouchActive(false);
      touchStartRef.current = null;
      
      // Snap back to current section on cancel
      scrollToSection(currentSection);
    };
    
    // Use both touch events and pointer events for better cross-browser support
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isScrolling, currentSection, direction, childrenArray.length, isMobile]);
  
  // Handle resize and orientation change
  useEffect(() => {
    const handleResize = () => {
      setVhVar();
      
      // After resize, ensure we're still on the correct section
      // Small delay to ensure DOM updates
      setTimeout(() => {
        scrollToSection(currentSection, "auto");
      }, 50);
    };
    
    setVhVar(); // Set on mount
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    // Handle visibility changes - fixes issues when app goes to background
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        handleResize();
      }
    });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      document.removeEventListener("visibilitychange", handleResize);
    };
  }, [currentSection]);
  
  // Initial setup
  useEffect(() => {
    setVhVar();
    
    // Delay initial scroll to ensure layout is complete
    setTimeout(() => {
      scrollToSection(currentSection, "auto");
    }, 100);
    
    // Clean up any timeout on unmount
    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  

  
  return (
    <div className={styles.snapScrollWrapper}>
      <div
        ref={containerRef}
        className={direction === "y" ? styles.snapContainerY : styles.snapContainerX}
        data-direction={direction}
        data-mobile={isMobile}
      >
        {React.Children.map(children, (child, idx) => (
          <section
            className={direction === "y" ? styles.snapSectionY : styles.snapSectionX}
            key={idx}
            data-index={idx}
            aria-hidden={idx !== currentSection}
          >
            {child}
          </section>
        ))}
      </div>
    </div>
  );
};

export default SnapScrollContainer;