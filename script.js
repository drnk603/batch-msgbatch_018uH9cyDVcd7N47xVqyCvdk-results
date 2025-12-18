(function() {
    'use strict';

    window.__app = window.__app || {};

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => { inThrottle = false; }, limit);
            }
        };
    }

    function initAOS() {
        if (window.__app.aosInit) return;
        window.__app.aosInit = true;

        if (window.AOS) {
            AOS.init({
                once: false,
                duration: 800,
                easing: 'ease-in-out',
                offset: 100,
                mirror: false,
                disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }

        window.__app.refreshAOS = () => {
            try {
                if (window.AOS) AOS.refresh();
            } catch (e) {}
        };
    }

    function initBurgerMenu() {
        if (window.__app.burgerInit) return;
        window.__app.burgerInit = true;

        const toggle = document.querySelector('.navbar-toggler');
        const collapse = document.querySelector('#navbarNav');
        const body = document.body;
        let isOpen = false;

        if (!toggle || !collapse) return;

        collapse.style.height = '0';
        collapse.style.overflow = 'hidden';
        collapse.style.transition = 'height 0.4s ease-in-out';

        function openMenu() {
            isOpen = true;
            collapse.style.height = `calc(100vh - var(--header-h))`;
            collapse.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden';
        }

        function closeMenu() {
            isOpen = false;
            collapse.style.height = '0';
            collapse.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen ? closeMenu() : openMenu();
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && isOpen) closeMenu();
        });
    }

    function initScrollSpy() {
        if (window.__app.scrollSpyInit) return;
        window.__app.scrollSpyInit = true;

        const sections = document.querySelectorAll('[id^="section-"]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#section-"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    function initSmoothScroll() {
        if (window.__app.smoothScrollInit) return;
        window.__app.smoothScrollInit = true;

        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const href = target.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const header = document.querySelector('.l-header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        });
    }

    function initScrollAnimations() {
        if (window.__app.scrollAnimInit) return;
        window.__app.scrollAnimInit = true;

        const animateElements = document.querySelectorAll('.card, img, .accordion-item, .btn-primary, .btn-outline-primary');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        });
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }

    function initMicroInteractions() {
        if (window.__app.microInit) return;
        window.__app.microInit = true;

        const interactiveElements = document.querySelectorAll('.btn, .card, .nav-link, a[class*="btn"]');

        interactiveElements.forEach(el => {
            el.style.transition = 'all 0.3s ease-in-out';

            el.addEventListener('mouseenter', function() {
                if (this.classList.contains('btn-primary') || this.classList.contains('btn-success')) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                    this.style.boxShadow = 'var(--shadow-lg)';
                } else if (this.classList.contains('card')) {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = 'var(--shadow-xl)';
                } else {
                    this.style.opacity = '0.85';
                }
            });

            el.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.opacity = '';
            });

            el.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.98)';
            });

            el.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
        });
    }

    function initRippleEffect() {
        if (window.__app.rippleInit) return;
        window.__app.rippleInit = true;

        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(btn => {
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';

            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initCountUp() {
        if (window.__app.countUpInit) return;
        window.__app.countUpInit = true;

        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    el.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function initFormValidation() {
        if (window.__app.formValidationInit) return;
        window.__app.formValidationInit = true;

        const forms = document.querySelectorAll('.c-contact-form');

        const patterns = {
            firstName: /^[a-zA-ZÀ-ÿ\s-']{2,50}$/,
            lastName: /^[a-zA-ZÀ-ÿ\s-']{2,50}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\d\s+\-()]{10,20}$/,
            message: /^.{10,}$/
        };

        const errorMessages = {
            firstName: 'Bitte geben Sie einen gültigen Vornamen ein (2-50 Zeichen)',
            lastName: 'Bitte geben Sie einen gültigen Nachnamen ein (2-50 Zeichen)',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            phone: 'Bitte geben Sie eine gültige Telefonnummer ein (10-20 Zeichen)',
            message: 'Bitte geben Sie eine Nachricht ein (mindestens 10 Zeichen)',
            privacy: 'Sie müssen die Datenschutzerklärung akzeptieren'
        };

        const validateField = (field) => {
            const fieldName = field.getAttribute('name');
            const value = field.value.trim();
            const fieldGroup = field.closest('.c-form__group') || field.closest('.form-check');

            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'Dieses Feld ist erforderlich';
            } else if (field.type === 'checkbox') {
                isValid = field.checked;
                errorMessage = errorMessages[fieldName] || 'Dieses Feld ist erforderlich';
            } else if (value && patterns[fieldName]) {
                isValid = patterns[fieldName].test(value);
                errorMessage = errorMessages[fieldName];
            }

            if (!isValid) {
                field.classList.add('is-invalid');
                if (fieldGroup) {
                    let errorDiv = fieldGroup.querySelector('.invalid-feedback');
                    if (!errorDiv) {
                        errorDiv = document.createElement('div');
                        errorDiv.className = 'invalid-feedback';
                        fieldGroup.appendChild(errorDiv);
                    }
                    errorDiv.textContent = errorMessage;
                    errorDiv.style.display = 'block';
                }
            } else {
                field.classList.remove('is-invalid');
                if (fieldGroup) {
                    const errorDiv = fieldGroup.querySelector('.invalid-feedback');
                    if (errorDiv) {
                        errorDiv.style.display = 'none';
                    }
                }
            }

            return isValid;
        };

        forms.forEach(form => {
            const fields = form.querySelectorAll('input, textarea, select');

            fields.forEach(field => {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('is-invalid')) {
                        validateField(field);
                    }
                });
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                let isFormValid = true;
                fields.forEach(field => {
                    if (!validateField(field)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) {
                        firstInvalid.focus();
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                const submitBtn = form.querySelector('[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Wird gesendet...';

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        window.location.href = 'thank_you.html';
                    }, 1500);
                }
            });
        });
    }

    function initPortfolioFilter() {
        if (window.__app.portfolioFilterInit) return;
        window.__app.portfolioFilterInit = true;

        const filterButtons = document.querySelectorAll('[data-filter]');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length === 0 || portfolioItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                portfolioItems.forEach(item => {
                    item.style.transition = 'all 0.6s ease-in-out';

                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        setTimeout(() => {
                            item.style.display = 'block';
                            requestAnimationFrame(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            });
                        }, 300);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    function initModals() {
        if (window.__app.modalsInit) return;
        window.__app.modalsInit = true;

        const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
        const modals = document.querySelectorAll('.modal');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-bs-target');
                const modal = document.querySelector(targetId);
                if (modal) {
                    modal.style.display = 'flex';
                    modal.style.opacity = '0';
                    requestAnimationFrame(() => {
                        modal.style.transition = 'opacity 0.3s ease-in-out';
                        modal.style.opacity = '1';
                        modal.classList.add('show');
                    });
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        modals.forEach(modal => {
            const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
            
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.classList.remove('show');
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                });
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.classList.remove('show');
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });
    }

    function initAccordion() {
        if (window.__app.accordionInit) return;
        window.__app.accordionInit = true;

        const accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('data-bs-target');
                const target = document.querySelector(targetId);
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                accordionButtons.forEach(btn => {
                    btn.classList.add('collapsed');
                    btn.setAttribute('aria-expanded', 'false');
                });

                document.querySelectorAll('.accordion-collapse').forEach(collapse => {
                    collapse.classList.remove('show');
                });

                if (!isExpanded) {
                    this.classList.remove('collapsed');
                    this.setAttribute('aria-expanded', 'true');
                    target.classList.add('show');
                }
            });
        });
    }

    function initImages() {
        if (window.__app.imagesInit) return;
        window.__app.imagesInit = true;

        const images = document.querySelectorAll('img');

        images.forEach(img => {
            if (!img.hasAttribute('loading') && !img.classList.contains('c-logo__img')) {
                img.setAttribute('loading', 'lazy');
            }

            img.addEventListener('error', function() {
                const placeholder = 'data:image/svg+xml;base64,' + btoa(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">' +
                    '<rect width="300" height="200" fill="#f8f9fa"/>' +
                    '<text x="150" y="100" font-family="Arial" font-size="14" fill="#6c757d" text-anchor="middle">Bild nicht verfügbar</text>' +
                    '</svg>'
                );
                this.src = placeholder;
            });
        });

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.hasAttribute('loading')) {
                video.setAttribute('loading', 'lazy');
            }
        });
    }

    function initScrollToTop() {
        if (window.__app.scrollTopInit) return;
        window.__app.scrollTopInit = true;

        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease-in-out;
            z-index: 1000;
            font-size: 24px;
            box-shadow: var(--shadow-lg);
        `;
        document.body.appendChild(scrollTopBtn);

        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.transform = 'translateY(100px)';
            }
        }, 100));

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    window.__app.init = function() {
        initAOS();
        initBurgerMenu();
        initScrollSpy();
        initSmoothScroll();
        initScrollAnimations();
        initMicroInteractions();
        initRippleEffect();
        initCountUp();
        initFormValidation();
        initPortfolioFilter();
        initModals();
        initAccordion();
        initImages();
        initScrollToTop();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.__app.init);
    } else {
        window.__app.init();
    }

})();