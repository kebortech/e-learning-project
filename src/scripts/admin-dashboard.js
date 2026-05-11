// ==========================================
// ADMIN DASHBOARD - Full Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("[v0] Admin Dashboard Initializing");
    initializeAdminDashboard();
    setupEventListeners();
    loadAdminData();
    displayAdminStats();
});

function initializeAdminDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = './login.html';
        return;
    }
    updateUserInfo(currentUser);
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 'Administrator';
    document.getElementById('userAvatar').textContent = user.avatar;
    document.getElementById('headerAvatar').textContent = user.avatar;
}

function setupEventListeners() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            switchPage(page);
        });
    });
    document.getElementById('menuToggle')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('mobileOverlay')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
}

// ==========================================
// PAGE SWITCHING
// ==========================================

function switchPage(page) {
    console.log("[v0] Switching to page:", page);
    
    document.querySelectorAll('[id$="-page"]').forEach(el => {
        el.style.display = 'none';
    });

    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.style.display = 'block';
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    const titles = {
        'overview': 'Admin Dashboard',
        'users': 'User Management',
        'instructors': 'Instructor Approvals',
        'courses': 'Course Management',
        'payments': 'Payment Processing',
        'analytics': 'Analytics',
        'reports': 'Reports',
        'settings': 'System Settings',
        'moderation': 'Content Moderation'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Admin Dashboard';

    if (page === 'users') {
        loadUsersPage();
    } else if (page === 'instructors') {
        loadInstructorsPage();
    } else if (page === 'courses') {
        loadCoursesPage();
    } else if (page === 'payments') {
        loadPaymentsPage();
    } else if (page === 'analytics') {
        loadAnalyticsPage();
    }

    closeMobileMenu();
}

// ==========================================
// MOBILE MENU & THEME
// ==========================================

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ==========================================
// LOAD ADMIN DATA
// ==========================================

let adminData = {};

function loadAdminData() {
    const stats = getDashboardStats();
    const users = getAllUsers();
    const courses = getAllCourses();
    const payments = getPaymentsData();
    const instructors = users.filter(u => u.role === 'instructor');
    const students = users.filter(u => u.role === 'student');

    adminData = {
        stats: stats,
        users: users,
        courses: courses,
        payments: payments,
        instructors: instructors,
        students: students
    };

    console.log("[v0] Admin data loaded:", adminData);
}

// ==========================================
// DISPLAY ADMIN STATS
// ==========================================

function displayAdminStats() {
    const { stats } = adminData;

    // Update overview stats if they exist
    const totalUsersEl = document.getElementById('totalUsers');
    const totalCoursesEl = document.getElementById('totalCourses');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const activeEnrollmentsEl = document.getElementById('activeEnrollments');

    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers;
    if (totalCoursesEl) totalCoursesEl.textContent = stats.totalCourses;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + (stats.totalRevenue / 100).toFixed(2);
    if (activeEnrollmentsEl) activeEnrollmentsEl.textContent = stats.activeEnrollments;

    // Update badges
    document.getElementById('usersBadge').textContent = stats.totalUsers;
    document.getElementById('instructorsBadge').textContent = stats.totalInstructors;
}

// ==========================================
// USERS MANAGEMENT
// ==========================================

function loadUsersPage() {
    const { users } = adminData;
    const grid = document.getElementById('usersGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (users.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary);">No users found.</p>';
        return;
    }

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div class="user-avatar" style="width: 48px; height: 48px;">${user.avatar}</div>
                <div>
                    <h4 style="margin: 0;">${user.name}</h4>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">${user.email}</p>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span class="badge-pill" style="background: ${getRoleBadgeColor(user.role)};">${user.role}</span>
                <span style="font-size: 0.85rem; color: ${user.status === 'active' ? '#10b981' : '#ef4444'};">
                    ${user.status}
                </span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">Joined ${user.joinDate}</p>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-secondary btn-sm" onclick="${user.status === 'active' ? `deactivateUser(${user.id})` : `activateUser(${user.id})`}">
                    <i class="fas fa-${user.status === 'active' ? 'lock' : 'unlock'}"></i> ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-ghost btn-sm" onclick="deleteUserAdmin(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// INSTRUCTOR APPROVALS
// ==========================================

function loadInstructorsPage() {
    const { instructors } = adminData;
    const grid = document.getElementById('instructorsGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    const pendingInstructors = instructors.filter(i => !i.verified);
    
    if (pendingInstructors.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1;">All instructors verified.</p>';
    } else {
        pendingInstructors.forEach(instructor => {
            const card = document.createElement('div');
            card.className = 'instructor-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="user-avatar" style="width: 48px; height: 48px;">${instructor.avatar}</div>
                    <div>
                        <h4 style="margin: 0;">${instructor.name}</h4>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">${instructor.email}</p>
                    </div>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Expertise:</strong> ${instructor.expertise?.join(', ') || 'N/A'}</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${instructor.bio || 'No bio provided'}</p>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary btn-sm" onclick="verifyInstructor(${instructor.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="rejectInstructor(${instructor.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

function verifyInstructor(instructorId) {
    updateUser(instructorId, { verified: true });
    loadAdminData();
    loadInstructorsPage();
    showToast('Instructor verified!');
}

function rejectInstructor(instructorId) {
    if (confirm('Are you sure you want to reject this instructor?')) {
        deleteUser(instructorId);
        loadAdminData();
        loadInstructorsPage();
        showToast('Instructor rejected');
    }
}

// ==========================================
// COURSE MANAGEMENT
// ==========================================

function loadCoursesPage() {
    const { courses } = adminData;
    const grid = document.getElementById('coursesGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (courses.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-secondary);">No courses found.</p>';
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-admin-card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="margin: 0;">${course.title}</h4>
                    <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">By ${course.instructor.name}</p>
                </div>
                <span class="badge-pill" style="background: ${course.status === 'published' ? '#10b981' : '#f59e0b'};">
                    ${course.status}
                </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; font-size: 0.85rem; color: var(--text-secondary);">
                <span><i class="fas fa-users"></i> ${course.students} students</span>
                <span><i class="fas fa-star"></i> ${course.rating} rating</span>
                <span><i class="fas fa-dollar-sign"></i> $${course.price}</span>
                <span><i class="fas fa-video"></i> ${course.lectures} lectures</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-sm" onclick="reviewCourse(${course.id})">
                    <i class="fas fa-eye"></i> Review
                </button>
                <button class="btn btn-secondary btn-sm" onclick="${course.status === 'published' ? `unpublishCourse(${course.id})` : `publishCourse(${course.id})`}">
                    <i class="fas fa-${course.status === 'published' ? 'eye-slash' : 'check'}"></i> ${course.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button class="btn btn-ghost btn-sm" onclick="deleteCourseAdmin(${course.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function publishCourse(courseId) {
    updateCourse(courseId, { status: 'published' });
    loadAdminData();
    loadCoursesPage();
    showToast('Course published!');
}

function unpublishCourse(courseId) {
    updateCourse(courseId, { status: 'draft' });
    loadAdminData();
    loadCoursesPage();
    showToast('Course unpublished');
}

// ==========================================
// PAYMENT MANAGEMENT
// ==========================================

function loadPaymentsPage() {
    const { payments } = adminData;
    const grid = document.getElementById('paymentsGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    const users = getAllUsers();
    const courses = getAllCourses();

    payments.forEach(payment => {
        const student = users.find(u => u.id === payment.studentId);
        const course = courses.find(c => c.id === payment.courseId);
        if (student && course) {
            const card = document.createElement('div');
            card.className = 'payment-card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0;">${student.name}</h4>
                        <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">${course.title}</p>
                    </div>
                    <span class="badge-pill" style="background: ${payment.status === 'completed' ? '#10b981' : '#f59e0b'};">
                        ${payment.status}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span style="font-weight: 600; color: var(--primary);">$${payment.amount}</span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">${payment.paymentDate}</span>
                </div>
                <div style="background: var(--bg-secondary); padding: 0.5rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.85rem;">
                    <strong>ID:</strong> ${payment.transactionId}
                </div>
                <button class="btn btn-primary btn-sm" style="width: 100%;">
                    <i class="fas fa-receipt"></i> View Invoice
                </button>
            `;
            grid.appendChild(card);
        }
    });
}

// ==========================================
// ANALYTICS PAGE
// ==========================================

function loadAnalyticsPage() {
    const { stats } = adminData;
    const container = document.getElementById('analyticsContainer');
    
    if (!container) return;

    container.innerHTML = `
        <div class="analytics-grid">
            <div class="stat-card">
                <h3>Platform Growth</h3>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2.5rem; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">
                        ${stats.totalUsers}
                    </div>
                    <p style="color: var(--text-secondary);">Total Users</p>
                </div>
            </div>
            <div class="stat-card">
                <h3>Course Activity</h3>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2.5rem; color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">
                        ${stats.activeEnrollments}
                    </div>
                    <p style="color: var(--text-secondary);">Active Enrollments</p>
                </div>
            </div>
            <div class="stat-card">
                <h3>Revenue Performance</h3>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2.5rem; color: var(--success); font-weight: 700; margin-bottom: 0.5rem;">
                        $${(stats.totalRevenue / 100).toFixed(2)}
                    </div>
                    <p style="color: var(--text-secondary);">Total Revenue</p>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// USER MANAGEMENT FUNCTIONS
// ==========================================

function editUser(userId) {
    showToast(`Editing user ${userId}`);
}

function activateUser(userId) {
    updateUser(userId, { status: 'active' });
    loadAdminData();
    loadUsersPage();
    showToast('User activated');
}

function deactivateUser(userId) {
    updateUser(userId, { status: 'inactive' });
    loadAdminData();
    loadUsersPage();
    showToast('User deactivated');
}

function deleteUserAdmin(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId);
        loadAdminData();
        loadUsersPage();
        showToast('User deleted');
    }
}

function reviewCourse(courseId) {
    showToast(`Reviewing course ${courseId}`);
}

function deleteCourseAdmin(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        deleteCourse(courseId);
        loadAdminData();
        loadCoursesPage();
        showToast('Course deleted');
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getRoleBadgeColor(role) {
    const colors = {
        'admin': '#3b82f6',
        'instructor': '#8b5cf6',
        'student': '#10b981'
    };
    return colors[role] || '#6b7280';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUserId');
        window.location.href = './login.html';
    }
}

window.switchPage = switchPage;
window.editUser = editUser;
window.activateUser = activateUser;
window.deactivateUser = deactivateUser;
window.deleteUserAdmin = deleteUserAdmin;
window.verifyInstructor = verifyInstructor;
window.rejectInstructor = rejectInstructor;
window.publishCourse = publishCourse;
window.unpublishCourse = unpublishCourse;
window.reviewCourse = reviewCourse;
window.deleteCourseAdmin = deleteCourseAdmin;
