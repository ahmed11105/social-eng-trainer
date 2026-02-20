# 🔌 Plugins & Tools Installed

## ✅ What Just Got Installed

All the best tools for React/Next.js/Tailwind development!

---

## 📦 npm Packages Installed

### Production Dependencies:
1. **clsx** - Conditional className utility
2. **tailwind-merge** - Merge Tailwind classes intelligently
3. **@headlessui/react** - Accessible UI components
4. **framer-motion** - Advanced animations
5. **react-hot-toast** - Toast notifications

### Dev Dependencies:
1. **prettier** - Code formatter
2. **prettier-plugin-tailwindcss** - Auto-sort Tailwind classes

---

## 🛠️ Configuration Files Created

### 1. `.prettierrc` - Prettier Configuration
Auto-formats your code and sorts Tailwind classes!

### 2. `.prettierignore` - Files to Skip
Ignores build files, node_modules, etc.

### 3. `lib/utils.ts` - Utility Functions
Created the `cn()` function for combining classes!

### 4. `.vscode/extensions.json` - Recommended Extensions
VSCode will prompt you to install recommended extensions!

### 5. `.vscode/settings.json` - VSCode Settings
Auto-format on save, Tailwind IntelliSense, etc.

---

## 🚀 How to Use

### 1. Install VSCode Extensions

When you open VSCode, you'll see a popup:
> "This workspace has extension recommendations"

**Click "Install All"** to get:
- Tailwind CSS IntelliSense
- Prettier
- ES7+ React Snippets
- Error Lens
- Auto Rename Tag
- Console Ninja
- ESLint

### 2. Use the `cn()` Utility

**Old way:**
```tsx
className={`btn ${isActive ? 'bg-blue-500' : 'bg-gray-500'} ${isDisabled ? 'opacity-50' : ''}`}
```

**New way:**
```tsx
import { cn } from '@/lib/utils';

className={cn(
  'btn',
  isActive ? 'bg-blue-500' : 'bg-gray-500',
  { 'opacity-50': isDisabled }
)}
```

### 3. Use Headless UI Components

**Example: Dialog/Modal**
```tsx
import { Dialog } from '@headlessui/react';

<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  <Dialog.Panel>
    <Dialog.Title>Title</Dialog.Title>
    Content here
  </Dialog.Panel>
</Dialog>
```

### 4. Use Framer Motion Animations

**Example: Fade in/out**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 5. Use React Hot Toast

**Example: Show toast**
```tsx
import toast, { Toaster } from 'react-hot-toast';

// In your layout
<Toaster position="top-right" />

// Anywhere in your app
toast.success('Achievement unlocked!');
toast.error('Login failed');
toast('Just a message');
```

---

## 📝 VSCode Snippets Available

With ES7+ React Snippets installed, type these shortcuts:

- `rafce` → React Arrow Function Component Export
- `useState` → Auto-import and create useState
- `useEffect` → Auto-import and create useEffect
- `rfc` → React Function Component
- `imp` → Import module

---

## 🎨 Prettier Features

**Auto-formatting on save:**
- Consistent indentation
- Single quotes
- Trailing commas
- **Auto-sorts Tailwind classes!**

**Before:**
```tsx
className="text-white hover:bg-blue-500 p-4 bg-gray-900"
```

**After (auto-sorted):**
```tsx
className="bg-gray-900 p-4 text-white hover:bg-blue-500"
```

---

## 🔧 Tailwind IntelliSense Features

With the VSCode extension:

1. **Autocomplete** - Shows all Tailwind classes as you type
2. **Color Preview** - See colors inline (bg-blue-500 shows blue)
3. **Linting** - Warns about invalid/deprecated classes
4. **Hover Info** - Hover over class to see CSS
5. **Works with cn()** - IntelliSense works inside cn() function!

---

## 📚 Quick Reference

### clsx Examples:
```tsx
clsx('btn', 'active')                    // => 'btn active'
clsx({ 'btn-active': isActive })         // => 'btn-active' if true
clsx('btn', { active: isActive })        // => 'btn active' if true
clsx(['btn', 'active'])                  // => 'btn active'
```

### cn() Examples (clsx + tailwind-merge):
```tsx
cn('p-4', 'p-8')                         // => 'p-8' (conflict resolved)
cn('bg-red-500', 'bg-blue-500')          // => 'bg-blue-500' (last wins)
cn('p-4', props.className)               // props.className can override
```

---

## 🎯 What This Gives You

### Better DX (Developer Experience):
- ✅ Auto-formatting on save
- ✅ Tailwind autocomplete
- ✅ Component snippets
- ✅ Inline error highlighting
- ✅ Auto-rename tags
- ✅ Cleaner className code

### Better UX (User Experience):
- ✅ Accessible components (Headless UI)
- ✅ Smooth animations (Framer Motion)
- ✅ Better notifications (Hot Toast)

### Better Code:
- ✅ Consistent formatting
- ✅ Less verbose classNames
- ✅ Conflict-free Tailwind classes
- ✅ Type-safe utilities

---

## 🚀 Next Steps

1. **Open VSCode** → Install recommended extensions when prompted
2. **Restart VSCode** → Settings take effect
3. **Start using `cn()`** → Import from `@/lib/utils`
4. **Try Prettier** → Save any file and watch it auto-format!
5. **Explore Headless UI** → https://headlessui.com/
6. **Explore Framer Motion** → https://www.framer.com/motion/

---

## 📊 Package Summary

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.7.0",
    "@headlessui/react": "^2.2.0",
    "framer-motion": "^12.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.9"
  }
}
```

---

**Everything is set up and ready to use!** 🎉

Your development experience just got **10x better**! 🚀
