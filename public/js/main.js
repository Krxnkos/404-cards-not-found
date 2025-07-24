/**
 * 404: Cards Not Found - Main Application JavaScript
 * Implements secure coding practices with class-based architecture
 */

'use strict';

/**
 * Application Controller Class
 * Main application logic controller
 */
class ApplicationController {
  constructor() {
    this.isInitialized = false;
    this.observers = new Map();
    this.eventHandlers = new Map();
    
    // Bind methods to preserve 'this' context
    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  /**
   * Initialize the application
   */
  initialize() {
    if (this.isInitialized) {
      console.warn('Application already initialized');
      return;
    }

    // Add event listeners
    document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    this.isInitialized = true;
    console.log('404: Cards Not Found - Application Initialized');
  }

  /**
   * Handle DOM content loaded event
   */
  handleDOMContentLoaded() {
    try {
      this.initializeComponents();
      this.setupAccessibility();
      console.log('DOM Content Loaded - Components Initialized');
    } catch (error) {
      console.error('Error during DOMContentLoaded:', error);
    }
  }

  /**
   * Handle page visibility change
   */
  handleVisibilityChange() {
    const animationManager = AnimationManager.getInstance();
    
    if (document.hidden) {
      animationManager.pauseAllAnimations();
    } else {
      animationManager.resumeAllAnimations();
    }
  }

  /**
   * Handle before unload event
   */
  handleBeforeUnload() {
    this.cleanup();
  }

  /**
   * Initialize application components
   */
  initializeComponents() {
    const smoothScrolling = new SmoothScrolling();
    const buttonEffects = new ButtonEffects();
    const cardAnimations = new CardAnimations();
    const accessibilityManager = new AccessibilityManager();

    // Store components for cleanup
    this.components = {
      smoothScrolling,
      buttonEffects,
      cardAnimations,
      accessibilityManager
    };

    // Initialize each component
    Object.values(this.components).forEach(component => {
      if (component.initialize) {
        component.initialize();
      }
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.textContent.trim()) {
        console.warn('Interactive element missing accessible label:', element);
      }
    });
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Cleanup observers
    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });

    // Cleanup components
    if (this.components) {
      Object.values(this.components).forEach(component => {
        if (component.destroy) {
          component.destroy();
        }
      });
    }

    this.observers.clear();
    this.eventHandlers.clear();
  }
}

/**
 * Smooth Scrolling Component
 */
class SmoothScrolling {
  constructor() {
    this.anchorLinks = [];
  }

  initialize() {
    this.anchorLinks = document.querySelectorAll('a[href^="#"]');
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.anchorLinks.forEach(link => {
      link.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL without triggering navigation
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  }

  destroy() {
    this.anchorLinks.forEach(link => {
      link.removeEventListener('click', this.handleAnchorClick);
    });
  }
}

/**
 * Button Effects Component
 */
class ButtonEffects {
  constructor() {
    this.buttons = [];
    this.activeEffects = new Set();
  }

  initialize() {
    this.buttons = document.querySelectorAll('.btn, button');
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this.handleButtonClick.bind(this));
      button.addEventListener('keydown', this.handleButtonKeydown.bind(this));
    });
  }

  handleButtonClick(event) {
    const button = event.currentTarget;
    this.applyClickEffect(button);
  }

  handleButtonKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const button = event.currentTarget;
      this.applyClickEffect(button);
    }
  }

  applyClickEffect(button) {
    if (this.activeEffects.has(button)) {
      return; // Prevent duplicate effects
    }

    this.activeEffects.add(button);
    
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.15s ease';

    setTimeout(() => {
      button.style.transform = '';
      this.activeEffects.delete(button);
    }, 150);
  }

  destroy() {
    this.buttons.forEach(button => {
      button.removeEventListener('click', this.handleButtonClick);
      button.removeEventListener('keydown', this.handleButtonKeydown);
    });
    this.activeEffects.clear();
  }
}

/**
 * Card Animations Component
 */
class CardAnimations {
  constructor() {
    this.floatingCards = [];
    this.featureCards = [];
    this.intersectionObserver = null;
  }

  initialize() {
    this.floatingCards = document.querySelectorAll('.floating-card');
    this.featureCards = document.querySelectorAll('.feature-card');
    
    this.setupFloatingCardEffects();
    this.setupScrollAnimations();
    this.setupCardInteractionEffects();
  }

  setupFloatingCardEffects() {
    this.floatingCards.forEach((card, index) => {
      card.addEventListener('mouseenter', this.handleCardMouseEnter.bind(this));
      card.addEventListener('mouseleave', this.handleCardMouseLeave.bind(this));
      card.addEventListener('focus', this.handleCardMouseEnter.bind(this));
      card.addEventListener('blur', this.handleCardMouseLeave.bind(this));
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      observerOptions
    );

    this.featureCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.intersectionObserver.observe(card);
    });
  }

  setupCardInteractionEffects() {
    const cardElements = document.querySelectorAll('.feature-card, .error-card');
    cardElements.forEach(element => {
      element.addEventListener('mouseenter', this.handleCardHover.bind(this));
      element.addEventListener('mouseleave', this.handleCardUnhover.bind(this));
    });
  }

  handleCardMouseEnter(event) {
    const card = event.currentTarget;
    card.style.animationPlayState = 'paused';
    card.style.transform = 'scale(1.2) rotate(15deg)';
  }

  handleCardMouseLeave(event) {
    const card = event.currentTarget;
    card.style.animationPlayState = 'running';
    card.style.transform = '';
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }

  handleCardHover(event) {
    const element = event.currentTarget;
    element.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
  }

  handleCardUnhover(event) {
    const element = event.currentTarget;
    element.style.boxShadow = '';
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    [...this.floatingCards, ...this.featureCards].forEach(card => {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
      card.removeEventListener('focus', this.handleCardMouseEnter);
      card.removeEventListener('blur', this.handleCardMouseLeave);
    });
  }
}

/**
 * Accessibility Manager Component
 */
class AccessibilityManager {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  initialize() {
    this.setupReducedMotionHandling();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }

  setupReducedMotionHandling() {
    if (this.reducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }

    this.reducedMotion.addEventListener('change', (e) => {
      document.body.classList.toggle('reduced-motion', e.matches);
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for custom elements
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupScreenReaderSupport() {
    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
}

/**
 * Animation Manager Singleton
 */
class AnimationManager {
  constructor() {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }

    this.animations = new Set();
    AnimationManager.instance = this;
  }

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  addAnimation(element) {
    this.animations.add(element);
  }

  removeAnimation(element) {
    this.animations.delete(element);
  }

  pauseAllAnimations() {
    this.animations.forEach(element => {
      element.style.animationPlayState = 'paused';
    });
  }

  resumeAllAnimations() {
    this.animations.forEach(element => {
      element.style.animationPlayState = 'running';
    });
  }
}

// Initialize the application
const app = new ApplicationController();
app.initialize();
