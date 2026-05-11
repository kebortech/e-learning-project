// ==========================================
// USER DATABASE (Simulated)
// ==========================================
const defaultUsers = {
    'admin@learnia.com': {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@learnia.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'AU',
        phone: '+1 (555) 123-4567',
        bio: 'Platform administrator managing all operations',
        createdAt: '2024-01-01',
        lastLogin: null
    },
    'lelistu@learnhub.com': {
        id: 2,
        firstName: 'Lelistu',
        lastName: 'Ahmed',
        email: 'lelistu@learnhub.com',
        password: 'lelistu123',
        role: 'instructor',
        specialization: 'Web Development',
        experience: 10,
        avatar: 'LA',
        phone: '',
        bio: 'Senior Full-Stack Developer with 10+ years of experience in web development.',
        rating: 4.8,
        totalStudents: 89450,
        totalCourses: 1,
        createdAt: '2024-01-15',
        lastLogin: null
    },
    'ararso@learnhub.com': {
        id: 4,
        firstName: 'Ararso',
        lastName: 'Mohammed',
        email: 'ararso@learnhub.com',
        password: 'ararso123',
        role: 'instructor',
        specialization: 'Python & Data Science',
        experience: 10,
        avatar: 'AM',
        phone: '',
        bio: 'Python and Data Science expert with 10+ years of experience.',
        rating: 4.7,
        totalStudents: 125000,
        totalCourses: 1,
        createdAt: '2024-01-15',
        lastLogin: null
    },
    'student@learnia.com': {
        id: 3,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'student@learnia.com',
        password: 'student123',
        role: 'student',
        avatar: 'JD',
        phone: '+1 (555) 345-6789',
        bio: 'Aspiring full-stack developer passionate about learning new technologies',
        enrolledCourses: [1, 3, 6],
        completedCourses: [1],
        totalHoursLearned: 48,
        certificates: 1,
        createdAt: '2024-02-01',
        lastLogin: null
    }
};

// Initialize users database if not exists, or migrate if old instructor accounts detected
(function initUsersDB() {
    const stored = localStorage.getItem('learniaUsers');
    if (!stored) {
        localStorage.setItem('learniaUsers', JSON.stringify(defaultUsers));
        return;
    }
    try {
        const users = JSON.parse(stored);
        // Migrate: remove old instructor accounts and add new ones
        if (users['instructor@learnia.com'] || (!users['lelistu@learnhub.com'] && !users['ararso@learnhub.com'])) {
            delete users['instructor@learnia.com'];
            users['lelistu@learnhub.com'] = defaultUsers['lelistu@learnhub.com'];
            users['ararso@learnhub.com'] = defaultUsers['ararso@learnhub.com'];
            localStorage.setItem('learniaUsers', JSON.stringify(users));
        }
    } catch (e) {
        localStorage.setItem('learniaUsers', JSON.stringify(defaultUsers));
    }
})();

// ==========================================
// STATE MANAGEMENT
// ==========================================
let selectedRole = 'student';
let currentUser = null;

// ==========================================
// DOM ELEMENTS
// ==========================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const body = document.body;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function getUsersDB() {
    try {
        return JSON.parse(localStorage.getItem('learniaUsers')) || defaultUsers;
    } catch (error) {
        console.error('Error reading users database:', error);
        return defaultUsers;
    }
}

function saveUsersDB(users) {
    try {
        localStorage.setItem('learniaUsers', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users database:', error);
        showToast('Error saving data. Please try again.', 'error');
        return false;
    }
}

function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('learniaCurrentUser')) || 
                     JSON.parse(sessionStorage.getItem('learniaCurrentUser'));
        return user;
    } catch (error) {
        console.error('Error reading current user:', error);
        return null;
    }
}

function setCurrentUser(user, rememberMe = false) {
    try {
        // Remove password before storing
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        
        currentUser = userWithoutPassword;
        
        if (rememberMe) {
            localStorage.setItem('learniaCurrentUser', JSON.stringify(userWithoutPassword));
        } else {
            sessionStorage.setItem('learniaCurrentUser', JSON.stringify(userWithoutPassword));
        }
        return true;
    } catch (error) {
        console.error('Error saving current user:', error);
        return false;
    }
}

function redirectToDashboard(role) {
    console.log("[v0] Redirecting to dashboard for role:", role);
    switch(role) {
        case 'admin':
            window.location.href = './admin-dashboard.html';
            break;
        case 'instructor':
            window.location.href = './instructor-dashboard.html';
            break;
        case 'student':
            window.location.href = './student-dashboard.html';
            break;
        default:
            window.location.href = './index.html';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

// ==========================================
// ROLE SELECTION
// ==========================================
const roleTabs = document.querySelectorAll('.role-tab');

if (roleTabs.length > 0) {
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            roleTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Update selected role
            selectedRole = tab.dataset.role;
            
            // Show/hide instructor fields for registration
            if (window.location.pathname.includes('register')) {
                const instructorFields = document.getElementById('instructorFields');
                const instructorBio = document.getElementById('instructorBio');
                
                if (instructorFields && instructorBio) {
                    if (selectedRole === 'instructor') {
                        instructorFields.style.display = 'block';
                        instructorBio.style.display = 'block';
                        // Add required attribute to instructor fields
                        document.getElementById('specialization')?.setAttribute('required', '');
                        document.getElementById('experience')?.setAttribute('required', '');
                    } else {
                        instructorFields.style.display = 'none';
                        instructorBio.style.display = 'none';
                        // Remove required attribute from instructor fields
                        document.getElementById('specialization')?.removeAttribute('required');
                        document.getElementById('experience')?.removeAttribute('required');
                    }
                }
            }
        });
    });
}

// ==========================================
// PASSWORD TOGGLE
// ==========================================
const togglePasswordBtn = document.getElementById('togglePassword');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const icon = togglePasswordBtn.querySelector('i');
        
        if (passwordInput) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                passwordInput.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        }
    });
}

// Also handle confirm password toggle if exists
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
if (toggleConfirmPasswordBtn) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const icon = toggleConfirmPasswordBtn.querySelector('i');
        
        if (confirmPasswordInput) {
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                confirmPasswordInput.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        }
    });
}

// ==========================================
// DEMO CREDENTIALS FILL
// ==========================================
function fillCredentials(email, password) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.value = email;
        // Trigger input event for any listeners
        emailInput.dispatchEvent(new Event('input'));
    }
    
    if (passwordInput) {
        passwordInput.value = password;
        // Trigger input event for any listeners
        passwordInput.dispatchEvent(new Event('input'));
    }
    
    // Set correct role tab based on email
    let role = 'student';
    if (email.includes('admin')) {
        role = 'admin';
    } else if (email.includes('instructor')) {
        role = 'instructor';
    }
    
    if (roleTabs.length > 0) {
        roleTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.role === role) {
                tab.classList.add('active');
                selectedRole = role;
            }
        });
    }
    
    // Show success toast
    showToast(`Credentials filled for ${role} account`, 'success');
}

// Make fillCredentials globally available
window.fillCredentials = fillCredentials;

// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberMe = document.getElementById('rememberMe')?.checked;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        const email = emailInput?.value.trim().toLowerCase();
        const password = passwordInput?.value;
        
        // Reset previous errors
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Validation
        let hasError = false;
        
        if (!email) {
            showInputError(emailInput, 'Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            showInputError(emailInput, 'Please enter a valid email');
            hasError = true;
        }
        
        if (!password) {
            showInputError(passwordInput, 'Password is required');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Disable button and show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        }
        
        // Simulate network delay
        setTimeout(() => {
            // Check credentials
            const users = getUsersDB();
            const user = users[email];
            
            if (!user) {
                showToast('Invalid email or password', 'error');
                showInputError(emailInput, 'No account found with this email');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                }
                return;
            }
            
            if (user.password !== password) {
                showToast('Invalid email or password', 'error');
                showInputError(passwordInput, 'Incorrect password');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                }
                return;
            }
            
            // Check role matches selected tab
            if (user.role !== selectedRole) {
                showToast(`This account is registered as ${user.role}. Please select the correct role tab.`, 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                }
                return;
            }
            
            // Update last login
            user.lastLogin = new Date().toISOString();
            users[email] = user;
            saveUsersDB(users);
            
            // Store current user
            if (setCurrentUser(user, rememberMe)) {
                // Show success state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    submitBtn.style.background = '#10b981';
                }
                
                showToast('Login successful! Redirecting...', 'success');
                
                // Redirect after delay
                setTimeout(() => {
                    redirectToDashboard(user.role);
                }, 1000);
            }
        }, 800);
    });
}

// ==========================================
// REGISTER FUNCTIONALITY
// ==========================================
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        const firstName = firstNameInput?.value.trim();
        const lastName = lastNameInput?.value.trim();
        const email = emailInput?.value.trim().toLowerCase();
        const password = passwordInput?.value;
        const confirmPassword = confirmPasswordInput?.value;
        
        // Reset previous errors
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Validation
        let hasError = false;
        
        if (!firstName) {
            showInputError(firstNameInput, 'First name is required');
            hasError = true;
        } else if (firstName.length < 2) {
            showInputError(firstNameInput, 'First name must be at least 2 characters');
            hasError = true;
        }
        
        if (!lastName) {
            showInputError(lastNameInput, 'Last name is required');
            hasError = true;
        } else if (lastName.length < 2) {
            showInputError(lastNameInput, 'Last name must be at least 2 characters');
            hasError = true;
        }
        
        if (!email) {
            showInputError(emailInput, 'Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            showInputError(emailInput, 'Please enter a valid email');
            hasError = true;
        }
        
        if (!password) {
            showInputError(passwordInput, 'Password is required');
            hasError = true;
        } else if (!validatePassword(password)) {
            showInputError(passwordInput, 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
            hasError = true;
        }
        
        if (!confirmPassword) {
            showInputError(confirmPasswordInput, 'Please confirm your password');
            hasError = true;
        } else if (password !== confirmPassword) {
            showInputError(confirmPasswordInput, 'Passwords do not match');
            hasError = true;
        }
        
        // Validate instructor fields if role is instructor
        if (selectedRole === 'instructor') {
            const specializationInput = document.getElementById('specialization');
            const experienceInput = document.getElementById('experience');
            
            if (specializationInput && !specializationInput.value.trim()) {
                showInputError(specializationInput, 'Specialization is required');
                hasError = true;
            }
            
            if (experienceInput) {
                const experience = parseInt(experienceInput.value);
                if (!experienceInput.value || isNaN(experience) || experience < 0) {
                    showInputError(experienceInput, 'Valid experience is required');
                    hasError = true;
                }
            }
        }
        
        if (hasError) return;
        
        // Block instructor self-registration
        if (selectedRole === 'instructor') {
            showToast('Instructor accounts must be created by an admin. Please contact support.', 'error');
            return;
        }

        // Check if email already exists
        const users = getUsersDB();
        if (users[email]) {
            showToast('An account with this email already exists', 'error');
            showInputError(emailInput, 'Email already registered');
            return;
        }
        
        // Disable button and show loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        }
        
        // Simulate network delay
        setTimeout(() => {
            // Create new user
            const newUser = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                password,
                role: selectedRole,
                avatar: (firstName[0] + lastName[0]).toUpperCase(),
                phone: '',
                bio: '',
                createdAt: new Date().toISOString().split('T')[0],
                lastLogin: new Date().toISOString()
            };
            
            // Add role-specific fields
            if (selectedRole === 'instructor') {
                newUser.specialization = document.getElementById('specialization')?.value || '';
                newUser.experience = parseInt(document.getElementById('experience')?.value) || 0;
                newUser.rating = 0;
                newUser.totalStudents = 0;
                newUser.totalCourses = 0;
            } else if (selectedRole === 'student') {
                newUser.enrolledCourses = [];
                newUser.completedCourses = [];
                newUser.totalHoursLearned = 0;
                newUser.certificates = 0;
            }
            
            // Save to database
            users[email] = newUser;
            if (!saveUsersDB(users)) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
                }
                return;
            }
            
            // Auto login new user
            if (setCurrentUser(newUser, false)) {
                // Show success state
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
                    submitBtn.style.background = '#10b981';
                }
                
                showToast('Account created successfully! Welcome to LearnHub!', 'success');
                
                // Redirect after delay
                setTimeout(() => {
                    redirectToDashboard(selectedRole);
                }, 1500);
            }
        }, 1000);
    });
}

// ==========================================
// FORM INPUT ERROR HELPER
// ==========================================
function showInputError(inputElement, message) {
    if (!inputElement) return;
    
    inputElement.classList.add('error');
    
    // Remove existing error message
    const existingError = inputElement.parentElement?.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Create error message element
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message visible';
    errorSpan.textContent = message;
    
    // Insert after input or its parent
    const parent = inputElement.closest('.input-icon') || inputElement.parentElement;
    if (parent) {
        parent.appendChild(errorSpan);
    }
    
    // Remove error on input
    inputElement.addEventListener('input', function removeError() {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        const error = inputElement.parentElement?.querySelector('.error-message');
        if (error) error.remove();
        inputElement.removeEventListener('input', removeError);
    }, { once: true });
}

// ==========================================
// CHECK AUTH STATE
// ==========================================
function checkAuth() {
    const storedUser = getCurrentUser();
    
    if (storedUser) {
        currentUser = storedUser;
        
        // Check if on auth pages
        const currentPath = window.location.pathname;
        const isAuthPage = currentPath.includes('login.html') || 
                          currentPath.includes('register.html');
        
        if (isAuthPage) {
            // User is already logged in, redirect to dashboard
            redirectToDashboard(currentUser.role);
            return true;
        }
        
        // Check if on dashboard pages
        const isDashboardPage = currentPath.includes('dashboard');
        if (isDashboardPage) {
            // Ensure user is on correct dashboard
            const expectedDashboard = `${currentUser.role}-dashboard.html`;
            if (!currentPath.includes(expectedDashboard)) {
                redirectToDashboard(currentUser.role);
                return false;
            }
        }
        
        return true;
    }
    
    // Check if trying to access protected pages without auth
    const currentPath = window.location.pathname;
    const isDashboardPage = currentPath.includes('dashboard');
    
    if (isDashboardPage) {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    return false;
}

// ==========================================
// REQUIRE AUTH FOR PROTECTED PAGES
// ==========================================
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// ==========================================
// LOGOUT FUNCTIONALITY
// ==========================================
function logout() {
    // Clear all auth data
    localStorage.removeItem('learniaCurrentUser');
    sessionStorage.removeItem('learniaCurrentUser');
    currentUser = null;
    
    // Show logout message
    showToast('Logged out successfully', 'success');
    
    // Redirect to login after short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

// Make logout globally available
window.logout = logout;

// ==========================================
// UPDATE USER PROFILE
// ==========================================
function updateUserProfile(updates) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const users = getUsersDB();
    if (!users[user.email]) return false;
    
    // Update user in database
    users[user.email] = {
        ...users[user.email],
        ...updates,
        email: user.email // Don't allow email change
    };
    
    if (saveUsersDB(users)) {
        // Update current session
        const updatedUser = { ...user, ...updates };
        const isRemembered = localStorage.getItem('learniaCurrentUser') !== null;
        setCurrentUser(updatedUser, isRemembered);
        return true;
    }
    
    return false;
}

// ==========================================
// CHANGE PASSWORD
// ==========================================
function changePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };
    
    const users = getUsersDB();
    const userRecord = users[user.email];
    
    if (!userRecord) return { success: false, message: 'User not found' };
    
    if (userRecord.password !== currentPassword) {
        return { success: false, message: 'Current password is incorrect' };
    }
    
    if (!validatePassword(newPassword)) {
        return { success: false, message: 'New password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number' };
    }
    
    userRecord.password = newPassword;
    if (saveUsersDB(users)) {
        return { success: true, message: 'Password changed successfully' };
    }
    
    return { success: false, message: 'Error saving password' };
}

// Make functions globally available
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword;
window.requireAuth = requireAuth;

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

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
}

// ==========================================
// GET ALL USERS (Admin only)
// ==========================================
function getAllUsers() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        return { success: false, message: 'Unauthorized', data: [] };
    }
    
    const users = getUsersDB();
    const userList = Object.values(users).map(u => ({
        ...u,
        password: undefined // Don't expose passwords
    }));
    
    return { success: true, data: userList };
}

// ==========================================
// DELETE USER (Admin only)
// ==========================================
function deleteUser(email) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        return { success: false, message: 'Unauthorized' };
    }
    
    if (email === user.email) {
        return { success: false, message: 'Cannot delete your own account' };
    }
    
    const users = getUsersDB();
    if (!users[email]) {
        return { success: false, message: 'User not found' };
    }
    
    delete users[email];
    if (saveUsersDB(users)) {
        return { success: true, message: 'User deleted successfully' };
    }
    
    return { success: false, message: 'Error deleting user' };
}

// Make admin functions globally available
window.getAllUsers = getAllUsers;
window.deleteUser = deleteUser;

// ==========================================
// STATISTICS (For Dashboards)
// ==========================================
function getPlatformStats() {
    const users = getUsersDB();
    const userList = Object.values(users);
    
    return {
        totalUsers: userList.length,
        totalStudents: userList.filter(u => u.role === 'student').length,
        totalInstructors: userList.filter(u => u.role === 'instructor').length,
        totalAdmins: userList.filter(u => u.role === 'admin').length,
        users: userList.map(u => ({ ...u, password: undefined }))
    };
}

function getInstructorStats() {
    const user = getCurrentUser();
    if (!user || user.role !== 'instructor') return null;
    
    const users = getUsersDB();
    const instructor = users[user.email];
    
    return {
        totalStudents: instructor.totalStudents || 0,
        totalCourses: instructor.totalCourses || 0,
        rating: instructor.rating || 0,
        specialization: instructor.specialization || '',
        experience: instructor.experience || 0
    };
}

function getStudentStats() {
    const user = getCurrentUser();
    if (!user || user.role !== 'student') return null;
    
    const users = getUsersDB();
    const student = users[user.email];
    
    return {
        enrolledCourses: student.enrolledCourses?.length || 0,
        completedCourses: student.completedCourses?.length || 0,
        hoursLearned: student.totalHoursLearned || 0,
        certificates: student.certificates || 0
    };
}

// Make stats functions globally available
window.getPlatformStats = getPlatformStats;
window.getInstructorStats = getInstructorStats;
window.getStudentStats = getStudentStats;

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
    const isLoggedIn = checkAuth();
    
    // If on auth pages and logged in, redirect happens in checkAuth
    if (isLoggedIn) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            // Already redirected in checkAuth
            return;
        }
        
        // Update UI with current user info if on dashboard
        if (currentPath.includes('dashboard')) {
            updateDashboardUserInfo();
        }
    }
    
    // Add loaded class for animations
    if (body) {
        body.classList.add('loaded');
    }
});

// ==========================================
// UPDATE DASHBOARD USER INFO
// ==========================================
function updateDashboardUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update user name displays
    const userNames = document.querySelectorAll('#userName, .user-name');
    userNames.forEach(el => {
        el.textContent = `${user.firstName} ${user.lastName}`;
    });
    
    // Update user avatars
    const userAvatars = document.querySelectorAll('#userAvatar, .user-avatar');
    userAvatars.forEach(el => {
        el.textContent = user.avatar || user.firstName[0] + user.lastName[0];
    });
    
    // Update user roles
    const userRoles = document.querySelectorAll('#userRole, .user-role');
    userRoles.forEach(el => {
        el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    });
    
    // Update emails
    const userEmails = document.querySelectorAll('#userEmail, .user-email');
    userEmails.forEach(el => {
        el.textContent = user.email;
    });
}

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log('%c🔐 LearnHub Auth System', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%cSecure authentication with role-based access control', 'font-size: 12px; color: #94a3b8;');
console.log('%cDemo Credentials:', 'font-size: 14px; font-weight: bold; color: #10b981;');
console.log('%cAdmin: admin@learnia.com / admin123', 'font-size: 12px; color: #8b5cf6;');
console.log('%cInstructor: lelistu@learnhub.com / lelistu123', 'font-size: 12px; color: #8b5cf6;');
console.log('%cStudent: student@learnia.com / student123', 'font-size: 12px; color: #8b5cf6;');
