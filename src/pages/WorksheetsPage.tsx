import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

type SubjId = 'math' | 'thai' | 'english' | 'coding'
type FilterId = 'all' | SubjId

const CHIP_MAP: Record<SubjId, string>  = { math: 'chip-sage', thai: 'chip-mustard', english: 'chip-sky', coding: 'chip-plum' }
const LABEL_MAP: Record<SubjId, string> = { math: 'คณิต', thai: 'ไทย', english: 'อังกฤษ', coding: 'Coding' }

interface Worksheet {
  subj: SubjId
  title: string
  pages: number
  level: string
  downloads: number
}

const WORKSHEETS: Worksheet[] = [
  { subj: 'math',    title: 'บวกเลข 2 หลัก (ชุดที่ 1)',  pages: 4, level: 'Lv 2', downloads: 1840 },
  { subj: 'math',    title: 'ลบเลข 2 หลัก (มีการยืม)',  pages: 4, level: 'Lv 3', downloads: 1234 },
  { subj: 'math',    title: 'นับ 1-100 หน้าฝึก',          pages: 2, level: 'Lv 1', downloads: 3120 },
  { subj: 'thai',    title: 'คัดพยัญชนะ ก-ฮ',            pages: 6, level: 'Lv 1', downloads: 4310 },
  { subj: 'thai',    title: 'คัดสระและวรรณยุกต์',          pages: 4, level: 'Lv 2', downloads: 1820 },
  { subj: 'english', title: 'Trace letters A-Z',          pages: 6, level: 'Lv 1', downloads: 2840 },
  { subj: 'english', title: 'Sight words level 1',        pages: 4, level: 'Lv 2', downloads: 1640 },
  { subj: 'coding',  title: 'Unplugged: ลำดับคำสั่ง',      pages: 3, level: 'Lv 2', downloads: 920 },
]

function WorksheetPreview({ subject }: { subject: SubjId; title?: string }) {
  const grad: Record<SubjId, string> = {
    math:    'linear-gradient(160deg, #E8F0DF 0%, #C9D9BB 100%)',
    thai:    'linear-gradient(160deg, #FBF0D0 0%, #F0D890 100%)',
    english: 'linear-gradient(160deg, #DAE4F2 0%, #B0C8E0 100%)',
    coding:  'linear-gradient(160deg, #EDDDEB 0%, #CBA8C8 100%)',
  }
  return (
    <div style={{
      aspectRatio: '4/3',
      background: grad[subject],
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: 16,
    }}>
      <SubjectGlyph subject={subject} size={56} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '80%' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            height: 6, borderRadius: 3,
            background: 'rgba(31,27,16,.12)',
            width: i === 2 ? '60%' : '100%',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', color: 'rgba(31,27,16,.5)', fontSize: 11 }}>
        <FileText size={12} /> PDF
      </div>
    </div>
  )
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',     label: 'ทั้งหมด' },
  { id: 'math',    label: 'คณิตศาสตร์' },
  { id: 'thai',    label: 'ภาษาไทย' },
  { id: 'english', label: 'ภาษาอังกฤษ' },
  { id: 'coding',  label: 'Coding' },
]

export default function WorksheetsPage({ ctx: _ctx }: { ctx: AppCtx }) {
  const [filter, setFilter] = useState<FilterId>('all')
  const filtered = filter === 'all' ? WORKSHEETS : WORKSHEETS.filter(w => w.subj === filter)

  return (
    <>
      <div className="mb-5">
        <div className="kicker">แบบฝึกหัด</div>
        <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '8px 0 0' }}>โหลด PDF · ปริ้นได้</h1>
        <p className="muted" style={{ maxWidth: 600, marginTop: 10 }}>
          แบบฝึกหัดในรูปแบบ PDF สำหรับเขียนลงบนกระดาษ เหมาะกับเด็กที่ต้องการฝึกควบคู่กับการเล่นในระบบ
        </p>
      </div>

      {/* Subject filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className="btn btn-sm"
            style={{
              background: filter === f.id ? 'var(--ink-900)' : 'var(--surface)',
              color: filter === f.id ? 'var(--cream-50)' : 'var(--ink-800)',
              border: '1px solid ' + (filter === f.id ? 'var(--ink-900)' : 'var(--rule)'),
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Worksheet grid */}
      <div className="tile-grid">
        {filtered.map((w, i) => (
          <div key={i} className="lift" style={{ padding: 0, overflow: 'hidden' }}>
            <WorksheetPreview subject={w.subj} title={w.title} />
            <div style={{ padding: 16 }}>
              <span className={`chip ${CHIP_MAP[w.subj]}`}>
                {LABEL_MAP[w.subj]} · {w.level}
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', margin: '8px 0 4px', lineHeight: 1.3 }}>
                {w.title}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginBottom: 14 }}>
                {w.pages} หน้า · ดาวน์โหลดแล้ว {w.downloads.toLocaleString()} ครั้ง
              </div>
              <button className="btn btn-soft btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={() => alert('จำลองการดาวน์โหลด PDF')}>
                <Download size={14} /> ดาวน์โหลด PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
