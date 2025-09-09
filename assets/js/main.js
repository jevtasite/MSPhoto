// MS Photo - Main JavaScript File
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1200,
    easing: "ease-out-cubic",
    once: true,
    offset: 100,
    disable: "mobile",
  });

  // Initialize GLightbox for portfolio gallery
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    zoomable: true,
    draggable: true,
    closeOnOutsideClick: true,
    moreText: "View more",
  });

  // Initialize Swiper for testimonials
  const testimonialsSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });

  // Navbar functionality
  const navbar = document.querySelector(".custom-navbar");
  const navToggler = document.querySelector(".navbar-toggler");
  const navCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Smooth scrolling for nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId.startsWith("#")) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Close mobile menu if open
          if (navCollapse.classList.contains("show")) {
            navToggler.click();
          }

          // Smooth scroll to section
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          // Update active nav link
          updateActiveNavLink(targetId);
        }
      }
    });
  });

  // Update active navigation link based on scroll position
  function updateActiveNavLink(activeSection = null) {
    const sections = document.querySelectorAll("section[id]");

    if (!activeSection) {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionId = "#" + section.getAttribute("id");

        if (rect.top <= 150 && rect.bottom >= 150) {
          activeSection = sectionId;
        }
      });
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === activeSection) {
        link.classList.add("active");
      }
    });
  }

  // Portfolio filtering functionality
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Filter portfolio items with animation
      portfolioItems.forEach((item, index) => {
        const category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          item.style.display = "block";
          item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
        } else {
          item.style.animation = "fadeOut 0.3s ease both";
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll("[data-counter]");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-counter"));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // Intersection Observer for counter animation
  const statsSection = document.querySelector("#about");
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("counted")
        ) {
          entry.target.classList.add("counted");
          animateCounters();
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Back to top button functionality
  const backToTopBtn = document.querySelector(".back-to-top");

  function handleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Contact form handling
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const weddingDate = document.getElementById("weddingDate").value;
      const message = document.getElementById("message").value;

      // Basic validation
      if (!firstName || !lastName || !email || !message) {
        showNotification("Please fill in all required fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      // Simulate form submission (replace with actual form handling)
      const submitBtn = this.querySelector(".btn-gold");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        showNotification(
          "Thank you! Your message has been sent successfully. We'll get back to you soon!",
          "success"
        );
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((n) => n.remove());

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : "fa-info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add styles for notification
    const style = document.createElement("style");
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 1rem;
                color: var(--text-primary);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.4s ease;
                transform: translateX(100%);
                animation-fill-mode: forwards;
            }

            .notification-success {
                border-left: 4px solid #4CAF50;
            }

            .notification-error {
                border-left: 4px solid #f44336;
            }

            .notification-info {
                border-left: 4px solid var(--accent-gold);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .notification-content i {
                font-size: 1.2rem;
                color: var(--accent-gold);
            }

            .notification-success .notification-content i {
                color: #4CAF50;
            }

            .notification-error .notification-content i {
                color: #f44336;
            }

            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                padding: 0;
                transition: color 0.3s ease;
            }

            .notification-close:hover {
                color: var(--text-primary);
            }

            @keyframes slideInRight {
                to {
                    transform: translateX(0);
                }
            }

            @keyframes slideOutRight {
                to {
                    transform: translateX(100%);
                }
            }
        `;

    if (!document.querySelector("#notification-styles")) {
      style.id = "notification-styles";
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Handle close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      notification.style.animation = "slideOutRight 0.4s ease forwards";
      setTimeout(() => notification.remove(), 400);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.animation = "slideOutRight 0.4s ease forwards";
        setTimeout(() => notification.remove(), 400);
      }
    }, 5000);
  }

  // Parallax effect for hero section
  function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector(".hero-video");

    if (heroVideo && scrolled < window.innerHeight) {
      const rate = scrolled * -0.5;
      heroVideo.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
    }
  }

  // Lazy loading for images
  function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // Performance optimization: Throttle scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Debounce function for resize events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle window resize
  const handleResize = debounce(() => {
    // Reinitialize AOS on resize
    AOS.refresh();

    // Update swiper on resize
    if (testimonialsSwiper) {
      testimonialsSwiper.update();
    }
  }, 250);

  // Event listeners
  window.addEventListener(
    "scroll",
    throttle(() => {
      handleNavbarScroll();
      updateActiveNavLink();
      handleBackToTop();
      handleParallax();
    }, 16)
  );

  window.addEventListener("resize", handleResize);

  // Initialize lazy loading
  initLazyLoading();

  // Add CSS animations for portfolio filtering
  const portfolioAnimations = document.createElement("style");
  portfolioAnimations.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.9);
            }
        }
    `;
  document.head.appendChild(portfolioAnimations);

  // Preloader (if exists)
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    });
  }

  // Initialize everything
  console.log("MS Photo website initialized successfully!");

  // Add some performance monitoring
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        console.log(
          `Page load time: ${Math.round(
            perfData.loadEventEnd - perfData.fetchStart
          )}ms`
        );
      }, 0);
    });
  }

  // Error handling for missing elements
  const criticalElements = [
    ".custom-navbar",
    ".hero-section",
    "#about",
    "#portfolio",
    "#services",
    "#testimonials",
    "#contact",
  ];
  criticalElements.forEach((selector) => {
    if (!document.querySelector(selector)) {
      console.warn(`Critical element not found: ${selector}`);
    }
  });

  // Service Worker registration (for future PWA features)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => console.log("SW registered"))
      .catch((error) => console.log("SW registration failed"));
  }
});
