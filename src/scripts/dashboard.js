// ==========================================
// DASHBOARD SHARED LOGIC (Fully Responsive)
// ==========================================

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('learniaCurrentUser')) || 
                    JSON.parse(sessionStorage.getItem('learniaCurrentUser'));

if (!currentUser) {
    console.log("[v0] No current user found, redirecting to login");
    window.location.href = './login.html';
}

// Expected role based on page
const pageRole = window.location.pathname.includes('admin') ? 'admin' :
                 window.location.pathname.includes('instructor') ? 'instructor' :
                 window.location.pathname.includes('student') ? 'student' : null;

if (pageRole && currentUser.role !== pageRole) {
    console.log("[v0] Role mismatch. User is", currentUser.role, "but page expects", pageRole);
    // Redirect to correct dashboard
    switch(currentUser.role) {
        case 'admin':
            console.log("[v0] Redirecting to admin dashboard");
            window.location.href = './admin-dashboard.html';
            break;
        case 'instructor':
            console.log("[v0] Redirecting to instructor dashboard");
            window.location.href = './instructor-dashboard.html';
            break;
        case 'student':
            console.log("[v0] Redirecting to student dashboard");
            window.location.href = './student-dashboard.html';
            break;
        default:
            console.log("[v0] Unknown role, redirecting to login");
            window.location.href = './login.html';
    }
}

// ==========================================
// SIDEBAR TOGGLE (Responsive)
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
let sidebarOpen = false;

function openSidebar() {
    if (sidebar) {
        sidebar.classList.add('open');
        sidebarOpen = true;
        if (mobileOverlay) {
            mobileOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove('open');
        sidebarOpen = false;
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

function toggleSidebar() {
    if (sidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeSidebar);
}

// Close sidebar on navigation link click (mobile)
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            closeSidebar();
        }
    });
});

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarOpen && window.innerWidth <= 1024) {
        closeSidebar();
        if (menuToggle) menuToggle.focus();
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close sidebar if resizing to desktop
        if (window.innerWidth > 1024 && sidebarOpen) {
            closeSidebar();
        }
    }, 250);
});

// Handle swipe gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

if (sidebar) {
    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sidebar.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    // Swipe left to close
    if (swipeDistance < -50 && sidebarOpen) {
        closeSidebar();
    }
}

// Open sidebar on swipe right from edge
document.addEventListener('touchstart', (e) => {
    if (!sidebarOpen && e.touches[0].clientX < 30 && window.innerWidth <= 1024) {
        touchStartX = e.touches[0].screenX;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!sidebarOpen && touchStartX < 30) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX > 70) {
            openSidebar();
        }
    }
}, { passive: true });

// ==========================================
// USER INFO DISPLAY
// ==========================================
function updateDashboardUserInfo() {
    if (!currentUser) return;
    
    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const avatar = currentUser.avatar || (currentUser.firstName[0] + currentUser.lastName[0]).toUpperCase();
    const role = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    const email = currentUser.email;
    
    // Update user name displays
    document.querySelectorAll('#userName, .user-name').forEach(el => {
        el.textContent = fullName;
    });
    
    // Update welcome name
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = currentUser.firstName;
    
    // Update avatars
    document.querySelectorAll('#userAvatar, .user-avatar, #headerAvatar').forEach(el => {
        el.textContent = avatar;
    });
    
    // Update roles
    document.querySelectorAll('#userRole, .user-role').forEach(el => {
        el.textContent = role;
    });
    
    // Update emails
    document.querySelectorAll('#userEmail, .user-email').forEach(el => {
        el.textContent = email;
    });
}

// ==========================================
// TOAST NOTIFICATIONS (Responsive)
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast?.querySelector('i');
    
    if (!toast || !toastMessage) return;
    
    // Update icon based on type
    if (toastIcon) {
        toastIcon.className = 'fas';
        switch(type) {
            case 'success':
                toastIcon.classList.add('fa-check-circle');
                break;
            case 'error':
                toastIcon.classList.add('fa-exclamation-circle');
                break;
            case 'info':
                toastIcon.classList.add('fa-info-circle');
                break;
            default:
                toastIcon.classList.add('fa-check-circle');
        }
    }
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    
    // Auto hide
    const hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    // Allow swipe to dismiss on mobile
    let toastTouchStart = 0;
    toast.addEventListener('touchstart', (e) => {
        toastTouchStart = e.touches[0].clientX;
    }, { passive: true });
    
    toast.addEventListener('touchend', (e) => {
        const swipeDistance = e.changedTouches[0].clientX - toastTouchStart;
        if (Math.abs(swipeDistance) > 50) {
            clearTimeout(hideTimeout);
            toast.classList.remove('show');
        }
    }, { passive: true });
}

// ==========================================
// LOGOUT
// ==========================================
function logout() {
    showToast('Logging out...', 'info');
    setTimeout(() => {
        localStorage.removeItem('learniaCurrentUser');
        sessionStorage.removeItem('learniaCurrentUser');
        window.location.href = 'login.html';
    }, 500);
}

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeIcon = themeToggle.querySelector('i');
    function updateIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    updateIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        showToast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`, 'info');
    });
}

// ==========================================
// MODAL HANDLER
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input if exists
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Close on Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ==========================================
// ACTIVE LINK HIGHLIGHT
// ==========================================
function updateActiveLink() {
    const currentHash = window.location.hash;
    if (currentHash) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    updateDashboardUserInfo();
    updateActiveLink();
    document.body.classList.add('loaded');
    
    // Handle initial hash
    if (window.location.hash) {
        const pageName = window.location.hash.substring(1);
        if (typeof switchPage === 'function') {
            switchPage(pageName);
        }
    }
    
    // Prevent double-tap zoom on buttons
    document.querySelectorAll('button, .btn, .action-btn').forEach(btn => {
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });
    });
});

// Handle hash changes
window.addEventListener('hashchange', updateActiveLink);

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.logout = logout;

// ==========================================
// CONSOLE INFO
// ==========================================
console.log('%c📊 LearnHub Dashboard', 'font-size: 16px; font-weight: bold; color: #06b6d4;');
console.log('%cResponsive dashboard with role-based access', 'font-size: 12px; color: #94a3b8;');
console.log('%cUser:', 'font-weight: bold;', currentUser.email);
console.log('%cRole:', 'font-weight: bold;', currentUser.role);
