// Coursework page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize coursework page functionality
    initNavigationCards();
    initModalWindows();
    initInteractiveElements();
    initAnimations();
    initFeedbackForm();
});

// Navigation cards functionality
function initNavigationCards() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.id.replace('-nav', '');
            const targetSection = document.getElementById(targetId) ||
                document.getElementById(targetId + '-diagram') ||
                document.getElementById(targetId + 's');

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px)';
                }, 150);
            }
        });

        // Add hover effect with sound simulation
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.4)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        });
    });
}

// Modal windows functionality
function initModalWindows() {
    // Add click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Add escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// Show modal function
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'translateY(-50px) scale(0.8)';
        modalContent.style.opacity = '0';

        setTimeout(() => {
            modalContent.style.transform = 'translateY(0) scale(1)';
            modalContent.style.opacity = '1';
        }, 10);
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');

        // Add exit animation
        modalContent.style.transform = 'translateY(-50px) scale(0.8)';
        modalContent.style.opacity = '0';

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }, 300);
    }
}

// Download template function
function downloadTemplate() {
    // Create a simple template file
    const templateContent = `
# Шаблон диаграмм для курсовой работы

## Контекстная диаграмма
- [ ] Определить внешние сущности
- [ ] Описать потоки данных
- [ ] Установить границы системы

## Декомпозиция
- [ ] Создать DFD уровня 0
- [ ] Детализировать процессы (уровень 1)
- [ ] Добавить подпроцессы (уровень 2)

## UML диаграммы
- [ ] Диаграмма классов
- [ ] Диаграмма последовательности
- [ ] Диаграмма состояний
- [ ] Диаграмма случаев использования

## Рекомендации
1. Используйте единую нотацию
2. Соблюдайте иерархию
3. Проверяйте консистентность
4. Добавляйте описания

Автор: Аносов Артём
Дата создания: ${new Date().toLocaleDateString('ru-RU')}
`;

    // Create and download file
    const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-coursework.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show feedback
    showNotification('Шаблон скачан успешно!', 'success');
}

// Interactive elements
function initInteractiveElements() {
    const interactiveItems = document.querySelectorAll('.interactive-item');

    interactiveItems.forEach(item => {
        // Add ripple effect
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 600ms linear;
                background-color: rgba(255, 255, 255, 0.7);
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
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

// Animations and effects
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Special animation for UML items
                if (entry.target.classList.contains('content-section')) {
                    const umlItems = entry.target.querySelectorAll('.uml-item');
                    umlItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.transform = 'translateY(0)';
                            item.style.opacity = '1';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.content-section, .interactive-section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Initialize UML items for animation
    const umlItems = document.querySelectorAll('.uml-item');
    umlItems.forEach(item => {
        item.style.transform = 'translateY(30px)';
        item.style.opacity = '0';
        item.style.transition = 'all 0.6s ease';
    });
}

// Feedback form functionality
function initFeedbackForm() {
    const feedbackForm = document.querySelector('.feedback-form');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};

            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Simulate form submission
            submitFeedback(data);
        });

        // Add real-time validation
        const inputs = feedbackForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidationError);
        });
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove existing error
    clearValidationError(e);

    // Validate based on field type
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Введите корректный email адрес';
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }
}

function clearValidationError(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function showFieldError(field, message) {
    field.style.borderColor = '#FF5722';

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #FF5722;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    `;
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitFeedback(data) {
    // Show loading state
    const submitButton = document.querySelector('.feedback-form button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Show success message
        showNotification('Спасибо за ваш отзыв! Сообщение отправлено.', 'success');

        // Close modal and reset form
        closeModal('feedback');
        document.querySelector('.feedback-form').reset();

        // Log feedback data (for development)
        console.log('Feedback submitted:', data);
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF5722' : '#00d4ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Progress tracking removed

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + 1, 2, 3 for quick navigation to sections
        if (e.ctrlKey && ['1', '2', '3'].includes(e.key)) {
            e.preventDefault();
            const sectionIndex = parseInt(e.key) - 1;
            const sections = ['context-diagram', 'decomposition', 'uml-diagrams'];
            const targetSection = document.getElementById(sections[sectionIndex]);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Ctrl + D for download template
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            downloadTemplate();
        }

        // Ctrl + F for feedback
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            showModal('feedback');
        }
    });
}

// Initialize additional features when page loads
window.addEventListener('load', function() {
    initKeyboardShortcuts();


});



// Export functions for global access
window.showModal = showModal;
window.closeModal = closeModal;
window.downloadTemplate = downloadTemplate;