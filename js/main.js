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

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const activeDir = document.documentElement.getAttribute('dir');
            const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
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
                
                const letter = btn.getAttribute('data-letter');
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
});
