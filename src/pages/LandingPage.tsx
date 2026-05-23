import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, Check, Sparkles, Star, Gamepad2,
  Video, BookOpen, Pencil, Play,
} from 'lucide-react'
import { YungLogo } from '@/components/YungLogo'
import { YungMascot } from '@/components/YungMascot'
import { SubjectGlyph } from '@/components/SubjectGlyph'

/* ── Fade-up animation variant ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0, 0, 0.58, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

/* ── Apple SVG (mini illustration for quiz demo) ── */
function Apple() {
  return (
    <svg viewBox="0 0 24 28" width="30" height="36" aria-hidden="true">
      <path d="M 12 26 C 4 26, 2 18, 4 12 C 6 7, 10 7, 12 9 C 14 7, 18 7, 20 12 C 22 18, 20 26, 12 26 Z"
            fill="var(--rust)" stroke="var(--rust-deep)" strokeWidth=".5" />
      <path d="M 12 9 C 13 5, 16 3, 17 3" stroke="#5C544A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M 15 7 C 17 5, 19 6, 19 8 C 18 9, 16 8.5, 15 7 Z" fill="var(--sage)" />
    </svg>
  )
}

/* ── Interactive quiz mini-demo ── */
function SampleLessonCard() {
  const [answer, setAnswer] = useState<number | null>(null)

  return (
    <div className="yct-lift" style={{ overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--cream-50)',
        borderBottom: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="yct-chip yct-chip-sage">คณิตศาสตร์ · บทที่ 4</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>เป้าหมาย: จำตัวเลขให้คล่อง</span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>2 / 8</span>
      </div>

      {/* Question */}
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          แอปเปิ้ลทั้งหมดมีกี่ลูก?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '26px 0', flexWrap: 'wrap' }}>
          {Array.from({ length: 7 }).map((_, i) => <Apple key={i} />)}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {[5, 6, 7, 8].map(n => (
            <motion.button
              key={n}
              onClick={() => setAnswer(n)}
              whileTap={{ scale: 0.93 }}
              style={{
                width: 64, height: 64,
                borderRadius: 'var(--r-lg)',
                fontFamily: 'var(--yct-display)',
                fontSize: 'var(--text-2xl)',
                background: answer === n ? (n === 7 ? 'var(--sage-soft)' : 'var(--rust-tint)') : 'var(--cream-50)',
                border: answer === n
                  ? `2px solid ${n === 7 ? 'var(--sage)' : 'var(--rust)'}`
                  : '1px solid var(--rule)',
                color: 'var(--ink-900)',
                cursor: 'pointer',
                transition: 'background .15s, border-color .15s',
              }}>
              {n}
            </motion.button>
          ))}
        </div>
        {answer === 7 && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ marginTop: 18, color: 'var(--ok)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
            <Check size={16} /> ถูกต้อง! ได้ +5 ดาว
          </motion.div>
        )}
        {answer != null && answer !== 7 && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ marginTop: 18, color: 'var(--ink-700)', fontSize: 'var(--text-sm)' }}>
            ลองนับใหม่อีกครั้งดูนะ
          </motion.div>
        )}
      </div>

      {/* Card footer */}
      <div style={{ padding: '14px 20px', background: 'var(--cream-50)', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>ตัวอย่างหน้าบทเรียน</span>
        <button className="yct-btn yct-btn-soft yct-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Play size={12} /> เล่นเกมเต็ม
        </button>
      </div>
    </div>
  )
}

/* ── Parent mini report ── */
function ParentMiniReport() {
  const bars = [
    { label: 'คณิตศาสตร์',   v: 78, cls: 'sage',    sub: 'บวกลบ 2 หลัก · คล่องขึ้น' },
    { label: 'ภาษาไทย',      v: 64, cls: 'mustard', sub: 'เริ่มแยกสระเสียงยาวได้' },
    { label: 'ภาษาอังกฤษ',   v: 71, cls: 'sky',     sub: 'อ่านคำพยางค์เดียวคล่อง' },
    { label: 'Coding',       v: 43, cls: 'plum',    sub: 'ฝึก loop ด่านที่ 2 อยู่' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>รายงานสัปดาห์ที่ 21</div>
          <div style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-lg)' }}>น้องอุ๋ม · อายุ 8 ปี</div>
        </div>
        <span className="yct-chip yct-chip-sage">+12% สัปดาห์นี้</span>
      </div>

      <div className="yct-hr" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {bars.map(b => (
          <div key={b.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-900)' }}>{b.label}</span>
                <span style={{ marginLeft: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>{b.sub}</span>
              </div>
              <span style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-md)', color: 'var(--ink-900)' }}>{b.v}%</span>
            </div>
            <div className={`yct-bar ${b.cls}`}>
              <motion.i
                initial={{ width: 0 }}
                whileInView={{ width: `${b.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0, 0, 0.58, 1] }}
                style={{ display: 'block', height: '100%', borderRadius: 999 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--rust-tint)', borderRadius: 'var(--r-md)', border: '1px solid var(--rust-soft)' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--rust-deep)', fontWeight: 600, marginBottom: 4 }}>💡 คำแนะนำสัปดาห์หน้า</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-800)', lineHeight: 1.55 }}>
          น้องอุ๋มเริ่มเข้าใจสระยาว ลองให้อ่านหนังสือ 10 นาที/วัน<br />จะช่วยให้เชื่อมเสียงกับตัวอักษรได้เร็วขึ้น
        </div>
      </div>
    </div>
  )
}

/* ── Hero illustration ── */
function HeroIllustration() {
  return (
    <div style={{ position: 'relative', aspectRatio: '1/1', maxWidth: 520, width: '100%', marginLeft: 'auto', minWidth: 0 }}>
      {/* Organic rust blob background */}
      <div style={{
        position: 'absolute', inset: '8% 0 0 6%',
        background: 'var(--rust-tint)',
        borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
        border: '1px solid var(--rust-soft)',
      }} />
      {/* Sage circle accent */}
      <div style={{
        position: 'absolute', top: '8%', right: '8%',
        width: '30%', aspectRatio: '1',
        background: 'var(--sage-soft)',
        border: '1px solid #C7D6B0',
        borderRadius: '50%',
      }} />
      {/* Mascot centered + bobbing */}
      <div className="yct-bob" style={{ position: 'absolute', inset: '20% 18% 16% 18%', display: 'grid', placeItems: 'center' }}>
        <YungMascot size={260} mood="happy" />
      </div>

      {/* Floating chip — math progress */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
        className="yct-lift yct-pop"
        style={{ position: 'absolute', top: '10%', left: '2%', padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', maxWidth: 220, background: 'var(--surface)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sage-soft)', display: 'grid', placeItems: 'center', color: '#3F5D33', fontFamily: 'var(--yct-display)', fontSize: 'var(--text-md)', flexShrink: 0 }}>+9</div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>คณิตศาสตร์</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>วันนี้เก่งขึ้น</div>
        </div>
      </motion.div>

      {/* Floating chip — streak */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.5 }}
        className="yct-lift yct-pop"
        style={{ position: 'absolute', bottom: '10%', right: '2%', padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--surface)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--mustard-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Star size={18} color="var(--mustard)" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)' }}>Streak</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>7 วันติด</div>
        </div>
      </motion.div>

      {/* Sparkle accents */}
      <Sparkles size={20} color="var(--rust)" style={{ position: 'absolute', top: '35%', right: '10%' }} />
      <Sparkles size={14} color="var(--mustard)" style={{ position: 'absolute', bottom: '26%', left: '12%' }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════════ */
interface LandingPageProps {
  navigate?: (id: string) => void
}

export default function LandingPage({ navigate }: LandingPageProps = {}) {
  const go = (id: string) => navigate?.(id as never)
  const subjects = [
    { id: 'math'    as const, name: 'คณิตศาสตร์',     en: 'Mathematics',          desc: 'ตัวเลข บวกลบคูณหาร เรขาคณิต ตรรกะ', lessons: 240, chip: 'sage' },
    { id: 'thai'    as const, name: 'ภาษาไทย',         en: 'Thai language',         desc: 'พยัญชนะ สระ คำคล้อง คัดลายมือ',       lessons: 180, chip: 'mustard' },
    { id: 'english' as const, name: 'ภาษาอังกฤษ',     en: 'English',              desc: 'Phonics, vocabulary, conversations',   lessons: 200, chip: 'sky' },
    { id: 'coding'  as const, name: 'Coding & Logic',  en: 'Computational thinking', desc: 'ลำดับคำสั่ง เงื่อนไข วงวน',           lessons: 90,  chip: 'plum' },
  ]

  const wayToLearn = [
    { num: '01', name: 'เกม',         icon: Gamepad2, desc: 'เรียนรู้ผ่านการเล่น สนุกแต่ทุกเกมมีตัววัดผลการเรียนรู้ในตัว' },
    { num: '02', name: 'วิดีโอ',       icon: Video,    desc: 'บทเรียนสั้น 3–8 นาที พากย์ไทย ซับอังกฤษ ดูซ้ำได้ไม่จำกัด' },
    { num: '03', name: 'บทความ',       icon: BookOpen,  desc: 'เรื่องอ่านสนุก แบ่งตามระดับการอ่าน มีคำถามท้ายเรื่อง' },
    { num: '04', name: 'แบบฝึกหัด',   icon: Pencil,   desc: 'ดาวน์โหลด PDF หรือฝึกในระบบให้เช็คทันที' },
  ]

  const pricing = [
    { name: 'Free',   price: '0',      per: 'ตลอดไป',     desc: '3 บทเรียนต่อวัน ทุกวิชา',          feats: ['3 บทเรียน/วัน', 'เกมพื้นฐาน', 'ไม่มีโฆษณา'],                                        primary: false },
    { name: 'Family', price: '199',    per: '/เดือน',     desc: 'เด็กได้ 3 คน ผู้ปกครองดูได้',      feats: ['ไม่จำกัดบทเรียน', 'ดาวน์โหลดแบบฝึก PDF', 'รายงานรายสัปดาห์', 'เด็กในบ้าน 3 คน'], primary: true },
    { name: 'School', price: 'ติดต่อ', per: 'ราคาพิเศษ',  desc: 'สำหรับโรงเรียนและสถาบัน',          feats: ['Dashboard ครู', 'Class roster', 'Custom curriculum', 'Onboarding'],                 primary: false },
  ]

  return (
    <div className="yct-grain" style={{ background: 'var(--cream-100)', minHeight: '100vh', fontFamily: 'var(--yct-sans)', color: 'var(--ink-900)' }}>

      {/* ── Sticky Navbar ─────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 40px',
          background: 'rgba(245,239,228,.88)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderBottom: '1px solid var(--rule)',
        }}>
        <YungLogo size={26} />
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { label: 'วิชา', href: '#subjects' },
            { label: 'ตัวอย่างบทเรียน', href: '#sample' },
            { label: 'สำหรับผู้ปกครอง', href: '#parents' },
            { label: 'ราคา', href: '#pricing' },
          ].map(l => (
            <a key={l.label} href={l.href} className="yct-nav-link">{l.label}</a>
          ))}
          <button className="yct-btn yct-btn-ghost yct-btn-sm" onClick={() => go('home')}>เข้าใช้งาน</button>
          <button className="yct-btn yct-btn-primary yct-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => go('home')}>
            เริ่มเรียนฟรี <ArrowRight size={14} />
          </button>
        </nav>
      </motion.header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px 80px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>

          <motion.div variants={stagger} initial="hidden" animate="show" style={{ minWidth: 0 }}>
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <span style={{ color: 'var(--rust)', fontSize: 10 }}>●</span>
              <span className="yct-kicker">เปิดให้ใช้งานแล้ว — รุ่นเบต้า</span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              style={{
                fontFamily: 'var(--yct-display)',
                fontSize: 'clamp(36px, 4.4vw, 56px)',
                fontWeight: 360,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: 0,
                color: 'var(--ink-900)',
                wordBreak: 'keep-all',
                overflowWrap: 'normal',
              }}>
              <span style={{ display: 'inline-block' }}>สังคมแห่งการเรียนรู้</span><br />
              <em style={{ fontStyle: 'italic', color: 'var(--rust)', display: 'inline-block' }}>สำหรับเด็กที่อยากรู้</em>
            </motion.h1>

            <motion.p variants={fadeUp}
              style={{ fontSize: 'var(--text-md)', color: 'var(--ink-700)', maxWidth: 520, marginTop: 24, lineHeight: 1.65 }}>
              Youngciety คือพื้นที่เรียนรู้สำหรับเด็ก 3–12 ปี ที่ออกแบบให้
              <strong> เล่นได้จริง วัดผลได้จริง</strong> ครอบคลุมคณิตศาสตร์ ภาษา
              และทักษะแห่งอนาคต — บนแพลตฟอร์มเดียวที่อ่านง่ายทั้งภาษาไทยและอังกฤษ
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button className="yct-btn yct-btn-primary yct-btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => go('home')}>
                เริ่มต้นฟรี — ไม่ต้องใช้บัตร <ArrowRight size={16} />
              </button>
              <button className="yct-btn yct-btn-ghost yct-btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => go('brand')}>
                <Sparkles size={16} /> ดูระบบดีไซน์
              </button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 24, marginTop: 36, color: 'var(--ink-600)', fontSize: 'var(--text-sm)' }}>
              {['ไม่มีโฆษณา', 'ไทย & อังกฤษ', 'หลักสูตรตามวัย'].map(t => (
                <span key={t} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Check size={14} color="var(--ok)" /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero illustration */}
          <HeroIllustration />
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', background: 'var(--cream-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <span className="yct-kicker" style={{ color: 'var(--ink-600)' }}>ใช้โดยครอบครัวกว่า 8,200 คน · ครู &amp; โรงเรียน 140+ แห่ง</span>
          <div style={{ display: 'flex', gap: 24, color: 'var(--ink-500)', fontFamily: 'var(--yct-display)', fontSize: 'var(--text-md)', letterSpacing: '.02em' }}>
            {['Princess of Naradhiwas Sch.', 'NIST', 'RISE Asia', 'กระทรวง ศธ.'].map((s, i, arr) => (
              <span key={s} style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                {s}{i < arr.length - 1 && <span style={{ color: 'var(--rule-2)' }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subjects grid ─────────────────────────── */}
      <section id="subjects" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px 40px' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, marginBottom: 48 }}>
          <motion.div variants={fadeUp}>
            <div className="yct-kicker" style={{ color: 'var(--rust)', marginBottom: 8 }}>วิชาเรียน</div>
            <h2 style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 360, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, color: 'var(--ink-900)' }}>
              ครอบคลุมทุกวิชาสำคัญ<br />ในวัยกำลังเติบโต
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} style={{ fontSize: 'var(--text-md)', color: 'var(--ink-700)', lineHeight: 1.65, alignSelf: 'end' }}>
            หลักสูตรแต่ละวิชาแบ่งย่อยตามอายุและทักษะ มีทั้งบทเรียน วิดีโอ
            เกม และแบบฝึกหัด ระบบจะปรับความยากให้เหมาะกับเด็กแต่ละคน
            พร้อมรายงานความก้าวหน้าให้ผู้ปกครองทุกสัปดาห์
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {subjects.map(s => (
            <motion.div key={s.id} variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(31,27,22,.10)' }}
              className="yct-lift"
              style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' }}>
              <SubjectGlyph subject={s.id} size={56} />
              <div>
                <div style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-lg)', letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{s.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)', marginTop: 2 }}>{s.en}</div>
              </div>
              <div style={{ color: 'var(--ink-700)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{s.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
                <span className={`yct-chip yct-chip-${s.chip}`}>{s.lessons}+ บทเรียน</span>
                <ArrowRight size={16} color="var(--ink-500)" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Four ways to learn ───────────────────── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px' }}>
        <div className="yct-kicker" style={{ color: 'var(--rust)', textAlign: 'center', marginBottom: 8 }}>วิธีเรียนที่ Youngciety</div>
        <h2 style={{
          fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 360,
          letterSpacing: '-0.02em', lineHeight: 1.1,
          textAlign: 'center', maxWidth: 720, margin: '8px auto 56px',
          color: 'var(--ink-900)',
        }}>
          สี่ทาง สำหรับการเรียนรู้<br />ที่ <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>ติดตัวไปทั้งชีวิต</em>
        </h2>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {wayToLearn.map(w => (
            <motion.div key={w.num} variants={fadeUp} style={{ paddingTop: 8 }}>
              <div style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-md)', color: 'var(--rust)', letterSpacing: '.04em' }}>{w.num}</div>
              <div style={{ height: 1, background: 'var(--rule-2)', margin: '10px 0 18px' }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <w.icon size={20} color="var(--ink-800)" />
                <div style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-lg)', color: 'var(--ink-900)' }}>{w.name}</div>
              </div>
              <div style={{ color: 'var(--ink-700)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{w.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Sample lesson ─────────────────────────── */}
      <section id="sample" style={{ background: 'var(--cream-50)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center' }}>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="yct-kicker" style={{ color: 'var(--rust)', marginBottom: 8 }}>ลองดูเลย</motion.div>
              <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 360, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px', color: 'var(--ink-900)' }}>
                เรียนรู้ที่ <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>วัดผลได้</em><br />ตั้งแต่วันแรก
              </motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'var(--ink-700)', fontSize: 'var(--text-md)', lineHeight: 1.65 }}>
                ไม่ใช่แค่เล่นเสร็จแล้วจบ — ทุกครั้งที่เด็กเรียน ระบบจะบันทึก
                ความถูกต้อง ความเร็ว และจุดที่ติด แล้วประมวลผลให้ครูและ
                ผู้ปกครองเห็นชัดว่าเด็กเข้าใจอะไรแล้ว และต้องช่วยอะไรเพิ่ม
              </motion.p>
              <motion.div variants={fadeUp} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'การคัดลายมือมีระบบเช็คตามเส้นจริงๆ',
                  'เกมแต่ละด่านเชื่อมกับตัวชี้วัดในหลักสูตร',
                  'รายงานรายสัปดาห์ส่งถึงผู้ปกครองอัตโนมัติ',
                ].map(s => (
                  <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Check size={18} color="var(--rust)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: 'var(--ink-800)', fontSize: 'var(--text-base)' }}>{s}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <button className="yct-btn yct-btn-primary yct-btn-lg" style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => go('math')}>
                  ลองเล่นเกมตัวอย่าง <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>

            {/* Interactive quiz card */}
            <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <SampleLessonCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── For parents ───────────────────────────── */}
      <section id="parents" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'center' }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="yct-kicker" style={{ color: 'var(--rust)', marginBottom: 8 }}>สำหรับผู้ปกครอง</motion.div>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 360, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px', color: 'var(--ink-900)' }}>
              เห็นพัฒนาการของลูก<br />ทุกสัปดาห์ ไม่ต้องเดา
            </motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--ink-700)', fontSize: 'var(--text-md)', lineHeight: 1.65, maxWidth: 540 }}>
              Dashboard ผู้ปกครองรายงานเวลาเรียน วิชาที่เด่น ทักษะที่ต้องเสริม
              พร้อมคำแนะนำเป็นภาษาคน — ไม่ใช่กราฟปริศนา
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button className="yct-btn yct-btn-primary" onClick={() => go('parent')}>เปิดดู Dashboard</button>
              <button className="yct-btn yct-btn-ghost" onClick={() => go('worksheets')}>โหลดแบบฝึกหัดฟรี</button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="yct-lift" style={{ padding: 28 }}>
            <ParentMiniReport />
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────── */}
      <section id="pricing" style={{ background: 'var(--cream-50)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="yct-kicker" style={{ color: 'var(--rust)', marginBottom: 8 }}>ราคา</div>
            <h2 style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 360, letterSpacing: '-0.02em', margin: 0, color: 'var(--ink-900)' }}>
              เริ่มฟรี — อัปเกรดเมื่อพร้อม
            </h2>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1080, margin: '0 auto' }}>
            {pricing.map(p => (
              <motion.div key={p.name} variants={fadeUp}
                className="yct-lift"
                style={{
                  padding: 28, position: 'relative',
                  border: p.primary ? '2px solid var(--rust)' : '1px solid var(--rule)',
                }}>
                {p.primary && (
                  <div style={{ position: 'absolute', top: -12, left: 24, background: 'var(--rust)', color: 'white', padding: '4px 12px', borderRadius: 'var(--r-pill)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    ยอดนิยม
                  </div>
                )}
                <div style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-xl)', color: 'var(--ink-900)' }}>{p.name}</div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  {p.price !== 'ติดต่อ' && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-600)' }}>฿</span>}
                  <span style={{ fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{p.price}</span>
                  <span style={{ color: 'var(--ink-600)', fontSize: 'var(--text-sm)' }}>{p.per}</span>
                </div>
                <div style={{ color: 'var(--ink-600)', fontSize: 'var(--text-sm)', marginTop: 8, marginBottom: 18 }}>{p.desc}</div>
                <div className="yct-hr" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.feats.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--ink-800)' }}>
                      <Check size={16} color="var(--rust)" /> {f}
                    </div>
                  ))}
                </div>
                <button
                  className={p.primary ? 'yct-btn yct-btn-primary' : 'yct-btn yct-btn-ghost'}
                  style={{ width: '100%', marginTop: 22 }}>
                  {p.price === 'ติดต่อ' ? 'ติดต่อทีมงาน' : 'เลือกแผนนี้'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <YungLogo size={22} />
            <p style={{ color: 'var(--ink-600)', fontSize: 'var(--text-sm)', marginTop: 14, maxWidth: 320, lineHeight: 1.65 }}>
              Youngciety สร้างขึ้นเพื่อให้เด็กไทยได้เครื่องมือเรียนรู้ที่ดีเท่าเด็กในประเทศที่พัฒนาแล้ว
            </p>
          </div>
          {[
            { h: 'ผลิตภัณฑ์', items: ['วิชาทั้งหมด', 'เกมการศึกษา', 'แบบฝึกหัด', 'บทความ'] },
            { h: 'บริษัท',    items: ['เกี่ยวกับเรา', 'ทีมงาน', 'ติดต่อ', 'ร่วมงาน'] },
            { h: 'ช่วยเหลือ', items: ['FAQ', 'นโยบายความเป็นส่วนตัว', 'ข้อกำหนดการใช้งาน', 'ความปลอดภัยเด็ก'] },
          ].map(col => (
            <div key={col.h}>
              <div className="yct-kicker" style={{ color: 'var(--ink-600)', marginBottom: 14 }}>{col.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(item => (
                  <a key={item} href="#" style={{ color: 'var(--ink-800)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--rust)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-800)')}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', color: 'var(--ink-500)', fontSize: 'var(--text-xs)' }}>
          <span>© 2026 Youngciety Co., Ltd. · กรุงเทพมหานคร</span>
          <span>Made with care, in Thailand 🇹🇭</span>
        </div>
      </footer>

    </div>
  )
}
