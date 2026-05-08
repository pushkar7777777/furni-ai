/**
 * Smooth Scroll Animations Utility
 * Provides intersection observer hooks for scroll-triggered animations
 */

export const useScrollAnimation = () => {
  const observerRef = (element, options = {}) => {
    if (!element) return;

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animated');
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);
    return observer;
  };

  return { observerRef };
};

/**
 * Apply scroll animations to elements with data-scroll-animation attribute
 */
export const initScrollAnimations = () => {
  const animationClasses = [
    'fade-in',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'zoom-in',
    'bounce-in',
    'rotate-in'
  ];

  const elements = document.querySelectorAll('[data-scroll-animation]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const animationType = entry.target.dataset.scrollAnimation;
        const delay = entry.target.dataset.scrollDelay || index * 100;

        entry.target.style.animationDelay = `${delay}ms`;
        entry.target.classList.add('scroll-animated', animationType);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (element, offset = 100) => {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Stagger animations for multiple elements
 */
export const staggerAnimations = (containerSelector, animationClass = 'slide-up', delayStep = 100) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const children = container.querySelectorAll('[data-stagger]');

  children.forEach((child, index) => {
    child.style.animationDelay = `${index * delayStep}ms`;
    child.classList.add('scroll-animated', animationClass);
  });
};

/**
 * Scroll to specific section with smooth animation
 */
export const scrollToSection = (sectionId, smooth = true) => {
  const element = document.getElementById(sectionId);
  if (!element) return;

  if (smooth) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    element.scrollIntoView({ block: 'start' });
  }
};

/**
 * Parallax scroll effect
 */
export const applyParallaxEffect = (elementSelector, speed = 0.5) => {
  const element = document.querySelector(elementSelector);
  if (!element) return;

  const handleScroll = () => {
    const scrollY = window.pageYOffset;
    element.style.transform = `translateY(${scrollY * speed}px)`;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * Counter animation (for numbers)
 */
export const animateCounter = (element, targetValue, duration = 2000) => {
  if (!element) return;

  const startValue = 0;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);

    element.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

/**
 * Apply fade-in-on-scroll to collection of elements
 */
export const fadeInOnScroll = (selector, delay = 0) => {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in-scroll');
          observer.unobserve(entry.target);
        }, delay + index * 100);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
};

/**
 * Scroll progress bar
 */
export const initScrollProgressBar = () => {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = scrollHeight > 0 ? (window.pageYOffset / scrollHeight) * 100 : 0;
    progressBar.style.width = `${scrollProgress}%`;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * React Hook: useScrollAnimation
 */
export const useScrollAnimationHook = (options = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    const defaultOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, defaultOptions);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
};

/**
 * Scroll lock utility
 */
export const lockScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '17px'; // Account for scrollbar width
};

export const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};
