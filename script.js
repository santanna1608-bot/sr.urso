document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.header');
  const scrollThreshold = 50;
  
  const toggleHeaderState = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', toggleHeaderState);
  toggleHeaderState(); // Check immediately on load

  // --- Mobile Burger Menu Navigation ---
  const burgerMenuBtn = document.getElementById('burger-menu-btn');
  const navLinksList = document.getElementById('nav-links-list');
  const navLinksItems = document.querySelectorAll('.nav-links .nav-item a');

  const toggleMobileMenu = () => {
    const isExpanded = burgerMenuBtn.getAttribute('aria-expanded') === 'true';
    burgerMenuBtn.setAttribute('aria-expanded', !isExpanded);
    burgerMenuBtn.classList.toggle('active');
    navLinksList.classList.toggle('active');
  };

  burgerMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a navigation item is clicked
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenuBtn.setAttribute('aria-expanded', 'false');
      burgerMenuBtn.classList.remove('active');
      navLinksList.classList.remove('active');
    });
  });

  // --- Live Opening Hours Status Indicator ---
  const updateStoreStatus = () => {
    const statusContainer = document.getElementById('store-status-badge');
    if (!statusContainer) return;

    // Get current date/time
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeDecimal = hours + minutes / 60;

    let isOpen = false;

    if (day >= 1 && day <= 4) {
      // Monday to Thursday: 09:00 - 19:00
      if (timeDecimal >= 9.0 && timeDecimal < 19.0) {
        isOpen = true;
      }
    } else if (day === 5 || day === 6) {
      // Friday and Saturday: 09:00 - 20:00
      if (timeDecimal >= 9.0 && timeDecimal < 20.0) {
        isOpen = true;
      }
    } else if (day === 0) {
      // Sunday: Closed
      isOpen = false;
    }

    // Render store status badge
    if (isOpen) {
      statusContainer.innerHTML = '<span class="status-dot"></span>Aberto Agora';
      statusContainer.className = 'status-badge open';
      statusContainer.setAttribute('aria-label', 'Barbearia aberta agora');
    } else {
      statusContainer.innerHTML = '<span class="status-dot"></span>Fechado Agora';
      statusContainer.className = 'status-badge closed';
      statusContainer.setAttribute('aria-label', 'Barbearia fechada agora');
    }
  };

  // Run status immediately and poll every 60 seconds
  updateStoreStatus();
  setInterval(updateStoreStatus, 60000);

  // --- Viewport Intersection Observer (Scroll Reveal) ---
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve once revealed to keep layout performant
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Element is 10% visible
      rootMargin: '0px 0px -50px 0px' // Offset triggers slightly before they come in view
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // --- Contact Form Interactive Success Modal Simulation ---
  const contactForm = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('form-success-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (contactForm && modalOverlay && modalCloseBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop standard form refresh
      
      // Open Success Modal
      modalOverlay.classList.add('active');
      
      // Reset Form fields
      contactForm.reset();
    });

    // Close Modal button
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    // Close Modal clicking outside overlay
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // --- Card Image Carousel ---
  const initCardCarousels = () => {
    const carousels = document.querySelectorAll('.experience-image-wrapper.carousel-active');
    
    carousels.forEach(carousel => {
      const slides = carousel.querySelectorAll('.card-carousel .carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-indicators .dot');
      if (slides.length === 0) return;

      let currentSlide = 0;
      const slideInterval = 3000; // 3 seconds per image

      const nextSlide = () => {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) {
          dots[currentSlide].classList.remove('active');
        }

        // Calculate next index
        currentSlide = (currentSlide + 1) % slides.length;

        // Add active class to next slide and dot
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) {
          dots[currentSlide].classList.add('active');
        }
      };

      // Run carousel automatically
      let intervalId = setInterval(nextSlide, slideInterval);

      // Pause on hover
      carousel.addEventListener('mouseenter', () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      });
      carousel.addEventListener('mouseleave', () => {
        if (!intervalId) {
          intervalId = setInterval(nextSlide, slideInterval);
        }
      });
    });
  };

  initCardCarousels();
});
