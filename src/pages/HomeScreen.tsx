import { useState } from 'react'
import { Play, Flame, Star, ArrowRight, Sparkles, Clock } from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

const SUBJECT_NAMES: Record<string, string> = {
  math: 'คณิตศาสตร์', thai: 'ภาษาไทย', english: 'ภาษาอังกฤษ', coding: 'Coding',
}
const SUBJECT_COLORS: Record<string, string> = {
  math: 'sage', thai: 'mustard', english: 'sky', coding: 'plum',
}

function ProgressRings({ progress }: { progress: AppCtx['progress'] }) {
  const subjects = [
    { id: 'math',    label: 'คณิต',   color: 'var(--sage)' },
    { id: 'thai',    label: 'ไทย',    color: 'var(--mustard)' },
    { id: 'english', label: 'อังกฤษ',  color: 'var(--sky)' },
    { id: 'coding',  label: 'Code',   color: 'var(--plum)' },
  ]
  return (
    <div style={{ padding: '8px 24px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
      {subjects.map(s => {
        const p = progress[s.id]
        const pct = Math.round((p.lessons / p.total) * 100)
        const R = 22, C = 2 * Math.PI * R
        return (
          <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={R} stroke="var(--cream-200)" strokeWidth="6" fill="none" />
              <circle cx="28" cy="28" r={R} stroke={s.color} strokeWidth="6" fill="none"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - pct / 100)}
                strokeLinecap="round"
                transform="rotate(-90 28 28)" />
              <text x="28" y="33" textAnchor="middle" fontSize="13" fontFamily="var(--font-display)" fill="var(--ink-900)">{pct}%</text>
            </svg>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>{p.lessons}/{p.total}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function HomeScreen({ ctx }: { ctx: AppCtx }) {
  const [tasks] = useState([
    { done: true,  subj: 'math',    label: 'นับ 1-20 ให้คล่อง',       mins: 5, gain: 12 },
    { done: true,  subj: 'thai',    label: 'พยัญชนะ ก-ฮ ทบทวน',       mins: 6, gain: 10 },
    { done: false, subj: 'english', label: 'Phonics: short A sound',   mins: 6, gain: 12, route: 'library' },
    { done: false, subj: 'coding',  label: 'เกม: เดินทางให้ถึงดาว',    mins: 7, gain: 15, route: 'coding' },
  ])

  const todayDate = 'วันศุกร์ · 23 พ.ค.'

  return (
    <>
      {/* ── Hero greeting ── */}
      <section className="lift" style={{
        padding: 28,
        background: 'linear-gradient(180deg, var(--rust-tint) 0%, var(--surface) 70%)',
        border: '1px solid var(--rust-soft)',
        display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'center',
        marginBottom: 28,
      }}>
        <div>
          <div className="kicker" style={{ color: 'var(--rust-deep)' }}>{todayDate}</div>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 12px' }}>
            สวัสดี <em style={{ color: 'var(--rust-deep)', fontStyle: 'italic' }}>{ctx.user.name}</em>!<br />
            วันนี้พร้อมเรียนรู้แล้วใช่ไหม?
          </h1>
          <div style={{ display: 'flex', gap: 22, marginTop: 18 }}>
            <div className="stat">
              <span className="v" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame size={22} color="var(--rust)" /> {ctx.user.streak}
              </span>
              <span className="l">วันต่อเนื่อง</span>
            </div>
            <div style={{ width: 1, background: 'var(--rule)' }} />
            <div className="stat">
              <span className="v" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={22} color="var(--mustard)" /> {ctx.user.stars}
              </span>
              <span className="l">ดาวสะสม</span>
            </div>
            <div style={{ width: 1, background: 'var(--rule)' }} />
            <div className="stat">
              <span className="v">Lv {ctx.user.level}</span>
              <span className="l">เลเวล</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary btn-lg" onClick={() => ctx.navigate('math')}>
              <Play size={16} /> เรียนต่อ — บวก 2 หลัก
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => ctx.navigate('subjects')}>
              ดูวิชาทั้งหมด
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <YungMascot size={180} mood="happy" className="bob" />
        </div>
      </section>

      {/* ── Today's plan + Progress ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 28 }}>
        <section className="card">
          <div className="between" style={{ marginBottom: 18 }}>
            <div>
              <div className="kicker">แผนวันนี้</div>
              <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: '4px 0 0' }}>
                4 กิจกรรม · 24 นาที
              </h2>
            </div>
            <span className="chip chip-rust"><Clock size={12} /> เหลือ {tasks.filter(t => !t.done).length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((t, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
                alignItems: 'center', gap: 14,
                padding: '12px 14px',
                background: t.done ? 'var(--cream-50)' : 'var(--surface)',
                border: '1px solid var(--rule)', borderRadius: 'var(--r-md)',
                opacity: t.done ? 0.6 : 1,
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: t.done ? 'var(--sage)' : 'var(--surface)',
                  border: t.done ? '1px solid var(--sage)' : '1.5px solid var(--rule-2)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  {t.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12 L10 18 L20 6" /></svg>}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, textDecoration: t.done ? 'line-through' : 'none', fontSize: 'var(--text-base)' }}>{t.label}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>
                    {SUBJECT_NAMES[t.subj]} · {t.mins} นาที
                  </div>
                </div>
                <span className="chip chip-mustard"><Star size={12} /> +{t.gain}</span>
                {t.done
                  ? <span style={{ width: 80, textAlign: 'right', color: 'var(--ok)', fontSize: 'var(--text-sm)' }}>เสร็จแล้ว</span>
                  : <button className="btn btn-soft btn-sm" onClick={() => ctx.navigate((t.route || t.subj) as never)}>
                      เริ่ม <ArrowRight size={12} />
                    </button>
                }
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 24, paddingBottom: 0 }}>
            <div className="kicker">ความคืบหน้า</div>
            <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: '4px 0 16px' }}>สัปดาห์นี้</h2>
          </div>
          <ProgressRings progress={ctx.progress} />
          <div style={{ padding: '0 24px 24px' }}>
            <hr className="hr" style={{ margin: '8px 0 16px' }} />
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Sparkles size={16} color="var(--rust)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-700)', lineHeight: 1.5 }}>
                คณิตเก่งขึ้น 9% เมื่อคืน! ลองเล่น Coding ต่ออีกหน่อยจะได้สมดุล
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Subjects shortcuts ── */}
      <section style={{ marginBottom: 28 }}>
        <div className="between" style={{ marginBottom: 16 }}>
          <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>วิชาของฉัน</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => ctx.navigate('subjects')}>
            ดูทั้งหมด <ArrowRight size={12} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {(['math', 'thai', 'english', 'coding'] as const).map(id => {
            const p = ctx.progress[id]
            const pct = Math.round((p.lessons / p.total) * 100)
            const route = id === 'math' ? 'math' : id === 'coding' ? 'coding' : id === 'thai' ? 'handwriting' : 'article'
            return (
              <button key={id} onClick={() => ctx.navigate(route as never)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--rule)',
                  borderRadius: 'var(--r-lg)', padding: 18,
                  textAlign: 'left', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                <div className="between">
                  <SubjectGlyph subject={id} size={44} />
                  <span className="chip" style={{ fontSize: 'var(--text-xs)' }}>{p.lessons}/{p.total}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 4 }}>{SUBJECT_NAMES[id]}</div>
                  <div className={`bar ${SUBJECT_COLORS[id]}`}><i style={{ width: pct + '%' }} /></div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginTop: 6 }}>ความแม่นยำ {p.accuracy}%</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Achievements ── */}
      <section className="card">
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: 0 }}>เหรียญใหม่</h2>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)' }}>ปลดล็อค 12 / 48</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {[
            { icon: '🌟', label: 'เริ่มต้น',      unlocked: true },
            { icon: '🧮', label: 'คณิต 7 วัน',   unlocked: true },
            { icon: '📖', label: 'อ่าน 10 บท',    unlocked: true },
            { icon: '✏️', label: 'เขียน ก-ฮ',    unlocked: true },
            { icon: '🚀', label: 'Coding 5 ด่าน', unlocked: false },
            { icon: '🦉', label: 'นักเรียนยอด',   unlocked: false },
          ].map((a, i) => (
            <div key={i} style={{
              background: a.unlocked ? 'var(--cream-50)' : 'transparent',
              border: a.unlocked ? '1px solid var(--rule)' : '1.5px dashed var(--rule-2)',
              borderRadius: 'var(--r-lg)', padding: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: a.unlocked ? 1 : 0.5,
            }}>
              <div style={{
                fontSize: 32, width: 56, height: 56,
                display: 'grid', placeItems: 'center',
                background: a.unlocked ? 'var(--rust-tint)' : 'var(--cream-100)',
                border: '1px solid var(--rule)', borderRadius: '50%',
                filter: a.unlocked ? 'none' : 'grayscale(1)',
              }}>{a.icon}</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-700)', textAlign: 'center' }}>{a.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
