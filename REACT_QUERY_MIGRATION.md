# React Query Migration Status

This document tracks the migration from `useEffect` + `fetch` to React Query (TanStack Query).

## ✅ Completed

### API Client Files Created
- ✅ `lib/client/api/settings.ts` - Settings & sizes CRUD
- ✅ `lib/client/api/categories.ts` - Categories CRUD
- ✅ `lib/client/api/ingredients.ts` - Ingredients CRUD
- ✅ `lib/client/api/tags.ts` - Tags CRUD
- ✅ `lib/client/api/orders.ts` - Orders CRUD
- ✅ `lib/client/api/menu-items.ts` - Menu items CRUD
- ✅ `lib/client/api/auth.ts` - Authentication
- ✅ `lib/client/api/index.ts` - Barrel export

### Components Migrated
- ✅ `app/admin/ingredients/page.tsx` - useQuery for fetch, useMutation for delete
- ✅ `components/admin/ingredient-form.tsx` - useMutation for create/update
- ✅ `components/my-orders-content.tsx` - useQuery for fetching user orders
- ✅ `app/admin/settings/page.tsx` - useQuery + useMutation

## 🚧 In Progress / TODO

### High Priority
- ⏳ `components/admin/sizes-list.tsx` - Update size status mutations
- ⏳ `components/checkout-content.tsx` - Create order mutation
- ⏳ `components/admin/categories-list.tsx` - Category CRUD mutations
- ⏳ `components/admin/tags-list.tsx` - Tags CRUD mutations
- ⏳ `components/admin/menu-items-list.tsx` - Menu items delete mutation
- ⏳ `components/admin/orders-list.tsx` - Update order status mutation
- ⏳ `components/admin/category-form.tsx` - Create/update category mutation
- ⏳ `components/admin/tag-selector.tsx` - Create tag inline mutation
- ⏳ `components/admin/menu-item-form-wrapper.tsx` - Create/update menu item mutations

### Medium Priority
- ⏳ `app/admin/ingredients/[id]/edit/page.tsx` - Fetch single ingredient
- ⏳ `app/signup/page.tsx` - Signup mutation

### Low Priority (Keep as is)
- ✅ `components/providers/settings-provider.tsx` - Uses Zustand persist, works well
- ✅ Existing SSR pages (menu, page.tsx) - Server-side data fetching is optimal

## Benefits Achieved
1. ✅ No more `useEffect` for data fetching
2. ✅ Automatic caching with query keys
3. ✅ Automatic refetching and invalidation
4. ✅ Loading and error states built-in
5. ✅ Optimistic updates available
6. ✅ Centralized API logic in `lib/client/api/`
7. ✅ Better TypeScript types and error handling

## Query Keys Convention
- `["ingredients"]` - All ingredients
- `["ingredient", id]` - Single ingredient
- `["settings"]` - App settings
- `["sizes"]` - All sizes
- `["myOrders"]` - User's orders
- `["categories"]` - All categories
- `["tags"]` - All tags
- `["menuItems"]` - All menu items

## Next Steps
1. Continue migrating remaining components (see TODO list)
2. Add optimistic updates where appropriate
3. Consider adding React Query devtools in development
4. Remove old fetch code comments
5. Test all CRUD operations end-to-end
