// Contacts page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initFormValidation();
    initFAQ();
    initAnimations();
    initScrollEffects();
    initMap();
    initSocialLinks();
});

// Form validation functionality
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.submit-btn');

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            validateName(this);
        });
        nameInput.addEventListener('blur', function() {
            validateName(this);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }

    if (subjectInput) {
        subjectInput.addEventListener('input', function() {
            validateSubject(this);
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', function() {
            validateMessage(this);
            updateCharCounter(this);
        });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    // Add character counter
    if (messageInput) {
        addCharCounter(messageInput);
    }
}

// Validation functions
function validateName(input) {
    const value = input.value.trim();
    const minLength = 2;
    const maxLength = 50;

    if (value.length === 0) {
        showError(input, 'Пожалуйста, введите ваше имя');
        return false;
    } else if (value.length < minLength) {
        showError(input, `Имя должно содержать минимум ${minLength} символа`);
        return false;
    } else if (value.length > maxLength) {
        showError(input, `Имя не должно превышать ${maxLength} символов`);
        return false;
    } else if (!/^[а-яё\s\-]+$/i.test(value)) {
        showError(input, 'Имя может содержать только русские буквы, пробелы и дефисы');
        return false;
    }

    showSuccess(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.length === 0) {
        showError(input, 'Пожалуйста, введите email адрес');
        return false;
    } else if (!emailRegex.test(value)) {
        showError(input, 'Пожалуйста, введите корректный email адрес');
        return false;
    }

    showSuccess(input);
    return true;
}

function validateSubject(input) {
    const value = input.value.trim();
    const minLength = 5;
    const maxLength = 100;

    if (value.length === 0) {
        showError(input, 'Пожалуйста, введите тему сообщения');
        return false;
    } else if (value.length < minLength) {
        showError(input, `Тема должна содержать минимум ${minLength} символов`);
        return false;
    } else if (value.length > maxLength) {
        showError(input, `Тема не должна превышать ${maxLength} символов`);
        return false;
    }

    showSuccess(input);
    return true;
}

function validateMessage(input) {
    const value = input.value.trim();
    const minLength = 10;
    const maxLength = 1000;

    if (value.length === 0) {
        showError(input, 'Пожалуйста, введите сообщение');
        return false;
    } else if (value.length < minLength) {
        showError(input, `Сообщение должно содержать минимум ${minLength} символов`);
        return false;
    } else if (value.length > maxLength) {
        showError(input, `Сообщение не должно превышать ${maxLength} символов`);
        return false;
    }

    showSuccess(input);
    return true;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('success');
    formGroup.classList.add('error');

    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('error');
    formGroup.classList.add('success');

    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    let isValid = true;

    if (nameInput && !validateName(nameInput)) isValid = false;
    if (emailInput && !validateEmail(emailInput)) isValid = false;
    if (subjectInput && !validateSubject(subjectInput)) isValid = false;
    if (messageInput && !validateMessage(messageInput)) isValid = false;

    return isValid;
}

function addCharCounter(textarea) {
    const maxLength = 1000;
    const formGroup = textarea.closest('.form-group');
    if (!formGroup) return;

    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.innerHTML = `<span class="current">0</span>/<span class="max">${maxLength}</span>`;
    formGroup.appendChild(counter);
}

function updateCharCounter(textarea) {
    const formGroup = textarea.closest('.form-group');
    if (!formGroup) return;

    const counter = formGroup.querySelector('.char-counter .current');
    if (counter) {
        counter.textContent = textarea.value.length;
    }
}

function submitForm() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="loading-icon"></i> Отправка...';
    submitBtn.classList.add('loading');

    // Simulate form submission
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();

        // Show success message
        showSuccessMessage();

        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');

        // Clear validation states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('success', 'error');
        });

        // Remove error messages
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());

        // Reset character counter
        const counter = document.querySelector('.char-counter .current');
        if (counter) counter.textContent = '0';

    }, 2000);
}

function showSuccessMessage() {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <i class="success-icon">✓</i>
        <h3>Сообщение отправлено!</h3>
        <p>Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.</p>
    `;

    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(message, form);

    // Remove message after 5 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = null;
                }
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            }
        });
    });
}

// Animation functionality
function initAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.contact-card, .form-container, .faq-item, .map-container');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.navbar');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });
}

// Map functionality (placeholder for real map integration)
function initMap() {
    // Map initialization removed - using embedded iframe instead
    return;
}



// Social links functionality
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });

        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Utility functions
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateName,
        validateEmail,
        validateSubject,
        validateMessage,
        validateForm
    };
}