import { useRef, useState, useEffect } from 'react'
import { Pencil, Eraser, Trash2, Download } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DrawingCanvasProps {
  width?: number
  height?: number
  onSave?: (dataUrl: string) => void
  className?: string
}

const COLORS = [
  '#000000', '#FF44CB', '#0073E6', '#22C55E',
  '#F47820', '#F5B731', '#7C3AED', '#DC2626',
]

export function DrawingCanvas({
  width = 400, height = 280, onSave, className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [tool, setTool]   = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = width / rect.width
    const scaleY = height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      }
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top)  * scaleY,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    setDrawing(true)
    lastPos.current = getPos(e)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (!drawing) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)

    ctx.beginPath()
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth   = tool === 'eraser' ? brushSize * 4 : brushSize
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  function stopDraw() { setDrawing(false); lastPos.current = null }

  function clearCanvas() {
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
  }

  function handleSave() {
    const dataUrl = canvasRef.current!.toDataURL('image/png')
    onSave?.(dataUrl)
    const a = document.createElement('a')
    a.href = dataUrl; a.download = 'drawing.png'; a.click()
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-neutral-50 rounded-[var(--radius-sm)] border border-neutral-200">
        {/* Tools */}
        <div className="flex gap-1">
          {([
            { id: 'pen', icon: <Pencil size={15} />, label: 'วาด' },
            { id: 'eraser', icon: <Eraser size={15} />, label: 'ลบ' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-bold',
                'border transition-colors duration-150 cursor-pointer',
                tool === t.id
                  ? 'bg-brand-pink border-brand-pink text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-brand-pink',
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex gap-1.5 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pen') }}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-transform cursor-pointer',
                color === c && tool === 'pen'
                  ? 'border-neutral-900 scale-125'
                  : 'border-transparent hover:scale-110',
              )}
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-bold text-neutral-500">ขนาด</span>
          <input
            type="range" min={1} max={20} value={brushSize}
            onChange={e => setBrushSize(+e.target.value)}
            className="w-20 accent-brand-pink cursor-pointer"
          />
          <span className="text-[12px] font-bold w-4 text-neutral-700">{brushSize}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={clearCanvas}
            title="ล้างทั้งหมด"
            className="p-2 rounded-full border border-neutral-300 text-neutral-500 hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={handleSave}
            title="บันทึก"
            className="p-2 rounded-full border border-neutral-300 text-neutral-500 hover:border-brand-pink hover:text-brand-pink transition-colors cursor-pointer"
          >
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        className={cn(
          'w-full rounded-[var(--radius-sm)] border-2 border-neutral-300',
          'shadow-[var(--shadow-sm)]',
          tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair',
        )}
        style={{ touchAction: 'none', display: 'block' }}
      />
    </div>
  )
}
