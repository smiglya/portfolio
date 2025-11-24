// Global variables
let currentImageIndex = 0;
const images = [
    'image/фото карусель 1.png',
    'image/фото карусель 2.png',
    'image/фото карусель 3.png'
];

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initMobileMenu();
    initImageSlider();
    initScrollAnimations();
    initScrollToTop();
    initProgressBars();
    initNavbarScroll();
    initSkillCards();
    addScrollToTopButton();
    initSmoothScrolling();

    // Добавляем класс загрузки к элементам
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        const aboutText = document.querySelector('.about-text');

        if (heroContent) heroContent.classList.add('loaded');
        if (aboutText) aboutText.classList.add('loaded');

        document.querySelectorAll('.skill-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('loaded');
            }, index * 200);
        });
    }, 100);
});

// Navigation functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Image carousel functionality
function initImageSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Показать слайд
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // Следующий слайд
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    // Предыдущий слайд
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    // Обработчики событий
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Автопрокрутка слайдера
    let autoSlide = setInterval(nextSlide, 5000);

    // Пауза при наведении
    const slider = document.querySelector('.image-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });

        // Поддержка свайпов на мобильных устройствах
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });
    }

    // Управление клавиатурой
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Добавляем анимацию в зависимости от элемента
                if (element.classList.contains('skill-card')) {
                    element.style.animationDelay = `${Array.from(element.parentNode.children).indexOf(element) * 0.2}s`;
                    element.classList.add('animate-fade-up');
                } else if (element.classList.contains('hero-content')) {
                    element.classList.add('animate-fade-left');
                } else if (element.classList.contains('hero-image')) {
                    element.classList.add('animate-fade-right');
                } else {
                    element.classList.add('animate-fade-up');
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    document.querySelectorAll('.skill-card, .hero-content, .hero-image, .about-content').forEach(el => {
        observer.observe(el);
    });
}

// Scroll to top button
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.classList.add('scroll-to-top');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00d4ff, #0099cc);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
    `;

    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'translateY(0)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'translateY(100px)';
        }
    });

    // Scroll to top functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(0) scale(1.1)';
    });

    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scrolling to internal links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Text typing animation for hero section
function initTypingAnimation() {
    const heroText = document.querySelector('.hero-text h1');
    if (!heroText) return;

    const text = heroText.textContent;
    heroText.textContent = '';

    let i = 0;
    const typeInterval = setInterval(() => {
        heroText.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Parallax effect for background
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const background = document.querySelector('body::before');

        // Apply parallax only on desktop
        if (window.innerWidth > 768) {
            document.body.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        }
    });
}

// Add loading animation
function showLoadingComplete() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Initialize additional effects when page loads
window.addEventListener('load', function() {
    showLoadingComplete();
    initParallaxEffect();

    // Add entrance animation to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.animation = 'fadeInUp 1s ease forwards';
    }

    // Add CSS for animations
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
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
        
        .skill-card {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .skill-card:nth-child(1) { animation-delay: 0.1s; }
        .skill-card:nth-child(2) { animation-delay: 0.2s; }
        .skill-card:nth-child(3) { animation-delay: 0.3s; }
    `;
    document.head.appendChild(additionalStyles);
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn(`Не удалось загрузить изображение: ${this.src}`);
    });
});

// Console easter egg
console.log(`
%c🚀 Добро пожаловать на сайт Аносова Артёма! %c
%c👨‍💻 Этот сайт создан с использованием современных веб-технологий
%c🎯 HTML5, CSS3, JavaScript ES6+
%c💡 Если у вас есть вопросы, пишите: @Smiglya
`,
    'color: #00d4ff; font-size: 16px; font-weight: bold;',
    '',
    'color: #ffffff; font-size: 12px;',
    'color: #00d4ff; font-size: 12px;',
    'color: #ffffff; font-size: 12px;'
);

// Кнопка "наверх"
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (!scrollTopBtn) return;

    // Показать/скрыть кнопку
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Плавная прокрутка наверх
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Анимация прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.dataset.width;

                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 500);

                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Изменение навбара при прокрутке
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(0, 212, 255, 0.2)';
        }
    });
}

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Учитываем высоту навбара

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Активация навигационных ссылок
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Анимация счетчиков в статистике
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);

                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Запуск анимации счетчиков
setTimeout(animateCounters, 1000);

// Добавление эффекта параллакса
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.skill-card');

        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Управление темой (если потребуется)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    // Восстановление темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Обработка изменения размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Переинициализация при изменении размера
        const navbar = document.querySelector('.navbar');
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');

        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// Дополнительные утилиты
const utils = {
    // Дебаунс функции
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Троттлинг функции
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Проверка видимости элемента
    isElementInViewport: (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Экспорт утилит для использования в других скриптах
window.utils = utils;