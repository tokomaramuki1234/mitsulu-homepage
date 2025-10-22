// ==========================================
// 三流（Mitsuryū）LP JavaScript
// スクロールアニメーション・アコーディオン・インタラクション
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // 1. Intersection Observer for Scroll Animations
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ==========================================
    // 2. Accordion Functionality
    // ==========================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all accordions
            accordionHeaders.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
            });

            // Toggle current accordion
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ==========================================
    // 3. Smooth Scroll for Anchor Links
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // ==========================================
    // 4. Hero Icons Animation
    // ==========================================
    const heroIcons = document.querySelectorAll('.hero-icons .icon-large');
    
    heroIcons.forEach((icon, index) => {
        // Staggered entrance animation
        setTimeout(() => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0)';
            
            setTimeout(() => {
                icon.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }, 100);
        }, index * 150);

        // Continuous floating animation
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'float 2s ease-in-out infinite';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });

    // Add float keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 5. Service Cards Interaction
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.transition = 'transform 0.5s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });

    // ==========================================
    // 6. Lazy Loading Images
    // ==========================================
    const images = document.querySelectorAll('img[src*="placeholder"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add loading class
                img.classList.add('loading');
                
                // Simulate image load (already using placeholder)
                setTimeout(() => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                }, 300);

                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ==========================================
    // 7. CTA Button Click Tracking (Optional)
    // ==========================================
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Log event (for analytics)
            console.log('CTA Button Clicked:', this.textContent.trim());
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ==========================================
    // 8. Scroll Progress Indicator (Optional)
    // ==========================================
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;

        // Create progress bar if it doesn't exist
        let progressBar = document.getElementById('scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: linear-gradient(90deg, #F5A623, #8BC78F);
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }

        progressBar.style.width = scrollProgress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call

    // ==========================================
    // 9. Back to Top Button (Optional)
    // ==========================================
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'ページトップへ戻る');
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #F5A623;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#E88C00';
        this.style.transform = 'translateY(-5px)';
    });

    backToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#F5A623';
        this.style.transform = 'translateY(0)';
    });

    // ==========================================
    // 10. Performance Optimization
    // ==========================================
    
    // Debounce function for scroll events
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

    // Apply debounce to scroll events
    const debouncedScroll = debounce(updateScrollProgress, 10);
    window.removeEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', debouncedScroll);

    // ==========================================
    // 11. Initialize on DOM Ready
    // ==========================================
    console.log('三流 LP Initialized Successfully! 🌿');

    // Accessibility: Focus visible styles
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Add keyboard navigation styles
    const keyboardNavStyle = document.createElement('style');
    keyboardNavStyle.textContent = `
        body.keyboard-nav *:focus {
            outline: 3px solid #F5A623;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(keyboardNavStyle);

})();