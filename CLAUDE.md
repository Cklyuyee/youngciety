# Youngciety — Claude Guidelines

## Project Overview
Youngciety เป็น web platform แยกออกจาก YSC Backoffice โดยสิ้นเชิง  
Design language ได้รับแรงบันดาลใจจาก The Knot — **Bold · Joyful · Modern · Inclusive**

## Tech Stack
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** (config via `@theme` in `src/index.css`)
- Path alias: `@/` → `src/`

## Design Tokens
ทุก token อยู่ใน **`src/index.css` `@theme` block** และ **`src/lib/tokens.ts`**  
ห้าม hardcode สีหรือ spacing โดยตรง — ให้ใช้ token เสมอ

| Token prefix | ตัวอย่าง |
|---|---|
| `--color-brand-*` | `bg-brand-pink`, `text-brand-black` |
| `--color-accent-*` | `bg-accent-orange`, `text-accent-sky` |
| `--color-neutral-*` | `text-neutral-600`, `border-neutral-200` |
| `--radius-*` | `rounded-[var(--radius-lg)]` |
| `--shadow-*` | `shadow-[var(--shadow-md)]` |
| `--font-script` | `font-[var(--font-script)]` |

## UI Rules — MANDATORY

### ก่อนแก้ UI
1. ดู components ที่มีอยู่ใน `src/components/ui/` ก่อน
2. ใช้ component จาก `src/components/ui/` — ห้าม build raw HTML ซ้ำ

### Components ที่มีอยู่แล้ว
| ต้องการ | Import จาก |
|---|---|
| Button | `@/components/ui/Button` |
| Input | `@/components/ui/Input` |
| Badge | `@/components/ui/Badge` |
| Card, VendorCard, FeatureCard | `@/components/ui/Card` |

### ห้ามทำ
- ❌ ห้าม `className="text-[#FF3EAB]"` — ใช้ `text-brand-pink` แทน
- ❌ ห้าม `border-radius: 20px` inline — ใช้ `rounded-[var(--radius-xl)]`
- ❌ ห้าม raw `<button>` — ใช้ `<Button>` component
- ❌ ห้าม `font-mono` — ไม่ใช้ใน project นี้
- ❌ ห้าม emoji ใน UI component — ใช้ SVG icon แทน (Lucide แนะนำ)

## Folder Structure
```
src/
  components/
    ui/          # Primitive UI components (Button, Input, Badge, Card)
    layout/      # Navbar, Footer, Layout wrappers
    sections/    # Page sections (Hero, Features, Testimonial)
  pages/         # Route-level page components
  hooks/         # Custom React hooks
  lib/
    tokens.ts    # JS design tokens (mirrors CSS @theme)
    cn.ts        # className utility
  assets/        # Images, SVG
```

## Running the project
```bash
npm run dev      # Dev server (Vite HMR)
npm run build    # Production build
npm run preview  # Preview production build
```
