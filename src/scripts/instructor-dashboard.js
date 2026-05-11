// ==========================================
// INSTRUCTOR DASHBOARD - Full Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("[v0] Instructor Dashboard Initializing");
    initializeInstructorDashboard();
    setupEventListeners();
    loadInstructorData();
    displayInstructorStats();
});

function initializeInstructorDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'instructor') {
        window.location.href = './login.html';
        return;
    }
    updateUserInfo(currentUser);
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 'Instructor';
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
    document.getElementById('createCourseForm')?.addEventListener('submit', submitCreateCourse);
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
        'overview': 'Instructor Dashboard',
        'my-courses': 'My Courses',
        'create-course': 'Create New Course',
        'students': 'My Students',
        'lessons': 'Lessons',
        'quizzes': 'Quizzes',
        'assignments': 'Assignments',
        'revenue': 'Revenue',
        'reviews': 'Reviews',
        'profile': 'Profile Settings',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Instructor Dashboard';

    if (page === 'my-courses') {
        loadMyCoursesPage();
    } else if (page === 'students') {
        loadStudentsPage();
    } else if (page === 'revenue') {
        loadRevenueChart();
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
// LOAD INSTRUCTOR DATA
// ==========================================

let instructorData = {};

function loadInstructorData() {
    const currentUser = getCurrentUser();
    const courses = getCoursesByInstructor(currentUser.id);
    const stats = getInstructorStats(currentUser.id);
    const enrollments = getAllEnrollments();

    instructorData = {
        user: currentUser,
        courses: courses,
        stats: stats,
        enrollments: enrollments
    };

    console.log("[v0] Instructor data loaded:", instructorData);
}

// ==========================================
// DISPLAY INSTRUCTOR STATS
// ==========================================

function displayInstructorStats() {
    const { stats, courses } = instructorData;

    document.getElementById('coursesBadge').textContent = stats.totalCourses;
    document.getElementById('studentsBadge').textContent = stats.totalStudents;

    // Update overview stats if they exist
    const totalCoursesEl = document.getElementById('totalCourses');
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const avgRatingEl = document.getElementById('avgRating');

    if (totalCoursesEl) totalCoursesEl.textContent = stats.totalCourses;
    if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + (stats.totalRevenue / 100).toFixed(2);
    if (avgRatingEl) avgRatingEl.textContent = stats.averageRating;

    // Load courses grid
    loadMyCoursesPage();
}

function loadMyCoursesPage() {
    const { courses } = instructorData;
    const grid = document.getElementById('myCoursesGrid');
    
    if (!grid) return;

    grid.innerHTML = '';

    if (courses.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-book" style="font-size: 3rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No courses yet. <a href="#" onclick="switchPage('create-course'); return false;" style="color: var(--primary);">Create your first course</a></p>
            </div>
        `;
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        const enrollmentCount = instructorData.enrollments.filter(e => e.courseId === course.id).length;
        
        card.innerHTML = `
            <div class="course-card-header">
                <div class="course-badge ${course.gradient}">
                    <i class="fas ${course.icon}"></i>
                </div>
                <div class="course-status-badge" style="background: ${course.status === 'published' ? '#10b981' : '#f59e0b'};">
                    ${course.status === 'published' ? 'Published' : 'Draft'}
                </div>
            </div>
            <h3>${course.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">${course.description.substring(0, 100)}...</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; font-size: 0.85rem; color: var(--text-secondary);">
                <span><i class="fas fa-users"></i> ${enrollmentCount} students</span>
                <span><i class="fas fa-star"></i> ${course.rating} rating</span>
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span><i class="fas fa-video"></i> ${course.lectures} lectures</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-sm" onclick="editCourse(${course.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-secondary btn-sm" onclick="viewCourseAnalytics(${course.id})">
                    <i class="fas fa-chart-bar"></i> Analytics
                </button>
                <button class="btn btn-ghost btn-sm" onclick="deleteCourse(${course.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function loadStudentsPage() {
    const grid = document.getElementById('myStudentsGrid');
    if (!grid) return;

    const { courses, enrollments } = instructorData;
    const courseIds = courses.map(c => c.id);
    const students = getAllUsers().filter(u => u.role === 'student');
    const courseEnrollments = enrollments.filter(e => courseIds.includes(e.courseId));

    grid.innerHTML = '';

    if (courseEnrollments.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No students enrolled yet.</p>
            </div>
        `;
        return;
    }

    courseEnrollments.forEach(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        const course = courses.find(c => c.id === enrollment.courseId);
        if (student && course) {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="user-avatar" style="width: 48px; height: 48px; font-size: 1rem;">${student.avatar}</div>
                    <div>
                        <h4 style="margin: 0;">${student.name}</h4>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">${student.email}</p>
                    </div>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>${course.title}</strong></p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Progress: ${enrollment.progress}%</span>
                    <span style="font-size: 0.85rem; font-weight: 600;">${enrollment.progress}% Complete</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                </div>
                <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 1rem;">
                    <i class="fas fa-envelope"></i> Send Message
                </button>
            `;
            grid.appendChild(card);
        }
    });
}

// ==========================================
// COURSE MANAGEMENT
// ==========================================

function editCourse(courseId) {
    const course = getCourseById(courseId);
    if (course) {
        showToast(`Editing: ${course.title}`);
        // In a real app, this would open an edit form
    }
}

function viewCourseAnalytics(courseId) {
    showToast(`Viewing analytics for course ${courseId}`);
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        deleteCourse(courseId);
        loadInstructorData();
        displayInstructorStats();
        showToast('Course deleted successfully');
    }
}

function submitCreateCourse(e) {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const title = document.getElementById('courseTitle')?.value;
    const category = document.getElementById('courseCategory')?.value;
    const price = parseFloat(document.getElementById('coursePrice')?.value);
    const description = document.getElementById('courseDescription')?.value;

    if (title && category && price && description) {
        const newCourse = createCourse({
            title: title,
            category: category,
            categoryName: category,
            price: price,
            description: description,
            instructorId: currentUser.id,
            instructor: {
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.avatar
            },
            rating: 5,
            reviews: 0,
            students: 0,
            duration: '0 hours',
            lectures: 0,
            icon: 'fa-book',
            gradient: 'gradient-1',
            curriculum: [],
            requirements: [],
            includes: []
        });

        document.getElementById('createCourseForm').reset();
        loadInstructorData();
        displayInstructorStats();
        switchPage('my-courses');
        showToast('Course created successfully!');
    }
}

// ==========================================
// REVENUE & ANALYTICS
// ==========================================

function loadRevenueChart() {
    const chart = document.getElementById('revenueChart');
    if (!chart) return;

    const { stats } = instructorData;
    chart.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">$${(stats.totalRevenue / 100).toFixed(2)}</div>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">Total Revenue</p>
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-sm);">
                <i class="fas fa-chart-bar" style="font-size: 2rem; color: var(--text-secondary); opacity: 0.3;"></i>
                <p style="color: var(--text-secondary); margin-top: 1rem;">Revenue chart visualization would go here</p>
            </div>
        </div>
    `;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

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
window.editCourse = editCourse;
window.viewCourseAnalytics = viewCourseAnalytics;
window.deleteCourse = deleteCourse;
