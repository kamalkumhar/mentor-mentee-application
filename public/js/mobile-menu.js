// Mobile Navigation Functionality
// Add this to pages that need mobile hamburger menu

document.addEventListener('DOMContentLoaded', function() {
  // Create hamburger menu button if it doesn't exist
  const navbarContainer = document.querySelector('.navbar-container');
  const navLinks = document.querySelector('.nav-links');
  
  if (navbarContainer && navLinks && window.innerWidth <= 768) {
    // Check if hamburger button already exists
    let menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!menuToggle) {
      // Create hamburger button
      menuToggle = document.createElement('button');
      menuToggle.className = 'mobile-menu-toggle';
      menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      menuToggle.innerHTML = '☰';
      
      // Insert after navbar brand
      const navbarBrand = navbarContainer.querySelector('.navbar-brand');
      if (navbarBrand) {
        navbarBrand.parentNode.insertBefore(menuToggle, navbarBrand.nextSibling);
      } else {
        navbarContainer.appendChild(menuToggle);
      }
      
      // Add click event
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        
        // Change icon
        if (navLinks.classList.contains('show')) {
          menuToggle.innerHTML = '✕';
        } else {
          menuToggle.innerHTML = '☰';
        }
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!navbarContainer.contains(event.target) && navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          menuToggle.innerHTML = '☰';
        }
      });
      
      // Close menu when clicking a nav link
      const navLinksItems = navLinks.querySelectorAll('.nav-link');
      navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            navLinks.classList.remove('show');
            menuToggle.innerHTML = '☰';
          }
        });
      });
    }
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth > 768) {
      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
      if (menuToggle) {
        menuToggle.innerHTML = '☰';
      }
    }
  });
});

// Prevent zoom on double-tap for better mobile UX
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Optimize scroll performance on mobile
let ticking = false;
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScroll);
  }
  ticking = true;
}

function updateScroll() {
  ticking = false;
  // Add any scroll-based animations here if needed
}

window.addEventListener('scroll', requestTick, { passive: true });
