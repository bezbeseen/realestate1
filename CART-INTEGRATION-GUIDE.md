# 🛒 Cart Integration Guide

## ✅ What's Ready

You now have a complete cart system that works with your existing website:

### **Files Created:**
- `assets/js/cart.js` - Main cart functionality
- `assets/css/cart.css` - Cart styling  
- `assets/js/product-cart-integration.js` - Product page integration

### **Features:**
- ✅ **localStorage persistence** - Cart survives page refreshes
- ✅ **Works with existing cart button** - No changes to header needed
- ✅ **Quantity selectors** - Users can choose quantity
- ✅ **Bootstrap styling** - Matches your existing design
- ✅ **Mobile responsive** - Works on all devices

---

## 🚀 How to Integrate

### **Step 1: Add CSS to your pages**
Add this line to the `<head>` section of your product pages:

```html
<link rel="stylesheet" href="/assets/css/cart.css">
```

### **Step 2: Add JavaScript to your pages**
Add these lines before the closing `</body>` tag:

```html
<script src="/assets/js/cart.js"></script>
<script src="/assets/js/product-cart-integration.js"></script>
```

### **Step 3: Test on a product page**
Visit any product page (like `/products/prints/business-cards.html`) and you should see:
- "Add to Cart" button with price
- Quantity selector
- Cart icon in header updates when items added

---

## 🎯 Example Integration

Here's how to add to your product page template:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Your existing CSS -->
    <link rel="stylesheet" href="/assets/css/cart.css">
</head>
<body>
    <!-- Your existing content -->
    
    <!-- Add before closing body tag -->
    <script src="/assets/js/cart.js"></script>
    <script src="/assets/js/product-cart-integration.js"></script>
</body>
</html>
```

---

## 🔧 How It Works

### **Cart System:**
- Automatically detects product pages
- Extracts product info from page content
- Adds "Add to Cart" buttons dynamically
- Updates existing cart button in header

### **Product Detection:**
- Gets product ID from URL path
- Extracts name from page title
- Finds price from page content
- Gets image from product gallery

### **Cart Features:**
- Add/remove items
- Update quantities
- Calculate totals
- Persistent storage
- Modal cart display

---

## 🎨 Customization

### **Styling:**
Edit `assets/css/cart.css` to match your brand colors:

```css
/* Change primary color */
.btn-primary {
    background-color: #your-brand-color;
}

/* Change cart modal styling */
#cartModal .modal-content {
    border-radius: 12px;
}
```

### **Product Data:**
The system automatically detects product info, but you can add data attributes for more control:

```html
<div data-product-id="business-cards" data-price="29.99">
    <!-- Product content -->
</div>
```

---

## 🧪 Testing

### **Test Cart Functionality:**
1. Visit any product page
2. Click "Add to Cart"
3. Check cart icon updates
4. Click cart icon to view cart
5. Test quantity changes
6. Test remove items

### **Test Persistence:**
1. Add items to cart
2. Refresh page
3. Cart should still have items
4. Close browser and reopen
5. Cart should still have items

---

## 🚀 Next Steps

### **Phase 2: Stripe Integration**
Once cart is working, we can add:
- Stripe Checkout integration
- Payment processing
- Order confirmation emails

### **Phase 3: Advanced Features**
- Product variants (finishes, sizes)
- Bulk pricing
- Coupon codes
- Wishlist functionality

---

## ❓ Troubleshooting

### **Cart button not appearing:**
- Check if page URL contains `/products/`
- Verify JavaScript files are loaded
- Check browser console for errors

### **Product info not detected:**
- Add `data-product-id` attribute to product container
- Check page structure matches expected format

### **Cart not persisting:**
- Check if localStorage is enabled
- Verify cart.js is loaded before product integration

---

## 📞 Support

The cart system is designed to be simple and self-contained. If you need help:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Test on different product pages

**Ready to test?** Just add the CSS and JS files to your product pages and you're good to go! 🎉 