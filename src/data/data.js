// ==========================================
// SHARED DATA — Single source of truth
// Used by: courses.js, admin-dashboard.js,
//          instructor-dashboard.js, student-dashboard.js
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
        instructor: {
            name: "Lelistu Ahmed",
            email: "lelistu@learnhub.com",
            avatar: "LA",
            title: "Senior Full-Stack Developer",
            bio: "10+ years of experience in web development. Passionate about teaching modern web technologies.",
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
        description: "100 days of code with Python. Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
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
        instructor: {
            name: "Ararso Mohammed",
            email: "ararso@learnhub.com",
            avatar: "AM",
            title: "Python & Data Science Expert",
            bio: "10+ years of experience in Python and data science. Passionate about making programming accessible to everyone.",
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
