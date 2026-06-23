document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Menu Slider
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            // Toggle hamburger cross animation
            const spans = hamburger.querySelectorAll('span');
            if (mobileNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                mobileNav.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 2.5 Dynamic injection of Theme and RTL buttons inside Mobile Navigation Drawer
    if (mobileNav) {
        const mobileControls = document.createElement('div');
        mobileControls.className = 'mobile-nav-controls';
        mobileControls.innerHTML = `
            <button class="btn-icon theme-toggle" aria-label="Toggle Theme">
                <svg class="theme-icon-light" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm-1.06-10.96c.39-.39.39-1.03 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                </svg>
                <svg class="theme-icon-dark" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.38 5.38 0 0 1-4.4 2.26 5.4 5.4 0 0 1-5.4-5.4c0-1.8 1-3.39 2.45-4.2A9 9 0 0 0 12 3z"/>
                </svg>
            </button>
            <button class="btn-icon rtl-toggle" aria-label="Toggle Direction">
                <span style="font-weight: 700; font-size: 0.75rem; letter-spacing: 0.5px;">RTL</span>
            </button>
        `;
        const menuList = mobileNav.querySelector('.mobile-menu');
        if (menuList) {
            menuList.insertAdjacentElement('afterend', mobileControls);
        } else {
            mobileNav.prepend(mobileControls);
        }
    }

    // 3. Theme Toggle (Light / Dark)
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    // 4. RTL Toggle
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    const currentDir = localStorage.getItem('dir') || 'ltr';
    document.documentElement.setAttribute('dir', currentDir);

    const updateRtlButtonText = (dir) => {
        rtlToggles.forEach(toggle => {
            const span = toggle.querySelector('span');
            if (span) {
                span.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
            }
        });
    };
    updateRtlButtonText(currentDir);

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const activeDir = document.documentElement.getAttribute('dir');
            const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlButtonText(newDir);
        });
    });

    // 5. Active Nav link highlighting
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 6. Scroll Animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in, .animated');
    if (animatedElements.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // 7. Interactive Checklist Logic (Resources page)
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    if (checklistItems.length > 0) {
        const updateProgress = () => {
            const checkedCount = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
            const percentage = Math.round((checkedCount / checklistItems.length) * 100);
            const fill = document.querySelector('.progress-bar-fill');
            const percentLabel = document.querySelector('.progress-percentage');
            if (fill) fill.style.width = `${percentage}%`;
            if (percentLabel) percentLabel.textContent = `${percentage}%`;
        };

        checklistItems.forEach(item => {
            item.addEventListener('change', updateProgress);
        });
        updateProgress(); // init progress
    }

    // 8. FAQ Accordion Logic (Guides & Contact pages)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close other active FAQs
            faqQuestions.forEach(otherQ => {
                otherQ.parentElement.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 9. Search / Filters (Guides & Glossary page)
    const searchInput = document.getElementById('search-box');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const searchableCards = document.querySelectorAll('.searchable-card');
            
            searchableCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 10. Glossary letter filtering
    const letterBtns = document.querySelectorAll('.letter-btn');
    if (letterBtns.length > 0) {
        letterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                letterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const letter = btn.getAttribute('data-letter').toUpperCase();
                const glossaryCards = document.querySelectorAll('.glossary-card');
                
                glossaryCards.forEach(card => {
                    const term = card.querySelector('.glossary-term').textContent.trim();
                    if (letter === 'ALL' || term.toUpperCase().startsWith(letter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 11. Consultation Wizard (Booking page)
    const wizard = document.getElementById('booking-wizard');
    if (wizard) {
        let currentStep = 1;
        const steps = wizard.querySelectorAll('.wizard-step');
        const indicators = wizard.querySelectorAll('.step-indicator-dot');
        const prevBtn = wizard.querySelector('.btn-prev');
        const nextBtn = wizard.querySelector('.btn-next');

        const updateWizard = () => {
            steps.forEach((step, idx) => {
                if (idx + 1 === currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            indicators.forEach((indicator, idx) => {
                if (idx + 1 === currentStep) {
                    indicator.className = 'step-indicator-dot active';
                } else if (idx + 1 < currentStep) {
                    indicator.className = 'step-indicator-dot completed';
                } else {
                    indicator.className = 'step-indicator-dot';
                }
            });

            // Adjust navigation buttons visibility
            if (currentStep === 1) {
                prevBtn.style.visibility = 'hidden';
            } else {
                prevBtn.style.visibility = 'visible';
            }

            if (currentStep === steps.length) {
                // Success page: hide wizard footer
                const footer = wizard.querySelector('.wizard-footer');
                if (footer) footer.style.display = 'none';
            } else {
                nextBtn.textContent = currentStep === steps.length - 1 ? 'Confirm & Book' : 'Continue';
            }
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateWizard();
                }
            });

            nextBtn.addEventListener('click', () => {
                // Perform simple step validation before proceeding
                let isValid = true;
                const activeStepEl = wizard.querySelector('.wizard-step.active');
                
                if (currentStep === 1) {
                    // Check if experience option is selected
                    const selected = activeStepEl.querySelector('.selection-card.selected');
                    if (!selected) {
                        alert('Please select an option to continue.');
                        isValid = false;
                    }
                } else if (currentStep === 2) {
                    // Validate questionnaire
                    const capital = activeStepEl.querySelector('#capital-range').value;
                    const state = activeStepEl.querySelector('#target-states').value;
                    if (!capital || !state) {
                        alert('Please complete all fields.');
                        isValid = false;
                    }
                } else if (currentStep === 3) {
                    // Validate scheduler
                    const selectedDate = activeStepEl.querySelector('.calendar-day.selected');
                    const selectedTime = activeStepEl.querySelector('.time-slot.selected');
                    if (!selectedDate || !selectedTime) {
                        alert('Please select a date and time slot.');
                        isValid = false;
                    }
                } else if (currentStep === 4) {
                    // Validate contact details
                    const name = activeStepEl.querySelector('#client-name').value.trim();
                    const email = activeStepEl.querySelector('#client-email').value.trim();
                    const phone = activeStepEl.querySelector('#client-phone').value.trim();
                    if (!name || !email || !phone) {
                        alert('Please fill in your contact information.');
                        isValid = false;
                    }
                }

                if (isValid && currentStep < steps.length) {
                    currentStep++;
                    updateWizard();
                }
            });
        }

        // Selection cards listener inside Step 1
        const selectionCards = wizard.querySelectorAll('.selection-card');
        selectionCards.forEach(card => {
            card.addEventListener('click', () => {
                const parent = card.parentElement;
                parent.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        // Calendar Date picker simulation
        const calendarDays = wizard.querySelectorAll('.calendar-day:not(.day-disabled):not(.day-empty)');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                calendarDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
            });
        });

        // Time slot picker simulation
        const timeSlots = wizard.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                timeSlots.forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
            });
        });
    }

    // 12. Contact Form / Inquiry Submit
    const contactForm = document.getElementById('consultation-inquiry-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Success presentation
                const formParent = contactForm.parentElement;
                formParent.innerHTML = `
                    <div class="wizard-success-state animated visible" style="padding-block: 4rem;">
                        <div class="success-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1.002 1.002 0 0 1 1.46-1.37l4.1 4.36 7.9-8.77a1 1 0 0 1 1.48 1.34l-8.62 9.57a1 1 0 0 1-.73.36z"/></svg>
                        </div>
                        <h3 style="font-family: var(--font-serif); margin-bottom: 1rem; font-size: 1.8rem; color: var(--accent);">Thank You!</h3>
                        <p style="max-width: 500px; margin-inline: auto;">Your inquiry has been received. One of our senior property auction consultants will review your details and contact you via phone or email within the next 24 hours.</p>
                    </div>
                `;
            }, 1200);
        });
    }

    // 13. Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 14. Footer Social Icons Injection
    const footerLogoCol = document.querySelector('footer .footer-col');
    if (footerLogoCol) {
        const socialsContainer = document.createElement('div');
        socialsContainer.className = 'footer-socials';
        socialsContainer.innerHTML = `
            <a href="#" aria-label="Facebook" class="social-icon">
                <svg viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" class="social-icon">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" class="social-icon">
                <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" class="social-icon">
                <svg viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
        `;
        footerLogoCol.appendChild(socialsContainer);
    }
});
