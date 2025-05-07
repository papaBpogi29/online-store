// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initSmoothScroll();
    initSocialShare();
    initImageLoading();
    initResponsiveHelpers();
});

/**
 * Mobile Menu Toggle Functionality
 * Handles showing and hiding the navigation menu on mobile devices
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        
        // Toggle icon between bars and X
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

/**
 * Smooth Scrolling for Navigation
 * Adds smooth scrolling behavior to navigation links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // If mobile menu is open, close it
                const navMenu = document.querySelector('nav ul');
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    const menuToggle = document.querySelector('.mobile-menu-toggle i');
                    if (menuToggle) {
                        menuToggle.classList.remove('fa-times');
                        menuToggle.classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

/**
 * Social Share Functionality
 * Handles social media sharing for products
 */
function initSocialShare() {
    const shareLinks = document.querySelectorAll('.social-share a');
    
    shareLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const shareText = `Check out this product: ${productName} - ${productPrice}`;
            const shareUrl = window.location.href;
            
            let shareWindow = null;
            const icon = this.querySelector('i');
            
            // Determine which social platform to share on
            if (icon.classList.contains('fa-facebook')) {
                shareWindow = window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, 'facebook-share', 'width=580,height=550');
            } else if (icon.classList.contains('fa-twitter')) {
                shareWindow = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, 'twitter-share', 'width=550,height=420');
            } else if (icon.classList.contains('fa-instagram')) {
                // Instagram doesn't have a direct share URL API
                // Just open Instagram and let user know they need to share manually
                alert('To share on Instagram, please take a screenshot and share it on your Instagram account.');
                window.open('https://www.instagram.com', '_blank');
            }
            
            if (shareWindow) {
                shareWindow.focus();
            }
        });
    });
}

/**
 * Image Loading State
 * Adds loading indicators for product images
 */
function initImageLoading() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.classList.add('loading-overlay');
        loadingOverlay.innerHTML = '<div class="spinner"></div>';
        
        // Insert loading overlay
        img.parentNode.style.position = 'relative';
        img.parentNode.appendChild(loadingOverlay);
        
        // Set initial opacity for image
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // When image is loaded, remove loading overlay
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            const overlay = this.parentNode.querySelector('.loading-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        });
        
        // If image is already cached and loaded
        if (img.complete) {
            img.style.opacity = '1';
            const overlay = img.parentNode.querySelector('.loading-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });
    
    // Add CSS for loading spinner
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.3s ease;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(74, 111, 165, 0.2);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Responsive Design Helpers
 * Helper functions for responsive design
 */
function initResponsiveHelpers() {
    // Debounce function to limit how often a function is called
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Handle window resize events
    const handleResize = debounce(function() {
        // Check if we're in mobile view
        const isMobile = window.innerWidth <= 768;
        
        // Adjust UI based on screen size if needed
        if (!isMobile) {
            // If switching from mobile to desktop, make sure menu is visible
            const navMenu = document.querySelector('nav ul');
            if (navMenu) {
                navMenu.classList.remove('show');
                const menuToggle = document.querySelector('.mobile-menu-toggle i');
                if (menuToggle) {
                    menuToggle.classList.remove('fa-times');
                    menuToggle.classList.add('fa-bars');
                }
            }
        }
    }, 250);
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
}

