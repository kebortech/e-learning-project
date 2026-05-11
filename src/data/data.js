// ==========================================
// COMPREHENSIVE DATA MANAGEMENT SYSTEM
// Enhanced with CRUD operations and mock data
// Used by: all dashboards and main app
// ==========================================

// ==========================================
// 1. COURSES DATA
// ==========================================
const coursesData = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp 2026",
        category: "web-development",
        categoryName: "Web Development",
        level: "beginner",
        description: "Master HTML, CSS, JavaScript, React, Node.js, and more. Build 20+ real-world projects and launch your career as a full-stack developer.",
        price: 89.99,
        originalPrice: 199.99,
        rating: 4.8,
        reviews: 15420,
        students: 89450,
        duration: "48 hours",
        lectures: 385,
        badge: "bestseller",
        icon: "fa-code",
        gradient: "gradient-1",
        status: "published",
        createdDate: "2024-01-15",
        instructorId: 1,
        instructor: {
            name: "Lelistu Ahmed",
            email: "lelistu@learnhub.com",
            avatar: "LA",
            title: "Senior Full-Stack Developer",
            bio: "10+ years of experience in web development.",
            rating: 4.8,
            students: 89450,
            courses: 1
        },
        curriculum: [
            "Introduction to HTML5 & CSS3",
            "Advanced CSS: Flexbox, Grid, Animations",
            "JavaScript Fundamentals",
            "ES6+ Modern JavaScript",
            "React.js - Components, State, Hooks",
            "Node.js & Express.js",
            "Databases: MongoDB & PostgreSQL",
            "Authentication with JWT",
            "Deployment: AWS, Heroku, Netlify",
            "Final Project: E-Commerce App"
        ],
        requirements: [
            "No prior programming experience needed",
            "A computer with internet connection",
            "Willingness to learn"
        ],
        includes: [
            "48 hours on-demand video",
            "85 coding exercises",
            "20 real-world projects",
            "Downloadable resources",
            "Certificate of completion",
            "Lifetime access"
        ]
    },
    {
        id: 2,
        title: "The Complete Python Pro Bootcamp",
        category: "data-science",
        categoryName: "Data Science & AI",
        level: "beginner",
        description: "100 days of code with Python. Master Python by building 100 projects in 100 days.",
        price: 84.99,
        originalPrice: 174.99,
        rating: 4.7,
        reviews: 23400,
        students: 125000,
        duration: "60 hours",
        lectures: 478,
        badge: "bestseller",
        icon: "fa-brain",
        gradient: "gradient-2",
        status: "published",
        createdDate: "2024-02-10",
        instructorId: 2,
        instructor: {
            name: "Ararso Mohammed",
            email: "ararso@learnhub.com",
            avatar: "AM",
            title: "Python & Data Science Expert",
            bio: "10+ years of experience in Python and data science.",
            rating: 4.7,
            students: 125000,
            courses: 1
        },
        curriculum: [
            "Day 1-10: Python Basics",
            "Day 11-20: Functions & Modules",
            "Day 21-30: OOP in Python",
            "Day 31-40: Files, JSON & APIs",
            "Day 41-50: Web Scraping",
            "Day 51-60: Data Analysis with Pandas",
            "Day 61-70: Data Visualization",
            "Day 71-80: GUI with Tkinter",
            "Day 81-90: Game Development",
            "Day 91-100: Final Projects"
        ],
        requirements: [
            "No prior programming experience needed",
            "A computer with internet connection",
            "Eagerness to code for 100 days"
        ],
        includes: [
            "60 hours on-demand video",
            "100 coding exercises",
            "100 projects",
            "Python cheat sheets",
            "Certificate of completion",
            "Lifetime access"
        ]
    }
];

// ==========================================
// 2. USERS DATA (Students, Instructors, Admin)
// ==========================================
const usersData = [
    {
        id: 1,
        name: "Lelistu Ahmed",
        email: "lelistu@learnhub.com",
        password: "password123",
        role: "instructor",
        avatar: "LA",
        joinDate: "2024-01-01",
        status: "active",
        bio: "Senior Full-Stack Developer",
        expertise: ["Web Development", "JavaScript", "React", "Node.js"],
        totalStudents: 89450,
        totalCourses: 1,
        totalRevenue: 7500000,
        rating: 4.8,
        verified: true
    },
    {
        id: 2,
        name: "Ararso Mohammed",
        email: "ararso@learnhub.com",
        password: "password123",
        role: "instructor",
        avatar: "AM",
        joinDate: "2024-01-05",
        status: "active",
        bio: "Python & Data Science Expert",
        expertise: ["Python", "Data Science", "Machine Learning", "AI"],
        totalStudents: 125000,
        totalCourses: 1,
        totalRevenue: 10625000,
        rating: 4.7,
        verified: true
    },
    {
        id: 3,
        name: "Admin User",
        email: "admin@learnhub.com",
        password: "admin123",
        role: "admin",
        avatar: "AU",
        joinDate: "2023-12-01",
        status: "active",
        verified: true
    },
    {
        id: 4,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "student",
        avatar: "JD",
        joinDate: "2024-03-15",
        status: "active",
        enrolledCourses: [1, 2],
        verified: true
    },
    {
        id: 5,
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "student",
        avatar: "JS",
        joinDate: "2024-03-20",
        status: "active",
        enrolledCourses: [1],
        verified: true
    }
];

// ==========================================
// 3. STUDENT ENROLLMENTS
// ==========================================
const enrollmentsData = [
    {
        id: 1,
        studentId: 4,
        courseId: 1,
        enrollDate: "2024-03-15",
        progress: 45,
        status: "in-progress",
        certificateEarned: false,
        completionDate: null,
        lessonsCompleted: 173,
        totalLessons: 385,
        assignmentsCompleted: 8,
        totalAssignments: 20,
        score: 87.5
    },
    {
        id: 2,
        studentId: 4,
        courseId: 2,
        enrollDate: "2024-03-20",
        progress: 25,
        status: "in-progress",
        certificateEarned: false,
        completionDate: null,
        lessonsCompleted: 119,
        totalLessons: 478,
        assignmentsCompleted: 5,
        totalAssignments: 100,
        score: 82.0
    },
    {
        id: 3,
        studentId: 5,
        courseId: 1,
        enrollDate: "2024-03-18",
        progress: 60,
        status: "in-progress",
        certificateEarned: false,
        completionDate: null,
        lessonsCompleted: 231,
        totalLessons: 385,
        assignmentsCompleted: 12,
        totalAssignments: 20,
        score: 91.5
    }
];

// ==========================================
// 4. ASSIGNMENTS & SUBMISSIONS
// ==========================================
const assignmentsData = [
    {
        id: 1,
        courseId: 1,
        title: "Build a Personal Portfolio Website",
        description: "Create a responsive personal portfolio website using HTML, CSS, and JavaScript",
        dueDate: "2024-05-15",
        difficulty: "intermediate",
        points: 100,
        submissions: [
            {
                studentId: 4,
                submissionDate: "2024-05-12",
                status: "submitted",
                score: 85,
                feedback: "Great work! Good use of CSS Grid."
            }
        ]
    },
    {
        id: 2,
        courseId: 1,
        title: "React Todo Application",
        description: "Build a fully functional todo app with React hooks",
        dueDate: "2024-05-30",
        difficulty: "intermediate",
        points: 100,
        submissions: []
    }
];

// ==========================================
// 5. PAYMENT TRANSACTIONS
// ==========================================
const paymentsData = [
    {
        id: 1,
        studentId: 4,
        courseId: 1,
        amount: 89.99,
        status: "completed",
        paymentDate: "2024-03-15",
        paymentMethod: "credit_card",
        transactionId: "TXN001"
    },
    {
        id: 2,
        studentId: 4,
        courseId: 2,
        amount: 84.99,
        status: "completed",
        paymentDate: "2024-03-20",
        paymentMethod: "credit_card",
        transactionId: "TXN002"
    },
    {
        id: 3,
        studentId: 5,
        courseId: 1,
        amount: 89.99,
        status: "completed",
        paymentDate: "2024-03-18",
        paymentMethod: "paypal",
        transactionId: "TXN003"
    }
];

// ==========================================
// 6. CERTIFICATES
// ==========================================
const certificatesData = [
    {
        id: 1,
        studentId: 4,
        courseId: 1,
        issuedDate: "2024-05-20",
        certificateNumber: "CERT-2024-0001",
        status: "issued"
    }
];

// ==========================================
// 7. STORAGE & INITIALIZATION
// ==========================================

// Initialize localStorage with data
function initializeDatabase() {
    if (!localStorage.getItem('learnhub_courses')) {
        localStorage.setItem('learnhub_courses', JSON.stringify(coursesData));
    }
    if (!localStorage.getItem('learnhub_users')) {
        localStorage.setItem('learnhub_users', JSON.stringify(usersData));
    }
    if (!localStorage.getItem('learnhub_enrollments')) {
        localStorage.setItem('learnhub_enrollments', JSON.stringify(enrollmentsData));
    }
    if (!localStorage.getItem('learnhub_assignments')) {
        localStorage.setItem('learnhub_assignments', JSON.stringify(assignmentsData));
    }
    if (!localStorage.getItem('learnhub_payments')) {
        localStorage.setItem('learnhub_payments', JSON.stringify(paymentsData));
    }
    if (!localStorage.getItem('learnhub_certificates')) {
        localStorage.setItem('learnhub_certificates', JSON.stringify(certificatesData));
    }
}

// ==========================================
// 8. CRUD OPERATIONS - COURSES
// ==========================================

function getAllCourses() {
    return JSON.parse(localStorage.getItem('learnhub_courses')) || coursesData;
}

function getCourseById(courseId) {
    const courses = getAllCourses();
    return courses.find(c => c.id === courseId);
}

function createCourse(courseData) {
    const courses = getAllCourses();
    const newCourse = {
        id: Math.max(...courses.map(c => c.id)) + 1,
        ...courseData,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'draft'
    };
    courses.push(newCourse);
    localStorage.setItem('learnhub_courses', JSON.stringify(courses));
    return newCourse;
}

function updateCourse(courseId, updates) {
    const courses = getAllCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index > -1) {
        courses[index] = { ...courses[index], ...updates };
        localStorage.setItem('learnhub_courses', JSON.stringify(courses));
        return courses[index];
    }
    return null;
}

function deleteCourse(courseId) {
    const courses = getAllCourses();
    const filtered = courses.filter(c => c.id !== courseId);
    localStorage.setItem('learnhub_courses', JSON.stringify(filtered));
    return true;
}

function getCoursesByInstructor(instructorId) {
    const courses = getAllCourses();
    return courses.filter(c => c.instructorId === instructorId);
}

// ==========================================
// 9. CRUD OPERATIONS - USERS
// ==========================================

function getAllUsers() {
    return JSON.parse(localStorage.getItem('learnhub_users')) || usersData;
}

function getUserById(userId) {
    const users = getAllUsers();
    return users.find(u => u.id === userId);
}

function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(u => u.email === email);
}

function createUser(userData) {
    const users = getAllUsers();
    const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    users.push(newUser);
    localStorage.setItem('learnhub_users', JSON.stringify(users));
    return newUser;
}

function updateUser(userId, updates) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index > -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('learnhub_users', JSON.stringify(users));
        return users[index];
    }
    return null;
}

function deleteUser(userId) {
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('learnhub_users', JSON.stringify(filtered));
    return true;
}

function getUsersByRole(role) {
    const users = getAllUsers();
    return users.filter(u => u.role === role);
}

// ==========================================
// 10. CRUD OPERATIONS - ENROLLMENTS
// ==========================================

function getAllEnrollments() {
    return JSON.parse(localStorage.getItem('learnhub_enrollments')) || enrollmentsData;
}

function getEnrollmentById(enrollmentId) {
    const enrollments = getAllEnrollments();
    return enrollments.find(e => e.id === enrollmentId);
}

function createEnrollment(enrollmentData) {
    const enrollments = getAllEnrollments();
    const newEnrollment = {
        id: Math.max(...enrollments.map(e => e.id), 0) + 1,
        ...enrollmentData,
        enrollDate: new Date().toISOString().split('T')[0],
        status: 'in-progress',
        progress: 0
    };
    enrollments.push(newEnrollment);
    localStorage.setItem('learnhub_enrollments', JSON.stringify(enrollments));
    return newEnrollment;
}

function updateEnrollment(enrollmentId, updates) {
    const enrollments = getAllEnrollments();
    const index = enrollments.findIndex(e => e.id === enrollmentId);
    if (index > -1) {
        enrollments[index] = { ...enrollments[index], ...updates };
        localStorage.setItem('learnhub_enrollments', JSON.stringify(enrollments));
        return enrollments[index];
    }
    return null;
}

function deleteEnrollment(enrollmentId) {
    const enrollments = getAllEnrollments();
    const filtered = enrollments.filter(e => e.id !== enrollmentId);
    localStorage.setItem('learnhub_enrollments', JSON.stringify(filtered));
    return true;
}

function getStudentEnrollments(studentId) {
    const enrollments = getAllEnrollments();
    return enrollments.filter(e => e.studentId === studentId);
}

function getCourseEnrollments(courseId) {
    const enrollments = getAllEnrollments();
    return enrollments.filter(e => e.courseId === courseId);
}

// ==========================================
// 11. ANALYTICS & STATISTICS
// ==========================================

function getDashboardStats() {
    const users = getAllUsers();
    const courses = getAllCourses();
    const enrollments = getAllEnrollments();
    const payments = getPaymentsData();

    return {
        totalUsers: users.length,
        totalInstructors: users.filter(u => u.role === 'instructor').length,
        totalStudents: users.filter(u => u.role === 'student').length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalRevenue: payments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0),
        activeEnrollments: enrollments.filter(e => e.status === 'in-progress').length,
        completedCourses: enrollments.filter(e => e.status === 'completed').length
    };
}

function getInstructorStats(instructorId) {
    const courses = getCoursesByInstructor(instructorId);
    const enrollments = getAllEnrollments();
    const payments = getPaymentsData();

    const courseIds = courses.map(c => c.id);
    const instructorEnrollments = enrollments.filter(e => courseIds.includes(e.courseId));
    const instructorPayments = payments.filter(p => courseIds.includes(p.courseId));

    return {
        totalCourses: courses.length,
        totalStudents: instructorEnrollments.length,
        totalRevenue: instructorPayments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0),
        publishedCourses: courses.filter(c => c.status === 'published').length,
        draftCourses: courses.filter(c => c.status === 'draft').length,
        averageRating: courses.length > 0 ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1) : 0
    };
}

function getStudentStats(studentId) {
    const enrollments = getStudentEnrollments(studentId);
    const courses = getAllCourses();

    return {
        enrolledCourses: enrollments.length,
        completedCourses: enrollments.filter(e => e.status === 'completed').length,
        inProgressCourses: enrollments.filter(e => e.status === 'in-progress').length,
        averageProgress: enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0,
        certificates: enrollments.filter(e => e.certificateEarned).length
    };
}

// ==========================================
// 12. PAYMENTS DATA FUNCTIONS
// ==========================================

function getPaymentsData() {
    return JSON.parse(localStorage.getItem('learnhub_payments')) || paymentsData;
}

function addPayment(paymentData) {
    const payments = getPaymentsData();
    const newPayment = {
        id: Math.max(...payments.map(p => p.id), 0) + 1,
        ...paymentData,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'completed'
    };
    payments.push(newPayment);
    localStorage.setItem('learnhub_payments', JSON.stringify(payments));
    return newPayment;
}

// ==========================================
// 13. CURRENT USER MANAGEMENT
// ==========================================

function getCurrentUser() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
        return getUserById(parseInt(currentUserId));
    }
    return null;
}

function setCurrentUser(userId) {
    localStorage.setItem('currentUserId', userId);
}

function logout() {
    localStorage.removeItem('currentUserId');
}

// ==========================================
// HELPER FUNCTION FOR DASHBOARDS
// Used by all dashboard scripts to get current user
// ==========================================
function getCurrentUser() {
    try {
        // First try the new format (learniaCurrentUser - used by auth system)
        let user = JSON.parse(localStorage.getItem('learniaCurrentUser'));
        if (user) {
            console.log("[v0] Got current user from localStorage:", user.email, user.role);
            return user;
        }
        
        // Try session storage (for non-persistent sessions)
        user = JSON.parse(sessionStorage.getItem('learniaCurrentUser'));
        if (user) {
            console.log("[v0] Got current user from sessionStorage:", user.email, user.role);
            return user;
        }
        
        // Fallback to old format
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
            user = getUserById(parseInt(userId));
            if (user) {
                console.log("[v0] Got current user from user ID:", user.email, user.role);
                return user;
            }
        }
        
        console.log("[v0] No current user found");
        return null;
    } catch (error) {
        console.error("[v0] Error getting current user:", error);
        return null;
    }
}

// Initialize database on load
initializeDatabase();
