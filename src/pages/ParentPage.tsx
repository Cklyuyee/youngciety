import { useState } from 'react'
import { Clock, Check, Sparkles, Flame, Download, Star, ArrowRight } from 'lucide-react'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

const KIDS = [
  { id: 'umm',  name: 'น้องอุ๋ม',  age: 8,  avatar: '🦊', color: 'var(--rust)', time: 178 },
  { id: 'mark', name: 'น้องมาร์ค', age: 11, avatar: '🐼', color: 'var(--sage)', time: 142 },
]

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-700)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} /> {label}
    </span>
  )
}

function WeeklyChart() {
  const days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
  const data: [number, number, number, number][] = [
    [12, 8, 6, 4], [15, 10, 8, 5], [10, 6, 10, 0],
    [18, 12, 5, 8], [14, 8, 12, 6], [20, 16, 10, 12], [22, 14, 8, 10],
  ]
  const max = Math.max(...data.map(d => d.reduce((a, b) => a + b, 0)))
  const colors = ['var(--sage)', 'var(--mustard)', 'var(--sky)', 'var(--plum)']

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 14, alignItems: 'flex-end', height: 200 }}>
        {data.map((d, i) => {
          const sum = d.reduce((a, b) => a + b, 0)
          const h = (sum / max) * 100
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: h + '%', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--rule)' }}>
                {d.map((v, j) => (
                  <div key={j} style={{ flex: v, background: colors[j], minHeight: v > 0 ? 4 : 0 }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 14, marginTop: 8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>
            {d}
            <div style={{ color: 'var(--ink-800)', marginTop: 2 }}>
              {data[i].reduce((a, b) => a + b, 0)}m
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ParentPage({ ctx }: { ctx: AppCtx }) {
  const [kid, setKid] = useState('umm')
  const current = KIDS.find(k => k.id === kid)!

  return (
    <>
      <div className="between mb-5">
        <div>
          <div className="kicker">รายงานผู้ปกครอง</div>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 0' }}>
            พัฒนาการของลูก<br />ในรอบสัปดาห์
          </h1>
        </div>
        <div className="row gap-2">
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} /> ส่งออก PDF
          </button>
          <button className="btn btn-primary btn-sm">ตั้งค่าครอบครัว</button>
        </div>
      </div>

      {/* Kid switcher */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {KIDS.map(k => (
          <button key={k.id} onClick={() => setKid(k.id)}
            style={{
              padding: 14, paddingRight: 22,
              background: kid === k.id ? 'var(--surface)' : 'var(--cream-50)',
              border: kid === k.id ? '2px solid var(--rust)' : '1px solid var(--rule)',
              borderRadius: 'var(--r-lg)', cursor: 'pointer',
              display: 'flex', gap: 12, alignItems: 'center', minWidth: 220,
            }}>
            <div style={{ width: 44, height: 44, fontSize: 26, borderRadius: '50%', background: 'var(--cream-100)', border: '1px solid var(--rule)', display: 'grid', placeItems: 'center' }}>
              {k.avatar}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>{k.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>อายุ {k.age} · เรียน {k.time} นาที</div>
            </div>
          </button>
        ))}
        <button style={{
          padding: 14, background: 'var(--cream-50)', border: '1.5px dashed var(--rule-2)',
          borderRadius: 'var(--r-lg)', cursor: 'pointer',
          display: 'flex', gap: 8, alignItems: 'center', color: 'var(--ink-600)',
        }}>+ เพิ่มเด็ก</button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'เวลาเรียนสัปดาห์นี้', v: `${current.time} นาที`, sub: '+24 จากสัปดาห์ก่อน',    tone: 'var(--ok)', icon: <Clock size={20} color="var(--rust)" /> },
          { l: 'บทเรียนเสร็จ',        v: '32 บท',               sub: 'ครบเป้าหมายรายวัน 6/7 วัน', tone: 'var(--ok)', icon: <Check size={20} color="var(--sage)" /> },
          { l: 'ความแม่นยำเฉลี่ย',     v: '84%',                sub: 'ดีขึ้น 4% จากเดือนก่อน',    tone: 'var(--ok)', icon: <Sparkles size={20} color="var(--mustard)" /> },
          { l: 'Streak',            v: kid === 'umm' ? '7 วัน' : '3 วัน', sub: kid === 'umm' ? 'ดีเยี่ยม!' : 'ขาดไป 2 วัน', tone: kid === 'umm' ? 'var(--ok)' : 'var(--warn)', icon: <Flame size={20} color="var(--rust)" /> },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div className="between" style={{ marginBottom: 10 }}>
              <span style={{ color: 'var(--ink-600)', fontSize: 'var(--text-xs)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{s.l}</span>
              {s.icon}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em' }}>{s.v}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: s.tone, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        <section className="card">
          <div className="between mb-3">
            <div>
              <div className="kicker">เวลาเรียนรายวัน</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginTop: 4 }}>สัปดาห์นี้</div>
            </div>
            <div className="row gap-3" style={{ fontSize: 'var(--text-xs)' }}>
              <LegendDot color="var(--sage)"    label="คณิต" />
              <LegendDot color="var(--mustard)" label="ไทย" />
              <LegendDot color="var(--sky)"     label="อังกฤษ" />
              <LegendDot color="var(--plum)"    label="Coding" />
            </div>
          </div>
          <WeeklyChart />
        </section>

        <section className="card">
          <div className="kicker">คำแนะนำสำหรับผู้ปกครอง</div>
          <div className="col mt-3" style={{ gap: 12 }}>
            {[
              { emoji: '🧩', title: 'ฝึก Coding เพิ่มอีก 10 นาที', body: 'ทักษะลำดับคำสั่งของน้องตามไม่ทันเพื่อน — เกม \'อ้อม\' เหมาะมาก', action: 'เปิดเกม', to: 'coding' as const },
              { emoji: '📚', title: 'อ่านบทความก่อนนอน', body: 'การอ่าน 8 นาทีก่อนนอน 3 วัน/สัปดาห์ ช่วยพัฒนาความเข้าใจ', action: 'ดูบทความ', to: 'library' as const },
              { emoji: '✏️', title: 'คัดลายมือต่อ', body: 'พยัญชนะ ก-ง คัดแล้ว — แนะนำให้ฝึก จ ถึง ฒ ต่อ', action: 'ฝึกคัด', to: 'handwriting' as const },
            ].map((r, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--cream-50)', border: '1px solid var(--rule)', borderRadius: 'var(--r-md)', display: 'flex', gap: 10 }}>
                <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{r.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{r.title}</div>
                  <div style={{ color: 'var(--ink-700)', fontSize: 'var(--text-xs)', lineHeight: 1.5, marginTop: 2 }}>{r.body}</div>
                  <button className="btn btn-soft btn-sm mt-2" onClick={() => ctx.navigate(r.to)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {r.action} <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Subject deep dive */}
      <section className="card mb-5">
        <div className="between mb-4">
          <div>
            <div className="kicker">รายวิชา</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginTop: 4 }}>พัฒนาการแยกตามวิชา</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            ดูรายงานเต็ม <ArrowRight size={12} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            { id: 'math',    name: 'คณิตศาสตร์',  color: 'sage',    tone: 'var(--sage)',    pct: 78, trend: '+12%',
              topics: [{ t: 'บวกลบ 2 หลัก', m: 'คล่อง', l: 'good' }, { t: 'การวัดและเวลา', m: 'เริ่มเข้าใจ', l: 'ok' }, { t: 'เศษส่วน', m: 'ยังไม่เริ่ม', l: 'todo' }] },
            { id: 'thai',    name: 'ภาษาไทย',    color: 'mustard', tone: 'var(--mustard)', pct: 64, trend: '+7%',
              topics: [{ t: 'พยัญชนะ ก-ฮ', m: 'คล่อง', l: 'good' }, { t: 'สระเสียงสั้น', m: 'ดี', l: 'good' }, { t: 'การคัดลายมือ', m: 'ต้องฝึกเพิ่ม', l: 'todo' }] },
            { id: 'english', name: 'ภาษาอังกฤษ', color: 'sky',     tone: 'var(--sky)',     pct: 71, trend: '+9%',
              topics: [{ t: 'Phonics short A', m: 'คล่อง', l: 'good' }, { t: 'Sight words L1', m: 'เริ่มอ่านคล่อง', l: 'ok' }, { t: 'Sentence building', m: 'ยังไม่เริ่ม', l: 'todo' }] },
            { id: 'coding',  name: 'Coding',    color: 'plum',    tone: 'var(--plum)',    pct: 45, trend: '+15%',
              topics: [{ t: 'ลำดับคำสั่ง', m: 'เริ่มได้', l: 'ok' }, { t: 'เงื่อนไข if-else', m: 'ยังไม่เริ่ม', l: 'todo' }, { t: 'วงวน', m: 'ยังไม่เริ่ม', l: 'todo' }] },
          ].map(s => (
            <div key={s.id} style={{ padding: 18, background: 'var(--surface-2)', border: '1px solid var(--rule)', borderRadius: 'var(--r-lg)' }}>
              <div className="between mb-3">
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}>{s.name}</div>
                  <div className="row gap-2 mt-2" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-md)', color: s.tone, fontWeight: 600 }}>{s.pct}%</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ok)' }}>↑ {s.trend}</span>
                  </div>
                </div>
                <SubjectGlyph subject={s.id as any} size={48} />
              </div>
              <div className={`bar ${s.color}`} style={{ marginBottom: 14 }}>
                <i style={{ width: s.pct + '%' }} />
              </div>
              <div className="col" style={{ gap: 6 }}>
                {s.topics.map((tp, i) => (
                  <div key={i} className="between" style={{ fontSize: 'var(--text-sm)' }}>
                    <span>{tp.t}</span>
                    <span style={{
                      color: tp.l === 'good' ? 'var(--ok)' : tp.l === 'ok' ? 'var(--mustard)' : 'var(--ink-500)',
                      fontWeight: 500,
                    }}>{tp.m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity log */}
      <section className="card">
        <div className="between mb-3">
          <div>
            <div className="kicker">กิจกรรมล่าสุด</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginTop: 4 }}>14 รายการ</div>
          </div>
          <select className="btn btn-ghost btn-sm" style={{ padding: '6px 12px' }} defaultValue="week">
            <option value="day">วันนี้</option>
            <option value="week">7 วันที่แล้ว</option>
            <option value="month">30 วันที่แล้ว</option>
          </select>
        </div>
        <div className="col" style={{ gap: 0 }}>
          {[
            { time: 'เมื่อเย็น 18:42', subj: 'math',    chip: 'chip-sage',    label: 'เกม Number Pairs',     detail: 'ได้ 240 คะแนน · ผ่าน 12 คู่',    star: 18 },
            { time: 'เมื่อเย็น 18:14', subj: 'thai',    chip: 'chip-mustard', label: 'คัดพยัญชนะ ก ข ค ง',    detail: 'คะแนน 88/100 · 4 ตัว',           star: 12 },
            { time: 'เมื่อบ่าย 16:30', subj: 'english', chip: 'chip-sky',     label: 'วิดีโอ Phonics A',      detail: 'ดูจนจบ 4:32 · ทำแบบฝึกหัด 5/5',   star: 10 },
            { time: 'เมื่อวาน 19:10',  subj: 'coding',  chip: 'chip-plum',    label: 'เกมเดินทางให้ถึงดาว',    detail: 'ผ่านด่าน 2 · ใช้ 6 คำสั่ง',       star: 15 },
            { time: '2 วันก่อน 17:55',  subj: 'math',    chip: 'chip-sage',    label: 'บทเรียน บวก 2 หลัก',    detail: 'ทบทวน 8 ข้อ · ถูก 7',            star: 8 },
          ].map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px auto 1fr auto', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--rule)' : 'none' }}>
              <span className="muted" style={{ fontSize: 'var(--text-xs)' }}>{a.time}</span>
              <span className={`chip ${a.chip}`}>{{ math: 'คณิต', thai: 'ไทย', english: 'อังกฤษ', coding: 'Coding' }[a.subj]}</span>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{a.label}</div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>{a.detail}</div>
              </div>
              <span className="chip chip-mustard" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} /> +{a.star}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
