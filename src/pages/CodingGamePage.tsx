import { useState, useEffect } from 'react'
import { Lock, Star, Play, ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import type { AppCtx } from '@/types/app'

const STORAGE_KEY = 'yct-coding-stars'
function loadStars(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? {} }
  catch { return {} }
}
function saveStars(s: Record<number, number>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

interface Pos { x: number; y: number; dir: number }
interface Block { x: number; y: number }
interface Level {
  id: number; title: string; brief: string; size: number
  start: Pos; goal: { x: number; y: number }; blocks: Block[]
  maxSteps: number; optimal: number
}

const LEVELS: Level[] = [
  { id: 1, title: 'ก้าวแรก', brief: 'ต่อคำสั่งให้น้องไข่เดินไปกินดาว ตรงไปข้างหน้า 3 ครั้ง',
    size: 5, start: { x: 0, y: 4, dir: 1 }, goal: { x: 3, y: 4 }, blocks: [], maxSteps: 5, optimal: 3 },
  { id: 2, title: 'เลี้ยวซ้าย', brief: 'ต้องเลี้ยวซ้ายแล้วเดินขึ้น',
    size: 5, start: { x: 0, y: 4, dir: 1 }, goal: { x: 2, y: 1 }, blocks: [{ x: 4, y: 4 }], maxSteps: 8, optimal: 6 },
  { id: 3, title: 'อ้อมสิ', brief: 'ระวังก้อนหิน — หาทางอ้อมไปให้ถึงดาว',
    size: 5, start: { x: 0, y: 4, dir: 1 }, goal: { x: 4, y: 0 }, blocks: [{ x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }], maxSteps: 14, optimal: 10 },
  { id: 4, title: 'ตรอกแคบ', brief: 'เดินไปตามทางที่กำหนด สลับซ้ายขวา',
    size: 5, start: { x: 0, y: 0, dir: 2 }, goal: { x: 4, y: 4 },
    blocks: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 1, y: 4 }, { x: 3, y: 4 }],
    maxSteps: 16, optimal: 12 },
  { id: 5, title: 'เส้นทางท้าทาย', brief: 'ภารกิจสุดท้าย — ใช้สมองให้เต็มที่',
    size: 6, start: { x: 0, y: 5, dir: 1 }, goal: { x: 5, y: 0 },
    blocks: [{ x: 1, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }],
    maxSteps: 22, optimal: 16 },
]

const CMDS: Record<string, { label: string; sym: string; color: string; desc: string }> = {
  F: { label: 'ไป',   sym: '▲', color: 'var(--rust)', desc: 'เดินไปข้างหน้า 1 ช่อง' },
  L: { label: 'ซ้าย', sym: '↺', color: 'var(--plum)', desc: 'หันซ้าย' },
  R: { label: 'ขวา',  sym: '↻', color: 'var(--sky)',  desc: 'หันขวา' },
}

function computeStars(steps: number, lv: Level) {
  if (steps <= lv.optimal)     return 3
  if (steps <= lv.optimal + 2) return 2
  return 1
}

function moveFn(p: Pos): Pos {
  const [dx, dy] = [[0,-1],[1,0],[0,1],[-1,0]][p.dir]
  return { ...p, x: p.x + dx, y: p.y + dy }
}
function inBounds(p: Pos, s: number) { return p.x >= 0 && p.x < s && p.y >= 0 && p.y < s }
function isBlocked(p: Pos, blocks: Block[]) { return blocks.some(b => b.x === p.x && b.y === p.y) }
function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

/* ── Summary ─────────────────────────────────────────────────── */
function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--ink-900)' }}>{value}</div>
      <div className="muted" style={{ fontSize: 'var(--text-xs)', letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

/* ── MiniGrid ─────────────────────────────────────────────────── */
function MiniGrid({ level, locked }: { level: Level; locked: boolean }) {
  const { size } = level
  const cellPct = 100 / size
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: locked ? 'var(--cream-50)' : 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid ' + (locked ? 'var(--rule-2)' : 'var(--rule)'), overflow: 'hidden' }}>
      {Array.from({ length: size - 1 }).map((_, i) => (
        <div key={i}>
          <div style={{ position: 'absolute', left: ((i+1)*cellPct)+'%', top:0, bottom:0, borderLeft: '1px dashed var(--rule-2)' }} />
          <div style={{ position: 'absolute', top: ((i+1)*cellPct)+'%', left:0, right:0, borderTop: '1px dashed var(--rule-2)' }} />
        </div>
      ))}
      {level.blocks.map((b, i) => (
        <div key={i} style={{ position:'absolute', left:`${b.x*cellPct+cellPct*0.15}%`, top:`${b.y*cellPct+cellPct*0.15}%`, width:`${cellPct*0.7}%`, height:`${cellPct*0.7}%`, background:'var(--cream-300)', borderRadius:3 }} />
      ))}
      <div style={{ position:'absolute', left:`${level.start.x*cellPct+cellPct*0.3}%`, top:`${level.start.y*cellPct+cellPct*0.3}%`, width:`${cellPct*0.4}%`, height:`${cellPct*0.4}%`, background:'var(--rust)', borderRadius:'50%' }} />
      <div style={{ position:'absolute', left:`${level.goal.x*cellPct+cellPct*0.25}%`, top:`${level.goal.y*cellPct+cellPct*0.25}%`, width:`${cellPct*0.5}%`, height:`${cellPct*0.5}%`, display:'grid', placeItems:'center' }}>
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--mustard)">
          <path d="M12 3 L14.5 9 L21 9.8 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.8 L9.5 9 Z" />
        </svg>
      </div>
    </div>
  )
}

/* ── Grid (full play) ─────────────────────────────────────────── */
function Grid({ size, actor, goal, blocks }: { size: number; actor: Pos; goal: { x: number; y: number }; blocks: Block[] }) {
  const cellPct = 100 / size
  const cells: { x: number; y: number }[] = []
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) cells.push({ x, y })
  return (
    <div style={{ position:'relative', aspectRatio:'1/1', background:'var(--cream-50)', border:'1px solid var(--rule)', borderRadius:'var(--r-md)', overflow:'hidden' }}>
      {cells.map((c, i) => (
        <div key={i} style={{ position:'absolute', left:`${c.x*cellPct}%`, top:`${c.y*cellPct}%`, width:`${cellPct}%`, height:`${cellPct}%`, borderRight:c.x<size-1?'1px dashed var(--rule-2)':'none', borderBottom:c.y<size-1?'1px dashed var(--rule-2)':'none' }} />
      ))}
      {blocks.map((b, i) => (
        <div key={i} style={{ position:'absolute', left:`${b.x*cellPct+cellPct*0.1}%`, top:`${b.y*cellPct+cellPct*0.1}%`, width:`${cellPct*0.8}%`, height:`${cellPct*0.8}%`, background:'var(--cream-300)', border:'1px solid var(--cream-400)', borderRadius:'var(--r-md)', display:'grid', placeItems:'center' }}>
          <svg viewBox="0 0 24 24" width="50%" height="50%" fill="var(--ink-600)" opacity=".6">
            <path d="M 4 14 L 8 8 L 16 6 L 20 12 L 18 18 L 10 20 Z" />
          </svg>
        </div>
      ))}
      <div style={{ position:'absolute', left:`${goal.x*cellPct+cellPct*0.18}%`, top:`${goal.y*cellPct+cellPct*0.18}%`, width:`${cellPct*0.64}%`, height:`${cellPct*0.64}%`, background:'var(--mustard-soft)', border:'2px dashed var(--mustard)', borderRadius:'50%', display:'grid', placeItems:'center' }}>
        <svg viewBox="0 0 24 24" width="60%" height="60%" fill="var(--mustard)">
          <path d="M12 3 L14.5 9 L21 9.8 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.8 L9.5 9 Z" />
        </svg>
      </div>
      <div style={{ position:'absolute', left:`${actor.x*cellPct+cellPct*0.1}%`, top:`${actor.y*cellPct+cellPct*0.1}%`, width:`${cellPct*0.8}%`, height:`${cellPct*0.8}%`, transition:'left .4s, top .4s', display:'grid', placeItems:'center' }}>
        <div style={{ transform:`rotate(${actor.dir*90-90}deg)`, transition:'transform .35s', transformOrigin:'center' }}>
          <YungMascot size={Math.max(36, 340/size*0.72)} mood="happy" />
        </div>
      </div>
    </div>
  )
}

/* ── LevelSelect ─────────────────────────────────────────────── */
function LevelSelect({ levels, stars, onPick }: { levels: Level[]; stars: Record<number, number>; onPick: (i: number) => void }) {
  return (
    <>
      <div className="between mb-5">
        <div>
          <span className="chip chip-plum">Coding · เกม</span>
          <h1 className="display" style={{ fontSize:'var(--text-3xl)', margin:'12px 0 6px', lineHeight:1.3 }}>
            พาน้องไข่ไปกินดาว <em style={{ color:'var(--rust)', fontStyle:'italic' }}>ทีละด่าน</em>
          </h1>
          <p className="muted" style={{ margin:0, maxWidth:560 }}>
            เลือกด่านที่อยากเล่น ใช้คำสั่งให้น้อยที่สุดเพื่อได้ 3 ดาว
          </p>
        </div>
        <YungMascot size={88} mood="happy" className="bob" />
      </div>

      <div className="card mb-5" style={{ background:'var(--plum-soft)', border:'1px solid #CFB7CA', padding:20 }}>
        <div className="row gap-5">
          <Summary label="ด่านที่ผ่าน" value={`${Object.keys(stars).length}/${levels.length}`} />
          <div style={{ width:1, background:'#C0A4BB' }} />
          <Summary label="ดาวสะสม" value={`${Object.values(stars).reduce((a,b)=>a+b,0)} / ${levels.length*3}`} />
          <div style={{ width:1, background:'#C0A4BB' }} />
          <Summary label="ทักษะ" value="ลำดับคำสั่ง" />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:18 }}>
        {levels.map((lv, i) => {
          const earned = stars[i] ?? 0
          const locked = i > 0 && !(stars[i-1] ?? 0)
          return (
            <button key={lv.id} onClick={() => !locked && onPick(i)} disabled={locked}
              style={{ textAlign:'left', padding:0, background:locked?'var(--cream-50)':'var(--surface)',
                border:earned===3?'2px solid var(--mustard)':earned>0?'1.5px solid var(--plum)':locked?'1.5px dashed var(--rule-2)':'1px solid var(--rule)',
                borderRadius:'var(--r-lg)', overflow:'hidden', cursor:locked?'default':'pointer', opacity:locked?0.55:1,
                display:'flex', flexDirection:'column', transition:'transform .15s' }}
              onMouseEnter={e=>{ if(!locked)(e.currentTarget as HTMLElement).style.transform='translateY(-2px)' }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform='none' }}>
              <div style={{ padding:14, background:locked?'var(--cream-100)':'var(--plum-soft)', borderBottom:'1px solid '+(locked?'var(--rule)':'#CFB7CA') }}>
                <MiniGrid level={lv} locked={locked} />
              </div>
              <div style={{ padding:16, flex:1 }}>
                <div className="between" style={{ marginBottom:8 }}>
                  <div>
                    <div className="kicker" style={{ color:locked?'var(--ink-500)':'#5B3855' }}>Lv {lv.id}</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-md)', marginTop:2 }}>{lv.title}</div>
                  </div>
                  {locked ? <Lock size={18} color="var(--ink-500)" /> : (
                    <div style={{ display:'flex', gap:3 }}>
                      {[1,2,3].map(n=><Star key={n} size={16} color={earned>=n?'var(--mustard)':'var(--cream-300)'} />)}
                    </div>
                  )}
                </div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--ink-600)', marginBottom:10 }}>
                  {locked ? `ผ่านด่าน ${lv.id-1} เพื่อปลดล็อค` : `เป้าหมาย ≤ ${lv.optimal} คำสั่ง`}
                </div>
                {!locked && (
                  <span className={`chip ${earned>0?'chip-plum':'chip-rust'}`} style={{ fontSize:'var(--text-xs)', display:'inline-flex', alignItems:'center', gap:4 }}>
                    {earned>0 ? '✓ ผ่านแล้ว · เล่นซ้ำ' : <><Play size={11} /> เริ่มเลย</>}
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

/* ── PlayScreen ──────────────────────────────────────────────── */
function PlayScreen({ level, onWin, onQuit }: { level: Level; onWin: (steps: number) => void; onQuit: () => void }) {
  const [program, setProgram] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [actor,   setActor]   = useState<Pos>(level.start)
  const [result,  setResult]  = useState<'fail' | null>(null)
  const [step,    setStep]    = useState(-1)

  useEffect(() => {
    setActor(level.start); setProgram([]); setResult(null); setStep(-1)
  }, [level.id])

  function addCmd(c: string) {
    if (running || program.length >= level.maxSteps) return
    setProgram(p => [...p, c]); setResult(null)
  }
  function removeCmd(i: number) {
    if (running) return
    setProgram(p => p.filter((_, j) => j !== i))
  }
  function clearProgram() {
    if (running) return
    setProgram([]); setResult(null); setActor(level.start); setStep(-1)
  }

  async function run() {
    if (running || program.length === 0) return
    setRunning(true); setResult(null)
    let pos: Pos = { ...level.start }
    setActor(pos); setStep(-1)
    await sleep(300)
    for (let i = 0; i < program.length; i++) {
      setStep(i)
      const c = program[i]
      if      (c === 'L') pos = { ...pos, dir: (pos.dir + 3) % 4 }
      else if (c === 'R') pos = { ...pos, dir: (pos.dir + 1) % 4 }
      else if (c === 'F') {
        const np = moveFn(pos)
        if (!inBounds(np, level.size) || isBlocked(np, level.blocks)) {
          setActor(pos); setResult('fail'); setRunning(false); return
        }
        pos = np
      }
      setActor({ ...pos })
      await sleep(380)
      if (pos.x === level.goal.x && pos.y === level.goal.y) {
        await sleep(200); onWin(program.length); return
      }
    }
    setResult('fail'); setRunning(false)
  }

  return (
    <div>
      <div className="between mb-4">
        <button className="btn btn-ghost btn-sm" onClick={onQuit} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <ArrowLeft size={12} /> เลือกด่านอื่น
        </button>
        <span className="chip chip-plum">Lv {level.id} · เป้าหมาย ≤ {level.optimal} คำสั่ง</span>
      </div>
      <div className="mb-5">
        <h1 className="display" style={{ fontSize:'var(--text-2xl)', margin:'0 0 4px' }}>{level.title}</h1>
        <p className="muted" style={{ margin:0 }}>{level.brief}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:28 }}>
        {/* Grid */}
        <div className="lift" style={{ padding:24, background:'var(--surface-2)' }}>
          <Grid size={level.size} actor={actor} goal={level.goal} blocks={level.blocks} />
          <div className="row mt-4" style={{ justifyContent:'space-between' }}>
            <span className="muted" style={{ fontSize:'var(--text-sm)' }}>
              {level.size}×{level.size} · ใช้ได้ ≤ {level.maxSteps} คำสั่ง
            </span>
            <div className="row gap-3">
              <span className="chip" style={{ background:'var(--rust)', color:'white', border:0 }}>
                <span style={{ width:8, height:8, background:'white', borderRadius:'50%', display:'inline-block', marginRight:4 }} />เริ่ม
              </span>
              <span className="chip" style={{ background:'var(--mustard)', color:'white', border:0 }}>
                <span style={{ width:8, height:8, background:'white', borderRadius:'50%', display:'inline-block', marginRight:4 }} />ดาว
              </span>
            </div>
          </div>
        </div>

        {/* Command panel */}
        <div>
          <div className="card mb-4">
            <div className="kicker">บล็อคคำสั่ง</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginTop:12 }}>
              {Object.entries(CMDS).map(([k, c]) => (
                <button key={k} disabled={running} onClick={() => addCmd(k)}
                  style={{ padding:'16px 12px', background:'var(--surface)', border:'1.5px solid var(--rule)', borderRadius:'var(--r-lg)',
                    cursor:running?'default':'pointer', display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
                  <div style={{ width:40, height:40, background:c.color, borderRadius:'var(--r-md)', display:'grid', placeItems:'center', color:'white', fontSize:22, fontWeight:600 }}>
                    {c.sym}
                  </div>
                  <div style={{ fontSize:'var(--text-sm)', fontWeight:500 }}>{c.label}</div>
                  <div className="muted" style={{ fontSize:'var(--text-xs)', textAlign:'center' }}>{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="between mb-3">
              <div className="kicker">โปรแกรมของฉัน</div>
              <span className="muted" style={{ fontSize:'var(--text-xs)' }}>{program.length} / {level.maxSteps}</span>
            </div>
            {program.length === 0 ? (
              <div className="dotted" style={{ textAlign:'center', color:'var(--ink-500)', padding:24 }}>
                คลิกบล็อคคำสั่งด้านบนเพื่อสร้างโปรแกรม
              </div>
            ) : (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {program.map((c, i) => (
                  <button key={i} onClick={() => removeCmd(i)} disabled={running}
                    style={{ position:'relative', width:56, height:56, background:CMDS[c].color, color:'white',
                      border:step===i?'3px solid var(--ink-900)':'1.5px solid rgba(0,0,0,.1)',
                      borderRadius:'var(--r-md)', cursor:running?'default':'pointer', fontSize:26, fontWeight:600,
                      transform:step===i?'translateY(-3px)':'none', transition:'transform .2s' }}>
                    {CMDS[c].sym}
                    <span style={{ position:'absolute', top:-6, right:-6, background:'var(--ink-900)', color:'white', borderRadius:'50%', width:18, height:18, fontSize:10, display:'grid', placeItems:'center' }}>
                      {i+1}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="hr" />
            <div className="row gap-2">
              <button className="btn btn-primary" onClick={run} disabled={running||program.length===0} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <Play size={14} /> รันโปรแกรม
              </button>
              <button className="btn btn-ghost" onClick={clearProgram} disabled={running}>ล้าง</button>
            </div>
            {result === 'fail' && (
              <div className="pop mt-4" style={{ padding:14, background:'#F5DCD2', border:'1px solid #D9846B', borderRadius:'var(--r-md)', display:'flex', gap:10, alignItems:'center', color:'#8C3A28' }}>
                <X size={18} color="#8C3A28" />
                <span>ยังไม่ถึงเป้าหมาย — ลองดูเส้นทางใหม่อีกที</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Complete ────────────────────────────────────────────────── */
function Complete({ result, level, hasNext, onReplay, onNext, onSelect, onHome }: {
  result: { steps: number; earned: number }; level: Level; hasNext: boolean
  onReplay: () => void; onNext: () => void; onSelect: () => void; onHome: () => void
}) {
  return (
    <div style={{ maxWidth:560, margin:'40px auto', textAlign:'center' }}>
      <YungMascot size={140} mood="cheer" className="bob" />
      <div className="kicker mt-4" style={{ color:'var(--ok)' }}>ผ่านด่าน {level.id}!</div>
      <h1 className="display" style={{ fontSize:'var(--text-3xl)', margin:'10px 0 0', lineHeight:1.3 }}>
        เก่งมาก! <em style={{ color:'var(--rust)', fontStyle:'italic' }}>{level.title}</em>
      </h1>
      <div className="row pop" style={{ justifyContent:'center', gap:8, marginTop:26 }}>
        {[1,2,3].map(n=>(
          <div key={n} style={{ transform:result.earned>=n?'scale(1)':'scale(.85)', opacity:result.earned>=n?1:0.4, transition:`transform .3s ease ${n*.1}s` }}>
            <Star size={56} color={result.earned>=n?'var(--mustard)':'var(--cream-300)'} />
          </div>
        ))}
      </div>
      <div className="card mt-5" style={{ background:'var(--cream-50)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
          <Summary label="คำสั่งที่ใช้" value={result.steps} />
          <Summary label="เป้าหมายต่ำสุด" value={`≤ ${level.optimal}`} />
        </div>
      </div>
      {result.earned === 3 && (
        <div className="pop mt-4" style={{ color:'var(--mustard)', fontFamily:'var(--font-display)', fontStyle:'italic', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Sparkles size={18} color="var(--mustard)" /> ครบ 3 ดาว — โปรแกรมเมอร์ตัวจริง!
        </div>
      )}
      <div className="row gap-3" style={{ justifyContent:'center', marginTop:32, flexWrap:'wrap' }}>
        <button className="btn btn-ghost" onClick={onReplay}>เล่นซ้ำด่าน {level.id}</button>
        {hasNext && (
          <button className="btn btn-primary" onClick={onNext} style={{ display:'flex', alignItems:'center', gap:6 }}>
            ด่านถัดไป <ArrowRight size={14} />
          </button>
        )}
        <button className="btn btn-ghost" onClick={onSelect}>เลือกด่าน</button>
      </div>
      <button className="btn btn-ghost btn-sm mt-4" onClick={onHome} style={{ color:'var(--ink-600)' }}>
        กลับหน้าหลัก
      </button>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────── */
type Stage = 'select' | 'play' | 'complete'

export default function CodingGamePage({ ctx }: { ctx: AppCtx }) {
  const [stage,     setStage]     = useState<Stage>('select')
  const [levelIdx,  setLevelIdx]  = useState(0)
  const [stars,     setStars]     = useState<Record<number, number>>(loadStars)
  const [lastResult, setLastResult] = useState<{ steps: number; earned: number } | null>(null)

  function pickLevel(i: number) { setLevelIdx(i); setStage('play') }
  function onWin(steps: number) {
    const lv = LEVELS[levelIdx]
    const earned = computeStars(steps, lv)
    const cur = stars[levelIdx] ?? 0
    if (earned > cur) { const next = { ...stars, [levelIdx]: earned }; setStars(next); saveStars(next) }
    setLastResult({ steps, earned }); setStage('complete')
  }
  function onQuit() { setStage('select') }

  if (stage === 'select') return <LevelSelect levels={LEVELS} stars={stars} onPick={pickLevel} />
  if (stage === 'play')   return <PlayScreen level={LEVELS[levelIdx]} onWin={onWin} onQuit={onQuit} />
  if (stage === 'complete' && lastResult)
    return <Complete result={lastResult} level={LEVELS[levelIdx]}
                     hasNext={levelIdx < LEVELS.length - 1}
                     onReplay={() => setStage('play')}
                     onNext={() => { setLevelIdx(i => i+1); setStage('play') }}
                     onSelect={() => setStage('select')}
                     onHome={() => ctx.navigate('home')} />
  return null
}
