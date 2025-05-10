import React, { useEffect, useRef, useState } from "react";
import styles from "./SnapScrollContainer.module.scss";

interface SnapScrollContainerProps {
  children: React.ReactNode;
  direction?: "y" | "x";
  scrollDelay?: number; // Time in ms to prevent scroll events
}

const SnapScrollContainer: React.FC<SnapScrollContainerProps> = ({
  children,
  direction = "y",
  scrollDelay = 1500
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const childrenArray = React.Children.toArray(children);
  
  // Handle scroll events and prevent multiple scrolls in succession
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      const size = direction === "y" ? window.innerHeight : window.innerWidth;
      const scroll = direction === "y" ? container.scrollTop : container.scrollLeft;
      const newSection = Math.round(scroll / size);
      
      if (newSection !== currentSection) {
        setIsScrolling(true);
        setCurrentSection(newSection);
        
        // Smooth snap to the correct section
        const targetScroll = newSection * size;
        
        if (direction === "y") {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        } else {
          container.scrollTo({ left: targetScroll, behavior: "smooth" });
        }
        
        // Reset scroll lock after animation
        setTimeout(() => {
          setIsScrolling(false);
        }, scrollDelay);
      }
    };
    
    // Use wheel event for more direct control
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
        setIsScrolling(true);
        setCurrentSection(nextSection);
        
        const size = direction === "y" ? window.innerHeight : window.innerWidth;
        const targetScroll = nextSection * size;
        
        if (direction === "y") {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        } else {
          container.scrollTo({ left: targetScroll, behavior: "smooth" });
        }
        
        setTimeout(() => {
          setIsScrolling(false);
        }, scrollDelay);
      }
    };
    
    // Handle keyboard navigation
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
        setIsScrolling(true);
        setCurrentSection(nextSection);
        
        const size = direction === "y" ? window.innerHeight : window.innerWidth;
        const targetScroll = nextSection * size;
        
        if (direction === "y") {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        } else {
          container.scrollTo({ left: targetScroll, behavior: "smooth" });
        }
        
        setTimeout(() => {
          setIsScrolling(false);
        }, scrollDelay);
      }
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;
      const delta = direction === "y" ? deltaY : deltaX;
      
      // Minimum swipe distance to trigger section change
      if (Math.abs(delta) > 50) {
        const nextSection = delta > 0 
          ? Math.min(currentSection + 1, childrenArray.length - 1)
          : Math.max(currentSection - 1, 0);
          
        if (nextSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(nextSection);
          
          const size = direction === "y" ? window.innerHeight : window.innerWidth;
          const targetScroll = nextSection * size;
          
          if (direction === "y") {
            container.scrollTo({ top: targetScroll, behavior: "smooth" });
          } else {
            container.scrollTo({ left: targetScroll, behavior: "smooth" });
          }
          
          setTimeout(() => {
            setIsScrolling(false);
          }, scrollDelay);
        }
      }
    };

    // Set up event listeners
    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    
    // Clean up
    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isScrolling, currentSection, direction, childrenArray.length, scrollDelay]);

  // Handle resize to ensure proper positioning
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const size = direction === "y" ? window.innerHeight : window.innerWidth;
      const targetScroll = currentSection * size;
      
      if (direction === "y") {
        container.scrollTo({ top: targetScroll, behavior: "auto" });
      } else {
        container.scrollTo({ left: targetScroll, behavior: "auto" });
      }
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSection, direction]);

  // On initial load, make sure we're at the right position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const size = direction === "y" ? window.innerHeight : window.innerWidth;
    const targetScroll = currentSection * size;
    
    if (direction === "y") {
      container.scrollTo({ top: targetScroll, behavior: "auto" });
    } else {
      container.scrollTo({ left: targetScroll, behavior: "auto" });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        direction === "y"
          ? styles.snapContainerY
          : styles.snapContainerX
      }
    >
      {React.Children.map(children, (child, idx) => (
        <section
          className={
            direction === "y"
              ? styles.snapSectionY
              : styles.snapSectionX
          }
          key={idx}
        >
          {child}
        </section>
      ))}
      
    </div>
  );
};

export default SnapScrollContainer;