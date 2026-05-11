// ==========================================
// THEME TOGGLE FUNCTIONALITY
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
if (themeIcon) updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// ==========================================
// AUTH STATE MANAGEMENT
// ==========================================
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('learniaCurrentUser')) || 
               JSON.parse(sessionStorage.getItem('learniaCurrentUser')) || null;
    } catch (error) {
        return null;
    }
}

function updateAuthUI() {
    const currentUser = getCurrentUser();
    const signInBtn = document.getElementById('signInBtn');
    const startLearningBtn = document.getElementById('startLearningBtn');
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const navUserName = document.getElementById('navUserName');
    const dashboardLink = document.getElementById('dashboardLink');
    const mobileAuthActions = document.getElementById('mobileAuthActions');
    const mobileUserSection = document.getElementById('mobileUserSection');
    const mobileUserAvatar = document.getElementById('mobileUserAvatar');
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileUserEmail = document.getElementById('mobileUserEmail');
    const mobileDashboardLink = document.getElementById('mobileDashboardLink');
    
    if (currentUser) {
        // User is logged in
        if (signInBtn) signInBtn.style.display = 'none';
        if (startLearningBtn) startLearningBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (mobileAuthActions) mobileAuthActions.style.display = 'none';
        if (mobileUserSection) mobileUserSection.style.display = 'block';
        
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        const avatar = currentUser.avatar || (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
        
        if (navUserAvatar) navUserAvatar.textContent = avatar;
        if (navUserName) navUserName.textContent = currentUser.firstName;
        if (mobileUserAvatar) mobileUserAvatar.textContent = avatar;
        if (mobileUserName) mobileUserName.textContent = fullName;
        if (mobileUserEmail) mobileUserEmail.textContent = currentUser.email;
        
        // Set dashboard link based on role
        const dashboardUrl = getDashboardUrl(currentUser.role);
        if (dashboardLink) dashboardLink.href = dashboardUrl;
        if (mobileDashboardLink) mobileDashboardLink.href = dashboardUrl;
        
        // Update bottom nav for logged in user
        updateBottomNav(true, currentUser.role);
    } else {
        // User is not logged in
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        if (startLearningBtn) startLearningBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
        if (mobileAuthActions) mobileAuthActions.style.display = 'flex';
        if (mobileUserSection) mobileUserSection.style.display = 'none';
        
        updateBottomNav(false);
    }
}

function getDashboardUrl(role) {
    switch(role) {
        case 'admin': return 'admin-dashboard.html';
        case 'instructor': return 'instructor-dashboard.html';
        case 'student': return 'student-dashboard.html';
        default: return 'login.html';
    }
}

function updateBottomNav(isLoggedIn, role) {
    const bottomNav = document.querySelector('.bottom-nav-container');
    if (!bottomNav) return;
    
    if (isLoggedIn) {
        bottomNav.innerHTML = `
            <a href="#home" class="bottom-nav-item active" data-section="home">
                <div class="nav-icon"><i class="fas fa-home"></i></div>
                <span>Home</span>
            </a>
            <a href="courses.html" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-laptop-code"></i></div>
                <span>Courses</span>
            </a>
            <a href="${getDashboardUrl(role)}" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-th-large"></i></div>
                <span>Dashboard</span>
            </a>
            <a href="#" onclick="handleLogout()" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-sign-out-alt"></i></div>
                <span>Logout</span>
            </a>
        `;
    } else {
        bottomNav.innerHTML = `
            <a href="#home" class="bottom-nav-item active" data-section="home">
                <div class="nav-icon"><i class="fas fa-home"></i></div>
                <span>Home</span>
            </a>
            <a href="courses.html" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-laptop-code"></i></div>
                <span>Courses</span>
            </a>
            <a href="register.html" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-user-plus"></i></div>
                <span>Join</span>
            </a>
            <a href="login.html" class="bottom-nav-item">
                <div class="nav-icon"><i class="fas fa-sign-in-alt"></i></div>
                <span>Login</span>
            </a>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('learniaCurrentUser');
    sessionStorage.removeItem('learniaCurrentUser');
    updateAuthUI();
    // Show brief message
    alert('Logged out successfully!');
}

// User menu dropdown toggle
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');

if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close mobile menu on window resize if it becomes desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = scrollPercentage + '%';
}, { passive: true });

// ==========================================
// BOTTOM NAVIGATION ACTIVE STATE
// ==========================================
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    if (!bottomNavItems.length) return;
    
    const scrollPosition = window.scrollY + 150;
    let currentSection = 'home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentSection = 'contact';
    }

    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === currentSection) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==========================================
// PRICING TOGGLE
// ==========================================
const pricingToggle = document.getElementById('pricingToggle');
const amountElements = document.querySelectorAll('.amount[data-monthly]');
const toggleLabels = document.querySelectorAll('.toggle-label');

if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;
        
        amountElements.forEach(el => {
            const monthly = el.getAttribute('data-monthly');
            const yearly = el.getAttribute('data-yearly');
            el.textContent = isYearly ? yearly : monthly;
        });
        
        toggleLabels.forEach(label => label.classList.remove('active'));
        if (isYearly) {
            toggleLabels[1]?.classList.add('active');
        } else {
            toggleLabels[0]?.classList.add('active');
        }
    });
}

// ==========================================
// FAQ ACCORDION
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    }
});

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
            submitBtn.style.background = '#10b981';
            
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-reveal').forEach(section => {
    revealObserver.observe(section);
});

// ==========================================
// NAVBAR BACKGROUND ON SCROLL
// ==========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }
}, { passive: true });

// ==========================================
// SHARED CART FUNCTIONALITY
// ==========================================
function updateHomeCartCount() {
    const cartCountHome = document.getElementById('cartCountHome');
    if (cartCountHome) {
        const cart = JSON.parse(localStorage.getItem('learaniaCart')) || [];
        cartCountHome.textContent = cart.length;
        cartCountHome.style.display = cart.length === 0 ? 'none' : 'flex';
    }
}

// ==========================================
// HANDLE RESIZE EVENTS
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateActiveNav();
    }, 250);
});

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    updateAuthUI();
    updateHomeCartCount();
    
    body.classList.add('loaded');
    
    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'learniaCart') {
            updateHomeCartCount();
        }
        if (e.key === 'learniaCurrentUser') {
            updateAuthUI();
        }
    });
});

// Update UI when page gains focus
window.addEventListener('focus', function() {
    updateAuthUI();
    updateHomeCartCount();
});

// Update cart count periodically
setInterval(updateHomeCartCount, 3000);

// ==========================================
// KEYBOARD NAVIGATION SUPPORT
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        mobileToggle.focus();
    }
});

// ==========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ==========================================
window.handleLogout = handleLogout;

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log('%c👋 Welcome to LearnHub!', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%cAlready have an account? %cLogin here → login.html', 'font-size: 12px; color: #94a3b8;', 'color: #06b6d4;');
console.log('%cNew user? %cRegister here → register.html', 'font-size: 12px; color: #94a3b8;', 'color: #10b981;');
console.log('%c🚀 Start your learning journey today!', 'font-size: 12px; color: #8b5cf6;');