import { useState } from 'react'
import { Play, Clock, BookOpen, Video, ArrowRight } from 'lucide-react'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

type Tab = 'video' | 'article'

const SUBJECT_CHIP: Record<string, string> = { math: 'chip-sage', thai: 'chip-mustard', english: 'chip-sky', coding: 'chip-plum' }
const SUBJECT_LABEL: Record<string, string> = { math: 'คณิต', thai: 'ไทย', english: 'อังกฤษ', coding: 'Coding' }

function VideoThumb({ subject }: { subject?: string }) {
  const grad: Record<string, string> = {
    math:    'linear-gradient(135deg, #7C9A6B 0%, #C9D9BB 100%)',
    thai:    'linear-gradient(135deg, #D8A93C 0%, #F5DFA0 100%)',
    english: 'linear-gradient(135deg, #6B89B3 0%, #B8CEE4 100%)',
    coding:  'linear-gradient(135deg, #8B5E83 0%, #C9A8C5 100%)',
    default: 'linear-gradient(135deg, #D97757 0%, #F2C7AD 100%)',
  }
  const bg = grad[subject ?? 'default'] ?? grad.default
  return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'grid', placeItems: 'center' }}>
      {subject && <SubjectGlyph subject={subject as any} size={64} />}
    </div>
  )
}

export default function LibraryPage({ ctx }: { ctx: AppCtx }) {
  const [tab, setTab] = useState<Tab>('video')

  return (
    <>
      <div className="mb-5">
        <div className="kicker">ห้องสมุด</div>
        <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 0' }}>วิดีโอและบทความ</h1>
        <p className="muted" style={{ maxWidth: 600, marginTop: 10 }}>
          สื่อการเรียนรู้ที่จัดทำให้เหมาะสมตามวัย แบ่งหมวดตามวิชาและทักษะ
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: 'var(--cream-200)', borderRadius: 'var(--r-pill)', marginBottom: 22 }}>
        {[
          { id: 'video' as Tab,   label: 'วิดีโอ',   Icon: Video },
          { id: 'article' as Tab, label: 'บทความ',  Icon: BookOpen },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="btn"
            style={{
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              color: 'var(--ink-900)',
              border: 0,
              boxShadow: tab === t.id ? 'var(--sh-1)' : 'none',
              padding: '8px 16px',
              fontSize: 'var(--text-sm)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <t.Icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Video tab ── */}
      {tab === 'video' && (
        <>
          {/* Featured video */}
          <div className="lift" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr' }}>
              <div className="media-ph" style={{ aspectRatio: '16/9', position: 'relative', borderRadius: 0, borderRight: '1px solid var(--rule)' }}>
                <VideoThumb />
                <button style={{
                  position: 'absolute', inset: 0, margin: 'auto',
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(255,255,255,.92)',
                  border: '1px solid var(--rule)',
                  cursor: 'pointer',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Play size={28} color="var(--rust)" />
                </button>
              </div>
              <div style={{ padding: 28 }}>
                <span className="chip chip-sky">ภาษาอังกฤษ · เริ่มต้น</span>
                <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: '12px 0 8px' }}>
                  Phonics: เสียงสระสั้น A
                </h2>
                <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
                  เรียนรู้เสียงสระ A สั้นในคำง่ายๆ ผ่านเพลงและภาพ พร้อมแบบฝึกหัดต่อท้าย
                </p>
                <div className="row mt-3" style={{ alignItems: 'center', color: 'var(--ink-600)', fontSize: 'var(--text-sm)', gap: 16 }}>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Clock size={14} /> 4:32</span>
                  <span>· เหมาะกับอายุ 5–7</span>
                </div>
                <button className="btn btn-primary mt-5" onClick={() => ctx.navigate('article')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  เริ่มดู <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Video grid */}
          <div className="tile-grid">
            {[
              { subj: 'math',    title: 'นับ 1-20 พร้อมร้องเพลง',       dur: '3:48' },
              { subj: 'thai',    title: 'พยัญชนะ ก ข ค ง',             dur: '5:12' },
              { subj: 'english', title: 'Animals & sounds',             dur: '4:05' },
              { subj: 'coding',  title: 'อะไรคือลำดับคำสั่ง?',            dur: '6:21' },
              { subj: 'math',    title: 'รูปทรง 2 มิติ',                  dur: '4:40' },
              { subj: 'thai',    title: 'สระเสียงยาว สระเสียงสั้น',       dur: '5:55' },
            ].map((v, i) => (
              <div key={i} className="lift" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => ctx.navigate('article')}>
                <div className="media-ph" style={{ aspectRatio: '16/9', position: 'relative', borderRadius: 0 }}>
                  <VideoThumb subject={v.subj} />
                  <span style={{
                    position: 'absolute', bottom: 8, right: 8,
                    background: 'rgba(31,27,22,.78)', color: 'white',
                    padding: '2px 6px', borderRadius: 4,
                    fontSize: 'var(--text-xs)',
                  }}>{v.dur}</span>
                </div>
                <div style={{ padding: 14 }}>
                  <span className={`chip ${SUBJECT_CHIP[v.subj]}`}>{SUBJECT_LABEL[v.subj]}</span>
                  <div style={{ fontSize: 'var(--text-base)', marginTop: 8, fontWeight: 500 }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Article tab ── */}
      {tab === 'article' && (
        <div className="tile-grid">
          {[
            { subj: 'thai',    title: 'ทำไมต้นไม้จึงเป็นสีเขียว?',       lvl: 'Lv 1 · 4 นาทีอ่าน', excerpt: 'ในใบไม้มีของวิเศษเล็กๆ ที่ทำให้ใบกลายเป็นสีเขียว...' },
            { subj: 'math',    title: 'ตัวเลขในชีวิตประจำวัน',           lvl: 'Lv 2 · 5 นาทีอ่าน', excerpt: 'ลองมองรอบตัว เลขอยู่ทุกที่เลยใช่ไหม?' },
            { subj: 'english', title: 'How birds find their way',       lvl: 'Lv 3 · 6 นาทีอ่าน', excerpt: 'Birds use the sun, the stars, and even Earth\'s magnetism...' },
            { subj: 'coding',  title: 'หุ่นยนต์ทำอะไรได้บ้าง',           lvl: 'Lv 2 · 4 นาทีอ่าน', excerpt: 'หุ่นยนต์ฟังคำสั่งจากคน แต่คนต้องเขียนคำสั่งให้ชัด...' },
            { subj: 'thai',    title: 'สัตว์โลกที่อยู่ตอนกลางคืน',       lvl: 'Lv 2 · 5 นาทีอ่าน', excerpt: 'บางตัวออกหากินตอนกลางคืน เช่น นกฮูก ค้างคาว...' },
            { subj: 'math',    title: 'เลขศูนย์มาจากไหน?',              lvl: 'Lv 3 · 7 นาทีอ่าน', excerpt: 'เลขศูนย์เพิ่งจะมีในประวัติศาสตร์ของมนุษย์เมื่อ...' },
          ].map((a, i) => (
            <div key={i} className="lift" style={{ padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10 }}
              onClick={() => ctx.navigate('article')}>
              <span className={`chip ${SUBJECT_CHIP[a.subj]}`}>{SUBJECT_LABEL[a.subj]}</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', letterSpacing: '-0.01em' }}>{a.title}</div>
              <p style={{ color: 'var(--ink-700)', fontSize: 'var(--text-sm)', margin: 0 }}>{a.excerpt}</p>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', marginTop: 'auto', paddingTop: 8 }}>{a.lvl}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
