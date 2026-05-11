// coursesData is defined in data.js (loaded before this script)

// ==========================================
// STATE MANAGEMENT
// ==========================================
let cart = JSON.parse(localStorage.getItem('learaniaCart')) || [];
let enrolledCourses = JSON.parse(localStorage.getItem('learaniaEnrolled')) || [];
let wishlist = JSON.parse(localStorage.getItem('learaniaWishlist')) || [];
let currentView = 'grid';
let currentPage = 1;
const coursesPerPage = 6;

const currentUser = JSON.parse(localStorage.getItem('learniaCurrentUser')) || JSON.parse(sessionStorage.getItem('learniaCurrentUser'));

function getPendingEnrollments() {
    if (!currentUser) return [];
    const pendingKey = `learaniaPending_${currentUser.email}`;
    return JSON.parse(localStorage.getItem(pendingKey)) || [];
}

// ==========================================
// DOM ELEMENTS
// ==========================================
const coursesGrid = document.getElementById('coursesGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDiscount = document.getElementById('cartDiscount');
const cartDiscountRow = document.getElementById('cartDiscountRow');
const cartCount = document.getElementById('cartCount');
const cartFooter = document.getElementById('cartFooter');
const cartItemCount = document.getElementById('cartItemCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const courseModal = document.getElementById('courseModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const courseSearch = document.getElementById('courseSearch');
const categoryFilter = document.getElementById('categoryFilter');
const levelFilter = document.getElementById('levelFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const noResults = document.getElementById('noResults');
const pagination = document.getElementById('pagination');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');
const showingCount = document.getElementById('showingCount');
const totalCount = document.getElementById('totalCount');
const activeFilters = document.getElementById('activeFilters');

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateCartUI() {
    const totalItems = cart.length;
    if (cartCount) { cartCount.textContent = totalItems; cartCount.style.display = totalItems === 0 ? 'none' : 'flex'; }
    if (cartItemCount) cartItemCount.textContent = totalItems;
    
    if (totalItems === 0) {
        if (cartItems) cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i><p>Your cart is empty</p><p style="font-size: 0.85rem; color: var(--text-secondary);">Add courses to get started!</p></div>';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (cartFooter) cartFooter.style.display = 'block';
        if (cartItems) {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image gradient-${(item.id % 4) + 1}"><i class="fas fa-laptop-code"></i></div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-instructor">by ${item.instructor?.name || 'Instructor'}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove from cart"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const discount = subtotal > 100 ? subtotal * 0.1 : 0;
        const total = subtotal - discount;
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        if (cartDiscountRow) cartDiscountRow.style.display = discount > 0 ? 'flex' : 'none';
        if (cartDiscount) cartDiscount.textContent = `-$${discount.toFixed(2)}`;
    }
    localStorage.setItem('learaniaCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
}

function addToCart(course) {
    if (!currentUser) { 
        showToast('Please login to add courses to cart', 'warning'); 
        setTimeout(() => window.location.href = 'login.html', 1500); 
        return; 
    }
    if (currentUser.role !== 'student') {
        showToast('Only students can purchase courses', 'warning');
        return;
    }
    if (enrolledCourses.includes(course.id)) { 
        showToast('You are already enrolled in this course!', 'info'); 
        return; 
    }
    if (getPendingEnrollments().includes(course.id)) { 
        showToast('This course is pending admin approval', 'info'); 
        return; 
    }
    if (cart.find(item => item.id === course.id)) { 
        showToast('Course already in cart!', 'warning'); 
        return; 
    }
    cart.push(course);
    updateCartUI();
    renderCourses();
    showToast(`${course.title} added to cart!`, 'success');
    
    // Open cart automatically
    setTimeout(() => openCart(), 500);
    
    if (cartBtn) { 
        cartBtn.style.transform = 'scale(1.3)'; 
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 300); 
    }
}

function removeFromCart(courseId) {
    cart = cart.filter(item => item.id !== courseId);
    updateCartUI();
    renderCourses();
    showToast('Course removed from cart', 'info');
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your cart?')) { 
        cart = []; 
        updateCartUI(); 
        renderCourses(); 
        showToast('Cart cleared', 'info'); 
    }
}

function toggleWishlist(courseId) {
    if (!currentUser) { showToast('Please login to use wishlist', 'warning'); return; }
    const index = wishlist.indexOf(courseId);
    if (index > -1) { wishlist.splice(index, 1); showToast('Removed from wishlist', 'info'); }
    else { wishlist.push(courseId); showToast('Added to wishlist!', 'success'); }
    localStorage.setItem('learaniaWishlist', JSON.stringify(wishlist));
    renderCourses();
}

// ==========================================
// FILTERING & SEARCH
// ==========================================
function getFilteredCourses() {
    let filtered = [...coursesData];
    const searchTerm = courseSearch ? courseSearch.value.toLowerCase() : '';
    if (searchTerm) filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm) || c.categoryName.toLowerCase().includes(searchTerm) || c.description.toLowerCase().includes(searchTerm));
    if (categoryFilter && categoryFilter.value) filtered = filtered.filter(c => c.category === categoryFilter.value);
    if (levelFilter && levelFilter.value) filtered = filtered.filter(c => c.level === levelFilter.value);
    if (priceFilter && priceFilter.value) {
        switch(priceFilter.value) {
            case 'free': filtered = filtered.filter(c => c.price === 0); break;
            case 'paid': filtered = filtered.filter(c => c.price > 0); break;
            case 'under50': filtered = filtered.filter(c => c.price < 50); break;
            case '50to100': filtered = filtered.filter(c => c.price >= 50 && c.price <= 100); break;
            case 'over100': filtered = filtered.filter(c => c.price > 100); break;
        }
    }
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'newest': filtered.sort((a, b) => b.id - a.id); break;
            case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
            case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
            default: filtered.sort((a, b) => b.students - a.students);
        }
    }
    return filtered;
}

function updateActiveFilters() {
    if (!activeFilters) return;
    let filters = [];
    if (categoryFilter && categoryFilter.value) filters.push({ label: categoryFilter.options[categoryFilter.selectedIndex].text, clear: () => { categoryFilter.value = ''; applyFilters(); } });
    if (levelFilter && levelFilter.value) filters.push({ label: levelFilter.options[levelFilter.selectedIndex].text, clear: () => { levelFilter.value = ''; applyFilters(); } });
    if (priceFilter && priceFilter.value) filters.push({ label: priceFilter.options[priceFilter.selectedIndex].text, clear: () => { priceFilter.value = ''; applyFilters(); } });
    if (courseSearch && courseSearch.value) filters.push({ label: `Search: "${courseSearch.value}"`, clear: () => { courseSearch.value = ''; applyFilters(); } });
    activeFilters.innerHTML = filters.map(f => `<span class="filter-tag">${f.label}<i class="fas fa-times"></i></span>`).join('');
    activeFilters.querySelectorAll('.filter-tag').forEach((tag, i) => tag.addEventListener('click', () => filters[i].clear()));
}

function clearAllFilters() {
    if (courseSearch) courseSearch.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = 'popular';
    currentPage = 1;
    renderCourses();
}

function applyFilters() { currentPage = 1; renderCourses(); }
function filterByCategory(category) { if (categoryFilter) { categoryFilter.value = category; applyFilters(); } }

function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category') && categoryFilter) categoryFilter.value = urlParams.get('category');
    if (urlParams.get('search') && courseSearch) courseSearch.value = urlParams.get('search');
}

// ==========================================
// COURSE RENDERING
// ==========================================
function renderCourses() {
    const filteredCourses = getFilteredCourses();
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;
    const startIndex = (currentPage - 1) * coursesPerPage;
    const coursesToShow = filteredCourses.slice(startIndex, startIndex + coursesPerPage);
    
    if (totalCount) totalCount.textContent = filteredCourses.length;
    if (showingCount) showingCount.textContent = filteredCourses.length === 0 ? 0 : coursesToShow.length;
    
    if (filteredCourses.length === 0) {
        if (coursesGrid) coursesGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        if (pagination) pagination.style.display = 'none';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    if (pagination) pagination.style.display = 'flex';
    
    if (coursesGrid) {
        coursesGrid.className = currentView === 'list' ? 'courses-grid list-view' : 'courses-grid';
        const pendingEnrollments = getPendingEnrollments();
        
        coursesGrid.innerHTML = coursesToShow.map(course => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const isPending = pendingEnrollments.includes(course.id);
            const isInCart = cart.find(item => item.id === course.id);
            const isWishlisted = wishlist.includes(course.id);
            let statusClass = isEnrolled ? 'enrolled' : (isInCart ? 'in-cart' : '');
            
            let actionBtn = '';
            if (isEnrolled) {
                actionBtn = '<button class="add-to-cart-btn enrolled"><i class="fas fa-check"></i> Enrolled</button>';
            } else if (isPending) {
                actionBtn = '<button class="add-to-cart-btn" style="background:#f59e0b;cursor:default;"><i class="fas fa-clock"></i> Pending Approval</button>';
            } else if (isInCart) {
                actionBtn = `<button class="add-to-cart-btn in-cart" onclick="event.stopPropagation();removeFromCart(${course.id})"><i class="fas fa-shopping-cart"></i> In Cart - Remove</button>`;
            } else {
                actionBtn = `<button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(coursesData.find(c=>c.id===${course.id}))"><i class="fas fa-cart-plus"></i> Add to Cart</button>`;
            }
            
            return `<div class="course-card ${statusClass}" onclick="openCourseDetail(${course.id})">
                <div class="course-image"><div class="gradient-bg gradient-${(course.id%4)+1}"><i class="fas fa-laptop-code"></i></div>
                <span class="course-badge badge-${course.badge}">${course.badge.charAt(0).toUpperCase()+course.badge.slice(1)}</span>
                <span class="course-level">${course.level.charAt(0).toUpperCase()+course.level.slice(1)}</span></div>
                <div class="course-body">
                    <div class="course-category">${course.categoryName}</div>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-instructor"><div class="instructor-avatar">${course.instructor.avatar}</div><span>${course.instructor.name}</span></div>
                    <div class="course-meta">
                        <span class="course-rating"><span class="stars-filled">${'★'.repeat(Math.floor(course.rating))}${course.rating%1>=0.5?'½':''}</span><span class="rating-number">${course.rating} (${(course.reviews/1000).toFixed(1)}k)</span></span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-users"></i> ${(course.students/1000).toFixed(1)}k</span>
                    </div>
                    <div class="course-footer" onclick="event.stopPropagation()">
                        <div class="course-price">${course.originalPrice?`<span class="original-price">$${course.originalPrice}</span>`:''}$${course.price}</div>
                        <div class="course-actions">${actionBtn}<button class="wishlist-btn ${isWishlisted?'active':''}" onclick="toggleWishlist(${course.id})" title="Wishlist"><i class="fas fa-heart"></i></button></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }
    renderPagination(totalPages);
    updateActiveFilters();
}

function renderPagination(totalPages) {
    if (!pageNumbers || !prevPage || !nextPage) return;
    if (totalPages <= 1) { if (pagination) pagination.style.display = 'none'; return; }
    if (pagination) pagination.style.display = 'flex';
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
    let pages = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
        pages.push(1);
        let start = Math.max(2, currentPage - 1), end = Math.min(totalPages - 1, currentPage + 1);
        if (currentPage <= 2) end = Math.min(4, totalPages - 1);
        if (currentPage >= totalPages - 1) start = Math.max(totalPages - 3, 2);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }
    pageNumbers.innerHTML = pages.map(p => p === '...' ? '<span class="page-number" style="cursor:default;">...</span>' : `<button class="page-number ${p===currentPage?'active':''}" onclick="goToPage(${p})">${p}</button>`).join('');
}

function goToPage(page) { currentPage = page; renderCourses(); if (coursesGrid) coursesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function changeView(view) { currentView = view; document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view)); renderCourses(); }

// ==========================================
// COURSE DETAIL MODAL
// ==========================================
function openCourseDetail(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course || !modalBody) return;
    const isEnrolled = enrolledCourses.includes(course.id);
    const isPending = getPendingEnrollments().includes(course.id);
    const isInCart = cart.find(item => item.id === course.id);
    const isWishlisted = wishlist.includes(course.id);
    
    modalBody.innerHTML = `
        <div class="modal-course-header">
            <div class="modal-course-image gradient-${(course.id%4)+1}"><i class="fas fa-laptop-code"></i></div>
            <div class="modal-course-info">
                <div class="modal-course-category">${course.categoryName}</div>
                <h2>${course.title}</h2>
                <p class="modal-course-description">${course.description}</p>
                <div class="modal-course-meta">
                    <div class="modal-meta-item"><i class="fas fa-star" style="color:#f59e0b;"></i><div><strong>${course.rating} Rating</strong><span>${(course.reviews/1000).toFixed(1)}k reviews</span></div></div>
                    <div class="modal-meta-item"><i class="fas fa-users"></i><div><strong>${(course.students/1000).toFixed(1)}k Students</strong><span>Enrolled</span></div></div>
                    <div class="modal-meta-item"><i class="fas fa-clock"></i><div><strong>${course.duration}</strong><span>Total length</span></div></div>
                    <div class="modal-meta-item"><i class="fas fa-video"></i><div><strong>${course.lectures} Lectures</strong><span>Video lessons</span></div></div>
                    <div class="modal-meta-item"><i class="fas fa-signal"></i><div><strong>${course.level.charAt(0).toUpperCase()+course.level.slice(1)}</strong><span>Skill level</span></div></div>
                    <div class="modal-meta-item"><i class="fas fa-globe"></i><div><strong>English</strong><span>Language</span></div></div>
                </div>
            </div>
        </div>
        <div class="modal-instructor">
            <div class="modal-instructor-avatar">${course.instructor.avatar}</div>
            <div class="modal-instructor-info"><h4>${course.instructor.name}</h4><p>${course.instructor.title}</p><p style="font-size:0.85rem;margin-top:0.5rem;">${course.instructor.bio}</p></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem;">
            <div><h3 style="margin-bottom:1rem;">What You'll Learn</h3>${course.curriculum.map(i=>`<p style="padding:0.3rem 0;color:var(--text-secondary);font-size:0.9rem;"><i class="fas fa-check" style="color:#10b981;margin-right:0.75rem;"></i>${i}</p>`).join('')}</div>
            <div><h3 style="margin-bottom:1rem;">This Course Includes</h3>${course.includes.map(i=>`<p style="padding:0.3rem 0;color:var(--text-secondary);font-size:0.9rem;"><i class="fas fa-check" style="color:#10b981;margin-right:0.75rem;"></i>${i}</p>`).join('')}</div>
        </div>
        <div class="modal-footer">
            <div class="modal-price-section">${course.originalPrice?`<span class="modal-original-price">$${course.originalPrice}</span>`:''}<span class="modal-price">$${course.price}</span></div>
            <div class="modal-actions">
                ${isEnrolled?'<button class="btn btn-secondary" style="background:#10b981;border-color:#10b981;color:white;cursor:default;"><i class="fas fa-check"></i> Enrolled</button>':
                isPending?'<button class="btn btn-secondary" style="background:#f59e0b;border-color:#f59e0b;color:white;cursor:default;"><i class="fas fa-clock"></i> Pending Approval</button>':
                isInCart?`<button class="btn btn-secondary" onclick="removeFromCart(${course.id});closeModal();"><i class="fas fa-shopping-cart"></i> In Cart - Remove</button><button class="btn btn-primary" onclick="closeModal();openCart();"><i class="fas fa-credit-card"></i> Go to Cart</button>`:
                `<button class="btn btn-primary" onclick="addToCart(coursesData.find(c=>c.id===${course.id}));"><i class="fas fa-cart-plus"></i> Add to Cart</button>`}
                <button class="btn btn-ghost" onclick="toggleWishlist(${course.id})" style="color:${isWishlisted?'#ef4444':''};border-color:${isWishlisted?'#ef4444':''};"><i class="fas fa-heart"></i> ${isWishlisted?'Saved':'Wishlist'}</button>
            </div>
        </div>`;
    
    if (courseModal) { courseModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal() { if (courseModal) { courseModal.classList.remove('active'); document.body.style.overflow = ''; } }

// ==========================================
// CHECKOUT - REDIRECT TO CHECKOUT PAGE
// ==========================================
function checkout() {
    console.log('Checkout clicked! Cart length:', cart.length);
    
    if (cart.length === 0) { 
        showToast('Your cart is empty. Add courses first!', 'warning'); 
        return; 
    }
    
    if (!currentUser) { 
        showToast('Please login to checkout', 'warning'); 
        setTimeout(() => window.location.href = 'login.html', 1500); 
        return; 
    }
    
    if (currentUser.role !== 'student') {
        showToast('Only students can purchase courses', 'warning');
        return;
    }
    
    // Close cart sidebar if open
    closeCart();
    
    // Show processing message
    showToast('Redirecting to secure checkout...', 'info');
    
    // Redirect to checkout page
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

// ==========================================
// CART TOGGLE
// ==========================================
function openCart() { 
    console.log('Opening cart...');
    if (cartSidebar) cartSidebar.classList.add('active'); 
    if (cartOverlay) cartOverlay.classList.add('active'); 
    document.body.style.overflow = 'hidden'; 
}

function closeCart() { 
    if (cartSidebar) cartSidebar.classList.remove('active'); 
    if (cartOverlay) cartOverlay.classList.remove('active'); 
    document.body.style.overflow = ''; 
}

// ==========================================
// AUTH UI
// ==========================================
function updateAuthUI() {
    const signInBtn = document.getElementById('signInBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const navUserName = document.getElementById('navUserName');
    const dashboardLink = document.getElementById('dashboardLink');
    const mobileAuthActions = document.getElementById('mobileAuthActions');
    
    if (currentUser) {
        if (signInBtn) signInBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (mobileAuthActions) mobileAuthActions.style.display = 'none';
        const avatar = currentUser.avatar || (currentUser.firstName?.[0] || '') + (currentUser.lastName?.[0] || '');
        if (navUserAvatar) navUserAvatar.textContent = avatar;
        if (navUserName) navUserName.textContent = currentUser.firstName;
        const roles = { admin: 'admin-dashboard.html', instructor: 'instructor-dashboard.html', student: 'student-dashboard.html' };
        if (dashboardLink) dashboardLink.href = roles[currentUser.role] || 'login.html';
    } else {
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        if (registerBtn) registerBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
        if (mobileAuthActions) mobileAuthActions.style.display = 'flex';
    }
}

function handleLogout() { 
    localStorage.removeItem('learniaCurrentUser'); 
    sessionStorage.removeItem('learniaCurrentUser'); 
    window.location.reload(); 
}

// ==========================================
// EVENT LISTENERS
// ==========================================
if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Cart button clicked!');
        openCart();
    });
}

if (cartClose) cartClose.addEventListener('click', (e) => { e.preventDefault(); closeCart(); });
if (cartOverlay) cartOverlay.addEventListener('click', (e) => { e.preventDefault(); closeCart(); });
if (modalClose) modalClose.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
if (courseModal) courseModal.addEventListener('click', e => { if (e.target === courseModal) closeModal(); });

// CHECKOUT BUTTON - MOST IMPORTANT EVENT LISTENER
if (checkoutBtn) {
    console.log('Checkout button found!');
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Proceed to Checkout clicked!');
        checkout();
    });
} else {
    console.error('Checkout button NOT found!');
}

// Also handle any other checkout buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('#checkoutBtn') || e.target.closest('[data-action="checkout"]')) {
        e.preventDefault();
        checkout();
    }
});

if (courseSearch) courseSearch.addEventListener('input', () => { currentPage = 1; renderCourses(); });
if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
if (levelFilter) levelFilter.addEventListener('change', applyFilters);
if (priceFilter) priceFilter.addEventListener('change', applyFilters);
if (sortFilter) sortFilter.addEventListener('change', applyFilters);
if (prevPage) prevPage.addEventListener('click', () => goToPage(currentPage - 1));
if (nextPage) nextPage.addEventListener('click', () => goToPage(currentPage + 1));

document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') { 
        if (courseModal && courseModal.classList.contains('active')) closeModal(); 
        if (cartSidebar && cartSidebar.classList.contains('active')) closeCart(); 
    } 
});

document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => changeView(btn.dataset.view)));

// User menu dropdown
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', e => { e.stopPropagation(); userDropdown.classList.toggle('show'); });
    document.addEventListener('click', e => { if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) userDropdown.classList.remove('show'); });
}

// ==========================================
// THEME & MOBILE MENU
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    const updateIcon = t => { if (themeIcon) { themeIcon.classList.remove('fa-sun', 'fa-moon'); themeIcon.classList.add(t === 'dark' ? 'fa-moon' : 'fa-sun'); } };
    updateIcon(savedTheme);
    themeToggle.addEventListener('click', () => { const t = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; body.setAttribute('data-theme', t); localStorage.setItem('theme', t); updateIcon(t); });
}

const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => { mobileMenu.classList.toggle('active'); const i = mobileToggle.querySelector('i'); if (i) { i.classList.toggle('fa-bars'); i.classList.toggle('fa-times'); } });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileMenu.classList.remove('active'); const i = mobileToggle.querySelector('i'); if (i) { i.classList.remove('fa-times'); i.classList.add('fa-bars'); } }));
}

// Scroll Progress
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) window.addEventListener('scroll', () => { const p = (document.documentElement.scrollTop || document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100; scrollProgress.style.width = p + '%'; }, { passive: true });

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => { 
    console.log('Courses page loaded!');
    updateAuthUI(); 
    updateCartUI(); 
    handleURLParameters(); 
    renderCourses(); 
    body.classList.add('loaded');
    
    // Debug: Check if checkout button exists
    const btn = document.getElementById('checkoutBtn');
    if (btn) {
        console.log('✅ Checkout button is ready!');
    } else {
        console.error('❌ Checkout button NOT found on page load!');
    }
});

window.addEventListener('focus', () => { 
    const sc = JSON.parse(localStorage.getItem('learaniaCart')) || []; 
    if (JSON.stringify(sc) !== JSON.stringify(cart)) { cart = sc; updateCartUI(); renderCourses(); } 
    const sw = JSON.parse(localStorage.getItem('learaniaWishlist')) || []; 
    if (JSON.stringify(sw) !== JSON.stringify(wishlist)) { wishlist = sw; renderCourses(); } 
    updateAuthUI();
});

// ==========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ==========================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.openCourseDetail = openCourseDetail;
window.closeModal = closeModal;
window.openCart = openCart;
window.closeCart = closeCart;
window.checkout = checkout;
window.goToPage = goToPage;
window.changeView = changeView;
window.applyFilters = applyFilters;
window.clearAllFilters = clearAllFilters;
window.filterByCategory = filterByCategory;
window.handleLogout = handleLogout;
window.scrollToTop = scrollToTop;

console.log('🚀 LearnHub Courses - Ready!');
console.log('📚 2 Premium Courses Available');
console.log('🛒 Checkout button connected to checkout.html');
console.log('💳 Payment flow: Cart → Checkout → Payment → Admin Approval → Access');