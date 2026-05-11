// ==========================================
// STUDENT DASHBOARD - Full Functionality
// ==========================================

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("[v0] Student Dashboard Initializing");
    initializeStudentDashboard();
    setupEventListeners();
    loadStudentData();
    displayDashboardData();
});

function initializeStudentDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = './login.html';
        return;
    }
    updateUserInfo(currentUser);
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 'Student';
    document.getElementById('userAvatar').textContent = user.avatar;
    document.getElementById('headerAvatar').textContent = user.avatar;
    document.getElementById('welcomeName').textContent = user.name.split(' ')[0];
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
    document.getElementById('studentProfileForm')?.addEventListener('submit', updateStudentProfile);
}

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
        'overview': 'Dashboard',
        'my-courses': 'My Learning',
        'wishlist': 'Wishlist',
        'progress': 'My Progress',
        'certificates': 'My Certificates',
        'assignments': 'Assignments',
        'discussions': 'Discussions',
        'peers': 'Study Groups',
        'profile': 'Profile Settings',
        'settings': 'Account Settings'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    if (page === 'my-courses') {
        loadMyCoursesPage();
    } else if (page === 'certificates') {
        loadCertificatesPage();
    }

    closeMobileMenu();
}

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

let studentData = {};

function loadStudentData() {
    const currentUser = getCurrentUser();
    const enrollments = getStudentEnrollments(currentUser.id);
    const courses = getAllCourses();
    const stats = getStudentStats(currentUser.id);

    studentData = {
        user: currentUser,
        enrollments: enrollments,
        courses: courses,
        stats: stats
    };

    console.log("[v0] Student data loaded:", studentData);
}

function displayDashboardData() {
    const { stats, enrollments } = studentData;
    const courses = getAllCourses();

    document.getElementById('enrolledCount').textContent = stats.enrolledCourses;
    document.getElementById('completedCount').textContent = stats.completedCourses;
    document.getElementById('certCount').textContent = stats.certificates;
    document.getElementById('learningBadge').textContent = stats.inProgressCourses;
    document.getElementById('certBadge').textContent = stats.certificates;

    let totalHours = 0;
    enrollments.forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        if (course) {
            const hours = parseInt(course.duration) || 0;
            totalHours += (enrollment.progress / 100) * hours;
        }
    });
    document.getElementById('hoursLearned').textContent = Math.round(totalHours);

    loadContinueLearning();
}

function loadContinueLearning() {
    const { enrollments } = studentData;
    const courses = getAllCourses();
    const grid = document.getElementById('continueLearningGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    const inProgressEnrollments = enrollments
        .filter(e => e.status === 'in-progress')
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);

    if (inProgressEnrollments.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-book-open" style="font-size: 3rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No courses in progress. <a href="./courses.html" style="color: var(--primary);">Browse courses</a></p>
            </div>
        `;
        return;
    }

    inProgressEnrollments.forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        if (course) {
            const progressPercentage = enrollment.progress;
            const card = document.createElement('div');
            card.className = 'course-card-horizontal';
            card.innerHTML = `
                <div class="course-card-content">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div class="course-badge ${course.gradient}">
                            <i class="fas ${course.icon}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 0.95rem;">${course.title}</h4>
                            <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">${course.categoryName}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Progress</span>
                            <span style="font-size: 0.85rem; font-weight: 600;">${progressPercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
                        <span><i class="fas fa-play-circle"></i> ${enrollment.lessonsCompleted}/${enrollment.totalLessons} lessons</span>
                        <span><i class="fas fa-tasks"></i> ${enrollment.assignmentsCompleted}/${enrollment.totalAssignments} assignments</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="continueCourse(${course.id})">
                    Continue <i class="fas fa-arrow-right"></i>
                </button>
            `;
            grid.appendChild(card);
        }
    });
}

function loadMyCoursesPage() {
    const { enrollments } = studentData;
    const courses = getAllCourses();
    const grid = document.getElementById('myCoursesGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    enrollments.forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        if (course) {
            const card = document.createElement('div');
            card.className = 'course-card-horizontal';
            card.innerHTML = `
                <div class="course-card-content">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div class="course-badge ${course.gradient}">
                            <i class="fas ${course.icon}"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 0.95rem;">${course.title}</h4>
                            <p style="margin: 0.25rem 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">By ${course.instructor.name}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 0.75rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Progress</span>
                            <span style="font-size: 0.85rem; font-weight: 600;">${enrollment.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
                        <span><i class="fas fa-play-circle"></i> ${enrollment.lessonsCompleted}/${enrollment.totalLessons}</span>
                        <span><i class="fas fa-tasks"></i> ${enrollment.assignmentsCompleted}/${enrollment.totalAssignments}</span>
                        <span style="color: ${enrollment.certificateEarned ? 'var(--success)' : 'var(--text-secondary)'};">
                            <i class="fas fa-certificate"></i> ${enrollment.certificateEarned ? 'Completed' : 'In Progress'}
                        </span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="continueCourse(${course.id})">
                    <i class="fas fa-arrow-right"></i>
                </button>
            `;
            grid.appendChild(card);
        }
    });
}

function loadCertificatesPage() {
    const { enrollments } = studentData;
    const courses = getAllCourses();
    const grid = document.querySelector('.certificate-grid');
    
    if (!grid) return;

    const earnedCerts = enrollments.filter(e => e.certificateEarned);
    
    if (earnedCerts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-certificate" style="font-size: 3rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No certificates yet. Keep learning to earn certificates!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';

    earnedCerts.forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        if (course) {
            const card = document.createElement('div');
            card.className = 'certificate-card';
            card.innerHTML = `
                <div style="background: linear-gradient(135deg, var(--primary), var(--accent)); padding: 2rem; border-radius: var(--radius-sm); color: white; text-align: center; margin-bottom: 1rem;">
                    <i class="fas fa-certificate" style="font-size: 3rem; margin-bottom: 0.5rem;"></i>
                    <h4>${course.title}</h4>
                    <p style="opacity: 0.9;">Completed on ${enrollment.completionDate || 'Recently'}</p>
                </div>
                <div style="text-align: center;">
                    <button class="btn btn-primary btn-sm"><i class="fas fa-download"></i> Download PDF</button>
                    <button class="btn btn-ghost btn-sm"><i class="fas fa-share"></i> Share</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

function continueCourse(courseId) {
    showToast(`Continuing course... ID: ${courseId}`);
}

function updateStudentProfile(e) {
    e.preventDefault();
    const currentUser = getCurrentUser();
    
    const updates = {
        name: `${document.getElementById('studentFirstName').value} ${document.getElementById('studentLastName').value}`,
        bio: document.getElementById('studentBio').value
    };

    updateUser(currentUser.id, updates);
    showToast('Profile updated successfully!');
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

function loadInitialProfile() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const names = currentUser.name.split(' ');
        document.getElementById('studentFirstName').value = names[0] || '';
        document.getElementById('studentLastName').value = names.slice(1).join(' ') || '';
        document.getElementById('studentEmail').value = currentUser.email;
        document.getElementById('studentBio').value = currentUser.bio || '';
    }
}

const profilePageObserver = setInterval(() => {
    const profilePage = document.getElementById('profile-page');
    if (profilePage && profilePage.style.display !== 'none') {
        loadInitialProfile();
        clearInterval(profilePageObserver);
    }
}, 100);

window.switchPage = switchPage;
window.continueCourse = continueCourse;
