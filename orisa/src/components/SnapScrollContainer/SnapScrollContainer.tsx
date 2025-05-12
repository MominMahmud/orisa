import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import styles from "./SnapScrollContainer.module.scss";

export interface SnapScrollContainerHandle {
  goToSection: (index: number, behavior?: ScrollBehavior) => void;
}

interface SnapScrollContainerProps {
  children: React.ReactNode;
  direction?: "y" | "x";
  scrollDelay?: number;
}

function setVhVar() {
  if (typeof window !== "undefined") {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.documentElement.style.setProperty(
        "--ios-bottom-padding",
        "env(safe-area-inset-bottom)"
      );
    }
  }
}

function getSectionSize(
  direction: "y" | "x",
  containerRef: React.RefObject<HTMLDivElement>
) {
  if (typeof window === "undefined") return 0;

  if (direction === "y") {
    const vh = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--vh");
    return vh ? parseFloat(vh) * 100 : window.innerHeight;
  } else {
    const container = containerRef.current;
    return container ? container.clientWidth : window.innerWidth;
  }
}

function isSmallMobileDevice() {
  return typeof window !== "undefined" && window.innerWidth <= 480;
}

const SnapScrollContainer = forwardRef<
  SnapScrollContainerHandle,
  SnapScrollContainerProps
>(({ children, direction = "y", scrollDelay = 1000 }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    goToSection: (index: number, behavior: ScrollBehavior = "smooth") => {
      if (index >= 0 && index < childrenArray.length) {
        handleSectionChange(index, behavior);
      }
    },
  }));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isSmallMobileDevice());
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToSection = (
    section: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    if (!containerRef.current) return;

    const size = getSectionSize(direction, containerRef as React.RefObject<HTMLDivElement>);
    const targetScroll = section * size;

    if (direction === "y") {
      containerRef.current.scrollTo({ top: targetScroll, behavior });
    } else {
      containerRef.current.scrollTo({ left: targetScroll, behavior });
    }
  };

  const handleSectionChange = (
    nextSection: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    if (isScrolling || nextSection === currentSection) return;

    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    setIsScrolling(true);
    setCurrentSection(nextSection);
    scrollToSection(nextSection, behavior);

    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollTimeoutRef.current = null;
    }, scrollDelay);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimer: number | null = null;

    const handleScroll = () => {
      if (isScrolling || isTouchActive) return;

      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }

      scrollTimer = window.setTimeout(() => {
        const size = getSectionSize(direction, containerRef as React.RefObject<HTMLDivElement>);
        const scroll =
          direction === "y" ? container.scrollTop : container.scrollLeft;
        const newSection = Math.round(scroll / size);

        if (newSection !== currentSection) {
          handleSectionChange(newSection);
        }

        scrollTimer = null;
      }, 50);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
    };
  }, [isScrolling, currentSection, direction, isTouchActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const delta = direction === "y" ? e.deltaY : e.deltaX;
      const nextSection =
        delta > 0
          ? Math.min(currentSection + 1, childrenArray.length - 1)
          : Math.max(currentSection - 1, 0);

      if (nextSection !== currentSection) {
        e.preventDefault();
        handleSectionChange(nextSection);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isScrolling, currentSection, direction, childrenArray.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      let nextSection = currentSection;

      if (direction === "y") {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          nextSection = Math.min(
            currentSection + 1,
            childrenArray.length - 1
          );
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          nextSection = Math.max(currentSection - 1, 0);
        }
      } else {
        if (e.key === "ArrowRight" || e.key === "PageDown") {
          nextSection = Math.min(
            currentSection + 1,
            childrenArray.length - 1
          );
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScrolling, currentSection, direction, childrenArray.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      setIsTouchActive(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || isScrolling) return;

      const touch = e.touches[0];
      const deltaX = touchStartRef.current.x - touch.clientX;
      const deltaY = touchStartRef.current.y - touch.clientY;

      const isMainDirection =
        direction === "y"
          ? Math.abs(deltaY) > Math.abs(deltaX) * 0.8
          : Math.abs(deltaX) > Math.abs(deltaY) * 0.8;

      if (
        isMainDirection &&
        ((direction === "y" && Math.abs(deltaY) > 10) ||
          (direction === "x" && Math.abs(deltaX) > 10))
      ) {
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
      const timeElapsed = Date.now() - touchStartRef.current.time;

      // 👇 Ignore very quick taps
      if (timeElapsed < 100) {
        touchStartRef.current = null;
        return;
      }

      const velocity = Math.abs(delta) / timeElapsed;
      const cappedVelocity = Math.min(velocity, 1.5);
      const threshold =
        cappedVelocity > 1 ? (isMobile ? 50 : 60) : (isMobile ? 70 : 80);

      const isMainDirection =
        direction === "y"
          ? Math.abs(deltaY) > Math.abs(deltaX) * 0.8
          : Math.abs(deltaX) > Math.abs(deltaY) * 0.8;

      if (Math.abs(delta) > threshold && isMainDirection) {
        let nextSection = currentSection;

        if (delta > 0 && currentSection < childrenArray.length - 1) {
          nextSection = currentSection + 1;
        } else if (delta < 0 && currentSection > 0) {
          nextSection = currentSection - 1;
}
        if (nextSection !== currentSection) {
          handleSectionChange(nextSection);
        }
      } else if (Math.abs(delta) < 10) {
        scrollToSection(currentSection);
      }

      touchStartRef.current = null;
    };

    const handleTouchCancel = () => {
      setIsTouchActive(false);
      touchStartRef.current = null;
      scrollToSection(currentSection);
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isScrolling, currentSection, direction, childrenArray.length, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setVhVar();
      setTimeout(() => {
        scrollToSection(currentSection, "auto");
      }, 50);
    };

    setVhVar();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
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

  useEffect(() => {
    setVhVar();
    setTimeout(() => {
      scrollToSection(currentSection, "auto");
    }, 100);

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
        className={
          direction === "y" ? styles.snapContainerY : styles.snapContainerX
        }
        data-direction={direction}
        data-mobile={isMobile}
      >
        {React.Children.map(children, (child, idx) => (
          <section
            className={
              direction === "y" ? styles.snapSectionY : styles.snapSectionX
            }
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
});

SnapScrollContainer.displayName = "SnapScrollContainer";

export default SnapScrollContainer;
