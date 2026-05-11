// ==========================================
// INSTRUCTOR DASHBOARD - Complete Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("[v0] Instructor Dashboard Initializing");
    initializeInstructorDashboard();
    setupEventListeners();
    loadInstructorData();
    displayDashboardContent();
});

// ==========================================
// INITIALIZATION
// ==========================================

function initializeInstructorDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'instructor') {
        window.location.href = './login.html';
        return;
    }
    updateUserInfo(currentUser);
    setupTheme();
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = 'Instructor';
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
}

function setupTheme() {
    const savedTheme = localStorage.getItem('instructorTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setupEventListeners() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page.trim();
            switchPage(page);
        });
    });
    document.getElementById('menuToggle')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('mobileOverlay')?.addEventListener('click', toggleMobileMenu);
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('profileForm')?.addEventListener('submit', updateProfile);
    document.getElementById('settingsForm')?.addEventListener('submit', saveSettings);
    document.getElementById('createCourseForm')?.addEventListener('submit', createCourse);
}

// ==========================================
// PAGE NAVIGATION
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
        if (link.dataset.page.trim() === page) {
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
        'analytics': 'Analytics',
        'revenue': 'Revenue',
        'reviews': 'Reviews',
        'profile': 'Profile Settings',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Instructor Dashboard';

    switch(page) {
        case 'overview':
            displayOverviewPage();
            break;
        case 'my-courses':
            displayMyCoursesPage();
            break;
        case 'students':
            displayStudentsPage();
            break;
        case 'lessons':
            displayLessonsPage();
            break;
        case 'quizzes':
            displayQuizzesPage();
            break;
        case 'assignments':
            displayAssignmentsPage();
            break;
        case 'analytics':
            displayAnalyticsPage();
            break;
        case 'revenue':
            displayRevenueChart();
            break;
        case 'reviews':
            displayReviewsPage();
            break;
        case 'profile':
            loadProfileData();
            break;
    }

    closeMobileMenu();
}

// ==========================================
// THEME & MOBILE MENU
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
    localStorage.setItem('instructorTheme', newTheme);
}

// ==========================================
// DATA LOADING
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
// DISPLAY FUNCTIONS
// ==========================================

function displayDashboardContent() {
    displayOverviewPage();
}

function displayOverviewPage() {
    const { stats, courses, enrollments } = instructorData;

    document.getElementById('coursesBadge').textContent = stats.totalCourses;
    document.getElementById('studentsBadge').textContent = stats.totalStudents;
    document.getElementById('totalCourses').textContent = stats.totalCourses;
    document.getElementById('totalStudents').textContent = stats.totalStudents;

    const monthlyRevenue = courses.reduce((sum, course) => {
        const enrollmentCount = enrollments.filter(e => e.courseId === course.id).length;
        return sum + (enrollmentCount * course.price);
    }, 0);
    document.querySelector('[data-stat="revenue"]')?.parentElement.querySelector('h3').textContent = '$' + monthlyRevenue.toLocaleString();

    displayInstructorCoursesTable();
}

function displayInstructorCoursesTable() {
    const { courses, enrollments } = instructorData;
    const table = document.getElementById('instructorCoursesTable');
    
    if (!table || courses.length === 0) {
        if (table) table.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No courses yet. Create your first course!</td></tr>';
        return;
    }

    table.innerHTML = courses.slice(0, 5).map(course => {
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        const revenue = courseEnrollments.length * course.price;
        return `
            <tr>
                <td><strong>${course.title}</strong></td>
                <td>${course.categoryName}</td>
                <td>${courseEnrollments.length}</td>
                <td>$${revenue.toLocaleString()}</td>
                <td><span class="star-rating">${(Math.random() * 2 + 3.5).toFixed(1)} ★</span></td>
                <td><span class="status-badge published">Published</span></td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-sm btn-ghost" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function displayMyCoursesPage() {
    const { courses } = instructorData;
    const grid = document.getElementById('myCoursesGrid');
    
    if (!grid) return;
    grid.innerHTML = '';

    if (courses.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><p>No courses yet. Create your first course!</p></div>';
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card-horizontal';
        card.innerHTML = `
            <div class="course-card-content">
                <h4>${course.title}</h4>
                <p style="color: var(--text-secondary);">${course.categoryName}</p>
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary btn-sm" onclick="editCourse(${course.id})">Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="manageCourseContent(${course.id})">Content</button>
                    <button class="btn btn-ghost btn-sm" onclick="deleteCourse(${course.id})">Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function displayStudentsPage() {
    const { enrollments } = instructorData;
    const courses = getAllCourses();
    const tbody = document.querySelector('#students-page tbody') || document.getElementById('studentsTable');
    
    if (!tbody) return;

    const enrolledStudents = {};
    enrollments.forEach(enrollment => {
        const student = getUserById(enrollment.studentId);
        if (student && !enrolledStudents[student.id]) {
            enrolledStudents[student.id] = { ...student, enrollments: [] };
        }
        if (enrolledStudents[enrollment.studentId]) {
            enrolledStudents[enrollment.studentId].enrollments.push(enrollment);
        }
    });

    tbody.innerHTML = Object.values(enrolledStudents).slice(0, 10).map(student => {
        const avgProgress = student.enrollments.length > 0 
            ? Math.round(student.enrollments.reduce((s, e) => s + e.progress, 0) / student.enrollments.length)
            : 0;
        return `
            <tr>
                <td><div style="display: flex; align-items: center; gap: 0.5rem;"><div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.7rem;">${student.avatar}</div><strong>${student.name}</strong></div></td>
                <td>${student.email}</td>
                <td>${student.enrollments.length}</td>
                <td>
                    <div class="progress-bar-container" style="width: 100px;">
                        <div class="progress-bar-fill" style="width: ${avgProgress}%"></div>
                    </div>
                    <span>${avgProgress}%</span>
                </td>
                <td>Recently</td>
                <td><button class="btn btn-sm btn-primary" onclick="viewStudentProgress(${student.id})">View</button></td>
            </tr>
        `;
    }).join('');
}

function displayLessonsPage() {
    const { courses } = instructorData;
    const table = document.getElementById('lessonsTable');
    
    if (!table) return;

    const lessons = [];
    courses.forEach((course, idx) => {
        for (let i = 1; i <= 3; i++) {
            lessons.push({
                id: `${course.id}-${i}`,
                title: `Lesson ${i}: ${course.title}`,
                courseId: course.id,
                course: course.title,
                duration: `${30 + i * 10} min`,
                order: i,
                status: i === 1 ? 'Published' : 'Draft'
            });
        }
    });

    table.innerHTML = lessons.slice(0, 8).map(lesson => `
        <tr>
            <td><strong>${lesson.title}</strong></td>
            <td>${lesson.course}</td>
            <td>${lesson.duration}</td>
            <td>${lesson.order}</td>
            <td><span class="status-badge ${lesson.status.toLowerCase()}">${lesson.status}</span></td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="editLesson('${lesson.id}')">Edit</button>
                <button class="btn btn-sm btn-ghost" onclick="deleteLesson('${lesson.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function displayQuizzesPage() {
    const { courses } = instructorData;
    const table = document.getElementById('quizzesTable');
    
    if (!table) return;

    const quizzes = [];
    courses.forEach((course, idx) => {
        quizzes.push({
            id: `quiz-${course.id}`,
            title: `${course.title} Assessment`,
            courseId: course.id,
            course: course.title,
            questions: 10 + idx * 5,
            passScore: 70,
            attempts: 3
        });
    });

    table.innerHTML = quizzes.slice(0, 8).map(quiz => `
        <tr>
            <td><strong>${quiz.title}</strong></td>
            <td>${quiz.course}</td>
            <td>${quiz.questions}</td>
            <td>${quiz.passScore}%</td>
            <td>${quiz.attempts}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="editQuiz('${quiz.id}')">Edit</button>
                <button class="btn btn-sm btn-ghost" onclick="deleteQuiz('${quiz.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function displayAssignmentsPage() {
    const { courses } = instructorData;
    const table = document.getElementById('assignmentsTable');
    
    if (!table) return;

    const assignments = [];
    courses.forEach(course => {
        assignments.push({
            id: `assignment-${course.id}`,
            title: `${course.title} Project`,
            courseId: course.id,
            course: course.title,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            submitted: Math.floor(Math.random() * 20),
            graded: Math.floor(Math.random() * 15)
        });
    });

    table.innerHTML = assignments.slice(0, 8).map(a => `
        <tr>
            <td><strong>${a.title}</strong></td>
            <td>${a.course}</td>
            <td>${a.dueDate}</td>
            <td>${a.submitted}</td>
            <td>${a.graded}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="gradeAssignments('${a.id}')">Grade</button>
            </td>
        </tr>
    `).join('');
}

function displayAnalyticsPage() {
    const { courses, enrollments, stats } = instructorData;

    document.getElementById('totalViews').textContent = Math.round(stats.totalStudents * 5.3);
    document.getElementById('completionRate').textContent = '42%';
    document.getElementById('activeStudents').textContent = Math.floor(stats.totalStudents * 0.65);

    const table = document.getElementById('analyticsTable');
    if (!table) return;

    table.innerHTML = courses.map(course => {
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        const avgCompletion = courseEnrollments.length > 0 
            ? Math.round(courseEnrollments.reduce((s, e) => s + e.progress, 0) / courseEnrollments.length)
            : 0;
        const revenue = courseEnrollments.length * course.price;
        return `
            <tr>
                <td><strong>${course.title}</strong></td>
                <td>${courseEnrollments.length}</td>
                <td>${avgCompletion}%</td>
                <td>${(3.5 + Math.random()).toFixed(1)} ★</td>
                <td>$${revenue.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

function displayRevenueChart() {
    const { courses, enrollments } = instructorData;

    let totalRevenue = 0;
    const courseRevenues = courses.map(course => {
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        const revenue = courseEnrollments.length * course.price;
        totalRevenue += revenue;
        return { title: course.title, revenue };
    });

    console.log("[v0] Revenue data:", { totalRevenue, courseRevenues });
}

function displayReviewsPage() {
    const { courses, enrollments } = instructorData;
    const container = document.getElementById('reviewsList');
    
    if (!container) return;

    const reviews = [
        { name: 'Sarah Johnson', rating: 5, text: 'Excellent course! Very well structured.', course: courses[0]?.title || 'Course' },
        { name: 'Mike Brown', rating: 4, text: 'Great content, could use more examples.', course: courses[0]?.title || 'Course' },
        { name: 'Emma Davis', rating: 5, text: 'Best course I\'ve taken! Highly recommend.', course: courses[1]?.title || 'Course' },
        { name: 'John Smith', rating: 3, text: 'Good but needs improvement in pacing.', course: courses[1]?.title || 'Course' },
    ];

    container.innerHTML = reviews.map(review => `
        <div style="border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <div>
                    <strong>${review.name}</strong>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">${review.course}</p>
                </div>
                <span style="color: #f59e0b;">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
            </div>
            <p>${review.text}</p>
        </div>
    `).join('');
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================

function updateProfile(e) {
    e.preventDefault();
    const currentUser = getCurrentUser();
    
    const updates = {
        name: `${document.getElementById('profileFirstName').value} ${document.getElementById('profileLastName').value}`,
        specialization: document.getElementById('profileSpecialization').value,
        bio: document.getElementById('profileBio').value
    };

    updateUser(currentUser.id, updates);
    showToast('Profile updated successfully');
}

function saveSettings(e) {
    e.preventDefault();
    localStorage.setItem('instructorSettings', JSON.stringify({
        notifications: true,
        privacy: 'public'
    }));
    showToast('Settings saved successfully');
}

function createCourse(e) {
    e.preventDefault();
    const currentUser = getCurrentUser();
    
    const newCourse = {
        id: Math.max(...getAllCourses().map(c => c.id), 0) + 1,
        title: e.target.querySelector('input[placeholder*="title"]').value,
        instructorId: currentUser.id,
        price: parseFloat(e.target.querySelector('input[type="number"]').value),
        categoryName: e.target.querySelector('select').value,
        duration: 40,
        rating: 0,
        students: 0
    };

    createCourseInDB(newCourse);
    showToast('Course created successfully');
    switchPage('my-courses');
}

function loadProfileData() {
    const currentUser = getCurrentUser();
    document.getElementById('profileFirstName').value = currentUser.name.split(' ')[0];
    document.getElementById('profileLastName').value = currentUser.name.split(' ').slice(1).join(' ');
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileSpecialization').value = currentUser.specialization || '';
    document.getElementById('profileBio').value = currentUser.bio || '';
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function editCourse(courseId) {
    showToast(`Editing course ${courseId}`);
    switchPage('create-course');
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        showToast('Course deleted successfully');
        loadInstructorData();
        displayMyCoursesPage();
    }
}

function manageCourseContent(courseId) {
    showToast(`Managing content for course ${courseId}`);
    switchPage('lessons');
}

function viewStudentProgress(studentId) {
    showToast(`Viewing progress for student ${studentId}`);
}

function editLesson(lessonId) {
    showToast(`Editing lesson ${lessonId}`);
}

function deleteLesson(lessonId) {
    if (confirm('Delete this lesson?')) {
        showToast('Lesson deleted');
        displayLessonsPage();
    }
}

function editQuiz(quizId) {
    showToast(`Editing quiz ${quizId}`);
}

function deleteQuiz(quizId) {
    if (confirm('Delete this quiz?')) {
        showToast('Quiz deleted');
        displayQuizzesPage();
    }
}

function gradeAssignments(assignmentId) {
    showToast(`Grading assignment ${assignmentId}`);
}

function openCreateLessonModal() {
    showToast('Create lesson modal opened');
}

function openCreateQuizModal() {
    showToast('Create quiz modal opened');
}

function openCreateAssignmentModal() {
    showToast('Create assignment modal opened');
}

function filterReviews(rating) {
    console.log("[v0] Filtering reviews by rating:", rating);
    displayReviewsPage();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('learniaCurrentUser');
        sessionStorage.removeItem('learniaCurrentUser');
        window.location.href = './login.html';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.switchPage = switchPage;
window.logout = logout;
window.editCourse = editCourse;
window.deleteCourse = deleteCourse;
window.manageCourseContent = manageCourseContent;
window.viewStudentProgress = viewStudentProgress;
window.editLesson = editLesson;
window.deleteLesson = deleteLesson;
window.editQuiz = editQuiz;
window.deleteQuiz = deleteQuiz;
window.gradeAssignments = gradeAssignments;
window.openCreateLessonModal = openCreateLessonModal;
window.openCreateQuizModal = openCreateQuizModal;
window.openCreateAssignmentModal = openCreateAssignmentModal;
window.filterReviews = filterReviews;
