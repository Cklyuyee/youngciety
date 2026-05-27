import { useState, useRef, useEffect, useCallback } from 'react'
import {
  BookOpen, Palette, Eraser, RotateCcw, Download, Sparkles,
  PenTool, Star, ArrowRight, ListOrdered, X,
} from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import type { AppCtx } from '@/types/app'

/* ════════════════════════════════════════════════════════════════
   Types & data
══════════════════════════════════════════════════════════════ */
interface Checkpoint { x: number; y: number; num: number; text: string }
interface LetterData { name: string; strokes: Checkpoint[][] }

/* Logical coordinate space 400 × 500 — canvas renders at any size */
const CANVAS_W = 400
const CANVAS_H = 500
/* Fixed pixel size of the letter template (does not stretch with canvas) */
const TEMPLATE_H = 460
const TEMPLATE_SCALE = TEMPLATE_H / CANVAS_H
const TEMPLATE_W = CANVAS_W * TEMPLATE_SCALE

const DEFAULT_ALPHABET: Record<string, LetterData> = {
  'ก': { name: 'ก. ไก่', strokes: [[
    { x: 120, y: 410, num: 1, text: 'เริ่มลากจากฐานซ้ายล่างขึ้นบน' },
    { x: 120, y: 280, num: 2, text: 'ลากตรงต่อไปด้านบน' },
    { x: 110, y: 190, num: 3, text: 'โค้งซ้ายเล็กน้อยทำปากไก่' },
    { x: 80,  y: 175, num: 4, text: 'หยักแหลมของหัวปากไก่' },
    { x: 125, y: 145, num: 5, text: 'โค้งกลับเข้าใน' },
    { x: 200, y: 110, num: 6, text: 'ลากโค้งเป็นหลังคา' },
    { x: 280, y: 160, num: 7, text: 'โค้งไหล่ลงขวาบน' },
    { x: 280, y: 290, num: 8, text: 'ลากตรงลงเป็นเสาขวา' },
    { x: 280, y: 410, num: 9, text: 'เสร็จที่ฐานขวาล่าง!' },
  ]]},
  'ข': { name: 'ข. ไข่', strokes: [[
    { x: 150, y: 180, num: 1, text: 'เริ่มลากหัวด้านล่างของกลมซ้าย' },
    { x: 120, y: 150, num: 2, text: 'ม้วนอ้อมหลังโค้งขึ้นบน' },
    { x: 150, y: 110, num: 3, text: 'ม้วนปิดวงกลมเป็นรูขุมหัว' },
    { x: 180, y: 150, num: 4, text: 'โค้งบนขวาแล้วลากลง' },
    { x: 140, y: 230, num: 5, text: 'โค้งลำคอลงข้างล่าง' },
    { x: 150, y: 390, num: 6, text: 'ลากฐานลงล่างขวา' },
    { x: 280, y: 390, num: 7, text: 'เลี้ยวขวาทำมุมฉาก' },
    { x: 280, y: 180, num: 8, text: 'ลากตรงขึ้นเป็นหลังคา!' },
  ]]},
  'ค': { name: 'ค. ควาย', strokes: [[
    { x: 180, y: 180, num: 1, text: 'เริ่มหัวด้านล่าง' },
    { x: 150, y: 150, num: 2, text: 'ม้วนหัวอ้อมหลัง' },
    { x: 180, y: 110, num: 3, text: 'ปิดวงกลมหัว' },
    { x: 210, y: 150, num: 4, text: 'โค้งขวาเล็กน้อย' },
    { x: 170, y: 220, num: 5, text: 'หักลงเข้าใน' },
    { x: 150, y: 300, num: 6, text: 'โค้งลำตัวลง' },
    { x: 170, y: 390, num: 7, text: 'ลากฐานล่าง' },
    { x: 280, y: 390, num: 8, text: 'มุมฐานขวา' },
    { x: 280, y: 180, num: 9, text: 'ตรงขึ้นจบบนขวา' },
  ]]},
  'ฆ': { name: 'ฆ. ระฆัง', strokes: [[
    { x: 180, y: 180, num: 1, text: 'หัวด้านล่าง' },
    { x: 150, y: 150, num: 2, text: 'ม้วนหลัง' },
    { x: 180, y: 110, num: 3, text: 'ปิดหัว' },
    { x: 220, y: 130, num: 4, text: 'หยักขึ้นบน' },
    { x: 200, y: 170, num: 5, text: 'หักลง' },
    { x: 230, y: 200, num: 6, text: 'โค้งกลับ' },
    { x: 170, y: 290, num: 7, text: 'ลงลำตัว' },
    { x: 170, y: 390, num: 8, text: 'ฐานล่าง' },
    { x: 280, y: 390, num: 9, text: 'มุมขวา' },
    { x: 280, y: 180, num: 10, text: 'ตรงขึ้นจบ!' },
  ]]},
  'ง': { name: 'ง. งู', strokes: [[
    { x: 150, y: 170, num: 1, text: 'หัวด้านล่าง' },
    { x: 120, y: 140, num: 2, text: 'ม้วนหลัง' },
    { x: 150, y: 105, num: 3, text: 'ปิดหัว' },
    { x: 195, y: 140, num: 4, text: 'ออกจากหัว' },
    { x: 230, y: 230, num: 5, text: 'โค้งลำตัวลง' },
    { x: 270, y: 340, num: 6, text: 'ฐานล่างขวา' },
    { x: 230, y: 400, num: 7, text: 'โค้งหางลง' },
    { x: 170, y: 380, num: 8, text: 'หางม้วนกลับขึ้น!' },
  ]]},
  'จ': { name: 'จ. จาน', strokes: [[
    { x: 130, y: 160, num: 1, text: 'หัวด้านล่าง' },
    { x: 100, y: 130, num: 2, text: 'ม้วนหลัง' },
    { x: 130, y: 100, num: 3, text: 'ปิดหัว' },
    { x: 170, y: 130, num: 4, text: 'ออกจากหัว' },
    { x: 220, y: 230, num: 5, text: 'โค้งลำตัวลง' },
    { x: 240, y: 340, num: 6, text: 'ฐานขวา' },
    { x: 190, y: 400, num: 7, text: 'โค้งล่าง' },
    { x: 130, y: 380, num: 8, text: 'หางม้วนกลับ' },
    { x: 130, y: 310, num: 9, text: 'หางขึ้นไปบน!' },
  ]]},
  'ฉ': { name: 'ฉ. ฉิ่ง', strokes: [[
    { x: 250, y: 130, num: 1, text: 'เริ่มหัวบนขวา' },
    { x: 230, y: 100, num: 2, text: 'ม้วนหัว' },
    { x: 260, y: 80,  num: 3, text: 'ปิดหัวบน' },
    { x: 285, y: 110, num: 4, text: 'ออกจากหัว' },
    { x: 290, y: 200, num: 5, text: 'ลงตรง' },
    { x: 270, y: 290, num: 6, text: 'โค้งใน' },
    { x: 200, y: 380, num: 7, text: 'โค้งฐาน' },
    { x: 130, y: 320, num: 8, text: 'หางซ้าย' },
    { x: 110, y: 230, num: 9, text: 'หางม้วนขึ้นบน!' },
  ]]},
  'ช': { name: 'ช. ช้าง', strokes: [[
    { x: 180, y: 180, num: 1, text: 'หัวด้านล่าง' },
    { x: 150, y: 150, num: 2, text: 'ม้วนหลัง' },
    { x: 180, y: 110, num: 3, text: 'ปิดหัว' },
    { x: 210, y: 150, num: 4, text: 'หยักเล็ก' },
    { x: 240, y: 120, num: 5, text: 'ขึ้นบน' },
    { x: 270, y: 160, num: 6, text: 'ลงมาขวา' },
    { x: 220, y: 270, num: 7, text: 'โค้งลำตัว' },
    { x: 170, y: 390, num: 8, text: 'ฐานล่าง' },
    { x: 290, y: 390, num: 9, text: 'มุมขวาจบ!' },
  ]]},
  'ซ': { name: 'ซ. โซ่', strokes: [[
    { x: 180, y: 180, num: 1, text: 'หัวด้านล่าง' },
    { x: 150, y: 150, num: 2, text: 'ม้วนหลัง' },
    { x: 180, y: 110, num: 3, text: 'ปิดหัว' },
    { x: 220, y: 130, num: 4, text: 'หยักขึ้น' },
    { x: 260, y: 170, num: 5, text: 'ลงขวา' },
    { x: 210, y: 280, num: 6, text: 'โค้งลำตัว' },
    { x: 160, y: 390, num: 7, text: 'ฐานล่าง' },
    { x: 290, y: 390, num: 8, text: 'มุมขวาจบ!' },
  ]]},
  'ฌ': { name: 'ฌ. เฌอ', strokes: [[
    { x: 130, y: 180, num: 1, text: 'หัวซ้าย' },
    { x: 100, y: 150, num: 2, text: 'ม้วนหลัง' },
    { x: 130, y: 110, num: 3, text: 'ปิดหัว' },
    { x: 170, y: 150, num: 4, text: 'ออกจากหัว' },
    { x: 200, y: 220, num: 5, text: 'ลงลำตัว' },
    { x: 200, y: 390, num: 6, text: 'ฐานล่างกลาง' },
    { x: 290, y: 390, num: 7, text: 'มุมขวา' },
    { x: 290, y: 180, num: 8, text: 'ตรงขึ้น' },
    { x: 260, y: 120, num: 9, text: 'หยักบนขวา' },
    { x: 320, y: 100, num: 10, text: 'จบที่ปลายหาง!' },
  ]]},
}

const ALPHABET_ORDER = ['ก', 'ข', 'ค', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ']

const PENCIL_COLORS = [
  { name: 'น้ำเงิน', color: '#4F46E5' },
  { name: 'แดง',     color: '#EF4444' },
  { name: 'เขียว',   color: 'var(--sage)' },
  { name: 'เหลือง',  color: 'var(--mustard)' },
  { name: 'ชมพู',    color: '#EC4899' },
]

/* ════════════════════════════════════════════════════════════════
   Particle helper
══════════════════════════════════════════════════════════════ */
interface Particle {
  x: number; y: number; color: string
  size: number; speedX: number; speedY: number
  alpha: number; decay: number
}
function makeParticle(x: number, y: number, color: string): Particle {
  return {
    x, y, color,
    size: Math.random() * 5 + 3,
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 3 - 1.5,
    alpha: 1,
    decay: Math.random() * 0.03 + 0.015,
  }
}

/* ════════════════════════════════════════════════════════════════
   LocalStorage
══════════════════════════════════════════════════════════════ */
const LS_ALPHABET  = 'yct-handwriting-alphabet'
const LS_COMPLETED = 'yct-handwriting-completed'

function loadAlphabetData(): Record<string, LetterData> {
  try {
    const saved = localStorage.getItem(LS_ALPHABET)
    if (saved) return { ...DEFAULT_ALPHABET, ...JSON.parse(saved) }
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_ALPHABET))
}
function loadCompleted(): Set<string> {
  try {
    const saved = localStorage.getItem(LS_COMPLETED)
    if (saved) return new Set<string>(JSON.parse(saved))
  } catch {}
  return new Set()
}

/* ════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
type Mood = 'happy' | 'cheer' | 'thinking' | 'default'

export default function HandwritingPage({ ctx: _ctx }: { ctx: AppCtx }) {
  /* ── React state (drives UI re-renders) ── */
  const [alphabet,             setAlphabet]             = useState<Record<string, LetterData>>(loadAlphabetData)
  const [currentLetter,        setCurrentLetter]        = useState('ก')
  const [currentStrokeIndex,   setCurrentStrokeIndex]   = useState(0)
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0)
  const [pencilColor,          setPencilColor]          = useState('#4F46E5')
  const [completedLetters,     setCompletedLetters]     = useState<Set<string>>(loadCompleted)
  const [designerMode,         setDesignerMode]         = useState(false)
  const [designerStrokes,      setDesignerStrokes]      = useState<Checkpoint[][]>([])
  const [mascotMood,           setMascotMood]           = useState<Mood>('happy')
  const [bubble,               setBubble]               = useState('สวัสดีค่ะหนูๆ! เลือกตัวอักษรแล้วเริ่มลากเลยน้า')
  const [nextHint,             setNextHint]             = useState('เริ่มลากจากจุดที่ 1')
  const [showWin,              setShowWin]              = useState(false)

  /* ── Refs (no re-renders, for canvas / animation / events) ── */
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const drawingPointsRef = useRef<{ x: number; y: number }[]>([])
  const particlesRef    = useRef<Particle[]>([])
  const isDrawingRef    = useRef(false)
  const audioCtxRef     = useRef<AudioContext | null>(null)
  const scaleRef        = useRef({ scale: TEMPLATE_SCALE, offsetX: 0, offsetY: 0 })
  const animationRef    = useRef<number>(0)
  /* Designer-mode: which checkpoint is being dragged */
  const draggingPointRef = useRef<{ strokeIdx: number; pointIdx: number } | null>(null)

  /* Mirror state in a ref so requestAnimationFrame can read current values */
  const stateRef = useRef({
    currentLetter, currentStrokeIndex, activeCheckpointIndex,
    pencilColor, designerMode, designerStrokes, alphabet,
  })
  useEffect(() => {
    stateRef.current = {
      currentLetter, currentStrokeIndex, activeCheckpointIndex,
      pencilColor, designerMode, designerStrokes, alphabet,
    }
  })

  /* ── Persist ── */
  useEffect(() => {
    try { localStorage.setItem(LS_COMPLETED, JSON.stringify([...completedLetters])) } catch {}
  }, [completedLetters])

  function saveAlphabet(next: Record<string, LetterData>) {
    setAlphabet(next)
    try { localStorage.setItem(LS_ALPHABET, JSON.stringify(next)) } catch {}
  }

  /* ── Audio ── */
  function initAudio() {
    if (!audioCtxRef.current) {
      const W = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
      const AC = window.AudioContext || W.webkitAudioContext
      if (AC) audioCtxRef.current = new AC()
    }
  }
  function playPop(freq = 440) {
    try {
      initAudio()
      const ac = audioCtxRef.current; if (!ac) return
      const osc = ac.createOscillator(); const gain = ac.createGain()
      osc.connect(gain); gain.connect(ac.destination)
      osc.type = 'sine'
      const now = ac.currentTime
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now); osc.stop(now + 0.1)
    } catch {}
  }
  function playFanfare() {
    try {
      initAudio()
      const ac = audioCtxRef.current; if (!ac) return
      const notes = [261.63, 329.63, 392.00, 523.25]
      const now = ac.currentTime
      notes.forEach((freq, idx) => {
        const osc = ac.createOscillator(); const gain = ac.createGain()
        osc.connect(gain); gain.connect(ac.destination)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.12)
        gain.gain.setValueAtTime(0.15, now + idx * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25)
        osc.start(now + idx * 0.12); osc.stop(now + idx * 0.12 + 0.3)
      })
    } catch {}
  }

  /* ── Canvas resize ── */
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const rect = c.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    c.width = rect.width; c.height = rect.height
    /* Letter template stays at fixed pixel size, centered in canvas */
    scaleRef.current = {
      scale:   TEMPLATE_SCALE,
      offsetX: (rect.width  - TEMPLATE_W) / 2,
      offsetY: (rect.height - TEMPLATE_H) / 2,
    }
  }, [])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    /* Measure after first paint to ensure layout has been computed */
    requestAnimationFrame(resizeCanvas)
    /* Watch container size changes (grid resize, window resize, etc.) */
    const ro = new ResizeObserver(() => resizeCanvas())
    ro.observe(c)
    return () => ro.disconnect()
  }, [resizeCanvas])

  /* ── Drawing ── */
  function drawEverything() {
    const c = canvasRef.current; if (!c) return
    const g = c.getContext('2d'); if (!g) return
    const { scale: sc, offsetX: ox, offsetY: oy } = scaleRef.current
    const tx = (lx: number) => lx * sc + ox
    const ty = (ly: number) => ly * sc + oy
    const s = stateRef.current

    g.clearRect(0, 0, c.width, c.height)

    if (!s.designerMode) {
      const letter = s.alphabet[s.currentLetter]
      if (letter) {
        /* template dashed lines */
        letter.strokes.forEach((stroke, si) => {
          g.save()
          g.lineCap = 'round'; g.lineJoin = 'round'

          /* glow */
          g.beginPath()
          g.moveTo(tx(stroke[0].x), ty(stroke[0].y))
          stroke.forEach(p => g.lineTo(tx(p.x), ty(p.y)))
          g.strokeStyle = 'rgba(255,255,255,0.08)'
          g.lineWidth = 36 * sc
          g.stroke()

          /* dashed */
          g.beginPath()
          g.moveTo(tx(stroke[0].x), ty(stroke[0].y))
          stroke.forEach(p => g.lineTo(tx(p.x), ty(p.y)))
          g.setLineDash([12 * sc, 16 * sc])
          g.strokeStyle = si === s.currentStrokeIndex
            ? 'rgba(255,255,255,0.42)'
            : 'rgba(255,255,255,0.15)'
          g.lineWidth = 14 * sc
          g.stroke()
          g.restore()
        })

        /* active pencil stroke — stays in raw canvas pixels */
        const pts = drawingPointsRef.current
        if (pts.length >= 2) {
          g.save()
          g.lineCap = 'round'; g.lineJoin = 'round'
          g.strokeStyle = s.pencilColor
          g.lineWidth = 10 * sc
          g.beginPath()
          g.moveTo(pts[0].x, pts[0].y)
          for (let i = 1; i < pts.length; i++) {
            const xc = (pts[i].x + pts[i-1].x) / 2
            const yc = (pts[i].y + pts[i-1].y) / 2
            g.quadraticCurveTo(pts[i-1].x, pts[i-1].y, xc, yc)
          }
          g.stroke(); g.restore()
        }

        /* checkpoints */
        letter.strokes.forEach((stroke, si) => {
          stroke.forEach((cp, idx) => {
            const cx = tx(cp.x); const cy = ty(cp.y)
            const r = 18 * sc
            const isCurStroke = si === s.currentStrokeIndex
            const isPast    = si < s.currentStrokeIndex || (si === s.currentStrokeIndex && idx < s.activeCheckpointIndex)
            const isActive  = si === s.currentStrokeIndex && idx === s.activeCheckpointIndex

            g.save()
            if (isPast) {
              g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2)
              g.fillStyle = '#7C9A6B'
              g.fill()
              g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.stroke()
              g.fillStyle = '#FFFFFF'
              g.font = `bold ${11 * sc}px sans-serif`
              g.textAlign = 'center'; g.textBaseline = 'middle'
              g.fillText('✓', cx, cy)
            } else if (isActive) {
              const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.15
              g.beginPath(); g.arc(cx, cy, r * 1.3 * pulse, 0, Math.PI * 2)
              g.fillStyle = 'rgba(217,119,87,0.30)'
              g.fill()
              g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2)
              g.fillStyle = '#D8A93C'
              g.fill()
              g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.stroke()
              g.fillStyle = '#FFFFFF'
              g.font = `bold ${13 * sc}px sans-serif`
              g.textAlign = 'center'; g.textBaseline = 'middle'
              g.fillText(String(cp.num), cx, cy)
            } else {
              g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2)
              g.fillStyle = isCurStroke ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'
              g.fill()
              g.strokeStyle = isCurStroke ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.12)'
              g.lineWidth = 1.5; g.stroke()
              g.fillStyle = `rgba(255,255,255,${isCurStroke ? 0.45 : 0.22})`
              g.font = `bold ${10 * sc}px sans-serif`
              g.textAlign = 'center'; g.textBaseline = 'middle'
              g.fillText(String(cp.num), cx, cy)
            }
            g.restore()
          })
        })
      }
    } else {
      /* Designer mode preview */
      s.designerStrokes.forEach((stroke, si) => {
        if (stroke.length > 1) {
          g.save()
          g.beginPath()
          g.moveTo(tx(stroke[0].x), ty(stroke[0].y))
          stroke.forEach(p => g.lineTo(tx(p.x), ty(p.y)))
          g.strokeStyle = si === s.designerStrokes.length - 1
            ? 'rgba(217,119,87,0.6)'
            : 'rgba(139,92,246,0.5)'
          g.lineWidth = 2; g.setLineDash([5, 5]); g.stroke()
          g.restore()
        }
        stroke.forEach((cp, idx) => {
          const cx = tx(cp.x); const cy = ty(cp.y)
          g.save()
          const drag = draggingPointRef.current
          const isDragging = drag !== null && drag.strokeIdx === si && drag.pointIdx === idx
          const r = (isDragging ? 18 : 14) * sc
          /* Glow halo when being dragged */
          if (isDragging) {
            g.beginPath(); g.arc(cx, cy, r * 1.8, 0, Math.PI * 2)
            g.fillStyle = 'rgba(217,119,87,0.30)'
            g.fill()
          }
          g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2)
          g.fillStyle = isDragging ? '#F59E0B' : (si === s.designerStrokes.length - 1 ? '#D97757' : '#8B5E83')
          g.fill()
          g.strokeStyle = '#FFFFFF'; g.lineWidth = isDragging ? 3 : 2; g.stroke()
          g.fillStyle = '#FFFFFF'
          g.font = `bold ${(isDragging ? 12 : 10) * sc}px sans-serif`
          g.textAlign = 'center'; g.textBaseline = 'middle'
          g.fillText(String(idx + 1), cx, cy)
          g.restore()
        })
      })
    }

    /* Particles */
    const particles = particlesRef.current
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.speedX; p.y += p.speedY; p.alpha -= p.decay
      if (p.alpha <= 0) { particles.splice(i, 1); continue }
      g.save()
      g.globalAlpha = p.alpha
      g.fillStyle = p.color
      g.beginPath()
      const spikes = 5
      let rot = Math.PI / 2 * 3
      const step = Math.PI / spikes
      const outerR = p.size, innerR = p.size / 2
      g.moveTo(p.x, p.y - outerR)
      for (let k = 0; k < spikes; k++) {
        g.lineTo(p.x + Math.cos(rot) * outerR, p.y + Math.sin(rot) * outerR); rot += step
        g.lineTo(p.x + Math.cos(rot) * innerR, p.y + Math.sin(rot) * innerR); rot += step
      }
      g.closePath(); g.fill(); g.restore()
    }
  }

  /* Animation loop */
  useEffect(() => {
    function loop() {
      drawEverything()
      animationRef.current = requestAnimationFrame(loop)
    }
    animationRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  /* ── Pointer logic ── */
  function getPos(e: MouseEvent | TouchEvent) {
    const c = canvasRef.current; if (!c) return { x: 0, y: 0 }
    const rect = c.getBoundingClientRect()
    const isTouch = 'touches' in e
    const clientX = isTouch ? e.touches[0].clientX : (e as MouseEvent).clientX
    const clientY = isTouch ? e.touches[0].clientY : (e as MouseEvent).clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function checkpointHit(px: number, py: number) {
    const s = stateRef.current
    const letter = s.alphabet[s.currentLetter]; if (!letter) return
    if (s.currentStrokeIndex >= letter.strokes.length) return
    const stroke = letter.strokes[s.currentStrokeIndex]
    if (s.activeCheckpointIndex >= stroke.length) return

    const tgt = stroke[s.activeCheckpointIndex]
    const { scale: sc, offsetX: ox, offsetY: oy } = scaleRef.current
    const targetX = tgt.x * sc + ox, targetY = tgt.y * sc + oy
    const dist = Math.hypot(px - targetX, py - targetY)
    const hitZone = 25 * sc

    if (dist < hitZone) {
      const newIdx = s.activeCheckpointIndex + 1
      playPop(280 + newIdx * 40)
      for (let i = 0; i < 15; i++) particlesRef.current.push(makeParticle(targetX, targetY, s.pencilColor))

      setMascotMood('cheer')
      setTimeout(() => setMascotMood('happy'), 700)

      if (newIdx >= stroke.length) {
        if (s.currentStrokeIndex < letter.strokes.length - 1) {
          /* Sync stateRef immediately so next mousemove sees updated values */
          stateRef.current.currentStrokeIndex   = s.currentStrokeIndex + 1
          stateRef.current.activeCheckpointIndex = 0
          setCurrentStrokeIndex(s.currentStrokeIndex + 1)
          setActiveCheckpointIndex(0)
          drawingPointsRef.current = []
          setBubble(`ดีมาก! ตอนนี้เริ่ม stroke ที่ ${s.currentStrokeIndex + 2} น้า ลากจากจุดที่ 1`)
          setNextHint(letter.strokes[s.currentStrokeIndex + 1][0].text || 'เริ่มลากจากจุดที่ 1')
        } else {
          triggerWin()
        }
      } else {
        /* Sync stateRef immediately so next mousemove sees updated index */
        stateRef.current.activeCheckpointIndex = newIdx
        setActiveCheckpointIndex(newIdx)
        const next = stroke[newIdx]
        setBubble(`เก่งมาก! ต่อไปจุดที่ ${newIdx + 1}`)
        setNextHint(next.text || `ลากผ่านจุดที่ ${next.num}`)
      }
    }
  }

  function triggerWin() {
    isDrawingRef.current = false
    playFanfare()
    setMascotMood('cheer')
    setCompletedLetters(prev => new Set(prev).add(stateRef.current.currentLetter))
    setShowWin(true)
  }

  /* ── Native event handlers (touch needs passive: false) ── */
  useEffect(() => {
    const c = canvasRef.current; if (!c) return

    /* Find a designer checkpoint near (px, py) in canvas pixel space.
       Hit radius matches the visible dot size (14×scale) so clicking just
       *outside* an existing dot adds a new point instead of starting a drag. */
    function findCheckpointAt(px: number, py: number) {
      const { scale: sc, offsetX: ox, offsetY: oy } = scaleRef.current
      const strokes = stateRef.current.designerStrokes
      const hitR = 14 * sc
      for (let si = 0; si < strokes.length; si++) {
        for (let pi = 0; pi < strokes[si].length; pi++) {
          const cp = strokes[si][pi]
          const cx = cp.x * sc + ox; const cy = cp.y * sc + oy
          if (Math.hypot(px - cx, py - cy) < hitR) {
            return { strokeIdx: si, pointIdx: pi }
          }
        }
      }
      return null
    }

    function onDown(e: MouseEvent | TouchEvent) {
      e.preventDefault(); initAudio()
      const s = stateRef.current
      if (s.designerMode) {
        const pos = getPos(e)
        /* First: see if we clicked on an existing point → start dragging it */
        const hit = findCheckpointAt(pos.x, pos.y)
        if (hit) {
          draggingPointRef.current = hit
          return
        }
        /* Empty space → add a new point at this position */
        const { scale: sc, offsetX: ox, offsetY: oy } = scaleRef.current
        const lx = Math.round((pos.x - ox) / sc)
        const ly = Math.round((pos.y - oy) / sc)
        setDesignerStrokes(prev => {
          const next = prev.length === 0 ? [[]] : prev.map(s2 => [...s2])
          const last = next[next.length - 1]
          last.push({ x: lx, y: ly, num: last.length + 1, text: '' })
          return next
        })
        return
      }
      isDrawingRef.current = true
      const pos = getPos(e)
      drawingPointsRef.current = [pos]
      checkpointHit(pos.x, pos.y)
    }
    function onMove(e: MouseEvent | TouchEvent) {
      const s = stateRef.current
      if (s.designerMode) {
        /* If dragging a checkpoint, update its position */
        const drag = draggingPointRef.current
        if (drag) {
          e.preventDefault()
          const pos = getPos(e)
          const { scale: sc, offsetX: ox, offsetY: oy } = scaleRef.current
          const lx = Math.round((pos.x - ox) / sc)
          const ly = Math.round((pos.y - oy) / sc)
          setDesignerStrokes(prev => {
            const next = prev.map(arr => [...arr])
            if (next[drag.strokeIdx] && next[drag.strokeIdx][drag.pointIdx]) {
              next[drag.strokeIdx][drag.pointIdx] = {
                ...next[drag.strokeIdx][drag.pointIdx], x: lx, y: ly,
              }
            }
            return next
          })
        }
        return
      }
      if (!isDrawingRef.current) return
      e.preventDefault()
      const pos = getPos(e)
      drawingPointsRef.current.push(pos)
      if (Math.random() < 0.35) {
        particlesRef.current.push(makeParticle(pos.x, pos.y, s.pencilColor))
      }
      checkpointHit(pos.x, pos.y)
    }
    function onUp() {
      isDrawingRef.current = false
      draggingPointRef.current = null
    }

    c.addEventListener('mousedown',  onDown)
    c.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)
    c.addEventListener('touchstart', onDown, { passive: false })
    c.addEventListener('touchmove',  onMove, { passive: false })
    window.addEventListener('touchend',   onUp)
    return () => {
      c.removeEventListener('mousedown',  onDown)
      c.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      c.removeEventListener('touchstart', onDown)
      c.removeEventListener('touchmove',  onMove)
      window.removeEventListener('touchend',   onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── Actions ── */
  function selectLetter(letter: string) {
    if (designerMode) toggleDesigner()
    setCurrentLetter(letter)
    setCurrentStrokeIndex(0)
    setActiveCheckpointIndex(0)
    drawingPointsRef.current = []
    particlesRef.current = []
    setMascotMood('happy')
    const info = alphabet[letter]
    setBubble(`ฝึกเขียน ${letter} (${info.name}) กันน้า ลากจากจุดที่ 1`)
    setNextHint(info.strokes[0][0].text || 'เริ่มลากจากจุดที่ 1')
  }

  function resetCheckpoints() {
    setCurrentStrokeIndex(0)
    setActiveCheckpointIndex(0)
    drawingPointsRef.current = []
    particlesRef.current = []
    setMascotMood('happy')
    setBubble(`เริ่มใหม่ได้น้า ลากจากจุดที่ 1 ของตัว ${currentLetter}`)
    setNextHint(alphabet[currentLetter].strokes[0][0].text || 'เริ่มลากจากจุดที่ 1')
  }

  function clearCanvas() {
    drawingPointsRef.current = []
  }

  function closeWinModal(goNext: boolean) {
    setShowWin(false)
    if (goNext) {
      const idx = ALPHABET_ORDER.indexOf(currentLetter)
      const nextIdx = (idx + 1) % ALPHABET_ORDER.length
      selectLetter(ALPHABET_ORDER[nextIdx])
    } else {
      resetCheckpoints()
    }
  }

  function toggleDesigner() {
    if (!designerMode) {
      setDesignerStrokes(JSON.parse(JSON.stringify(alphabet[currentLetter].strokes)))
      setDesignerMode(true)
      setBubble(`Designer Mode เปิดอยู่ — ลากจุดเพื่อย้ายตำแหน่ง คลิกพื้นที่ว่างเพื่อเพิ่มจุดใหม่`)
    } else {
      /* Save designer data back */
      if (designerStrokes.length > 0 && designerStrokes[0].length > 0) {
        const numbered = designerStrokes.map(stroke =>
          stroke.map((p, i) => ({ ...p, num: i + 1, text: p.text || `จุดที่ ${i + 1}` }))
        )
        const next = { ...alphabet, [currentLetter]: { ...alphabet[currentLetter], strokes: numbered } }
        saveAlphabet(next)
        setBubble(`บันทึก checkpoint ของตัว "${currentLetter}" เรียบร้อย!`)
      }
      setDesignerMode(false)
      resetCheckpoints()
    }
  }
  function addStroke() {
    setDesignerStrokes(prev => {
      if (prev.length === 0 || prev[prev.length - 1].length > 0) return [...prev, []]
      return prev
    })
  }
  function undoLastPoint() {
    setDesignerStrokes(prev => {
      if (prev.length === 0) return prev
      const next = prev.map(s => [...s])
      const last = next[next.length - 1]
      if (last.length > 0) last.pop()
      else if (next.length > 1) next.pop()
      return next
    })
  }
  function clearDesignerData() {
    if (confirm('ลบ checkpoint ทั้งหมดของตัวนี้?')) setDesignerStrokes([[]])
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(alphabet, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `yct-handwriting-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  /* ── Progress ── */
  const letter = alphabet[currentLetter]
  const totalCheckpoints = letter.strokes.reduce((sum, s) => sum + s.length, 0)
  let doneCheckpoints = 0
  for (let i = 0; i < currentStrokeIndex; i++) doneCheckpoints += letter.strokes[i].length
  doneCheckpoints += activeCheckpointIndex
  const percent = Math.round((doneCheckpoints / totalCheckpoints) * 100)

  /* ════════════════════════════════════════════════════════════
     Render
  ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* Title */}
      <div className="between mb-4">
        <div>
          <span className="chip chip-mustard">ภาษาไทย · ฝึกคัดอักษร</span>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '10px 0 4px', lineHeight: 1.3 }}>
            ห้องเรียนคัดลายมือ <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>กับน้องยัง</em>
          </h1>
          <p className="muted" style={{ margin: 0, maxWidth: 560 }}>
            ลากตามตัวเลข 1 → 2 → 3 ระบบจะให้เสียงและดาวเมื่อทำถูก
          </p>
        </div>
        <div className="row gap-2">
          <button onClick={toggleDesigner}
            className="btn btn-sm"
            style={{
              background: designerMode ? 'var(--rust)' : 'var(--cream-100)',
              color: designerMode ? 'white' : 'var(--ink-700)',
              border: '1px solid ' + (designerMode ? 'var(--rust-deep)' : 'var(--rule)'),
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <PenTool size={12} /> Designer
          </button>
          <button onClick={exportData}
            className="btn btn-soft btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: 16, alignItems: 'stretch' }}>

        {/* ── LEFT: Letter selector + tools ── */}
        <div className="col" style={{ gap: 12 }}>
          {/* Letters */}
          <section className="card">
            <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={12} /> เลือกตัวอักษร
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
              marginTop: 10,
            }}>
              {ALPHABET_ORDER.map(l => {
                const isActive    = l === currentLetter
                const isCompleted = completedLetters.has(l)
                return (
                  <button key={l} onClick={() => selectLetter(l)}
                    style={{
                      position: 'relative', aspectRatio: '1/1', padding: 4,
                      background: isActive ? 'var(--rust-tint)' : 'var(--surface)',
                      border: isActive ? '2px solid var(--rust)' : '1.5px solid var(--rule)',
                      borderRadius: 'var(--r-md)', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform .15s',
                    }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 24,
                      color: isActive ? 'var(--rust-deep)' : isCompleted ? 'var(--sage)' : 'var(--ink-500)',
                    }}>{l}</span>
                    <span style={{ fontSize: 9, color: isActive ? 'var(--rust-deep)' : 'var(--ink-500)', marginTop: 2, fontWeight: 600 }}>
                      {alphabet[l]?.name.split(' ').slice(-1)[0]}
                    </span>
                    {isCompleted && (
                      <Star size={12} fill="var(--mustard)" color="var(--mustard)"
                        style={{ position: 'absolute', top: -4, right: -4 }} />
                    )}
                  </button>
                )
              })}
            </div>
            <div style={{
              marginTop: 10, padding: '6px 10px', textAlign: 'center',
              background: 'var(--cream-100)', borderRadius: 'var(--r-md)',
              fontSize: 'var(--text-xs)', color: 'var(--ink-700)',
            }}>
              <b>{completedLetters.size}</b> / {ALPHABET_ORDER.length} ตัวที่ผ่านแล้ว
            </div>
          </section>

          {/* Pencil colors */}
          <section className="card">
            <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Palette size={12} /> สีดินสอ
            </div>
            <div style={{
              display: 'flex', gap: 8, justifyContent: 'space-between',
              padding: 10, marginTop: 10,
              background: 'var(--cream-100)', borderRadius: 'var(--r-md)',
            }}>
              {PENCIL_COLORS.map(p => (
                <button key={p.color} onClick={() => setPencilColor(p.color)} title={p.name}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: p.color, cursor: 'pointer',
                    border: '2px solid white',
                    transform: pencilColor === p.color ? 'scale(1.18)' : 'scale(1)',
                    boxShadow: pencilColor === p.color ? '0 4px 10px rgba(31,27,22,.2)' : 'none',
                    transition: 'all .15s',
                  }} />
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="col" style={{ gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={clearCanvas}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Eraser size={12} /> ลบกระดาน
            </button>
            <button className="btn btn-soft btn-sm" onClick={resetCheckpoints}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RotateCcw size={12} /> เริ่มฝึกใหม่
            </button>
          </div>
        </div>

        {/* ── CENTER: Canvas ── */}
        <div ref={containerRef} className="lift"
          style={{
            padding: 12, position: 'relative',
            background: designerMode ? 'var(--rust-tint)' : 'var(--cream-100)',
            border: designerMode ? '3px dashed var(--rust)' : '8px solid #6B4423',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden', minHeight: 540,
          }}>
          <div style={{
            position: 'relative', width: '100%', height: '100%', minHeight: 520,
            background: '#1A2A1F',
            backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,.4)',
            overflow: 'hidden',
          }}>
            {/* HUD top-left */}
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 10,
              background: 'rgba(0,0,0,.45)', color: '#D8E7DA',
              padding: '4px 10px', borderRadius: 'var(--r-pill)',
              fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C9A6B' }} />
              {designerMode ? 'Designer mode' : 'ลากดินสอผ่านวงกลมตามลำดับ'}
            </div>
            {/* HUD top-right */}
            <div style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              background: 'rgba(0,0,0,.45)', color: '#D8E7DA',
              padding: '4px 12px', borderRadius: 'var(--r-pill)',
              fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 600,
            }}>
              <span>สำเร็จ</span>
              <div style={{ width: 64, height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: percent + '%',
                  background: 'linear-gradient(to right, var(--sage), #B5D196)',
                  transition: 'width .3s',
                }} />
              </div>
              <span>{percent}%</span>
            </div>

            <canvas ref={canvasRef}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                cursor: designerMode ? 'pointer' : 'crosshair',
                touchAction: 'none',
              }} />

            {/* Designer toolbar */}
            {designerMode && (
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--rust)', color: 'white',
                padding: '8px 14px', borderRadius: 'var(--r-pill)',
                fontSize: 'var(--text-xs)', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 10, zIndex: 10,
                boxShadow: '0 6px 16px rgba(184,90,61,.4)',
              }}>
                <PenTool size={12} /> Designer
                <span style={{ opacity: .5 }}>·</span>
                <button onClick={addStroke}
                  style={{ background: 'rgba(255,255,255,.12)', color: 'white', border: 0, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
                  + Stroke
                </button>
                <button onClick={undoLastPoint}
                  style={{ background: 'rgba(255,255,255,.12)', color: 'white', border: 0, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
                  Undo
                </button>
                <button onClick={clearDesignerData}
                  style={{ background: 'rgba(0,0,0,.3)', color: 'white', border: 0, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Mascot + Hint ── */}
        <div className="col" style={{ gap: 12 }}>
          <section className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{
              position: 'relative',
              background: 'var(--rust-tint)', border: '1.5px solid var(--rust-soft)',
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              fontSize: 'var(--text-sm)', color: 'var(--rust-deep)',
              fontWeight: 500, lineHeight: 1.5, marginBottom: 12,
            }}>
              {bubble}
              <div style={{
                position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
                width: 12, height: 12, background: 'var(--rust-tint)',
                borderRight: '1.5px solid var(--rust-soft)', borderBottom: '1.5px solid var(--rust-soft)',
              }} />
            </div>
            <YungMascot size={120} mood={mascotMood} className={mascotMood === 'cheer' ? 'pop' : 'bob'} />
            <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 8, fontWeight: 600 }}>
              คุณครูน้องยัง
            </div>
          </section>

          <section className="card">
            <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ListOrdered size={12} /> ขั้นตอนถัดไป
            </div>
            <div style={{
              marginTop: 8, padding: 12,
              background: 'var(--cream-100)', borderRadius: 'var(--r-md)',
              fontSize: 'var(--text-sm)', color: 'var(--ink-800)', lineHeight: 1.5, minHeight: 60,
            }}>
              {nextHint}
            </div>
            <div style={{
              marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--rule)',
              fontSize: 10, color: 'var(--ink-500)', lineHeight: 1.5,
            }}>
              💡 <b>Designer Mode</b> — ลากจุดที่มีอยู่เพื่อย้ายตำแหน่ง · คลิกพื้นที่ว่างเพื่อเพิ่มจุดใหม่ · กด Undo เพื่อลบจุดล่าสุด
            </div>
          </section>
        </div>
      </div>

      {/* Win modal */}
      {showWin && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(31,27,22,.6)',
          backdropFilter: 'blur(6px)', zIndex: 100,
          display: 'grid', placeItems: 'center', padding: 16,
        }}>
          <div className="pop" style={{
            background: 'var(--surface)', borderRadius: 'var(--r-xl)',
            padding: 40, maxWidth: 400, width: '100%', textAlign: 'center',
            border: '3px solid var(--mustard)', position: 'relative',
            boxShadow: '0 24px 60px rgba(31,27,22,.4)',
          }}>
            <button onClick={() => closeWinModal(false)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'var(--cream-100)', border: 0, borderRadius: '50%',
                width: 28, height: 28, cursor: 'pointer',
                display: 'grid', placeItems: 'center', color: 'var(--ink-700)',
              }}>
              <X size={14} />
            </button>
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'var(--mustard)', border: '4px solid white',
              fontSize: 40, display: 'grid', placeItems: 'center',
              margin: '-65px auto 16px', boxShadow: '0 8px 20px rgba(216,169,60,.4)',
            }}>🎉</div>
            <h3 className="display" style={{ fontSize: 'var(--text-2xl)', margin: '0 0 8px', color: 'var(--rust)' }}>
              สุดยอดไปเลย!
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-700)', margin: '0 0 16px' }}>
              เขียน <b>"{letter.name}"</b> สำเร็จครบถ้วน
            </p>
            <div className="row pop" style={{ justifyContent: 'center', gap: 4, marginBottom: 24 }}>
              {[1,2,3,4,5].map(i => (
                <Sparkles key={i} size={26} fill="var(--mustard)" color="var(--mustard)" />
              ))}
            </div>
            <div className="row gap-2">
              <button className="btn btn-ghost" onClick={() => closeWinModal(false)} style={{ flex: 1 }}>
                ฝึกอีกครั้ง
              </button>
              <button className="btn btn-primary" onClick={() => closeWinModal(true)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                ตัวต่อไป <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
