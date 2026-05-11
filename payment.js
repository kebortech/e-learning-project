// ==========================================
// PAYMENT PROCESSING LOGIC
// ==========================================

// Get cart from localStorage
const cart = JSON.parse(localStorage.getItem('learaniaCart')) || [];
const currentUser = JSON.parse(localStorage.getItem('learniaCurrentUser')) || 
                    JSON.parse(sessionStorage.getItem('learniaCurrentUser'));

// Redirect to courses if cart is empty
if (cart.length === 0) {
    window.location.href = 'courses.html';
}

// ==========================================
// STATE
// ==========================================
let selectedPaymentMethod = null;
let currentStep = 1;
let transactionId = '';

// ==========================================
// DOM ELEMENTS
// ==========================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ==========================================
// INITIALIZE ORDER SUMMARY
// ==========================================
function loadOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const finalTotalEl = document.getElementById('finalTotal');
    
    if (!orderItems) return;
    
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = subtotal > 100 ? subtotal * 0.1 : 0; // 10% discount for orders over $100
    const total = subtotal - discount;
    
    orderItems.innerHTML = cart.map((item, index) => `
        <div class="order-item">
            <div class="order-item-image gradient-${(index % 4) + 1}">
                <i class="fas fa-laptop-code"></i>
            </div>
            <div class="order-item-details">
                <div class="order-item-title">${item.title}</div>
                <div class="order-item-price">$${item.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
    if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;
    
    // Update amount displays
    const amountElements = document.querySelectorAll('#telebirrAmount, #cbeTransferAmount, #cbeBirrAmount, #cardAmount');
    amountElements.forEach(el => {
        el.textContent = `$${total.toFixed(2)}`;
    });
    
    return total;
}

const orderTotal = loadOrderSummary();

// ==========================================
// STEP NAVIGATION
// ==========================================
function goToStep(step) {
    currentStep = step;
    
    // Hide all step contents
    document.querySelectorAll('.checkout-step-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current step
    const stepContent = document.getElementById(`step${step}Content`);
    if (stepContent) {
        stepContent.style.display = 'block';
    }
    
    // Update steps indicator
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) {
            el.classList.add('completed');
        } else if (index + 1 === step) {
            el.classList.add('active');
        }
    });
    
    // Show correct payment form in step 2
    if (step === 2 && selectedPaymentMethod) {
        showPaymentForm(selectedPaymentMethod);
    }
    
    // Scroll to top
    window.scrollTo({ top: 100, behavior: 'smooth' });
}

// ==========================================
// PAYMENT METHOD SELECTION
// ==========================================
const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
const continueBtn = document.getElementById('continueToPayment');

paymentMethodInputs.forEach(input => {
    input.addEventListener('change', () => {
        selectedPaymentMethod = input.value;
        if (continueBtn) {
            continueBtn.disabled = false;
        }
        
        // Update card visual selection
        document.querySelectorAll('.payment-method-card').forEach(card => {
            card.classList.remove('selected');
        });
        input.closest('.payment-method-card')?.classList.add('selected');
    });
});

// ==========================================
// SHOW PAYMENT FORM BASED ON METHOD
// ==========================================
function showPaymentForm(method) {
    // Hide all forms
    document.querySelectorAll('#telebirrForm, #cbeForm, #cardForm').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show selected form
    switch(method) {
        case 'telebirr':
            document.getElementById('telebirrForm').style.display = 'block';
            break;
        case 'cbe':
            document.getElementById('cbeForm').style.display = 'block';
            break;
        case 'card':
            document.getElementById('cardForm').style.display = 'block';
            break;
    }
}

// ==========================================
// CBE METHOD TOGGLE
// ==========================================
document.querySelectorAll('.cbe-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.cbe-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const method = option.dataset.cbeMethod;
        document.getElementById('transferContent').style.display = method === 'transfer' ? 'block' : 'none';
        document.getElementById('cbebirrContent').style.display = method === 'cbebirr' ? 'block' : 'none';
    });
});

// ==========================================
// TELEBIRR PAYMENT
// ==========================================
const telebirrForm = document.getElementById('telebirrPaymentForm');
if (telebirrForm) {
    telebirrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('telebirrPhone').value;
        const name = document.getElementById('telebirrName').value;
        const pin = document.getElementById('telebirrPin').value;
        
        if (!phone || !name || !pin) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        // Simulate Telebirr payment processing
        processPayment('telebirr', {
            phone: `+251${phone}`,
            name: name,
            amount: orderTotal
        });
    });
}

// ==========================================
// CBE BANK TRANSFER
// ==========================================
const cbeTransferForm = document.getElementById('cbeTransferForm');
if (cbeTransferForm) {
    cbeTransferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('cbeTransferName').value;
        const account = document.getElementById('cbeTransferAccount').value;
        const ref = document.getElementById('cbeTransferRef').value;
        
        if (!name || !account || !ref) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        processPayment('cbe_transfer', {
            name: name,
            account: account,
            reference: ref,
            amount: orderTotal
        });
    });
}

// ==========================================
// CBE BIRR PAYMENT
// ==========================================
const cbeBirrForm = document.getElementById('cbeBirrForm');
if (cbeBirrForm) {
    cbeBirrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('cbeBirrPhone').value;
        const name = document.getElementById('cbeBirrName').value;
        
        if (!phone || !name) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        processPayment('cbe_birr', {
            phone: `+251${phone}`,
            name: name,
            amount: orderTotal
        });
    });
}

// ==========================================
// CARD PAYMENT
// ==========================================
const cardForm = document.getElementById('cardPaymentForm');
if (cardForm) {
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
            showToast('Please fill all card details', 'error');
            return;
        }
        
        processPayment('card', {
            lastFour: cardNumber.slice(-4),
            name: cardName,
            amount: orderTotal
        });
    });
}

// Format card number
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });
}

// Format expiry date
const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });
}

// ==========================================
// PAYMENT PROCESSING
// ==========================================
function processPayment(method, details) {
    // Generate transaction ID
    transactionId = 'TXN' + Date.now().toString(36).toUpperCase();
    
    // Show loading state
    showToast('Processing payment...', 'info');
    
    // Simulate payment processing delay
    setTimeout(() => {
        // Save payment record
        const paymentRecord = {
            transactionId: transactionId,
            method: method,
            details: details,
            amount: orderTotal,
            courses: cart.map(c => ({ id: c.id, title: c.title, price: c.price })),
            status: 'pending', // pending admin approval
            userId: currentUser ? currentUser.email : 'guest',
            userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest',
            timestamp: new Date().toISOString(),
            approved: false,
            approvedBy: null,
            approvedAt: null
        };
        
        // Save to payments database
        savePayment(paymentRecord);
        
        // Update confirmation step
        document.getElementById('transactionId').textContent = transactionId;
        document.getElementById('confirmAmount').textContent = `$${orderTotal.toFixed(2)}`;
        
        // Go to confirmation step
        goToStep(3);
        
        // Clear cart
        localStorage.setItem('learaniaCart', JSON.stringify([]));
        
        // Update enrolled courses in pending state
        if (currentUser) {
            const pendingKey = `learaniaPending_${currentUser.email}`;
            const pending = JSON.parse(localStorage.getItem(pendingKey)) || [];
            cart.forEach(course => {
                if (!pending.includes(course.id)) {
                    pending.push(course.id);
                }
            });
            localStorage.setItem(pendingKey, JSON.stringify(pending));
        }
        
        showToast('Payment submitted for approval!', 'success');
    }, 2000);
}

// ==========================================
// SAVE PAYMENT RECORD
// ==========================================
function savePayment(record) {
    const payments = JSON.parse(localStorage.getItem('learniaPayments')) || [];
    payments.push(record);
    localStorage.setItem('learniaPayments', JSON.stringify(payments));
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type, 'show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// THEME TOGGLE
// ==========================================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeIcon = themeToggle.querySelector('i');
    function updateIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    updateIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Make functions globally available
window.goToStep = goToStep;