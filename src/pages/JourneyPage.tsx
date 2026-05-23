import { useState, useMemo } from 'react'
import {
  Lock, Check, Star, Play, ArrowRight,
  BookOpen, Video, Pencil, Gamepad2,
} from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx, RouteId } from '@/types/app'

/* ── Level data per subject ─────────────────────────────── */
type NodeState = 'done' | 'current' | 'locked'
type NodeKind  = 'lesson' | 'game' | 'practice' | 'video' | 'boss'

interface LevelNode { t: string; kind: NodeKind; state: NodeState; goTo?: RouteId }

interface PathData {
  title: string
  colorVar: string
  softVar: string
  darkVar: string
  icon: string
  nodes: LevelNode[]
}

const PATHS: Record<string, PathData> = {
  math: {
    title: 'คณิตศาสตร์ — ตัวเลขและการบวกลบ',
    colorVar: 'var(--sage)', softVar: 'var(--sage-soft)', darkVar: '#3F5D33', icon: 'math',
    nodes: [
      { t: 'นับ 1–10',            kind: 'lesson',   state: 'done' },
      { t: 'นับ 1–20',            kind: 'lesson',   state: 'done' },
      { t: 'เปรียบเทียบจำนวน',     kind: 'practice', state: 'done' },
      { t: 'เกม: จับคู่จำนวน',      kind: 'game',     state: 'done',    goTo: 'math' },
      { t: 'ทบทวน · ด่านกลาง',    kind: 'boss',     state: 'done' },
      { t: 'บวก 1 หลัก',           kind: 'lesson',   state: 'done' },
      { t: 'ลบ 1 หลัก',            kind: 'lesson',   state: 'done' },
      { t: 'วิดีโอ: บวกลบในชีวิต',  kind: 'video',    state: 'done',    goTo: 'library' },
      { t: 'บวก 2 หลักไม่ทด',       kind: 'lesson',   state: 'current', goTo: 'math' },
      { t: 'บวก 2 หลักมีทด',       kind: 'lesson',   state: 'locked' },
      { t: 'เกม: Number Pairs',    kind: 'game',     state: 'locked',  goTo: 'math' },
      { t: 'ด่านใหญ่ · ผู้ช่วยคณิต', kind: 'boss',     state: 'locked' },
      { t: 'ลบ 2 หลัก',            kind: 'lesson',   state: 'locked' },
      { t: 'สูตรคูณแม่ 2',          kind: 'lesson',   state: 'locked' },
    ],
  },
  thai: {
    title: 'ภาษาไทย — พยัญชนะ สระ และการคัด',
    colorVar: 'var(--mustard)', softVar: 'var(--mustard-soft)', darkVar: '#75561A', icon: 'thai',
    nodes: [
      { t: 'พยัญชนะ ก ข ค',      kind: 'lesson',   state: 'done' },
      { t: 'พยัญชนะ ฆ ง จ ฉ',     kind: 'lesson',   state: 'done' },
      { t: 'ฝึกคัด ก-ฉ',          kind: 'practice', state: 'done',    goTo: 'handwriting' },
      { t: 'วิดีโอ: ก ไก่',        kind: 'video',    state: 'done',    goTo: 'library' },
      { t: 'ด่านกลาง · ทดสอบ ก-ฉ', kind: 'boss',     state: 'done' },
      { t: 'พยัญชนะ ช–ญ',         kind: 'lesson',   state: 'current', goTo: 'handwriting' },
      { t: 'ฝึกคัด ช-ญ',          kind: 'practice', state: 'locked',  goTo: 'handwriting' },
      { t: 'พยัญชนะ ฎ–ฒ',         kind: 'lesson',   state: 'locked' },
      { t: 'สระเสียงสั้น',          kind: 'lesson',   state: 'locked' },
      { t: 'สระเสียงยาว',           kind: 'lesson',   state: 'locked' },
      { t: 'ด่านใหญ่ · พยัญชนะ ก-ฮ', kind: 'boss',   state: 'locked' },
    ],
  },
  english: {
    title: 'English — Phonics & first words',
    colorVar: 'var(--sky)', softVar: 'var(--sky-soft)', darkVar: '#345070', icon: 'english',
    nodes: [
      { t: 'Alphabet A–G',      kind: 'lesson',   state: 'done' },
      { t: 'Alphabet H–N',      kind: 'lesson',   state: 'done' },
      { t: 'Trace letters A–N', kind: 'practice', state: 'done',    goTo: 'handwriting' },
      { t: 'Short A sound',     kind: 'lesson',   state: 'current', goTo: 'article' },
      { t: 'Short E sound',     kind: 'lesson',   state: 'locked' },
      { t: 'Video: animals',    kind: 'video',    state: 'locked',  goTo: 'library' },
      { t: 'Boss · Phonics quiz', kind: 'boss',   state: 'locked' },
      { t: 'Sight words 1',     kind: 'lesson',   state: 'locked' },
    ],
  },
  coding: {
    title: 'Coding — คิดเป็นลำดับ',
    colorVar: 'var(--plum)', softVar: 'var(--plum-soft)', darkVar: '#5B3855', icon: 'coding',
    nodes: [
      { t: 'ลำดับคำสั่งคืออะไร',      kind: 'lesson', state: 'done' },
      { t: 'วิดีโอ: หุ่นยนต์ทำได้',    kind: 'video',  state: 'done',    goTo: 'library' },
      { t: 'เกม: เดินตรง',            kind: 'game',   state: 'done',    goTo: 'coding' },
      { t: 'เกม: เลี้ยวซ้ายขวา',       kind: 'game',   state: 'current', goTo: 'coding' },
      { t: 'เกม: อ้อม',               kind: 'game',   state: 'locked',  goTo: 'coding' },
      { t: 'ด่านใหญ่ · เก็บดาวให้ครบ', kind: 'boss',   state: 'locked' },
      { t: 'วงวน',                    kind: 'lesson', state: 'locked' },
    ],
  },
}

const KIND_LABEL: Record<NodeKind, string> = {
  lesson: 'บทเรียน', practice: 'คัดลายมือ', video: 'วิดีโอ', game: 'เกม', boss: 'ด่านใหญ่',
}

function KindIcon({ kind, color = 'white', size = 22 }: { kind: NodeKind; color?: string; size?: number }) {
  const props = { size, color }
  if (kind === 'lesson')   return <BookOpen {...props} />
  if (kind === 'practice') return <Pencil {...props} />
  if (kind === 'video')    return <Video {...props} />
  if (kind === 'game')     return <Gamepad2 {...props} />
  if (kind === 'boss')     return <Star size={size + 4} color={color} />
  return <BookOpen {...props} />
}

function ProgressCurve({ positions, upTo, Vstep, color }: {
  positions: { x: number; y: number }[]
  upTo: number; Vstep: number; color: string
}) {
  if (upTo < 0) return null
  let d = `M ${positions[0].x} ${positions[0].y}`
  for (let i = 1; i <= upTo; i++) {
    const prev = positions[i - 1]
    const p = positions[i]
    d += ` C ${prev.x} ${prev.y + Vstep * 0.55}, ${p.x} ${p.y - Vstep * 0.55}, ${p.x} ${p.y}`
  }
  return <path d={d} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
}

function PathMap({ path, onPick }: { path: PathData; onPick: (n: LevelNode) => void }) {
  const W = 720, Vstep = 130, margin = 80, centerX = W / 2, amplitude = 220

  const positions = useMemo(() => path.nodes.map((_, i) => ({
    x: centerX + Math.sin(i / 2.6) * amplitude,
    y: margin + i * Vstep,
  })), [path.nodes])

  const totalH = margin * 2 + (path.nodes.length - 1) * Vstep

  const curvePath = positions.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = positions[i - 1]
    return acc + ` C ${prev.x} ${prev.y + Vstep * 0.55}, ${p.x} ${p.y - Vstep * 0.55}, ${p.x} ${p.y}`
  }, '')

  const currentIdx = path.nodes.findIndex(n => n.state === 'current')
  const progressEnd = currentIdx === -1 ? path.nodes.length - 1 : currentIdx

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: W, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <path d={curvePath} fill="none"
          stroke={path.colorVar} strokeWidth="14" strokeOpacity=".18"
          strokeLinecap="round" strokeLinejoin="round" />
        <ProgressCurve positions={positions} upTo={progressEnd} Vstep={Vstep} color={path.colorVar} />
      </svg>

      {/* HTML nodes overlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {path.nodes.map((n, i) => {
          const { x, y } = positions[i]
          const isLocked  = n.state === 'locked'
          const isCurrent = n.state === 'current'
          const isDone    = n.state === 'done'
          const isBoss    = n.kind === 'boss'
          const r = isBoss ? 44 : 36

          const bg = isLocked ? 'var(--cream-200)' : isDone ? path.colorVar : 'var(--surface)'
          const border = isLocked
            ? '1px dashed var(--rule-2)'
            : isCurrent ? `3px solid ${path.colorVar}`
            : `2px solid ${path.darkVar}`
          const iconColor = (isDone) ? 'white' : path.darkVar

          return (
            <div key={i} style={{
              position: 'absolute',
              left: `calc(${(x / W) * 100}% - ${r}px)`,
              top: y - r,
              width: r * 2, height: r * 2,
              display: 'grid', placeItems: 'center',
            }}>
              <button
                disabled={isLocked}
                onClick={() => onPick(n)}
                className={isCurrent ? 'pop' : ''}
                style={{
                  position: 'relative',
                  width: r * 2, height: r * 2,
                  borderRadius: '50%',
                  background: bg, border,
                  cursor: isLocked ? 'default' : 'pointer',
                  display: 'grid', placeItems: 'center',
                  transform: isCurrent ? 'translateY(-4px)' : 'none',
                  boxShadow: isCurrent
                    ? `0 8px 24px rgba(31,27,22,.15), 0 0 0 8px ${path.softVar}`
                    : isDone ? `0 4px 0 ${path.darkVar}` : '0 2px 6px rgba(31,27,22,.08)',
                  transition: 'transform .2s',
                }}>
                {isLocked
                  ? <Lock size={20} color="var(--ink-500)" />
                  : isDone
                    ? <Check size={isBoss ? 28 : 24} color="white" />
                    : <KindIcon kind={n.kind} color={iconColor} />
                }

                {/* Boss starburst */}
                {isBoss && !isLocked && (
                  <svg style={{ position: 'absolute', inset: -10, pointerEvents: 'none' }} viewBox="-1 -1 2 2">
                    {Array.from({ length: 12 }).map((_, k) => {
                      const a = (k / 12) * Math.PI * 2
                      return (
                        <line key={k}
                          x1={Math.cos(a) * 0.78} y1={Math.sin(a) * 0.78}
                          x2={Math.cos(a) * 0.95} y2={Math.sin(a) * 0.95}
                          stroke={path.colorVar} strokeWidth=".04" strokeLinecap="round" />
                      )
                    })}
                  </svg>
                )}
              </button>

              {/* Number bubble */}
              <div style={{
                position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                background: isLocked ? 'var(--cream-200)' : path.darkVar,
                color: isLocked ? 'var(--ink-500)' : 'white',
                fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-mono)',
                padding: '1px 6px', borderRadius: 999,
                border: `1px solid ${isLocked ? 'var(--rule-2)' : path.darkVar}`,
              }}>{i + 1}</div>

              {/* Label below */}
              <div style={{
                position: 'absolute', top: r * 2 + 8, left: '50%', transform: 'translateX(-50%)',
                textAlign: 'center', width: 170, pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: path.darkVar, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {KIND_LABEL[n.kind]}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)',
                  color: isLocked ? 'var(--ink-500)' : 'var(--ink-900)', lineHeight: 1.25,
                }}>{n.t}</div>
              </div>

              {/* "Continue" callout */}
              {isCurrent && (
                <div className="pop" style={{
                  position: 'absolute',
                  left: x > W / 2 ? 'auto' : r * 2 + 16,
                  right: x > W / 2 ? r * 2 + 16 : 'auto',
                  top: -4,
                  background: 'var(--ink-900)', color: 'white',
                  padding: '8px 14px 8px 12px', borderRadius: 'var(--r-md)',
                  fontSize: 'var(--text-xs)', fontWeight: 500,
                  whiteSpace: 'nowrap', display: 'flex', gap: 6, alignItems: 'center',
                  pointerEvents: 'none',
                }}>
                  <Play size={12} color="white" /> ทำต่อจากที่นี่
                  <span style={{
                    position: 'absolute', top: '50%',
                    [x > W / 2 ? 'right' : 'left']: -5,
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: 10, height: 10, background: 'var(--ink-900)',
                  }} />
                </div>
              )}

              {/* Mascot on current node */}
              {isCurrent && (
                <div style={{
                  position: 'absolute', top: -r - 28, left: '50%',
                  transform: 'translateX(-50%)', pointerEvents: 'none',
                }} className="bob">
                  <YungMascot size={56} mood="happy" />
                </div>
              )}
            </div>
          )
        })}

        {/* Trophy at end */}
        {(() => {
          const last = positions[positions.length - 1]
          return (
            <div style={{
              position: 'absolute',
              left: `calc(${(last.x / W) * 100}% - 36px)`,
              top: last.y + 92, textAlign: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 'var(--r-lg)',
                background: 'var(--cream-50)', border: '1.5px dashed var(--rule-2)',
                display: 'grid', placeItems: 'center', margin: '0 auto',
              }}>
                <span style={{ fontSize: 28 }}>🏆</span>
              </div>
              <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 8 }}>เป้าหมายปลายทาง</div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default function JourneyPage({ ctx }: { ctx: AppCtx }) {
  const [subject, setSubject] = useState<string>('math')
  const path = PATHS[subject]
  const doneCount = path.nodes.filter(n => n.state === 'done').length
  const subjectLabels: Record<string, string> = { math: 'คณิตศาสตร์', thai: 'ภาษาไทย', english: 'อังกฤษ', coding: 'Coding' }

  return (
    <>
      <div className="between mb-5">
        <div>
          <div className="kicker">ด่านเรียนรู้</div>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 14px', lineHeight: 1.15 }}>
            เดินทางทีละด่าน <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>ปลดล็อคไปเรื่อยๆ</em>
          </h1>
          <p className="muted" style={{ margin: 0, maxWidth: 540 }}>
            เรียนตามลำดับ — ด่านสีจะปลดเมื่อทำด่านก่อนหน้าเสร็จ ระหว่างทางมีบทเรียน เกม วิดีโอ และฝึกคัดสลับกัน
          </p>
        </div>
      </div>

      {/* Subject switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {(Object.entries(PATHS) as [string, PathData][]).map(([id, p]) => {
          const sp = ctx.progress[id]
          const active = subject === id
          return (
            <button key={id} onClick={() => setSubject(id)}
              style={{
                padding: 14, textAlign: 'left', cursor: 'pointer',
                background: active ? 'var(--surface)' : 'var(--cream-50)',
                border: active ? `2px solid ${p.colorVar}` : '1px solid var(--rule)',
                borderRadius: 'var(--r-lg)',
                display: 'flex', gap: 12, alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
              <SubjectGlyph subject={id as never} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', letterSpacing: '-0.01em' }}>
                  {subjectLabels[id]}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginTop: 2 }}>
                  {sp.lessons}/{sp.total} ด่าน
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Path container */}
      <section className="lift" style={{
        padding: '32px 0 64px',
        background: `linear-gradient(180deg, ${path.softVar} 0%, var(--surface) 240px)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(31,27,22,.06) 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px', opacity: .5, pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', padding: '0 32px 28px', textAlign: 'center' }}>
          <div className="kicker" style={{ color: path.darkVar }}>
            {subjectLabels[subject]} · {doneCount} / {path.nodes.length} ด่าน
          </div>
          <h2 className="display" style={{ fontSize: 'var(--text-xl)', margin: '8px 0 0' }}>
            {path.title}
          </h2>
        </div>

        <PathMap path={path} onPick={n => {
          if (n.state !== 'locked' && n.goTo) ctx.navigate(n.goTo)
        }} />
      </section>

      {/* Tip */}
      <div className="card mt-5" style={{
        background: 'var(--rust-tint)', border: '1px solid var(--rust-soft)',
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <YungMascot size={64} mood="thinking" />
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ color: 'var(--rust-deep)' }}>เกร็ดความรู้</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', marginTop: 4 }}>
            ทำให้ครบทุกด่านเพื่อปลดเหรียญพิเศษ — แต่ทำช้าๆ ก็ได้นะ
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => ctx.navigate('home')}>
          กลับหน้าหลัก <ArrowRight size={14} />
        </button>
      </div>
    </>
  )
}
