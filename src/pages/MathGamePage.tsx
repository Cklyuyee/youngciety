import { useState, useEffect } from 'react'
import { Lock, Star, Play, ArrowRight, ArrowLeft, Flame, Sparkles } from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import type { AppCtx } from '@/types/app'

const STORAGE_KEY = 'yct-math-stars'
function loadStars(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? {} }
  catch { return {} }
}
function saveStars(s: Record<number, number>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

interface Level {
  id: number; title: string; sub: string
  targetRange: [number, number]; tiles: number; time: number; goal: number; triples: boolean
}
const LEVELS: Level[] = [
  { id: 1, title: 'นับให้คล่อง',   sub: 'หาคู่ที่บวกกันได้ 4–8',     targetRange: [4, 8],   tiles: 6, time: 60, goal: 5, triples: false },
  { id: 2, title: 'บวกเล็ก',       sub: 'ผลรวมไม่เกิน 12',           targetRange: [6, 12],  tiles: 6, time: 60, goal: 6, triples: false },
  { id: 3, title: 'บวกใหญ่',       sub: 'ผลรวม 10–18',               targetRange: [10, 18], tiles: 6, time: 55, goal: 7, triples: false },
  { id: 4, title: 'สามตัวรวมกัน',   sub: 'ใช้ 2–3 ตัวให้ครบเป้า',      targetRange: [10, 20], tiles: 7, time: 60, goal: 6, triples: true },
  { id: 5, title: 'ไวเหมือนสายฟ้า', sub: 'เวลาน้อย แต้มแน่น',          targetRange: [8, 18],  tiles: 6, time: 45, goal: 8, triples: false },
]

function computeStars(r: { pairs: number; secondsLeft: number }, level: Level) {
  if (r.pairs >= level.goal && r.secondsLeft >= 6) return 3
  if (r.pairs >= level.goal) return 2
  if (r.pairs >= 1) return 1
  return 0
}

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function newPuzzle(level: Level) {
  const [min, max] = level.targetRange
  const target = rand(min, max)
  let numbers: number[] = []
  if (level.triples && Math.random() < 0.5) {
    const a = rand(1, Math.min(9, target - 2))
    const b = rand(1, Math.min(9, target - a - 1))
    numbers = [a, b, target - a - b]
  } else {
    const a = rand(1, Math.min(9, target - 1))
    numbers = [a, target - a]
  }
  while (numbers.length < level.tiles) {
    numbers.push(rand(1, Math.min(target + 2, 12)))
  }
  return { target, numbers: shuffle(numbers) }
}

/* ── Sub-components ─────────────────────────────────────────── */
function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-900)' }}>{value}</div>
      <div className="muted" style={{ fontSize: 'var(--text-xs)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function StatBox({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <div className="card-flat" style={{ padding: 12, textAlign: 'center' }}>
      <div style={{ height: 24, display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', marginTop: 6, lineHeight: 1 }}>{v}</div>
      <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 2 }}>{l}</div>
    </div>
  )
}

/* ── LevelSelect ─────────────────────────────────────────────── */
function LevelSelect({ levels, stars, onPick }: { levels: Level[]; stars: Record<number, number>; onPick: (i: number) => void; ctx?: AppCtx }) {
  return (
    <>
      <div className="between mb-5">
        <div>
          <span className="chip chip-sage">คณิตศาสตร์ · เกม</span>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '12px 0 6px', lineHeight: 1.3 }}>
            จับคู่ผลรวม <em style={{ color: 'var(--rust)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Number Pairs</em>
          </h1>
          <p className="muted" style={{ margin: 0, maxWidth: 560 }}>
            เลือกด่านที่อยากเล่น ด่านยากจะปลดเมื่อทำด่านก่อนหน้าผ่านแล้ว
          </p>
        </div>
        <YungMascot size={88} mood="happy" className="bob" />
      </div>

      <div className="card mb-5" style={{ background: 'var(--sage-soft)', border: '1px solid #C7D6B0', padding: 20 }}>
        <div className="row gap-5">
          <Summary label="ด่านที่ผ่าน" value={`${Object.keys(stars).length}/${levels.length}`} />
          <div style={{ width: 1, background: '#B5C9A0' }} />
          <Summary label="ดาวสะสม" value={`${Object.values(stars).reduce((a, b) => a + b, 0)} / ${levels.length * 3}`} />
          <div style={{ width: 1, background: '#B5C9A0' }} />
          <Summary label="สถิติคะแนน" value="240" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
        {levels.map((lv, i) => {
          const earned = stars[i] ?? 0
          const locked = i > 0 && !(stars[i - 1] ?? 0)
          return (
            <button key={lv.id} onClick={() => !locked && onPick(i)} disabled={locked}
              style={{
                textAlign: 'left', padding: 0,
                background: locked ? 'var(--cream-50)' : 'var(--surface)',
                border: earned === 3 ? '2px solid var(--mustard)' : earned > 0 ? '1.5px solid var(--sage)' : locked ? '1.5px dashed var(--rule-2)' : '1px solid var(--rule)',
                borderRadius: 'var(--r-lg)', overflow: 'hidden',
                cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.55 : 1,
                display: 'flex', flexDirection: 'column', transition: 'transform .15s',
              }}
              onMouseEnter={e => { if (!locked) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{
                padding: '20px 18px 14px',
                background: locked ? 'var(--cream-100)' : earned === 3 ? 'var(--mustard-soft)' : 'var(--sage-soft)',
                borderBottom: '1px solid ' + (locked ? 'var(--rule)' : earned === 3 ? '#E4D08C' : '#C7D6B0'),
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div className="kicker" style={{ color: locked ? 'var(--ink-500)' : earned === 3 ? '#75561A' : '#3F5D33' }}>
                    Lv {lv.id}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--ink-900)', lineHeight: 1.3, marginTop: 4 }}>
                    {lv.title}
                  </div>
                </div>
                {locked ? (
                  <Lock size={20} color="var(--ink-500)" />
                ) : (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3].map(n => (
                      <Star key={n} size={18} color={earned >= n ? 'var(--mustard)' : 'var(--cream-300)'} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: 16, flex: 1 }}>
                <div className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 14 }}>{lv.sub}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginBottom: 14 }}>
                  <span>⏱ {lv.time}s</span><span>·</span>
                  <span>เป้า: {lv.goal} คู่</span><span>·</span>
                  <span>{lv.tiles} ช่อง</span>
                </div>
                {locked ? (
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-500)' }}>ผ่านด่าน {lv.id - 1} เพื่อปลดล็อค</div>
                ) : earned > 0 ? (
                  <span className="chip chip-sage" style={{ fontSize: 'var(--text-xs)' }}>✓ ผ่านแล้ว · เล่นซ้ำ</span>
                ) : (
                  <span className="chip chip-rust" style={{ fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Play size={11} /> เริ่มเลย
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ── LevelIntro ──────────────────────────────────────────────── */
function LevelIntro({ level, stars, onStart, onBack }: { level: Level; stars: number; onStart: () => void; onBack: () => void }) {
  return (
    <>
      <button className="btn btn-ghost btn-sm mb-4" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeft size={12} /> เลือกด่านอื่น
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center', padding: '20px 0' }}>
        <div>
          <span className="chip chip-sage">Lv {level.id} · คณิตศาสตร์</span>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '14px 0 6px', lineHeight: 1.3 }}>
            {level.title}
          </h1>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-700)' }}>{level.sub}</p>
          <div className="hr" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 460 }}>
            <StatBox icon={<Flame size={20} color="var(--rust)" />}    v={`${level.time}s`} l="เวลา" />
            <StatBox icon={<Star size={20} color="var(--mustard)" />}  v={`${level.goal} คู่`} l="เป้าหมาย" />
            <StatBox icon={<span style={{ fontFamily: 'var(--font-display)', color: 'var(--sage)', fontSize: 20 }}>Σ</span>}
                     v={`${level.targetRange[0]}–${level.targetRange[1]}`} l="ผลรวมเป้า" />
          </div>
          <div className="mt-5" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3].map(n => <Star key={n} size={26} color={stars >= n ? 'var(--mustard)' : 'var(--cream-300)'} />)}
            </div>
            <span className="muted" style={{ fontSize: 'var(--text-sm)' }}>
              คะแนนสูงสุดที่ผ่าน: <b>{stars}/3 ดาว</b>
            </span>
          </div>
          <button className="btn btn-primary btn-lg mt-5" onClick={onStart} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={16} /> เริ่มด่าน
          </button>
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 280, height: 280, background: 'var(--sage-soft)', border: '1px solid #C7D6B0', borderRadius: '70% 30% 60% 40% / 50% 60% 40% 50%' }} />
            <div className="bob" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <YungMascot size={200} mood="happy" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Play ────────────────────────────────────────────────────── */
function PlayScreen({ level, onEnd }: { level: Level; onEnd: (r: { score: number; pairs: number; secondsLeft: number; goal: number }) => void }) {
  const [score,    setScore]    = useState(0)
  const [combo,    setCombo]    = useState(0)
  const [pairs,    setPairs]    = useState(0)
  const [time,     setTime]     = useState(level.time)
  const [picked,   setPicked]   = useState<number[]>([])
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null)
  const [puzzle,   setPuzzle]   = useState(() => newPuzzle(level))

  function end() { onEnd({ score, pairs, secondsLeft: Math.max(0, time), goal: level.goal }) }

  useEffect(() => {
    if (time <= 0) { end(); return }
    const id = setTimeout(() => setTime(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [time])

  function pick(i: number) {
    if (feedback) return
    const np = picked.includes(i) ? picked.filter(x => x !== i) : [...picked, i]
    setPicked(np)
    const maxPick = level.triples ? 3 : 2
    if (np.length >= 2) {
      const sum = np.reduce((s, idx) => s + puzzle.numbers[idx], 0)
      if (sum === puzzle.target) {
        const pts = 10 + combo * 2
        setScore(s => s + pts); setCombo(c => c + 1); setPairs(p => p + 1)
        setFeedback('right')
        setTimeout(() => { setFeedback(null); setPicked([]); setPuzzle(newPuzzle(level)) }, 800)
      } else if (sum > puzzle.target || np.length >= maxPick) {
        setFeedback('wrong'); setCombo(0)
        setTimeout(() => { setFeedback(null); setPicked([]) }, 650)
      }
    }
  }

  const pct     = (time / level.time) * 100
  const goalPct = Math.min(100, (pairs / level.goal) * 100)

  return (
    <div>
      {/* HUD */}
      <div className="lift" style={{ padding: '14px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span className="chip chip-sage">Lv {level.id} · {level.title}</span>
          <div className="stat">
            <span className="v" style={{ fontSize: 'var(--text-xl)' }}>{score}</span>
            <span className="l">คะแนน</span>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--rule)' }} />
          <div className="stat">
            <span className="v" style={{ fontSize: 'var(--text-xl)', color: 'var(--ok)' }}>{pairs}/{level.goal}</span>
            <span className="l">คู่สำเร็จ</span>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--rule)' }} />
          <div className="stat">
            <span className="v" style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--rust)' }}>
              <Flame size={16} /> ×{combo + 1}
            </span>
            <span className="l">คอมโบ</span>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--rule)' }} />
          <div className="stat">
            <span className="v" style={{ fontSize: 'var(--text-xl)', color: time < 10 ? 'var(--err)' : 'var(--ink-900)' }}>{time}s</span>
            <span className="l">เวลา</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={end}>หยุดเล่น</button>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        <div>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="muted" style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>เวลา</span>
            <span style={{ fontSize: 'var(--text-xs)', color: time < 10 ? 'var(--err)' : 'var(--ink-600)' }}>{time}s</span>
          </div>
          <div className="bar"><i style={{ width: pct + '%', background: time < 10 ? 'var(--err)' : 'var(--rust)' }} /></div>
        </div>
        <div>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="muted" style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase' }}>เป้าหมาย</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ok)' }}>{pairs}/{level.goal}</span>
          </div>
          <div className="bar sage"><i style={{ width: goalPct + '%' }} /></div>
        </div>
      </div>

      {/* Target */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div className="kicker" style={{ color: 'var(--ink-600)' }}>
          {level.triples ? 'หา 2 หรือ 3 ตัวที่บวกกันได้' : 'หาคู่ที่บวกกันได้'}
        </div>
        <div style={{
          display: 'inline-grid', placeItems: 'center',
          width: 110, height: 110,
          background: feedback === 'right' ? 'var(--sage-soft)' : feedback === 'wrong' ? '#F5DCD2' : 'var(--rust-tint)',
          border: '2px solid ' + (feedback === 'right' ? 'var(--sage)' : feedback === 'wrong' ? '#D9846B' : 'var(--rust)'),
          borderRadius: '50%', marginTop: 12, transition: 'all .25s',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: feedback === 'right' ? 'var(--ok)' : 'var(--rust-deep)' }}>
            {puzzle.target}
          </span>
        </div>
      </div>

      {/* Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${level.tiles >= 7 ? 4 : 3}, 1fr)`,
        gap: 14, maxWidth: 620, margin: '0 auto',
      }}>
        {puzzle.numbers.map((n, i) => {
          const iP = picked.includes(i)
          return (
            <button key={i} onClick={() => pick(i)} disabled={!!feedback}
              style={{
                aspectRatio: '1/1',
                background: iP ? 'var(--rust)' : 'var(--surface)',
                color: iP ? 'white' : 'var(--ink-900)',
                border: iP ? '2px solid var(--rust-deep)' : '1.5px solid var(--rule)',
                borderRadius: 'var(--r-xl)',
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)',
                cursor: feedback ? 'default' : 'pointer',
                transition: 'transform .15s, background .15s',
                transform: iP ? 'translateY(-2px)' : 'none',
                boxShadow: iP ? '0 6px 16px rgba(184,90,61,.25)' : 'var(--sh-1)',
              }}>
              {n}
            </button>
          )
        })}
      </div>

      {feedback === 'right' && (
        <div className="pop" style={{ textAlign: 'center', marginTop: 24, color: 'var(--ok)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Sparkles size={20} color="var(--ok)" /> ถูกต้อง! +{10 + combo * 2}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="pop" style={{ textAlign: 'center', marginTop: 24, color: 'var(--err)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
          ลองอีกครั้ง
        </div>
      )}
    </div>
  )
}

/* ── Complete ────────────────────────────────────────────────── */
function Complete({ result, level, hasNext, onReplay, onNext, onSelect, onHome }: {
  result: { score: number; pairs: number; secondsLeft: number; earned: number }
  level: Level; hasNext: boolean
  onReplay: () => void; onNext: () => void; onSelect: () => void; onHome: () => void
}) {
  const passed = result.pairs >= level.goal
  return (
    <div style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center' }}>
      <YungMascot size={140} mood={passed ? 'cheer' : 'thinking'} className="bob" />
      <div className="kicker mt-4" style={{ color: passed ? 'var(--ok)' : 'var(--ink-600)' }}>
        {passed ? `ผ่านด่าน ${level.id}!` : 'ใกล้แล้วนะ'}
      </div>
      <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '10px 0 0', lineHeight: 1.3 }}>
        {passed ? <>{`เก่งมาก! `}<em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>{level.title}</em></> : 'ลองอีกครั้ง'}
      </h1>

      <div className="row pop" style={{ justifyContent: 'center', gap: 8, marginTop: 26 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ transform: result.earned >= n ? 'scale(1)' : 'scale(.85)', opacity: result.earned >= n ? 1 : 0.4, transition: `transform .3s ease ${n * .1}s` }}>
            <Star size={56} color={result.earned >= n ? 'var(--mustard)' : 'var(--cream-300)'} />
          </div>
        ))}
      </div>

      <div className="card mt-5" style={{ background: 'var(--cream-50)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: 4 }}>
          <Summary label="คะแนน"     value={result.score} />
          <Summary label="คู่สำเร็จ"   value={`${result.pairs}/${level.goal}`} />
          <Summary label="เวลาที่เหลือ" value={`${result.secondsLeft}s`} />
        </div>
      </div>

      {result.earned === 3 && (
        <div className="pop mt-4" style={{ color: 'var(--mustard)', fontFamily: 'var(--font-display)', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Sparkles size={18} color="var(--mustard)" /> ครบ 3 ดาว! ปลดล็อคด่านถัดไปแล้ว
        </div>
      )}

      <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={onReplay}>เล่นซ้ำด่าน {level.id}</button>
        {hasNext && passed && (
          <button className="btn btn-primary" onClick={onNext} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            ด่านถัดไป <ArrowRight size={14} />
          </button>
        )}
        <button className="btn btn-ghost" onClick={onSelect}>เลือกด่าน</button>
      </div>
      <button className="btn btn-ghost btn-sm mt-4" onClick={onHome} style={{ color: 'var(--ink-600)' }}>
        กลับหน้าหลัก
      </button>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
type Stage = 'select' | 'intro' | 'play' | 'complete'

export default function MathGamePage({ ctx }: { ctx: AppCtx }) {
  const [stage,     setStage]     = useState<Stage>('select')
  const [levelIdx,  setLevelIdx]  = useState(0)
  const [stars,     setStars]     = useState<Record<number, number>>(loadStars)
  const [lastResult, setLastResult] = useState<{ score: number; pairs: number; secondsLeft: number; earned: number } | null>(null)

  function pickLevel(i: number) { setLevelIdx(i); setStage('intro') }
  function startPlay()           { setStage('play') }
  function onPlayEnd(result: { score: number; pairs: number; secondsLeft: number; goal: number }) {
    const earned = computeStars(result, LEVELS[levelIdx])
    const cur    = stars[levelIdx] ?? 0
    if (earned > cur) {
      const next = { ...stars, [levelIdx]: earned }
      setStars(next); saveStars(next)
    }
    setLastResult({ ...result, earned })
    setStage('complete')
  }

  if (stage === 'select')
    return <LevelSelect levels={LEVELS} stars={stars} onPick={pickLevel} ctx={ctx} />
  if (stage === 'intro')
    return <LevelIntro level={LEVELS[levelIdx]} stars={stars[levelIdx] ?? 0} onStart={startPlay} onBack={() => setStage('select')} />
  if (stage === 'play')
    return <PlayScreen level={LEVELS[levelIdx]} onEnd={onPlayEnd} />
  if (stage === 'complete' && lastResult)
    return <Complete result={lastResult} level={LEVELS[levelIdx]}
                     hasNext={levelIdx < LEVELS.length - 1}
                     onReplay={() => setStage('intro')}
                     onNext={() => { setLevelIdx(i => i + 1); setStage('intro') }}
                     onSelect={() => setStage('select')}
                     onHome={() => ctx.navigate('home')} />
  return null
}
