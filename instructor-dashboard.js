// ==========================================
// INSTRUCTOR DASHBOARD LOGIC
// ==========================================

// Check instructor access
if (!currentUser || currentUser.role !== 'instructor') {
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
        overview: 'Instructor Dashboard',
        'my-courses': 'My Courses',
        'create-course': 'Create New Course',
        students: 'My Students',
        lessons: 'Lessons',
        quizzes: 'Quizzes',
        assignments: 'Assignments',
        revenue: 'Revenue',
        reviews: 'Reviews',
        profile: 'Profile Settings',
        settings: 'Settings'
    };
    
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Instructor Dashboard';
    
    // Load page-specific data
    if (pageName === 'profile') loadProfileData();
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
function loadInstructorStats() {
    if (!currentUser) return;

    // Filter courses belonging to this instructor
    const myCourses = (typeof coursesData !== 'undefined')
        ? coursesData.filter(c => c.instructor.email === currentUser.email)
        : [];

    const totalStudents = myCourses.reduce((sum, c) => sum + c.students, 0);
    const avgRating = myCourses.length
        ? (myCourses.reduce((sum, c) => sum + c.rating, 0) / myCourses.length).toFixed(1)
        : '—';

    // Update sidebar badges
    const coursesBadge = document.getElementById('coursesBadge');
    const studentsBadge = document.getElementById('studentsBadge');
    if (coursesBadge) coursesBadge.textContent = myCourses.length;
    if (studentsBadge) studentsBadge.textContent = totalStudents.toLocaleString();

    // Update overview stat cards
    const totalCoursesEl = document.getElementById('totalCourses');
    const totalStudentsEl = document.getElementById('totalStudents');
    if (totalCoursesEl) totalCoursesEl.textContent = myCourses.length;
    if (totalStudentsEl) totalStudentsEl.textContent = totalStudents.toLocaleString();

    // Render overview courses table
    const overviewTable = document.getElementById('instructorCoursesTable');
    if (overviewTable) {
        overviewTable.innerHTML = myCourses.length ? myCourses.map(course => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 40px; height: 30px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 4px; display:flex; align-items:center; justify-content:center; color:white;">
                            <i class="fas ${course.icon || 'fa-book'}" style="font-size:0.85rem;"></i>
                        </div>
                        <strong>${course.title}</strong>
                    </div>
                </td>
                <td>${course.categoryName}</td>
                <td>${course.students.toLocaleString()}</td>
                <td>$${(course.students * course.price * 0.7).toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                <td><span style="color: #f59e0b;">${'★'.repeat(Math.round(course.rating))}</span> ${course.rating}</td>
                <td><span class="status status-active">Published</span></td>
                <td>
                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn"><i class="fas fa-chart-bar"></i></button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-secondary);">No courses yet</td></tr>`;
    }

    // Render my-courses grid
    const myCoursesGrid = document.getElementById('myCoursesGrid');
    if (myCoursesGrid) {
        myCoursesGrid.innerHTML = myCourses.length ? myCourses.map(course => `
            <div class="course-admin-card">
                <div class="course-admin-image ${course.gradient || 'gradient-1'}">
                    <i class="fas ${course.icon || 'fa-book'}"></i>
                </div>
                <div class="course-admin-body">
                    <h4>${course.title}</h4>
                    <p class="course-admin-meta">
                        <span><i class="fas fa-users"></i> ${course.students.toLocaleString()} students</span>
                        <span><i class="fas fa-star" style="color: #f59e0b;"></i> ${course.rating}</span>
                    </p>
                    <div class="progress-bar-container" style="margin: 0.75rem 0;">
                        <div class="progress-bar-fill blue" style="width: 100%;"></div>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">Published • $${course.price}</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="action-btn"><i class="fas fa-edit"></i> Edit</button>
                        <button class="action-btn"><i class="fas fa-eye"></i> Preview</button>
                    </div>
                </div>
            </div>
        `).join('') : `<p style="color:var(--text-secondary);padding:1rem;">No courses yet. Create your first course!</p>`;
    }
}

// ==========================================
// LOAD PROFILE DATA
// ==========================================
function loadProfileData() {
    if (!currentUser) return;
    
    const firstNameEl = document.getElementById('profileFirstName');
    const lastNameEl = document.getElementById('profileLastName');
    const emailEl = document.getElementById('profileEmail');
    const specializationEl = document.getElementById('profileSpecialization');
    const bioEl = document.getElementById('profileBio');
    
    if (firstNameEl) firstNameEl.value = currentUser.firstName || '';
    if (lastNameEl) lastNameEl.value = currentUser.lastName || '';
    if (emailEl) emailEl.value = currentUser.email || '';
    if (specializationEl) specializationEl.value = currentUser.specialization || '';
    if (bioEl) bioEl.value = currentUser.bio || '';
}

// ==========================================
// PROFILE FORM SUBMISSION
// ==========================================
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updates = {
            firstName: document.getElementById('profileFirstName')?.value,
            lastName: document.getElementById('profileLastName')?.value,
            specialization: document.getElementById('profileSpecialization')?.value,
            bio: document.getElementById('profileBio')?.value
        };
        
        if (window.updateUserProfile && window.updateUserProfile(updates)) {
            // Update current user in memory
            Object.assign(currentUser, updates);
            currentUser.avatar = (updates.firstName[0] + updates.lastName[0]).toUpperCase();
            
            // Update display
            updateDashboardUserInfo();
            showToast('Profile updated successfully', 'success');
        } else {
            showToast('Error updating profile', 'error');
        }
    });
}

// ==========================================
// CREATE COURSE FORM
// ==========================================
const createCourseForm = document.getElementById('createCourseForm');
if (createCourseForm) {
    createCourseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate course creation
        const submitBtn = createCourseForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showToast('Course created successfully!', 'success');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Course Created!';
            submitBtn.style.background = '#10b981';
            
            // Reset form after delay
            setTimeout(() => {
                createCourseForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// ==========================================
// ADD COURSE ADMIN CARDS STYLES
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .courses-grid-admin {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .course-admin-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        transition: var(--transition);
    }
    
    .course-admin-card:hover {
        transform: translateY(-2px);
        border-color: var(--primary);
        box-shadow: 0 8px 25px rgba(6, 182, 212, 0.15);
    }
    
    .course-admin-image {
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
    }
    
    .course-admin-body {
        padding: 1.25rem;
    }
    
    .course-admin-body h4 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }
    
    .course-admin-meta {
        display: flex;
        gap: 1rem;
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }
    
    .course-admin-meta span {
        display: flex;
        align-items: center;
        gap: 0.35rem;
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
    
    .search-input {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--bg-secondary);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.9rem;
    }
    
    .search-input:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    @media (max-width: 768px) {
        .courses-grid-admin {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    loadInstructorStats();
    updateDashboardUserInfo();
});

// Make functions globally available
window.switchPage = switchPage;