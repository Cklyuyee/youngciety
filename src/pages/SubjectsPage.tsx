import { useState } from 'react'
import { ArrowRight, Lock, Play, Check } from 'lucide-react'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

const SUBJECTS = [
  { id: 'math',    name: 'คณิตศาสตร์',  en: 'Mathematics' },
  { id: 'thai',    name: 'ภาษาไทย',   en: 'Thai language' },
  { id: 'english', name: 'ภาษาอังกฤษ', en: 'English' },
  { id: 'coding',  name: 'Coding',   en: 'Computational thinking' },
] as const

type SubjectId = typeof SUBJECTS[number]['id']

const LESSON_MAP: Record<SubjectId, { unit: string; lessons: { t: string; done?: boolean; lock?: boolean; current?: boolean }[] }[]> = {
  math: [
    { unit: 'หน่วยที่ 1 · ตัวเลข', lessons: [
      { t: 'นับ 1–10', done: true }, { t: 'นับ 1–20', done: true }, { t: 'เปรียบเทียบจำนวน', done: true },
    ]},
    { unit: 'หน่วยที่ 2 · บวกลบ', lessons: [
      { t: 'บวก 1 หลัก', done: true }, { t: 'ลบ 1 หลัก', done: true },
      { t: 'บวก 2 หลักไม่ทด', current: true }, { t: 'บวก 2 หลักมีทด' },
    ]},
    { unit: 'หน่วยที่ 3 · คูณหาร', lessons: [
      { t: 'สูตรคูณแม่ 2', lock: true }, { t: 'สูตรคูณแม่ 3', lock: true },
    ]},
  ],
  thai: [
    { unit: 'หน่วยที่ 1 · พยัญชนะ', lessons: [
      { t: 'ก ข ค ง ฉ', done: true }, { t: 'ช ซ ฌ ญ ฎ', done: true },
      { t: 'คัดลายมือ ก-ฮ', current: true },
    ]},
    { unit: 'หน่วยที่ 2 · สระและวรรณยุกต์', lessons: [
      { t: 'สระเสียงสั้น', lock: true },
    ]},
  ],
  english: [
    { unit: 'Unit 1 · Phonics', lessons: [
      { t: 'Short A sound', done: true }, { t: 'Short E sound', current: true },
    ]},
  ],
  coding: [
    { unit: 'Unit 1 · ลำดับคำสั่ง', lessons: [
      { t: 'เดินทางให้ถึงดาว', current: true }, { t: 'เลี้ยวซ้าย/ขวา', lock: true },
    ]},
  ],
}

export default function SubjectsPage({ ctx }: { ctx: AppCtx }) {
  const [active, setActive] = useState<SubjectId>('math')
  const units = LESSON_MAP[active]
  const p = ctx.progress[active]

  const goToLesson = () => {
    const routes: Record<SubjectId, string> = {
      math: 'math', coding: 'coding', thai: 'handwriting', english: 'article',
    }
    ctx.navigate(routes[active] as never)
  }

  return (
    <>
      <div className="mb-6">
        <div className="kicker">วิชาเรียน</div>
        <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 0' }}>เลือกวิชา และเริ่มเดินทาง</h1>
      </div>

      {/* Subject tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {SUBJECTS.map(s => {
          const sp = ctx.progress[s.id]
          const isActive = active === s.id
          return (
            <button key={s.id} onClick={() => setActive(s.id)}
              style={{
                padding: 16, textAlign: 'left', cursor: 'pointer',
                background: isActive ? 'var(--surface)' : 'var(--cream-50)',
                border: isActive ? '2px solid var(--rust)' : '1px solid var(--rule)',
                borderRadius: 'var(--r-lg)',
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
              <SubjectGlyph subject={s.id} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}>{s.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>{sp.lessons}/{sp.total} บทเรียน</div>
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
        {/* Lesson list */}
        <div className="col">
          {units.map((u, i) => (
            <section key={i} className="card">
              <div className="between" style={{ marginBottom: 14 }}>
                <div>
                  <div className="kicker">{u.unit}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)', marginTop: 4 }}>
                    {u.lessons.filter(l => l.done).length} / {u.lessons.length} บทเรียนเสร็จแล้ว
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {u.lessons.map((l, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 14px',
                    background: l.current ? 'var(--rust-tint)' : l.lock ? 'transparent' : 'var(--cream-50)',
                    border: l.current ? '1.5px solid var(--rust)' : '1px solid var(--rule)',
                    borderRadius: 'var(--r-md)',
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: l.done ? 'var(--sage)' : l.lock ? 'transparent' : 'var(--surface)',
                      border: l.done ? '1px solid var(--sage)' : l.lock ? '1.5px dashed var(--rule-2)' : '1px solid var(--rule-2)',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      {l.done ? <Check size={16} color="white" /> : l.lock ? <Lock size={14} color="var(--ink-500)" /> : null}
                    </span>
                    <span style={{ flex: 1, fontWeight: l.current ? 600 : 400, color: l.lock ? 'var(--ink-500)' : 'var(--ink-900)' }}>
                      {l.t}
                    </span>
                    {l.current && (
                      <button className="btn btn-primary btn-sm" onClick={goToLesson}>
                        <Play size={12} /> เรียน
                      </button>
                    )}
                    {!l.current && !l.lock && !l.done && (
                      <button className="btn btn-ghost btn-sm">เริ่ม</button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="col">
          <section className="card">
            <div className="kicker">ความคืบหน้า</div>
            <div className="display" style={{ fontSize: 'var(--text-2xl)', margin: '8px 0 12px' }}>
              {Math.round((p.lessons / p.total) * 100)}%
            </div>
            <div className="bar"><i style={{ width: Math.round((p.lessons / p.total) * 100) + '%' }} /></div>
            <hr className="hr" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="stat">
                <span className="v">{p.accuracy}%</span>
                <span className="l">ความแม่นยำ</span>
              </div>
              <div className="stat">
                <span className="v">{p.streak}</span>
                <span className="l">วันต่อกัน</span>
              </div>
            </div>
          </section>
          <section className="card">
            <div className="kicker">ทำต่อจากที่ค้างไว้</div>
            <div className="display" style={{ fontSize: 'var(--text-lg)', margin: '8px 0 6px' }}>บวก 2 หลักไม่ทด</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)', marginBottom: 14 }}>4 / 8 ข้อ</div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={goToLesson}>
              เรียนต่อ <ArrowRight size={14} />
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
