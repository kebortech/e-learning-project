// ==========================================
// STUDENT DASHBOARD LOGIC
// ==========================================

// Check student access
if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'login.html';
}

// ==========================================
// PAGE NAVIGATION
// ==========================================
function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('[id$="-page"]').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Update active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        overview: 'Student Dashboard',
        'my-courses': 'My Learning',
        wishlist: 'My Wishlist',
        progress: 'My Progress',
        certificates: 'My Certificates',
        assignments: 'Assignments',
        discussions: 'Discussions',
        peers: 'Study Groups',
        profile: 'Profile Settings',
        settings: 'Settings'
    };
    
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Student Dashboard';
    
    // Load page-specific data
    if (pageName === 'profile') loadStudentProfile();
}

// Sidebar navigation
document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        switchPage(link.dataset.page);
    });
});

// ==========================================
// LOAD DASHBOARD DATA
// ==========================================
function loadStudentStats() {
    if (!currentUser) return;
    
    // Update welcome name
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = currentUser.firstName;
    
    // Update header avatar
    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) headerAvatar.textContent = currentUser.avatar || currentUser.firstName[0] + currentUser.lastName[0];
    
    // Update stat badges
    const learningBadge = document.getElementById('learningBadge');
    const certBadge = document.getElementById('certBadge');
    
    if (learningBadge) learningBadge.textContent = currentUser.enrolledCourses?.length || 0;
    if (certBadge) certBadge.textContent = currentUser.certificates || 0;
    
    // Update overview stats
    const enrolledCount = document.getElementById('enrolledCount');
    const completedCount = document.getElementById('completedCount');
    const hoursLearned = document.getElementById('hoursLearned');
    const certCount = document.getElementById('certCount');
    
    if (enrolledCount) enrolledCount.textContent = currentUser.enrolledCourses?.length || 0;
    if (completedCount) completedCount.textContent = currentUser.completedCourses?.length || 0;
    if (hoursLearned) hoursLearned.textContent = currentUser.totalHoursLearned || 0;
    if (certCount) certCount.textContent = currentUser.certificates || 0;

    // Render enrolled courses from coursesData
    renderEnrolledCourses();
}

// ==========================================
// RENDER ENROLLED COURSES FROM coursesData
// ==========================================
function renderEnrolledCourses() {
    if (typeof coursesData === 'undefined') return;

    const enrolled = currentUser.enrolledCourses || [];
    const completed = currentUser.completedCourses || [];

    // Filter to courses the student is enrolled in, or show all if none enrolled
    const myCourses = enrolled.length
        ? coursesData.filter(c => enrolled.includes(c.id))
        : coursesData; // demo: show all courses if no enrollment data

    const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4'];
    const progressValues = [68, 45]; // demo progress per course index

    function buildCourseCard(course, index, showInstructor) {
        const isDone = completed.includes(course.id);
        const progress = isDone ? 100 : (progressValues[index] || 30);
        const fillColor = isDone ? 'green' : (index % 2 === 0 ? 'blue' : 'purple');

        return `
            <div class="continue-course-card">
                <div class="course-thumb ${gradients[index % gradients.length]}">
                    <i class="fas ${course.icon || 'fa-book'}"></i>
                </div>
                <div class="course-info">
                    <h4>${course.title}</h4>
                    ${showInstructor ? `<p>Instructor: ${course.instructor.name}</p>` : `<p>${course.curriculum[Math.floor(progress / 10)] || course.curriculum[0]}</p>`}
                    <div class="progress-bar-container" style="margin: 0.75rem 0;">
                        <div class="progress-bar-fill ${fillColor}" style="width: ${progress}%;"></div>
                    </div>
                    <span style="font-size: 0.8rem; color: ${isDone ? '#10b981' : 'var(--text-secondary)'};">
                        ${isDone ? '✓ Completed' : progress + '% Complete'}
                    </span>
                    ${isDone
                        ? `<button class="btn btn-secondary" style="width: 100%; margin-top: 0.75rem;"><i class="fas fa-certificate"></i> View Certificate</button>`
                        : `<button class="btn btn-primary" style="width: 100%; margin-top: 0.75rem;"><i class="fas fa-play"></i> Continue</button>`
                    }
                </div>
            </div>`;
    }

    const continueLearningGrid = document.getElementById('continueLearningGrid');
    if (continueLearningGrid) {
        continueLearningGrid.innerHTML = myCourses.length
            ? myCourses.map((c, i) => buildCourseCard(c, i, false)).join('')
            : `<p style="color:var(--text-secondary);">No courses enrolled yet. <a href="courses.html">Browse courses</a></p>`;
    }

    const myCoursesGrid = document.getElementById('myCoursesGrid');
    if (myCoursesGrid) {
        myCoursesGrid.innerHTML = myCourses.length
            ? myCourses.map((c, i) => buildCourseCard(c, i, true)).join('')
            : `<p style="color:var(--text-secondary);">No courses enrolled yet. <a href="courses.html">Browse courses</a></p>`;
    }
}

// ==========================================
// LOAD STUDENT PROFILE
// ==========================================
function loadStudentProfile() {
    if (!currentUser) return;
    
    const firstNameEl = document.getElementById('studentFirstName');
    const lastNameEl = document.getElementById('studentLastName');
    const emailEl = document.getElementById('studentEmail');
    const bioEl = document.getElementById('studentBio');
    
    if (firstNameEl) firstNameEl.value = currentUser.firstName || '';
    if (lastNameEl) lastNameEl.value = currentUser.lastName || '';
    if (emailEl) emailEl.value = currentUser.email || '';
    if (bioEl) bioEl.value = currentUser.bio || '';
}

// ==========================================
// PROFILE FORM SUBMISSION
// ==========================================
const studentProfileForm = document.getElementById('studentProfileForm');
if (studentProfileForm) {
    studentProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updates = {
            firstName: document.getElementById('studentFirstName')?.value,
            lastName: document.getElementById('studentLastName')?.value,
            bio: document.getElementById('studentBio')?.value
        };
        
        if (window.updateUserProfile && window.updateUserProfile(updates)) {
            // Update current user in memory
            Object.assign(currentUser, updates);
            currentUser.avatar = (updates.firstName[0] + updates.lastName[0]).toUpperCase();
            
            // Update display
            updateDashboardUserInfo();
            loadStudentStats();
            showToast('Profile updated successfully', 'success');
        } else {
            showToast('Error updating profile', 'error');
        }
    });
}

// ==========================================
// ADD STUDENT-SPECIFIC STYLES
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .continue-learning-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .continue-course-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        transition: var(--transition);
    }
    
    .continue-course-card:hover {
        transform: translateY(-2px);
        border-color: var(--primary);
        box-shadow: 0 8px 25px rgba(6, 182, 212, 0.15);
    }
    
    .course-thumb {
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: white;
    }
    
    .course-info {
        padding: 1.25rem;
    }
    
    .course-info h4 {
        font-size: 1rem;
        margin-bottom: 0.35rem;
    }
    
    .course-info p {
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }
    
    .certificate-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }
    
    .certificate-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
        transition: var(--transition);
    }
    
    .certificate-card:hover {
        border-color: var(--primary);
        box-shadow: 0 8px 25px rgba(6, 182, 212, 0.15);
    }
    
    .certificate-card .btn {
        margin: 0.25rem;
    }
    
    .form-control {
        width: 100%;
        padding: 12px 16px;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.95rem;
        transition: var(--transition);
    }
    
    .form-control:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
    }
    
    .form-control:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
        .continue-learning-grid,
        .certificate-grid {
            grid-template-columns: 1fr;
        }
        
        .welcome-banner {
            text-align: center;
        }
        
        .welcome-banner > div {
            flex-direction: column;
            align-items: center;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// COURSE ACTION BUTTONS
// ==========================================
document.querySelectorAll('.continue-course-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const courseName = btn.closest('.continue-course-card').querySelector('h4').textContent;
        showToast(`Opening ${courseName}...`, 'info');
    });
});

document.querySelectorAll('.continue-course-card .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const courseName = btn.closest('.continue-course-card').querySelector('h4').textContent;
        showToast(`Viewing certificate for ${courseName}`, 'success');
    });
});

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    loadStudentStats();
    updateDashboardUserInfo();
});

// Make functions globally available
window.switchPage = switchPage;