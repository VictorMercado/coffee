# Orbit Coffee - Complete Testing Guide

## 🧪 Testing Checklist

### Public Site Tests

#### Homepage (http://localhost:3000)
- [ ] Page loads without errors
- [ ] Menu items display from database
- [ ] Images show (or placeholder if no image)
- [ ] Category tabs are visible
- [ ] Click each category tab - items filter correctly
- [ ] Prices display correctly
- [ ] Tags display on items (popular, strong, sweet, etc.)

#### Menu Functionality
- [ ] Click "Add to Order" on any item
- [ ] Size selector works (SM/MD/LG for drinks, none for pastries)
- [ ] Price updates when size changes
- [ ] Cart icon shows item count
- [ ] Open cart drawer
- [ ] Verify items in cart
- [ ] Adjust quantities in cart
- [ ] Remove items from cart
- [ ] Cart total calculates correctly

### Admin Authentication Tests

#### Login (http://localhost:3000/admin/login)
- [ ] Page loads with login form
- [ ] Enter email: admin@orbitcoffee.com
- [ ] Enter password: admin123
- [ ] Click "LOGIN"
- [ ] Redirects to /admin/menu-items
- [ ] Sidebar navigation visible
- [ ] Header shows "LOGOUT" button

#### Protected Routes
- [ ] Try accessing /admin/menu-items without login → redirects to login
- [ ] After login, can access all admin pages
- [ ] Logout button works → redirects to homepage

### Menu Items Management Tests

#### List View (/admin/menu-items)
- [ ] Table displays all menu items
- [ ] Shows: name, category, price, status
- [ ] Featured badge shows for featured items
- [ ] Active/Inactive status visible
- [ ] Edit and Delete buttons present

#### Create New Item (/admin/menu-items/new)
- [ ] Form loads with all sections:
  - [ ] Basic Information
  - [ ] Image Upload
  - [ ] Sizes (hidden for pastries)
  - [ ] Tags
  - [ ] Ingredients
  - [ ] Recipe Steps

**Test Create:**
- [ ] Fill in name: "Test Espresso"
- [ ] Fill in description: "A test coffee item"
- [ ] Set base price: 4.00
- [ ] Select category: Classic
- [ ] Check "Active" and "Featured"
- [ ] Upload an image (drag & drop or click)
- [ ] Select sizes: SM, MD, LG
- [ ] Add a tag (create new: "test")
- [ ] Add an ingredient:
  - [ ] Click "ADD INGREDIENT"
  - [ ] Select "Espresso"
  - [ ] Enter quantity: "2 shots"
  - [ ] Check "Optional"
- [ ] Add recipe step:
  - [ ] Click "ADD STEP"
  - [ ] Enter instruction: "Pull espresso shot"
  - [ ] Enter duration: "30 seconds"
  - [ ] Enter temperature: "195°F"
- [ ] Click "CREATE ITEM"
- [ ] Redirects to list page
- [ ] New item appears in table

#### Edit Item
- [ ] Click edit button on any item
- [ ] Form loads with existing data
- [ ] All fields populated correctly
- [ ] Modify name, description, or price
- [ ] Add/remove tags
- [ ] Add/remove ingredients
- [ ] Reorder recipe steps (use up/down arrows)
- [ ] Click "UPDATE ITEM"
- [ ] Changes saved successfully
- [ ] Redirects to list

#### Delete Item
- [ ] Click delete button on an item
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Item marked as inactive (soft delete)
- [ ] Item disappears from public site
- [ ] Item still in database (check Prisma Studio)

### Ingredients Management Tests

#### List View (/admin/ingredients)
- [ ] Table displays all ingredients
- [ ] Shows: name, description, allergens
- [ ] Edit and Delete buttons present

#### Create Ingredient (/admin/ingredients/new)
- [ ] Fill in name: "Test Syrup"
- [ ] Fill in description: "A test syrup"
- [ ] Fill in allergens: "Sugar"
- [ ] Check "Active"
- [ ] Click "CREATE INGREDIENT"
- [ ] Redirects to list
- [ ] New ingredient appears

#### Edit Ingredient
- [ ] Click edit on any ingredient
- [ ] Modify fields
- [ ] Click "UPDATE INGREDIENT"
- [ ] Changes saved

#### Delete Ingredient
- [ ] Click delete on unused ingredient
- [ ] Confirm deletion
- [ ] Ingredient removed
- [ ] Try deleting ingredient in use → should work (soft delete)

### Image Upload Tests

#### Upload Image
- [ ] Create or edit menu item
- [ ] Drag image file to upload area
- [ ] Preview appears
- [ ] Remove image (X button)
- [ ] Click to browse and select image
- [ ] Save menu item
- [ ] Image appears on public site

#### Invalid File
- [ ] Try uploading non-image file (PDF, TXT)
- [ ] Should show error or reject upload

### Recipe Steps Tests

#### Add Steps
- [ ] Add multiple recipe steps
- [ ] Each step has step number
- [ ] Fill in instruction, duration, temperature

#### Reorder Steps
- [ ] Add 3+ steps
- [ ] Click "up" arrow on step 3 → moves to position 2
- [ ] Click "down" arrow → moves down
- [ ] Step numbers auto-update

#### Remove Steps
- [ ] Click delete button on a step
- [ ] Step removed
- [ ] Remaining steps renumber

### Tags Tests

#### Add Existing Tag
- [ ] In menu item form, click "ADD TAG"
- [ ] Select existing tag from dropdown
- [ ] Tag added to menu item

#### Create New Tag
- [ ] Click "ADD TAG"
- [ ] Type new tag name in input
- [ ] Click "CREATE" or press Enter
- [ ] Tag created and added to item
- [ ] Tag available for other items

#### Remove Tag
- [ ] Click X on any tag
- [ ] Tag removed from item (not deleted from system)

### Ingredients Selector Tests

#### Add Ingredient
- [ ] Click "ADD INGREDIENT"
- [ ] Dropdown shows available ingredients
- [ ] Click an ingredient
- [ ] Ingredient added with quantity field

#### Set Quantity
- [ ] Enter quantity: "2 oz", "1 shot", etc.
- [ ] Mark as optional
- [ ] Save menu item
- [ ] Verify saved correctly

#### Remove Ingredient
- [ ] Click X button on ingredient
- [ ] Ingredient removed from item

### Navigation Tests

#### Sidebar Navigation
- [ ] Click "MENU ITEMS" → goes to menu items list
- [ ] Click "INGREDIENTS" → goes to ingredients list
- [ ] Click "TAGS" → not implemented (future feature)
- [ ] Click "SETTINGS" → not implemented (future feature)
- [ ] Active page highlighted in sidebar

### API Tests (Optional - Use curl or Postman)

#### Public Endpoints (No Auth Required)
```bash
# Get all menu items
curl http://localhost:3000/api/menu-items

# Get single menu item
curl http://localhost:3000/api/menu-items/{id}

# Get categories
curl http://localhost:3000/api/categories

# Get sizes
curl http://localhost:3000/api/sizes

# Get ingredients
curl http://localhost:3000/api/ingredients
```

#### Protected Endpoints (Require Admin Login)
```bash
# Create menu item (requires auth cookie from browser)
curl -X POST http://localhost:3000/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","description":"Test","basePrice":5.0,"categoryId":"..."}'
```

### Edge Cases & Error Handling

#### Form Validation
- [ ] Submit empty form → shows validation errors
- [ ] Enter negative price → should reject
- [ ] Enter text in price field → should reject
- [ ] Required fields show error messages

#### Database Errors
- [ ] Duplicate ingredient name → should show error
- [ ] Invalid category ID → should show error

#### Session Handling
- [ ] Logout and try to access admin page → redirects to login
- [ ] Login expires after time → prompts re-login

### Database Verification (Prisma Studio)

Open Prisma Studio to verify data:
```bash
pnpm prisma studio
```

- [ ] Open browser at http://localhost:5555
- [ ] Browse MenuItem table → see all items
- [ ] Browse Ingredient table → see all ingredients
- [ ] Browse Tag table → see all tags
- [ ] Browse User table → see admin user
- [ ] Check MenuItemSize junction table → size relationships
- [ ] Check MenuItemTag junction table → tag relationships
- [ ] Check MenuItemIngredient junction table → ingredient relationships
- [ ] Check RecipeStep table → recipe steps with correct stepNumber

### Performance Tests

#### Page Load Times
- [ ] Public homepage loads in < 2 seconds
- [ ] Admin pages load quickly
- [ ] Form submissions respond quickly
- [ ] Image uploads complete without timeout

#### Large Data Sets
- [ ] Add 20+ menu items
- [ ] List page still performs well
- [ ] Search/filter still fast

### Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

### Mobile Responsiveness

- [ ] Public site responsive on mobile
- [ ] Admin dashboard usable on tablet (not optimized for phone)

## ✅ Success Criteria

All tests should pass with:
- No console errors
- Data persists across page refreshes
- Forms validate correctly
- Images upload and display
- Relationships between data work correctly
- Authentication protects admin routes
- Public site displays database content

## 🐛 Known Limitations

1. **Tags Page** - Not implemented (uses API only)
2. **Settings Page** - Not implemented (placeholder)
3. **Mobile Admin** - Not optimized for phone screens
4. **Bulk Operations** - No bulk delete/edit
5. **Search** - No search functionality yet
6. **Filtering** - No advanced filtering in admin
7. **Pagination** - All items load at once (fine for small datasets)

## 📝 Test Results Template

```
Test Date: _________
Tester: _________

Public Site: ☐ Pass ☐ Fail
Notes: _________________

Authentication: ☐ Pass ☐ Fail
Notes: _________________

Menu Items CRUD: ☐ Pass ☐ Fail
Notes: _________________

Ingredients CRUD: ☐ Pass ☐ Fail
Notes: _________________

Image Upload: ☐ Pass ☐ Fail
Notes: _________________

Overall Status: ☐ Ready for Production ☐ Needs Work
```
