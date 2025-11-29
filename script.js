// script.js - JavaScript для сайта кинотеатра "КиноМир"

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing site functionality');
    
    // Общие функции для всех страниц
    initMobileMenu();
    initSmoothScroll();
    initPageTransitions();
    
    // Определяем текущую страницу и инициализируем соответствующие функции
    const isPersonalPage = document.querySelector('.dashboard') !== null;
    const isHomePage = !isPersonalPage;
    
    console.log('Page detection:', { isHomePage, isPersonalPage });
    
    // Функции для главной страницы
    if (isHomePage) {
        console.log('Initializing home page functions');
        initAuthModal();
    }
    
    // Функции для личного кабинета (personal.html)
    if (isPersonalPage) {
        console.log('Initializing personal page functions for cinema');
        initPersonalPage();
        initProfileFunctionality();
        initTicketsSection();
        initBonusesSection();
        initViewingHistorySection();
    }
});

// ==================== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ СТРАНИЦ ====================

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const headerActions = document.querySelector('.header-actions');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            
            if (headerActions) {
                headerActions.classList.toggle('active');
            }
            
            const icon = this.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                this.setAttribute('aria-label', 'Закрыть меню');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                this.setAttribute('aria-label', 'Открыть меню');
            }
        });
        
        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (headerActions) {
                    headerActions.classList.remove('active');
                }
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                }
            });
        });
        
        // Закрытие меню при клике вне области
        document.addEventListener('click', function(event) {
            if (mobileMenuBtn && navMenu && !event.target.closest('.header-container')) {
                navMenu.classList.remove('active');
                if (headerActions) {
                    headerActions.classList.remove('active');
                }
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
            }
        });

        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (headerActions) {
                    headerActions.classList.remove('active');
                }
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                }
            }
        });
    }
}

// Плавная прокрутка
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Проверяем, что это якорь на текущей странице
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Переходы между страницами
function initPageTransitions() {
    const transitionLinks = document.querySelectorAll('.transition-link');
    const pageTransition = document.querySelector('.page-transition');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) return;
            
            e.preventDefault();
            const targetUrl = href;
            
            if (pageTransition) {
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 600);
            } else {
                window.location.href = targetUrl;
            }
        });
    });
    
    if (pageTransition) {
        pageTransition.classList.remove('active');
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ====================

// Модальное окно авторизации
function initAuthModal() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.querySelector('.open-modal-btn');
    const closeBtn = document.querySelector('.close');
    
    if (!modal) return;
    
    const tabLinks = document.querySelectorAll('.tab-link');
    const authForms = document.querySelectorAll('.auth-form');
    const modalTitle = document.getElementById('modalTitle');
    
    // Элементы для валидации паролей
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const loginPassword = document.getElementById('loginPassword');
    
    // Открытие модального окна
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }
    
    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Переключение между вкладками
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;

            // Обновляем активные вкладки
            tabLinks.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Обновляем заголовок и показываем соответствующую форму
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === tabName + 'Form') {
                    form.classList.add('active');
                    // Обновляем заголовок модального окна
                    if (modalTitle) {
                        modalTitle.textContent = tabName === 'login' 
                            ? 'Вход в личный кабинет' 
                            : 'Регистрация для входа в личный кабинет';
                    }
                }
            });
        });
    });

    // Валидация совпадения паролей при регистрации
    if (confirmPassword && registerPassword && passwordError) {
        const validatePasswords = () => {
            if (registerPassword.value !== confirmPassword.value) {
                passwordError.classList.add('show');
                confirmPassword.setAttribute('aria-invalid', 'true');
            } else {
                passwordError.classList.remove('show');
                confirmPassword.setAttribute('aria-invalid', 'false');
            }
        };

        confirmPassword.addEventListener('input', validatePasswords);
        registerPassword.addEventListener('input', validatePasswords);
    }

    // Валидация сложности пароля только для регистрации
    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            validatePasswordComplexity(this.value, this);
        });
    }
    
    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm && loginPassword) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (loginPassword.value.trim() !== '') {
                simulateAuth('login');
            } else {
                showNotification('Введите пароль', 'error');
                loginPassword.focus();
            }
        });
    }

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем совпадение паролей
            if (registerPassword && confirmPassword && registerPassword.value !== confirmPassword.value) {
                if (passwordError) passwordError.classList.add('show');
                if (confirmPassword) confirmPassword.focus();
                return;
            }
            
            // Проверяем сложность пароля
            if (validatePasswordComplexity(registerPassword.value, registerPassword)) {
                if (passwordError) passwordError.classList.remove('show');
                simulateAuth('register');
            } else {
                showNotification('Пароль не соответствует требованиям безопасности', 'error');
            }
        });
    }

    // Инициализация переключателей видимости пароля
    initPasswordToggles();
    
    function validatePasswordComplexity(password, inputElement) {
        const hasMinLength = password.length >= 8;
        const hasNumbers = /\d/.test(password);
        const hasLatin = /[a-zA-Z]/.test(password);
        
        const isValid = hasMinLength && hasNumbers && hasLatin;
        
        if (inputElement) {
            inputElement.setAttribute('aria-invalid', !isValid);
        }
        
        return isValid;
    }
    
    function openModal() {
        modal.style.display = 'block';
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'true');
        }
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        // Фокус на первом поле ввода активной формы
        const activeForm = document.querySelector('.auth-form.active');
        if (activeForm) {
            const firstInput = activeForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.removeAttribute('aria-hidden');
            }
        }, 300);
    }
    
    function simulateAuth(type) {
        const submitBtn = document.querySelector(`#${type}Form .btn`);
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Загрузка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification(type === 'login' ? 'Вход выполнен успешно!' : 'Регистрация завершена!', 'success');
            closeModal();

            // Перенаправляем пользователя на страницу personal.html
            window.location.href = 'personal.html';
            
            // Возвращаем кнопке исходное состояние
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

// Переключатели видимости пароля
function initPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input && icon) {
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                    this.setAttribute('aria-label', 'Скрыть пароль');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                    this.setAttribute('aria-label', 'Показать пароль');
                }
            }
        });
    });
}

// ==================== ФУНКЦИИ ДЛЯ ЛИЧНОГО КАБИНЕТА КИНОТЕАТРА ====================

// Инициализация личного кабинета кинотеатра
function initPersonalPage() {
    console.log('Initializing cinema personal page...');
    
    // Загружаем сохраненные данные пользователя
    loadUserData();
    
    // Обработчик для кнопки "Выйти"
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isConfirmed = confirm('Вы уверены, что хотите выйти из личного кабинета?');
            
            if (isConfirmed) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Инициализация быстрых действий
    initQuickActions();
    
    // Функция активации раздела
    function activateSection(sectionId) {
        // Скрываем все разделы
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Показываем нужный раздел
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Обновляем активный пункт бокового меню
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // Автоматическое открытие раздела при загрузке страницы
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        activateSection(hash);
    } else {
        activateSection('overview');
    }
    
    // Обработчик для бокового меню
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            if (document.getElementById(sectionId)) {
                activateSection(sectionId);
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });
}

// Инициализация быстрых действий для кинотеатра
function initQuickActions() {
    // Обработчик для кнопки "Купить билеты"
    const buyTicketsAction = document.querySelector('.action-card:nth-child(1)');
    if (buyTicketsAction) {
        buyTicketsAction.addEventListener('click', function() {
            window.location.href = 'index.html#services';
        });
    }
    
    // Обработчик для кнопки "Мои билеты"
    const myTicketsAction = document.querySelector('.action-card:nth-child(2)');
    if (myTicketsAction) {
        myTicketsAction.addEventListener('click', function() {
            const ticketsLink = document.querySelector('a[data-section="bookings"]');
            if (ticketsLink) {
                ticketsLink.click();
            }
        });
    }
    
    // Обработчик для кнопки "Использовать бонусы"
    const useBonusesAction = document.querySelector('.action-card:nth-child(3)');
    if (useBonusesAction) {
        useBonusesAction.addEventListener('click', function() {
            const bonusesLink = document.querySelector('a[data-section="bonuses"]');
            if (bonusesLink) {
                bonusesLink.click();
            }
        });
    }
    
    // Обработчик для кнопки "Настройки профиля"
    const settingsAction = document.querySelector('.action-card:nth-child(4)');
    if (settingsAction) {
        settingsAction.addEventListener('click', function() {
            const settingsLink = document.querySelector('a[data-section="preferences"]');
            if (settingsLink) {
                settingsLink.click();
            }
        });
    }
}

// Загрузка данных пользователя
function loadUserData() {
    let userData = {};
    
    try {
        userData = JSON.parse(localStorage.getItem('userData')) || {};
    } catch (e) {
        console.error('Error parsing userData from localStorage:', e);
        userData = {};
    }
    
    // Заполняем поля персональных данных
    if (userData.firstName) {
        const firstNameField = document.getElementById('firstName');
        if (firstNameField) firstNameField.value = userData.firstName;
    }
    if (userData.lastName) {
        const lastNameField = document.getElementById('lastName');
        if (lastNameField) lastNameField.value = userData.lastName;
    }
    if (userData.email) {
        const emailField = document.getElementById('email');
        if (emailField) emailField.value = userData.email;
    }
    if (userData.phone) {
        const phoneField = document.getElementById('phone');
        if (phoneField) phoneField.value = userData.phone;
    }
    if (userData.birthdate) {
        const birthdateField = document.getElementById('birthdate');
        if (birthdateField) birthdateField.value = userData.birthdate;
    }
    
    // Обновляем информацию в боковой панели
    updateSidebarInfo(userData);
}

// Сохранение персональных данных
function savePersonalData() {
    try {
        const userData = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            birthdate: document.getElementById('birthdate')?.value || ''
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification('Личные данные успешно сохранены!', 'success');
        
        // Обновляем информацию в боковой панели
        updateSidebarInfo(userData);
    } catch (error) {
        console.error('Error saving personal data:', error);
        showNotification('Ошибка при сохранении данных', 'error');
    }
}

// Обновление информации в боковой панели
function updateSidebarInfo(userData) {
    const userInfoSection = document.querySelector('.user-info');
    if (!userInfoSection) return;
    
    // Обновляем имя
    const nameElement = userInfoSection.querySelector('h3');
    if (nameElement && userData.firstName && userData.lastName) {
        nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
    }
}

// Инициализация функциональности профиля
function initProfileFunctionality() {
    // Переключение между вкладками профиля
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    
    profileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchProfileTab(targetTab);
        });
    });
    
    // Обработчик для формы личных данных
    const personalDataForm = document.querySelector('#personal-info form');
    if (personalDataForm) {
        personalDataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalData();
        });
    }
    
    // Инициализация переключателей уведомлений
    initNotificationToggles();
}

// Переключение между вкладками профиля
function switchProfileTab(tabName) {
    // Скрываем все содержимое вкладок
    const allTabs = document.querySelectorAll('.profile-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Деактивируем все кнопки навигации
    const allNavItems = document.querySelectorAll('.profile-nav-item');
    allNavItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Показываем выбранную вкладку и активируем её кнопку
    const activeTab = document.getElementById(tabName);
    const activeNavButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab && activeNavButton) {
        activeTab.classList.add('active');
        activeNavButton.classList.add('active');
    }
}

// Инициализация переключателей уведомлений
function initNotificationToggles() {
    const notificationToggles = document.querySelectorAll('#notifications .switch input');
    
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.notification-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            // Сохраняем настройку в localStorage
            saveNotificationSetting(settingName, isEnabled);
            
            showNotification(`Настройка уведомлений "${settingName}" ${isEnabled ? 'включена' : 'выключена'}`, 'success');
        });
        
        // Восстанавливаем состояние из localStorage
        const settingName = toggle.closest('.notification-item').querySelector('h4').textContent;
        const savedSetting = getNotificationSetting(settingName);
        if (savedSetting !== null) {
            toggle.checked = savedSetting;
        }
    });
}

// Сохранение настройки уведомлений
function saveNotificationSetting(settingName, isEnabled) {
    try {
        const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {};
        notificationSettings[settingName] = isEnabled;
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    } catch (error) {
        console.error('Error saving notification setting:', error);
    }
}

// Получение настройки уведомлений
function getNotificationSetting(settingName) {
    try {
        const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {};
        return notificationSettings[settingName] !== undefined ? notificationSettings[settingName] : null;
    } catch (error) {
        console.error('Error getting notification setting:', error);
        return null;
    }
}

// ==================== ФУНКЦИИ ДЛЯ РАЗДЕЛА БИЛЕТОВ ====================

function initTicketsSection() {
    console.log('Initializing tickets section...');
    
    // Загружаем историю билетов
    loadTicketsHistory();
    
    // Инициализация обработчиков для кнопок билетов
    initTicketActions();
}

// Загрузка истории билетов
function loadTicketsHistory() {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем статические данные
    const tickets = [
        {
            id: 1,
            movie: "Аватар: Путь воды",
            date: "15.12.2025 19:30",
            hall: "Зал 3 (IMAX)",
            seats: "Ряд 5, Места 12-13",
            amount: "1,200 ₽",
            status: "active"
        },
        {
            id: 2,
            movie: "Оппенгеймер", 
            date: "18.12.2025 21:00",
            hall: "Зал 1",
            seats: "Ряд 7, Место 8",
            amount: "450 ₽",
            status: "active"
        },
        {
            id: 3,
            movie: "Человек-паук: Через вселенные",
            date: "10.11.2025 18:00",
            hall: "Зал 2", 
            seats: "Ряд 4, Места 5-6",
            amount: "900 ₽",
            status: "used"
        },
        {
            id: 4,
            movie: "Барби",
            date: "05.11.2025 20:30", 
            hall: "Зал 4",
            seats: "Ряд 6, Место 10",
            amount: "450 ₽",
            status: "used"
        }
    ];
    
    renderTicketsTable(tickets);
}

// Отображение таблицы билетов
function renderTicketsTable(tickets) {
    const activeTicketsBody = document.querySelector('#bookings .table-container:first-child tbody');
    const historyTicketsBody = document.querySelector('#bookings .table-container:last-child tbody');
    
    if (!activeTicketsBody || !historyTicketsBody) return;
    
    // Очищаем таблицы
    activeTicketsBody.innerHTML = '';
    historyTicketsBody.innerHTML = '';
    
    // Разделяем билеты на активные и использованные
    const activeTickets = tickets.filter(ticket => ticket.status === 'active');
    const historyTickets = tickets.filter(ticket => ticket.status === 'used');
    
    // Заполняем таблицу активных билетов
    activeTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.movie}</td>
            <td>${ticket.date}</td>
            <td>${ticket.hall}</td>
            <td>${ticket.seats}</td>
            <td>${ticket.amount}</td>
            <td><span class="status-badge status-completed">Активен</span></td>
            <td>
                <button class="btn btn-outline btn-sm show-qr" data-ticket-id="${ticket.id}">
                    <i class="fas fa-qrcode"></i> QR-код
                </button>
                <button class="btn btn-outline btn-sm refund-ticket" data-ticket-id="${ticket.id}">
                    <i class="fas fa-times"></i> Вернуть
                </button>
            </td>
        `;
        activeTicketsBody.appendChild(row);
    });
    
    // Заполняем таблицу истории билетов
    historyTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.movie}</td>
            <td>${ticket.date}</td>
            <td>${ticket.hall}</td>
            <td>${ticket.seats}</td>
            <td>${ticket.amount}</td>
            <td><span class="status-indicator status-completed"><i class="fas fa-check"></i> Просмотрен</span></td>
        `;
        historyTicketsBody.appendChild(row);
    });
}

// Инициализация обработчиков действий с билетами
function initTicketActions() {
    // Обработчик для кнопки показа QR-кода
    document.addEventListener('click', function(e) {
        if (e.target.closest('.show-qr')) {
            const ticketId = e.target.closest('.show-qr').getAttribute('data-ticket-id');
            showQRCode(ticketId);
        }
    });
    
    // Обработчик для кнопки возврата билета
    document.addEventListener('click', function(e) {
        if (e.target.closest('.refund-ticket')) {
            const ticketId = e.target.closest('.refund-ticket').getAttribute('data-ticket-id');
            refundTicket(ticketId);
        }
    });
}

// Показ QR-кода билета
function showQRCode(ticketId) {
    // В реальном приложении здесь генерировался бы настоящий QR-код
    // Для демонстрации покажем имитацию
    
    const qrModal = document.createElement('div');
    qrModal.className = 'modal';
    qrModal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
    `;
    
    qrModal.innerHTML = `
        <div class="modal-content" style="
            background-color: var(--gray-light);
            margin: 10% auto;
            padding: 20px;
            border-radius: var(--border-radius-lg);
            width: 300px;
            text-align: center;
            position: relative;
        ">
            <button class="close-modal" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                color: var(--text-secondary);
                cursor: pointer;
            ">&times;</button>
            <h3 style="margin-bottom: 20px;">QR-код билета</h3>
            <div style="
                width: 200px;
                height: 200px;
                margin: 0 auto 20px;
                background: linear-gradient(45deg, #0f1c2e, #1a2d4a);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                border-radius: 8px;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🎫</div>
                    <div>Билет #${ticketId}</div>
                </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 14px;">
                Покажите этот код на входе в кинотеатр
            </p>
        </div>
    `;
    
    document.body.appendChild(qrModal);
    
    // Обработчик закрытия модального окна
    const closeBtn = qrModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(qrModal);
    });
    
    qrModal.addEventListener('click', function(e) {
        if (e.target === qrModal) {
            document.body.removeChild(qrModal);
        }
    });
}

// Возврат билета
function refundTicket(ticketId) {
    const isConfirmed = confirm('Вы уверены, что хотите вернуть этот билет?');
    
    if (!isConfirmed) {
        return;
    }
    
    // Имитация процесса возврата
    showNotification('Запрос на возврат билета отправлен...', 'info');
    
    setTimeout(() => {
        showNotification('Билет успешно возвращен! Сумма будет зачислена в течение 3-5 рабочих дней.', 'success');
        // В реальном приложении здесь было бы обновление данных
    }, 1500);
}

// ==================== ФУНКЦИИ ДЛЯ РАЗДЕЛА БОНУСОВ ====================

function initBonusesSection() {
    console.log('Initializing bonuses section...');
    
    // Загружаем историю бонусов
    loadBonusesHistory();
    
    // Инициализация обработчиков для использования бонусов
    initBonusActions();
}

// Загрузка истории бонусов
function loadBonusesHistory() {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем статические данные
    const bonusesHistory = [
        {
            date: "10.11.2025",
            description: "Покупка билетов на 'Человек-паук'",
            accrued: 90,
            spent: 0,
            balance: 1250
        },
        {
            date: "05.11.2025", 
            description: "Покупка билета на 'Барби'",
            accrued: 45,
            spent: 0,
            balance: 1160
        },
        {
            date: "28.10.2025",
            description: "Покупка билета на 'Джон Уик 4'", 
            accrued: 45,
            spent: 0,
            balance: 1115
        },
        {
            date: "15.10.2025",
            description: "Оплата бонусами части билета",
            accrued: 0, 
            spent: 200,
            balance: 1070
        }
    ];
    
    renderBonusesTable(bonusesHistory);
}

// Отображение таблицы бонусов
function renderBonusesTable(bonusesHistory) {
    const bonusesBody = document.querySelector('#bonuses .table-container tbody');
    
    if (!bonusesBody) return;
    
    // Очищаем таблицу
    bonusesBody.innerHTML = '';
    
    // Заполняем таблицу
    bonusesHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.description}</td>
            <td>${entry.accrued > 0 ? `+${entry.accrued}` : '-'}</td>
            <td>${entry.spent > 0 ? `-${entry.spent}` : '-'}</td>
            <td>${entry.balance}</td>
        `;
        bonusesBody.appendChild(row);
    });
}

// Инициализация обработчиков для использования бонусов
function initBonusActions() {
    // В реальном приложении здесь была бы логика использования бонусов
    // Для демонстрации добавим кнопку для тестирования
    const useBonusesBtn = document.createElement('button');
    useBonusesBtn.className = 'btn btn-primary';
    useBonusesBtn.innerHTML = '<i class="fas fa-star"></i> Использовать бонусы';
    useBonusesBtn.style.marginTop = '20px';
    
    useBonusesBtn.addEventListener('click', function() {
        showNotification('Функция использования бонусов будет доступна при покупке билетов', 'info');
    });
    
    const bonusesSection = document.querySelector('#bonuses .history-section');
    if (bonusesSection) {
        bonusesSection.appendChild(useBonusesBtn);
    }
}

// ==================== ФУНКЦИИ ДЛЯ РАЗДЕЛА ИСТОРИИ ПРОСМОТРОВ ====================

function initViewingHistorySection() {
    console.log('Initializing viewing history section...');
    
    // Загружаем историю просмотров
    loadViewingHistory();
    
    // Инициализация фильтров
    initViewingHistoryFilters();
    
    // Инициализация системы оценок
    initRatingSystem();
}

// Загрузка истории просмотров
function loadViewingHistory() {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем статические данные
    const viewingHistory = [
        {
            id: 1,
            movie: "Человек-паук: Через вселенные",
            date: "10.11.2025",
            hall: "Зал 2",
            rating: 4
        },
        {
            id: 2,
            movie: "Барби",
            date: "05.11.2025", 
            hall: "Зал 4",
            rating: 3
        },
        {
            id: 3,
            movie: "Джон Уик 4",
            date: "28.10.2025",
            hall: "Зал 1", 
            rating: 5
        }
    ];
    
    renderViewingHistory(viewingHistory);
}

// Отображение истории просмотров
function renderViewingHistory(viewingHistory) {
    const viewingContainer = document.querySelector('.viewed-movies');
    
    if (!viewingContainer) return;
    
    // Очищаем контейнер
    viewingContainer.innerHTML = '';
    
    // Заполняем контейнер карточками фильмов
    viewingHistory.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="movie-poster">
                <i class="fas fa-film"></i>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.movie}</h3>
                <div class="movie-meta">
                    <span>Просмотрено: ${movie.date}</span>
                    <span>Зал: ${movie.hall}</span>
                </div>
                <div class="movie-rating">
                    <strong>Ваша оценка:</strong>
                    <div class="stars" data-movie-id="${movie.id}">
                        ${generateStarRating(movie.rating)}
                    </div>
                </div>
            </div>
        `;
        viewingContainer.appendChild(movieCard);
    });
}

// Генерация звезд рейтинга
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += `<i class="fas fa-star rated" data-rating="${i}"></i>`;
        } else {
            stars += `<i class="fas fa-star" data-rating="${i}"></i>`;
        }
    }
    return stars;
}

// Инициализация фильтров истории просмотров
function initViewingHistoryFilters() {
    const yearFilter = document.getElementById('yearFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    
    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            filterViewingHistory();
        });
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            filterViewingHistory();
        });
    }
}

// Фильтрация истории просмотров
function filterViewingHistory() {
    // В реальном приложении здесь была бы фильтрация данных
    // Для демонстрации просто покажем уведомление
    const yearFilter = document.getElementById('yearFilter')?.value;
    const ratingFilter = document.getElementById('ratingFilter')?.value;
    
    if (yearFilter !== 'all' || ratingFilter !== 'all') {
        showNotification('История просмотров отфильтрована', 'info');
    } else {
        showNotification('Показана вся история просмотров', 'info');
    }
}

// Инициализация системы оценок
function initRatingSystem() {
    // Обработчик для кликов по звездам рейтинга
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-star') && e.target.closest('.stars')) {
            const starsContainer = e.target.closest('.stars');
            const movieId = starsContainer.getAttribute('data-movie-id');
            const rating = parseInt(e.target.getAttribute('data-rating'));
            
            updateMovieRating(movieId, rating, starsContainer);
        }
    });
}

// Обновление рейтинга фильма
function updateMovieRating(movieId, rating, starsContainer) {
    // Обновляем отображение звезд
    const stars = starsContainer.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('rated');
        } else {
            star.classList.remove('rated');
        }
    });
    
    // В реальном приложении здесь был бы запрос к API для сохранения рейтинга
    showNotification(`Оценка ${rating} звезд сохранена для фильма`, 'success');
    
    // Сохраняем в localStorage для демонстрации
    try {
        const movieRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        movieRatings[movieId] = rating;
        localStorage.setItem('movieRatings', JSON.stringify(movieRatings));
    } catch (error) {
        console.error('Error saving movie rating:', error);
    }
}

// ==================== ПОДДЕРЖКА СТАРЫХ БРАУЗЕРОВ И ОБРАБОТКА ОШИБОК ====================

// Добавление поддержки старых браузеров
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Улучшенная обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});

// Глобальный объект для отладки (можно удалить в продакшене)
window.cinemaDebug = {
    showUserData: function() {
        console.log('Current user data:', JSON.parse(localStorage.getItem('userData') || '{}'));
    },
    clearUserData: function() {
        localStorage.removeItem('userData');
        console.log('User data cleared');
        window.location.reload();
    },
    showNotificationSettings: function() {
        console.log('Notification settings:', JSON.parse(localStorage.getItem('notificationSettings') || '{}'));
    }
};


// Динамическое применение темной темы
function applyDarkTheme() {
    // Принудительно применяем темные стили ко всем элементам
    document.querySelectorAll('*').forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const bgColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // Если фон светлый, заменяем на темный
        if (bgColor && (bgColor.includes('255, 255, 255') || bgColor.includes('#fff') || bgColor.includes('#ffffff'))) {
            element.style.backgroundColor = 'var(--gray-light)';
        }
        
        // Если текст темный, заменяем на светлый
        if (color && (color.includes('0, 0, 0') || color.includes('#000') || color.includes('#000000'))) {
            element.style.color = 'var(--text-primary)';
        }
    });
}

// Применяем темную тему при загрузке и при изменениях DOM
document.addEventListener('DOMContentLoaded', function() {
    applyDarkTheme();
    
    // Наблюдатель за изменениями DOM для динамически добавляемых элементов
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setTimeout(applyDarkTheme, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Также применяем тему при переключении разделов
document.addEventListener('click', function(e) {
    if (e.target.closest('.sidebar-link') || e.target.closest('.profile-nav-item')) {
        setTimeout(applyDarkTheme, 300);
    }
});

        