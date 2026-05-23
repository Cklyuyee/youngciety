import type { ReactNode } from 'react'
import {
  Home, Sparkles, BookOpen, Video, FileText,
  Gamepad2, Code2, Pencil, Users, Flame, Star,
} from 'lucide-react'
import { YungLogo } from '@/components/YungLogo'
import { YungMascot } from '@/components/YungMascot'
import type { AppCtx, RouteId } from '@/types/app'

const ROUTES = [
  { id: 'home'        as RouteId, label: 'หน้าหลัก',                 group: 'main',     Icon: Home },
  { id: 'journey'     as RouteId, label: 'ด่านเรียนรู้',                group: 'main',     Icon: Sparkles },
  { id: 'subjects'    as RouteId, label: 'วิชาเรียน',                 group: 'main',     Icon: BookOpen },
  { id: 'library'     as RouteId, label: 'ห้องสมุด',                  group: 'main',     Icon: Video },
  { id: 'worksheets'  as RouteId, label: 'แบบฝึกหัด',                group: 'main',     Icon: FileText },
  { id: 'math'        as RouteId, label: 'เกมคณิต',                  group: 'play',     Icon: Gamepad2 },
  { id: 'coding'      as RouteId, label: 'เกม Coding',               group: 'play',     Icon: Code2 },
  { id: 'handwriting' as RouteId, label: 'ฝึกคัดอักษร',               group: 'practice', Icon: Pencil },
  { id: 'article'     as RouteId, label: 'บทความตัวอย่าง',             group: 'practice', Icon: BookOpen },
  { id: 'parent'      as RouteId, label: 'Dashboard ผู้ปกครอง',       group: 'parent',   Icon: Users },
  { id: 'brand'       as RouteId, label: 'Brand system',             group: 'system',   Icon: Sparkles },
]

const GROUP_LABEL: Record<string, string> = {
  main: 'เรียน', play: 'เล่น', practice: 'ฝึก', parent: 'ผู้ปกครอง', system: 'ระบบดีไซน์',
}

type RouteGroup = 'main' | 'play' | 'practice' | 'parent' | 'system'

interface Props {
  route: RouteId
  navigate: (id: RouteId) => void
  ctx: AppCtx
  children: ReactNode
}

export default function AppShell({ route, navigate, ctx, children }: Props) {
  // Group routes
  const groups: Record<string, typeof ROUTES> = {}
  ROUTES.forEach(r => {
    if (!groups[r.group]) groups[r.group] = []
    groups[r.group].push(r)
  })

  const current = ROUTES.find(r => r.id === route)

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <button
          onClick={() => navigate('landing')}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left', marginBottom: 18 }}
        >
          <YungLogo size={24} />
        </button>

        {/* User card */}
        <div className="card-flat" style={{ padding: 12, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            background: 'var(--rust-tint)',
            display: 'grid', placeItems: 'center', fontSize: 22,
            border: '1px solid var(--rust-soft)', flexShrink: 0,
          }}>{ctx.user.avatar}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ctx.user.name}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>
              อายุ {ctx.user.age} · Lv {ctx.user.level}
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {(Object.entries(groups) as [RouteGroup, typeof ROUTES][]).map(([g, rs]) => (
            <div key={g}>
              <div className="nav-section">{GROUP_LABEL[g]}</div>
              {rs.map(r => (
                <button
                  key={r.id}
                  className={`nav-item${route === r.id ? ' active' : ''}`}
                  onClick={() => navigate(r.id)}
                >
                  <span className="nav-icon"><r.Icon size={16} /></span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Mascot tip */}
        <div style={{ marginTop: 14, padding: 14, background: 'var(--rust-tint)', borderRadius: 'var(--r-lg)', border: '1px solid var(--rust-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <YungMascot size={48} mood="happy" className="bob" />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-800)', lineHeight: 1.35 }}>
              <b style={{ display: 'block', color: 'var(--rust-deep)' }}>วันนี้ทำได้ดีมาก!</b>
              ต่ออีก 1 บทเรียน <br />จะปลดสติกเกอร์ใหม่
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div>
            <div className="kicker" style={{ color: 'var(--ink-500)' }}>
              {GROUP_LABEL[current?.group || ''] || ''}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', letterSpacing: '-0.01em' }}>
              {current?.label}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="chip chip-rust">
              <Flame size={14} /> {ctx.user.streak} วัน
            </span>
            <span className="chip chip-mustard">
              <Star size={14} /> {ctx.user.stars}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('parent')}>
              <Users size={14} /> ผู้ปกครอง
            </button>
          </div>
        </header>

        {/* Page */}
        <div className="page" key={route}>
          {children}
        </div>
      </main>
    </div>
  )
}
