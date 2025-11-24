// Practice page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize practice page functionality
    initTableOfContents();
    initSectionHighlighting();
    initReadingProgress();
    initSearchFunctionality();
    initSectionAnimations();
    initMobileTOC();

    // Применяем функциональность из основного скрипта
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
    if (typeof initScrollToTop === 'function') {
        initScrollToTop();
    }
});

// Table of Contents functionality
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.content-section');

    // Плавная прокрутка к разделам
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Обновляем активную ссылку
                updateActiveLink(this);
            }
        });
    });

    // Отслеживание активного раздела при прокрутке
    function updateActiveSection() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop &&
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        // Обновляем активную ссылку в оглавлении
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Обработчик прокрутки с троттлингом
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateActiveSection, 10);
    });

    // Инициализация активного раздела
    setTimeout(updateActiveSection, 100);
}

// Highlight current section in TOC
function initSectionHighlighting() {
    const sections = document.querySelectorAll('.content-section');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (sections.length === 0 || tocLinks.length === 0) return;

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const correspondingTocLink = document.querySelector(`.toc-link[href="#${sectionId}"]`);

                if (correspondingTocLink) {
                    updateActiveLink(correspondingTocLink);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

function updateActiveLink(activeLink) {
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Reading progress indicator
function initReadingProgress() {
    const progressFill = document.querySelector('.progress-fill');

    if (!progressFill) return;

    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;

        const progress = Math.min((scrollTop / documentHeight) * 100, 100);
        progressFill.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Инициализация
}



// Search functionality for content
function initSearchFunctionality() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('searchInput');

    if (!searchToggle || !searchBox || !searchInput) return;

    // Переключение видимости поиска
    searchToggle.addEventListener('click', () => {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });

    // Поиск по тексту
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.toLowerCase());
        }, 300);
    });

    function performSearch(query) {
        const sections = document.querySelectorAll('.content-section');
        const tocLinks = document.querySelectorAll('.toc-link');

        if (!query) {
            // Показать все секции
            sections.forEach(section => {
                section.style.display = 'block';
                removeHighlights(section);
            });
            tocLinks.forEach(link => link.style.display = 'flex');
            return;
        }

        let foundSections = new Set();

        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            const sectionId = section.id;

            if (content.includes(query)) {
                foundSections.add(sectionId);
                section.style.display = 'block';
                highlightText(section, query);
            } else {
                section.style.display = 'none';
                removeHighlights(section);
            }
        });

        // Скрыть/показать ссылки в оглавлении
        tocLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (foundSections.has(href)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        });

        // Показать уведомление если ничего не найдено
        if (foundSections.size === 0) {
            showNoResultsMessage();
        } else {
            hideNoResultsMessage();
        }
    }

    function highlightText(element, query) {
        removeHighlights(element);

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(query)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const content = textNode.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            const highlightedContent = content.replace(regex, '<mark class="search-highlight">$1</mark>');

            if (highlightedContent !== content) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedContent;
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }

    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    function showNoResultsMessage() {
        let noResultsMsg = document.querySelector('.no-results-message');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить поисковый запрос</p>
                </div>
            `;
            document.querySelector('.practice-content').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    }

    function hideNoResultsMessage() {
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Enhanced section animations
function initSectionAnimations() {
    // Сначала сделаем все секции видимыми
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('visible');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Анимация для карточек внутри секции
                const cards = entry.target.querySelectorAll('.tech-item, .feature-card, .achievement-card, .skill-item');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animationDelay = `${index * 0.1}s`;
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
}

// Table of contents scroll behavior
function enhanceTocBehavior() {
    const tableOfContents = document.querySelector('.table-of-contents');
    if (!tableOfContents) return;

    let isSticky = false;

    window.addEventListener('scroll', function() {
        const tocTop = tableOfContents.getBoundingClientRect().top;

        if (tocTop <= 100 && !isSticky) {
            isSticky = true;
            tableOfContents.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.2)';
        } else if (tocTop > 100 && isSticky) {
            isSticky = false;
            tableOfContents.style.boxShadow = 'none';
        }
    });
}

// Search functionality for content
function initContentSearch() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
        position: fixed;
        top: 50%;
        right: -300px;
        transform: translateY(-50%);
        width: 280px;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 15px;
        padding: 1rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        transition: right 0.3s ease;
        z-index: 1001;
    `;

    searchContainer.innerHTML = `
        <h4 style="color: #00d4ff; margin-bottom: 1rem;">Поиск по тексту</h4>
        <input type="text" id="content-search" placeholder="Введите текст для поиска..." 
               style="width: 100%; padding: 0.5rem; border: 1px solid #00d4ff; border-radius: 8px; 
                      background: rgba(255, 255, 255, 0.1); color: white;">
        <div id="search-results" style="margin-top: 1rem; max-height: 200px; overflow-y: auto;"></div>
    `;

    document.body.appendChild(searchContainer);

    // Toggle search panel
    const searchToggle = document.createElement('button');
    searchToggle.innerHTML = '🔍';
    searchToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        background: linear-gradient(45deg, #9C27B0, #673AB7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1002;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(156, 39, 176, 0.3);
    `;

    document.body.appendChild(searchToggle);

    let searchVisible = false;

    searchToggle.addEventListener('click', function() {
        searchVisible = !searchVisible;
        searchContainer.style.right = searchVisible ? '20px' : '-300px';
        searchToggle.style.right = searchVisible ? '320px' : '20px';
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + P for print
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }

        // Ctrl + F for search
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchToggle = document.querySelector('button');
            if (searchToggle) searchToggle.click();
        }

        // Arrow keys for navigation
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// Initialize all enhancements
window.addEventListener('load', function() {
    initSectionAnimations();
    enhanceTocBehavior();
    initContentSearch();
    initKeyboardShortcuts();

    // Add keyboard shortcuts info
    console.log(`
%c📚 Горячие клавиши для страницы практики:
%cCtrl + P - Печать документа
%cCtrl + F - Поиск по тексту
%cCtrl + ↑ - В начало страницы
%cCtrl + ↓ - В конец страницы
`,
        'color: #00d4ff; font-weight: bold;',
        'color: #ffffff;',
        'color: #ffffff;',
        'color: #ffffff;',
        'color: #ffffff;'
    );
});

// Error handling for practice page
window.addEventListener('error', function(e) {
    console.warn('Ошибка на странице практики:', e.error);
});

// Back to top with section context
function addContextualBackToTop() {
    const backButton = document.querySelector('.scroll-to-top');
    if (!backButton) return;

    // Show current section in tooltip
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-section');
        let currentSection = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                const heading = section.querySelector('h2');
                if (heading) {
                    currentSection = heading.textContent;
                }
            }
        });

        if (currentSection) {
            backButton.title = `Вернуться к началу (текущий раздел: ${currentSection})`;
        }
    });
}



// Мобильное оглавление
function initMobileTOC() {
    // Создаем кнопку для открытия оглавления на мобильных устройствах
    const tocToggle = document.createElement('button');
    tocToggle.className = 'mobile-toc-toggle';
    tocToggle.innerHTML = '📖';
    tocToggle.setAttribute('aria-label', 'Открыть оглавление');
    tocToggle.style.cssText = `
        position: fixed;
        top: 90px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient-3);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 20px;
        cursor: pointer;
        z-index: 1001;
        display: none;
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(tocToggle);

    const toc = document.querySelector('.table-of-contents');

    // Показывать кнопку только на мобильных устройствах
    function checkMobile() {
        if (window.innerWidth <= 768) {
            tocToggle.style.display = 'flex';
            tocToggle.style.alignItems = 'center';
            tocToggle.style.justifyContent = 'center';
        } else {
            tocToggle.style.display = 'none';
            if (toc) toc.classList.remove('mobile-open');
        }
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Обработчик клика по кнопке
    tocToggle.addEventListener('click', () => {
        if (toc) {
            toc.classList.toggle('mobile-open');
            tocToggle.innerHTML = toc.classList.contains('mobile-open') ? '✕' : '📖';
        }
    });

    // Закрытие при клике на ссылку в оглавлении
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && toc) {
                toc.classList.remove('mobile-open');
                tocToggle.innerHTML = '📖';
            }
        });
    });

    // Закрытие при клике вне оглавления
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            toc &&
            toc.classList.contains('mobile-open') &&
            !toc.contains(e.target) &&
            e.target !== tocToggle) {
            toc.classList.remove('mobile-open');
            tocToggle.innerHTML = '📖';
        }
    });
}

// Уведомления
function showNotification(message) {
    // Удаляем предыдущие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-3);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Удаление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Горячие клавиши
document.addEventListener('keydown', function(e) {
    // Ctrl+F для открытия поиска
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchToggle = document.querySelector('.search-toggle');
        const searchBox = document.querySelector('.search-box');
        const searchInput = document.getElementById('searchInput');

        if (searchToggle && searchBox && searchInput) {
            if (!searchBox.classList.contains('active')) {
                searchToggle.click();
            } else {
                searchInput.focus();
            }
        }
    }

    // Escape для закрытия поиска
    if (e.key === 'Escape') {
        const searchBox = document.querySelector('.search-box');
        const searchInput = document.getElementById('searchInput');

        if (searchBox && searchBox.classList.contains('active')) {
            searchBox.classList.remove('active');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    }
});

// Функция печати с настройками
function setupPrintStyles() {
    const printStyles = `
        @media print {
            .table-of-contents,
            .reading-progress,
            .scroll-top,
            .mobile-toc-toggle,
            .search-box,
            .toc-actions {
                display: none !important;
            }
            
            .practice-content {
                margin-left: 0 !important;
                max-width: 100% !important;
                padding: 0 !important;
            }
            
            .content-section {
                page-break-inside: avoid;
                margin-bottom: 2rem;
            }
            
            .practice-header {
                page-break-after: avoid;
            }
            
            .code-block pre {
                page-break-inside: avoid;
                border: 1px solid #ccc;
            }
            
            .tech-grid,
            .architecture-grid,
            .feature-grid,
            .achievements-grid {
                page-break-inside: avoid;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

// Инициализация стилей печати
setupPrintStyles();

// Обработка изменения размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Пересчитываем позиции для правильной работы навигации
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 250);
});

// CSS стили для поисковых результатов
const searchStyles = `
    .search-highlight {
        background: var(--primary-color);
        color: var(--bg-color);
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 600;
    }
    
    .animate-in {
        animation: fadeInScale 0.6s ease forwards;
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);