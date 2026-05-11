// ==========================================
// ADMIN DASHBOARD LOGIC
// ==========================================

// Check admin access
if (!currentUser || currentUser.role !== 'admin') {
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
        overview: 'Admin Dashboard',
        analytics: 'Analytics',
        users: 'User Management',
        instructors: 'Instructor Management',
        courses: 'Course Management',
        enrollments: 'Enrollments',
        approvals: 'Payment Approvals',
        transactions: 'Transaction History',
        settings: 'Platform Settings',
        reports: 'Reports & Analytics'
    };
    
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Admin Dashboard';
    
    // Load page-specific data
    if (pageName === 'users') loadUsersTable();
    if (pageName === 'instructors') loadInstructorsTable();
    if (pageName === 'courses') loadCoursesTable();
    if (pageName === 'approvals') loadPaymentApprovals();
    if (pageName === 'transactions') loadAllTransactions();
    if (pageName === 'reports') loadReportsData();
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
function loadDashboardStats() {
    const users = getUsersDB();
    const userList = Object.values(users);
    
    const totalUsers = userList.length;
    const students = userList.filter(u => u.role === 'student');
    const instructors = userList.filter(u => u.role === 'instructor');
    
    // Update stat cards
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalInstructors').textContent = instructors.length;
    document.getElementById('totalUsersBadge').textContent = totalUsers;
    
    // Update pending payments count
    updatePendingPaymentsCount();
    
    // Update approvals badge
    updateApprovalsBadge();
    
    // Load recent users table
    const recentUsers = userList.slice(-5).reverse();
    const tableBody = document.getElementById('recentUsersTable');
    if (tableBody) {
        tableBody.innerHTML = recentUsers.map(user => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.7rem;">
                            ${user.avatar || user.firstName[0] + user.lastName[0]}
                        </div>
                        <div>
                            <strong>${user.firstName} ${user.lastName}</strong>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="status status-${user.role === 'admin' ? 'active' : user.role === 'instructor' ? 'pending' : 'completed'}">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </td>
                <td><span class="status status-active">Active</span></td>
                <td>${user.createdAt}</td>
                <td>
                    <button class="action-btn" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteUserConfirm('${user.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Load quick approvals table
    loadQuickApprovals();
}

function updatePendingPaymentsCount() {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const pending = payments.filter(p => p.status === 'pending').length;
    document.getElementById('pendingPayments').textContent = pending;
}

function updateApprovalsBadge() {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const pending = payments.filter(p => p.status === 'pending').length;
    const badge = document.getElementById('pendingApprovalsBadge');
    if (badge) {
        badge.textContent = pending;
    }
}

function loadQuickApprovals() {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const pendingPayments = payments.filter(p => p.status === 'pending').slice(0, 5);
    
    const tableBody = document.getElementById('quickApprovalsTable');
    if (!tableBody) return;
    
    if (pendingPayments.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.5rem;"></i>
                    <p style="margin-top: 0.5rem;">No pending approvals</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = pendingPayments.map(payment => `
        <tr>
            <td><strong>${payment.transactionId}</strong></td>
            <td>${payment.userName}</td>
            <td>${payment.courses.map(c => c.title).join(', ')}</td>
            <td><strong>$${payment.amount.toFixed(2)}</strong></td>
            <td>
                <span class="status status-active">
                    ${payment.method.replace('_', ' ').toUpperCase()}
                </span>
            </td>
            <td>${new Date(payment.timestamp).toLocaleDateString()}</td>
            <td>
                <button class="action-btn success" onclick="approvePayment('${payment.transactionId}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="action-btn danger" onclick="rejectPayment('${payment.transactionId}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// USERS TABLE
// ==========================================
function loadUsersTable() {
    const users = getUsersDB();
    const userList = Object.values(users);
    
    const tableBody = document.getElementById('allUsersTable');
    if (tableBody) {
        tableBody.innerHTML = userList.map(user => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.7rem;">
                            ${user.avatar || user.firstName[0] + user.lastName[0]}
                        </div>
                        <div>
                            <strong>${user.firstName} ${user.lastName}</strong>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="status status-${user.role === 'admin' ? 'active' : user.role === 'instructor' ? 'pending' : 'completed'}">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </td>
                <td><span class="status status-active">Active</span></td>
                <td>${user.createdAt}</td>
                <td>
                    <button class="action-btn" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteUserConfirm('${user.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// ==========================================
// INSTRUCTORS TABLE
// ==========================================
function loadInstructorsTable() {
    const users = getUsersDB();
    const instructors = Object.values(users).filter(u => u.role === 'instructor');
    
    const tableBody = document.getElementById('instructorsTable');
    if (tableBody) {
        tableBody.innerHTML = instructors.map(inst => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.7rem;">
                            ${inst.avatar || inst.firstName[0] + inst.lastName[0]}
                        </div>
                        <div>
                            <strong>${inst.firstName} ${inst.lastName}</strong>
                        </div>
                    </div>
                </td>
                <td>${inst.specialization || 'N/A'}</td>
                <td>${inst.totalCourses || 0}</td>
                <td>${inst.totalStudents || 0}</td>
                <td>
                    <div style="color: #f59e0b;">
                        ${'★'.repeat(Math.floor(inst.rating || 0))}${(inst.rating || 0) % 1 >= 0.5 ? '½' : ''}
                        ${inst.rating || 0}
                    </div>
                </td>
                <td>
                    <button class="action-btn" onclick="editUser('${inst.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteUserConfirm('${inst.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// ==========================================
// COURSES TABLE
// ==========================================
function loadCoursesTable() {
    const tableBody = document.getElementById('coursesTable');
    if (!tableBody) return;

    if (!coursesData || coursesData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-secondary);">No courses found</td></tr>`;
        return;
    }

    tableBody.innerHTML = coursesData.map(course => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 30px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 4px; display:flex; align-items:center; justify-content:center; color:white; font-size:0.8rem;">
                        <i class="fas ${course.icon || 'fa-book'}"></i>
                    </div>
                    <strong>${course.title}</strong>
                </div>
            </td>
            <td>${course.instructor.name}</td>
            <td>${course.categoryName}</td>
            <td>${course.students.toLocaleString()}</td>
            <td>$${course.price.toFixed(2)}</td>
            <td><span class="status status-active">Active</span></td>
            <td>
                <button class="action-btn"><i class="fas fa-edit"></i></button>
                <button class="action-btn danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// PAYMENT APPROVALS
// ==========================================
function loadPaymentApprovals() {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const pendingPayments = payments.filter(p => p.status === 'pending');
    
    // Update pending count
    const pendingCount = document.getElementById('pendingCount');
    if (pendingCount) {
        pendingCount.textContent = `${pendingPayments.length} Pending`;
    }
    
    // Load table
    const tableBody = document.getElementById('approvalsTable');
    const noApprovals = document.getElementById('noApprovals');
    
    if (pendingPayments.length === 0) {
        if (tableBody) tableBody.innerHTML = '';
        if (noApprovals) noApprovals.style.display = 'block';
        updateApprovalsBadge();
        return;
    }
    
    if (noApprovals) noApprovals.style.display = 'none';
    
    if (tableBody) {
        tableBody.innerHTML = pendingPayments.map(payment => `
            <tr>
                <td><strong>${payment.transactionId}</strong></td>
                <td>${payment.userName}<br><small style="color: var(--text-secondary);">${payment.userId}</small></td>
                <td>
                    ${payment.courses.map(c => `<div style="font-size: 0.85rem; margin-bottom: 0.25rem;">• ${c.title} ($${c.price})</div>`).join('')}
                </td>
                <td><strong>$${payment.amount.toFixed(2)}</strong></td>
                <td>
                    <span class="status status-active">
                        ${payment.method.replace('_', ' ').toUpperCase()}
                    </span>
                </td>
                <td>${new Date(payment.timestamp).toLocaleDateString()}<br><small style="color: var(--text-secondary);">${new Date(payment.timestamp).toLocaleTimeString()}</small></td>
                <td><span class="status status-pending">Pending</span></td>
                <td>
                    <button class="action-btn success" onclick="approvePayment('${payment.transactionId}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn danger" onclick="rejectPayment('${payment.transactionId}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                    <button class="action-btn" onclick="viewPaymentDetails('${payment.transactionId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    updateApprovalsBadge();
}

function approvePayment(transactionId) {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const paymentIndex = payments.findIndex(p => p.transactionId === transactionId);
    
    if (paymentIndex === -1) return;
    
    if (confirm(`Approve payment ${transactionId}?\n\nThis will grant the student access to the purchased courses.`)) {
        // Update payment status
        payments[paymentIndex].status = 'approved';
        payments[paymentIndex].approved = true;
        payments[paymentIndex].approvedBy = currentUser.email;
        payments[paymentIndex].approvedAt = new Date().toISOString();
        localStorage.setItem('learniaPayments', JSON.stringify(payments));
        
        // Add courses to student's enrolled list
        const payment = payments[paymentIndex];
        if (payment.userId) {
            const users = getUsersDB();
            const user = Object.values(users).find(u => u.email === payment.userId);
            
            if (user && user.role === 'student') {
                // Remove from pending
                const pendingKey = `learaniaPending_${user.email}`;
                const pending = JSON.parse(localStorage.getItem(pendingKey)) || [];
                
                payment.courses.forEach(course => {
                    // Remove from pending
                    const pendingIndex = pending.indexOf(course.id);
                    if (pendingIndex > -1) pending.splice(pendingIndex, 1);
                    
                    // Add to enrolled
                    if (!user.enrolledCourses) user.enrolledCourses = [];
                    if (!user.enrolledCourses.includes(course.id)) {
                        user.enrolledCourses.push(course.id);
                    }
                });
                
                localStorage.setItem(pendingKey, JSON.stringify(pending));
                
                // Update user in database
                users[user.email] = user;
                saveUsersDB(users);
                
                // Update session if this is the current user
                const sessionUser = JSON.parse(sessionStorage.getItem('learniaCurrentUser'));
                if (sessionUser && sessionUser.email === user.email) {
                    sessionUser.enrolledCourses = user.enrolledCourses;
                    sessionStorage.setItem('learniaCurrentUser', JSON.stringify(sessionUser));
                }
            }
        }
        
        showToast('Payment approved! Student can now access courses.', 'success');
        loadPaymentApprovals();
        loadQuickApprovals();
        loadDashboardStats();
    }
}

function rejectPayment(transactionId) {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const paymentIndex = payments.findIndex(p => p.transactionId === transactionId);
    
    if (paymentIndex === -1) return;
    
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
        payments[paymentIndex].status = 'rejected';
        payments[paymentIndex].rejectionReason = reason.trim();
        payments[paymentIndex].rejectedBy = currentUser.email;
        payments[paymentIndex].rejectedAt = new Date().toISOString();
        localStorage.setItem('learniaPayments', JSON.stringify(payments));
        
        // Remove from pending enrollments
        const payment = payments[paymentIndex];
        if (payment.userId) {
            const pendingKey = `learaniaPending_${payment.userId}`;
            const pending = JSON.parse(localStorage.getItem(pendingKey)) || [];
            payment.courses.forEach(course => {
                const index = pending.indexOf(course.id);
                if (index > -1) pending.splice(index, 1);
            });
            localStorage.setItem(pendingKey, JSON.stringify(pending));
        }
        
        showToast('Payment rejected.', 'error');
        loadPaymentApprovals();
        loadQuickApprovals();
        loadDashboardStats();
    }
}

function viewPaymentDetails(transactionId) {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    const payment = payments.find(p => p.transactionId === transactionId);
    
    if (!payment) return;
    
    const detailsHtml = `
        <div style="text-align: left; line-height: 1.8;">
            <strong>Transaction ID:</strong> ${payment.transactionId}<br>
            <strong>Student:</strong> ${payment.userName}<br>
            <strong>Email:</strong> ${payment.userId}<br>
            <strong>Amount:</strong> $${payment.amount.toFixed(2)}<br>
            <strong>Method:</strong> ${payment.method.replace('_', ' ').toUpperCase()}<br>
            <strong>Status:</strong> ${payment.status.toUpperCase()}<br>
            <strong>Date:</strong> ${new Date(payment.timestamp).toLocaleString()}<br>
            <hr>
            <strong>Courses:</strong><br>
            ${payment.courses.map(c => `• ${c.title} - $${c.price}`).join('<br>')}
            ${payment.rejectionReason ? `<hr><strong>Rejection Reason:</strong><br>${payment.rejectionReason}` : ''}
        </div>
    `;
    
    // Create a simple modal-like alert
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; align-items: center; justify-content: center;';
    overlay.innerHTML = `
        <div style="background: var(--bg-primary); padding: 2rem; border-radius: 16px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="margin: 0;">Payment Details</h3>
                <button style="background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 1.5rem;">&times;</button>
            </div>
            ${detailsHtml}
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('button').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

// ==========================================
// ALL TRANSACTIONS
// ==========================================
function loadAllTransactions(filter = 'all') {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    let filteredPayments = payments;
    
    if (filter !== 'all') {
        filteredPayments = payments.filter(p => p.status === filter);
    }
    
    // Sort by date, newest first
    filteredPayments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const tableBody = document.getElementById('transactionsTable');
    if (tableBody) {
        if (filteredPayments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No transactions found
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = filteredPayments.map(payment => `
            <tr>
                <td><strong>${payment.transactionId}</strong></td>
                <td>${payment.userName}</td>
                <td>${payment.courses.map(c => c.title).join(', ')}</td>
                <td><strong>$${payment.amount.toFixed(2)}</strong></td>
                <td>
                    <span class="status status-active">
                        ${payment.method.replace('_', ' ').toUpperCase()}
                    </span>
                </td>
                <td>${new Date(payment.timestamp).toLocaleDateString()}</td>
                <td>
                    <span class="status status-${payment.status === 'approved' ? 'active' : payment.status === 'pending' ? 'pending' : 'inactive'}">
                        ${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                </td>
                <td>${payment.approvedBy || 'N/A'}</td>
            </tr>
        `).join('');
    }
}

function filterTransactions(filter) {
    document.querySelectorAll('#transactions-page .action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadAllTransactions(filter);
}

// ==========================================
// REPORTS DATA
// ==========================================
function loadReportsData() {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    
    const totalRevenue = payments
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.amount, 0);
    
    const totalTransactions = payments.length;
    const approvedTransactions = payments.filter(p => p.status === 'approved').length;
    const pendingTransactions = payments.filter(p => p.status === 'pending').length;
    
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('approvedTransactions').textContent = approvedTransactions;
    document.getElementById('pendingTransactions').textContent = pendingTransactions;
}

// ==========================================
// USER MANAGEMENT FUNCTIONS
// ==========================================
function openAddUserModal() {
    document.getElementById('newEmail').disabled = false;
    document.getElementById('addUserForm').reset();
    toggleInstructorFields();
    document.getElementById('addUserModal').classList.add('active');
}

function openAddInstructorModal() {
    document.getElementById('newEmail').disabled = false;
    document.getElementById('addUserForm').reset();
    document.getElementById('newRole').value = 'instructor';
    toggleInstructorFields();
    document.getElementById('addUserModal').classList.add('active');
}

function toggleInstructorFields() {
    const role = document.getElementById('newRole').value;
    const instructorFields = document.getElementById('instructorModalFields');
    if (instructorFields) {
        instructorFields.style.display = role === 'instructor' ? 'block' : 'none';
    }
}

function openAddCourseModal() {
    showToast('Add course functionality coming soon', 'info');
}

function addNewUser() {
    const firstName = document.getElementById('newFirstName').value.trim();
    const lastName = document.getElementById('newLastName').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    if (!firstName || !lastName || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    const users = getUsersDB();
    
    if (users[email]) {
        showToast('Email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password,
        role,
        avatar: (firstName[0] + lastName[0]).toUpperCase(),
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null
    };
    
    if (role === 'instructor') {
        newUser.specialization = document.getElementById('newSpecialization')?.value.trim() || '';
        newUser.experience = parseInt(document.getElementById('newExperience')?.value) || 0;
        newUser.rating = 0;
        newUser.totalStudents = 0;
        newUser.totalCourses = 0;
    } else if (role === 'student') {
        newUser.enrolledCourses = [];
        newUser.completedCourses = [];
        newUser.totalHoursLearned = 0;
        newUser.certificates = 0;
    }
    
    users[email] = newUser;
    saveUsersDB(users);
    
    closeModal('addUserModal');
    document.getElementById('addUserForm').reset();
    toggleInstructorFields();
    
    showToast('User added successfully', 'success');
    loadDashboardStats();
    if (document.getElementById('users-page').style.display !== 'none') {
        loadUsersTable();
    }
}

function editUser(email) {
    showToast('Edit user: ' + email, 'info');
    
    const users = getUsersDB();
    const user = users[email];
    if (!user) return;
    
    document.getElementById('newFirstName').value = user.firstName;
    document.getElementById('newLastName').value = user.lastName;
    document.getElementById('newEmail').value = user.email;
    document.getElementById('newEmail').disabled = true;
    document.getElementById('newPassword').value = '';
    document.getElementById('newRole').value = user.role;
    
    // Populate instructor fields if applicable
    if (user.role === 'instructor') {
        const specField = document.getElementById('newSpecialization');
        const expField = document.getElementById('newExperience');
        if (specField) specField.value = user.specialization || '';
        if (expField) expField.value = user.experience || 0;
    }
    
    toggleInstructorFields();
    document.getElementById('addUserModal').classList.add('active');
}

function deleteUserConfirm(email) {
    if (confirm(`Are you sure you want to delete user: ${email}?\n\nThis action cannot be undone.`)) {
        const users = getUsersDB();
        delete users[email];
        saveUsersDB(users);
        showToast('User deleted successfully', 'success');
        loadDashboardStats();
        loadUsersTable();
        loadInstructorsTable();
    }
}

// ==========================================
// USER SEARCH
// ==========================================
const userSearch = document.getElementById('userSearch');
if (userSearch) {
    userSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#allUsersTable tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// ==========================================
// GET USERS DATABASE
// ==========================================
function getUsersDB() {
    try {
        return JSON.parse(localStorage.getItem('learniaUsers')) || {};
    } catch (error) {
        console.error('Error reading users database:', error);
        return {};
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

// ==========================================
// SETTINGS FORM
// ==========================================
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Settings saved successfully', 'success');
    });
}

// ==========================================
// MODAL HANDLERS
// ==========================================
function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
    // Reset email field if it was disabled
    const emailInput = document.getElementById('newEmail');
    if (emailInput) emailInput.disabled = false;
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            const emailInput = document.getElementById('newEmail');
            if (emailInput) emailInput.disabled = false;
        }
    });
});

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    updateApprovalsBadge();
});

// Make functions globally available
window.switchPage = switchPage;
window.openAddUserModal = openAddUserModal;
window.openAddInstructorModal = openAddInstructorModal;
window.openAddCourseModal = openAddCourseModal;
window.addNewUser = addNewUser;
window.editUser = editUser;
window.deleteUserConfirm = deleteUserConfirm;
window.approvePayment = approvePayment;
window.rejectPayment = rejectPayment;
window.viewPaymentDetails = viewPaymentDetails;
window.filterTransactions = filterTransactions;
window.openModal = openModal;
window.closeModal = closeModal;