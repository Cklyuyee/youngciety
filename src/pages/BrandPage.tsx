import { YungMascot } from '@/components/YungMascot'
import { YungLogo } from '@/components/YungLogo'
import { SubjectGlyph } from '@/components/SubjectGlyph'
import type { AppCtx } from '@/types/app'

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 16, marginBottom: 24 }}>
        <h2 className="display" style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>{title}</h2>
        {sub && <p className="muted" style={{ margin: '6px 0 0', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{sub}</p>}
      </div>
      {children}
    </section>
  )
}

function Swatch({ name, hex, bg, dark }: { name: string; hex: string; bg: string; dark?: boolean }) {
  return (
    <div>
      <div style={{
        aspectRatio: '16/10', background: bg, borderRadius: 'var(--r-md)', border: '1px solid var(--rule)',
        padding: 14, display: 'flex', alignItems: 'flex-end',
        color: dark ? 'white' : 'var(--ink-900)',
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)',
      }}>{name}</div>
      <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 6 }}>{hex}</div>
    </div>
  )
}

function Quote({ dir, children }: { dir: 'up' | 'down'; children: React.ReactNode }) {
  return (
    <div style={{
      padding: 12,
      background: dir === 'up' ? 'var(--cream-50)' : 'rgba(184,73,60,.06)',
      border: '1px solid ' + (dir === 'up' ? 'var(--rule)' : 'rgba(184,73,60,.18)'),
      borderRadius: 'var(--r-md)',
      borderLeft: '3px solid ' + (dir === 'up' ? 'var(--ok)' : 'var(--err)'),
      fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink-800)',
    }}>
      {children}
    </div>
  )
}

export default function BrandPage({ ctx: _ctx }: { ctx: AppCtx }) {
  return (
    <>
      {/* Cover */}
      <header style={{ marginBottom: 60 }}>
        <div className="kicker">ระบบดีไซน์</div>
        <h1 className="display" style={{ fontSize: 'var(--text-4xl)', margin: '12px 0 16px' }}>
          Youngciety <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>Design System</em>
        </h1>
        <p style={{ maxWidth: 640, fontSize: 'var(--text-md)', color: 'var(--ink-700)', lineHeight: 1.65 }}>
          ระบบภาพและตัวอักษรที่อบอุ่น เป็นมิตร อ่านง่ายทั้งภาษาไทยและอังกฤษ
          เด็กรู้สึกชวนเล่น แต่ยังให้ความรู้สึกตั้งใจและน่าเชื่อถือต่อผู้ใหญ่
        </p>
      </header>

      {/* Brand foundations */}
      <Section title="Brand foundations" sub="ลัทธิและน้ำเสียง">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div className="kicker">Mission</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', lineHeight: 1.3, margin: '10px 0 0' }}>
              ให้เด็กไทยทุกคนได้เครื่องมือเรียนรู้ที่ดี <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>ติดตัวไปทั้งชีวิต</em>
            </p>
          </div>
          <div className="card">
            <div className="kicker">Vibe</div>
            <div className="col mt-2" style={{ gap: 6 }}>
              {[
                ['อบอุ่น',       'เหมือนกระดาษคราฟต์ ไม่ใช่หน้าจอคอม'],
                ['ตรงไปตรงมา', 'พูดเหมือนครูที่รักเด็ก ไม่พูดยาก'],
                ['มีลายเซ็น',   'Serif หนังสือ + cream + rust — เห็นแล้วจำได้'],
                ['ใจกว้าง',     'ภาษาไทยและอังกฤษ ระดับวัยที่กว้าง'],
              ].map(([k, v], i) => (
                <div key={i} className="row gap-3" style={{ alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--rust)', minWidth: 86 }}>{k}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-700)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Logo */}
      <Section title="Logo" sub="Wordmark · mark · lockups">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: 40, display: 'grid', placeItems: 'center', minHeight: 200 }}>
            <YungLogo size={48} />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
            <div className="card" style={{ display: 'grid', placeItems: 'center', background: 'var(--ink-900)' }}>
              <YungLogo size={28} />
            </div>
            <div className="card" style={{ display: 'grid', placeItems: 'center', background: 'var(--rust)' }}>
              <YungLogo size={28} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 16 }}>
          {[
            { label: 'Mark only',  el: <YungLogo size={56} /> },
            { label: 'Stacked',    el: <div style={{ textAlign: 'center' }}><YungLogo size={48} /><div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginTop: 6 }}>Youngciety</div></div> },
            { label: 'Dark bg',    el: <div style={{ background: 'var(--ink-900)', padding: 14, borderRadius: 'var(--r-md)' }}><YungLogo size={48} /></div> },
            { label: 'Tagline',    el: <div style={{ textAlign: 'center' }}><YungLogo size={20} /><div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xs)', color: 'var(--ink-600)', marginTop: 6 }}>A society for curious kids</div></div> },
          ].map((g, i) => (
            <div key={i} className="card" style={{ display: 'grid', placeItems: 'center', minHeight: 140 }}>
              <div>{g.el}</div>
              <div className="muted mt-3" style={{ fontSize: 'var(--text-xs)', textAlign: 'center' }}>{g.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Mascot */}
      <Section title="Mascot" sub="ตัวการ์ตูนประจำแบรนด์">
        <div className="card" style={{ padding: 32 }}>
          <div className="row gap-5" style={{ alignItems: 'center', marginBottom: 24 }}>
            <YungMascot size={140} mood="happy" className="bob" />
            <div style={{ flex: 1 }}>
              <div className="kicker">ชื่อเรียก</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', margin: '6px 0 8px' }}>
                ยัง <span style={{ color: 'var(--ink-500)' }}>· Yung</span>
              </div>
              <p style={{ color: 'var(--ink-700)', maxWidth: 560 }}>
                เมล็ดพันธุ์ที่กำลังงอก — เป็นสัญลักษณ์ของความอยากรู้ที่กำลังเติบโต
                สีดินเผาเหมือนกระถางต้นไม้ มีใบเขียวเล็กๆ บนหัวที่บอกว่าเขาคือ "young"
              </p>
            </div>
          </div>
          <div className="hr" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', textAlign: 'center' }}>
            {([
              { m: 'default',  l: 'ปกติ'  },
              { m: 'happy',    l: 'ยิ้ม'   },
              { m: 'cheer',    l: 'ดีใจ'   },
              { m: 'thinking', l: 'สงสัย'  },
              { m: 'sad',      l: 'เสียใจ' },
            ] as const).map(p => (
              <div key={p.m}>
                <YungMascot size={84} mood={p.m} />
                <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 6 }}>{p.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Color */}
      <Section title="Colour" sub="โทนหลัก + สีเสริมที่ใช้น้อย">
        <h3 className="display" style={{ fontSize: 'var(--text-lg)', margin: '0 0 12px' }}>Canvas — Cream</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            ['Cream 50',  '#FBF7EE', 'var(--cream-50)'],
            ['Cream 100', '#F5EFE4', 'var(--cream-100)'],
            ['Cream 200', '#ECE3D1', 'var(--cream-200)'],
            ['Cream 300', '#DDD1B8', 'var(--cream-300)'],
            ['Cream 400', '#C5B695', 'var(--cream-400)'],
          ].map(([n, h, v]) => <Swatch key={n} name={n} hex={h} bg={v} />)}
        </div>

        <h3 className="display" style={{ fontSize: 'var(--text-lg)', margin: '24px 0 12px' }}>Ink &amp; rule</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            ['Ink 900', '#1F1B16', 'var(--ink-900)', true],
            ['Ink 700', '#4A4339', 'var(--ink-700)', true],
            ['Ink 500', '#8B7F70', 'var(--ink-500)', true],
            ['Rule',    '#E5DDC9', 'var(--rule)'],
            ['Surface', '#FFFFFF', 'var(--surface)'],
          ].map(([n, h, v, d]) => <Swatch key={String(n)} name={String(n)} hex={String(h)} bg={String(v)} dark={!!d} />)}
        </div>

        <h3 className="display" style={{ fontSize: 'var(--text-lg)', margin: '24px 0 12px' }}>Primary — Rust</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            ['Rust',      '#D97757', 'var(--rust)',      true],
            ['Rust deep', '#B85A3D', 'var(--rust-deep)', true],
            ['Rust soft', '#F2D5C5', 'var(--rust-soft)'],
            ['Rust tint', '#FBE9DE', 'var(--rust-tint)'],
          ].map(([n, h, v, d]) => <Swatch key={String(n)} name={String(n)} hex={String(h)} bg={String(v)} dark={!!d} />)}
        </div>

        <h3 className="display" style={{ fontSize: 'var(--text-lg)', margin: '24px 0 12px' }}>
          Subject accents <span className="muted" style={{ fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>— ใช้น้อย เน้นบางจุด</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            ['Sage / คณิต',   '#7C9A6B', 'var(--sage)',    true],
            ['Mustard / ไทย', '#D8A93C', 'var(--mustard)', true],
            ['Sky / อังกฤษ',  '#6B89B3', 'var(--sky)',     true],
            ['Plum / Coding', '#8B5E83', 'var(--plum)',    true],
          ].map(([n, h, v, d]) => <Swatch key={String(n)} name={String(n)} hex={String(h)} bg={String(v)} dark={!!d} />)}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" sub="Source Serif 4 + Noto Sans Thai">
        <div className="card mb-4">
          <div className="kicker">Display — Source Serif 4</div>
          <div style={{ marginTop: 16 }}>
            <div className="display" style={{ fontSize: 84, lineHeight: 1, fontWeight: 360 }}>Aa ก ข</div>
            <div className="row gap-4 mt-2" style={{ color: 'var(--ink-600)', fontSize: 'var(--text-sm)' }}>
              <span>ใช้สำหรับ heading, ตัวเลข, quote</span>
              <span>· Weight 360–600</span>
              <span>· Optical size 36–72</span>
            </div>
          </div>
          <div className="hr" />
          <div className="col" style={{ gap: 10 }}>
            <div className="display" style={{ fontSize: 56, fontWeight: 360 }}>Heading XL — สังคมแห่งการเรียนรู้</div>
            <div className="display" style={{ fontSize: 32, fontStyle: 'italic', color: 'var(--rust)' }}>สำหรับเด็กที่อยากรู้ — Italic accent</div>
          </div>
        </div>

        <div className="card">
          <div className="kicker">Sans — Noto Sans Thai</div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 28, lineHeight: 1.3 }}>เลือกฟอนต์ที่อ่านง่ายทั้งภาษาไทยและอังกฤษ</div>
            <div style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--ink-700)', marginTop: 12, maxWidth: 600 }}>
              สำหรับเด็ก เราหลีกเลี่ยงฟอนต์ลายมือทุกประเภทเพื่อให้เด็กเห็นตัวอักษรที่ถูกต้อง
              The cat sat quietly on the warm afternoon windowsill.
            </div>
            <div className="row gap-3 mt-3" style={{ alignItems: 'baseline' }}>
              {[['Bold', 600], ['Medium', 500], ['Regular', 400], ['Light', 300]].map(([l, w]) => (
                <span key={String(l)} style={{ fontSize: 24, fontWeight: Number(w) }}>{l}</span>
              ))}
            </div>
          </div>
          <div className="hr" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              ['Display 3XL', 46, true,  'Section heads'],
              ['Display 2XL', 34, true,  'Subsections'],
              ['Body MD',     17, false, 'บทความ'],
              ['Caption',     13, false, 'label, chip'],
            ].map(([name, size, isDisplay, use]) => (
              <div key={String(name)}>
                <div style={{ fontSize: Number(size), fontFamily: isDisplay ? 'var(--font-display)' : 'var(--font-sans)', lineHeight: 1.2 }}>
                  {isDisplay ? 'Aa' : 'Aa คณิตศาสตร์'}
                </div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>{name} · {size}px</div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>{String(use)}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Components */}
      <Section title="Components">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div className="kicker">Buttons</div>
            <div className="row gap-3 mt-3" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary">เริ่มเรียน</button>
              <button className="btn btn-soft">ลองดู</button>
              <button className="btn btn-ghost">ยกเลิก</button>
            </div>
            <div className="row gap-3 mt-3" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm">เล็ก</button>
              <button className="btn btn-primary">ปกติ</button>
              <button className="btn btn-primary btn-lg">ใหญ่</button>
            </div>
          </div>

          <div className="card">
            <div className="kicker">Chips</div>
            <div className="row gap-2 mt-3" style={{ flexWrap: 'wrap' }}>
              <span className="chip">ทั้งหมด</span>
              <span className="chip chip-rust">คณิต · ใหม่</span>
              <span className="chip chip-sage">Lv 2</span>
              <span className="chip chip-mustard">ภาษาไทย</span>
              <span className="chip chip-sky">English</span>
              <span className="chip chip-plum">Coding</span>
            </div>
          </div>

          <div className="card">
            <div className="kicker">Cards</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div className="card-flat" style={{ padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Flat</div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>card-flat</div>
              </div>
              <div className="lift" style={{ padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>Lift</div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>lift</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="kicker">Progress bars</div>
            <div className="col mt-3" style={{ gap: 8 }}>
              <div className="bar"><i style={{ width: '78%' }} /></div>
              <div className="bar sage"><i style={{ width: '55%' }} /></div>
              <div className="bar mustard"><i style={{ width: '40%' }} /></div>
              <div className="bar plum"><i style={{ width: '20%' }} /></div>
            </div>
          </div>
        </div>
      </Section>

      {/* Subject icons */}
      <Section title="Subject icon system">
        <div className="card">
          <p className="muted" style={{ marginBottom: 18 }}>
            แต่ละวิชาใช้สี + ตัวอักษรตัวแทน เพื่อให้เด็กจดจำได้ง่ายโดยไม่ต้องอ่าน
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { id: 'math',    name: 'คณิตศาสตร์',  desc: 'Sage · ตัวเลข'   },
              { id: 'thai',    name: 'ภาษาไทย',    desc: 'Mustard · พยัญชนะ' },
              { id: 'english', name: 'ภาษาอังกฤษ', desc: 'Sky · Aa'          },
              { id: 'coding',  name: 'Coding',    desc: 'Plum · </>'         },
            ].map(s => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <SubjectGlyph subject={s.id as any} size={96} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', marginTop: 10 }}>{s.name}</div>
                <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Voice & tone */}
      <Section title="Voice & tone" sub="วิธีพูดกับเด็ก กับผู้ปกครอง">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div className="kicker" style={{ color: 'var(--ok)' }}>✓ เขียน</div>
            <div className="col mt-3" style={{ gap: 12 }}>
              <Quote dir="up">วันนี้คณิตเก่งขึ้น 9% เลย!</Quote>
              <Quote dir="up">ลองอีกครั้งดูนะ ใกล้แล้ว</Quote>
              <Quote dir="up">เก่งมาก! ได้รับ +10 ดาว</Quote>
            </div>
          </div>
          <div className="card">
            <div className="kicker" style={{ color: 'var(--err)' }}>✗ หลีกเลี่ยง</div>
            <div className="col mt-3" style={{ gap: 12 }}>
              <Quote dir="down">ผิด! เริ่มใหม่</Quote>
              <Quote dir="down">การตอบสนองของคุณไม่ถูกต้อง</Quote>
              <Quote dir="down">คุณได้รับการปลดล็อกความสำเร็จ</Quote>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer cta */}
      <div className="card-flat" style={{ marginTop: 60, padding: 40, textAlign: 'center', background: 'var(--rust-tint)', border: '1px solid var(--rust-soft)' }}>
        <YungMascot size={72} className="bob" mood="cheer" />
        <h2 className="display" style={{ fontSize: 'var(--text-2xl)', margin: '12px 0 6px' }}>นี่คือจุดเริ่มต้น</h2>
        <p className="muted" style={{ maxWidth: 520, margin: '0 auto' }}>
          ระบบจะเติบโตต่อตามฟีเจอร์ใหม่ — เปิดมุมมองให้ทีมและพันธมิตรเห็นทิศทางเดียวกัน
        </p>
      </div>
    </>
  )
}
