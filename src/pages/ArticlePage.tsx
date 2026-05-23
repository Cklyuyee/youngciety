import { useState } from 'react'
import { Play, Star, Sparkles, ArrowRight } from 'lucide-react'
import { YungMascot } from '@/components/YungMascot'
import type { AppCtx } from '@/types/app'

export default function ArticlePage({ ctx }: { ctx: AppCtx }) {
  const [answered, setAnswered] = useState<string | null>(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>
        {/* Article body */}
        <article>
          <div className="kicker">บทความ · ภาษาไทย · Lv 2</div>
          <h1 className="display" style={{ fontSize: 'var(--text-3xl)', margin: '10px 0 8px', letterSpacing: '-0.02em' }}>
            ทำไมท้องฟ้าถึงเป็นสีฟ้า?
          </h1>
          <div style={{ color: 'var(--ink-600)', fontSize: 'var(--text-sm)', marginBottom: 28 }}>
            เขียนโดย ครูฝน · ปรับปรุง 12 พ.ค. · อ่าน 4 นาที
          </div>

          {/* Hero image */}
          <div className="media-ph" style={{
            aspectRatio: '16/9', marginBottom: 24,
            background: 'linear-gradient(180deg, #B8D4E8, #E8C8A4)',
            border: '1px solid var(--rule)', color: 'rgba(255,255,255,.8)',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>
              (ภาพ: ท้องฟ้าและพระอาทิตย์)
            </span>
          </div>

          <div className="prose">
            <p>
              เคยมองท้องฟ้าตอนกลางวันแล้วสงสัยไหม ว่าทำไมท้องฟ้าถึงเป็น
              <em style={{ color: 'var(--rust)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}> สีฟ้า</em>?
              ทั้งๆ ที่แสงจากพระอาทิตย์ดูเหมือนจะเป็นสีขาวๆ
            </p>
            <p>
              ความลับอยู่ที่ <b>แสง</b> และ <b>อากาศ</b> ที่เราเดินผ่านมันทุกวันโดยไม่รู้ตัว
              แสงจากดวงอาทิตย์ความจริงแล้วประกอบด้วยสีหลายสี เหมือน
              สีของรุ้งกินน้ำ — แดง ส้ม เหลือง เขียว ฟ้า คราม ม่วง
            </p>
            <h2>แล้วทำไมแค่สีฟ้าเด่นออกมา?</h2>
            <p>
              เมื่อแสงเดินทางผ่านอากาศ มันชนกับอนุภาคเล็กๆ ในอากาศ
              แสงสีฟ้าและสีม่วงจะกระจายตัวออกไป<b>มากกว่า</b>สีอื่นๆ
              สายตาเราเห็นสีฟ้าง่ายกว่าสีม่วง เลยมองท้องฟ้าเป็นสีฟ้านั่นเอง!
            </p>
            <blockquote>
              ปรากฏการณ์นี้เรียกว่า "การกระเจิงของเรย์ลี"
              (Rayleigh scattering) ตั้งชื่อตามนักวิทยาศาสตร์ที่ค้นพบ
            </blockquote>
            <h2>แล้วตอนพระอาทิตย์ตกล่ะ?</h2>
            <p>
              ตอนพระอาทิตย์ตก แสงเดินทางผ่านอากาศไกลกว่าตอนกลางวัน
              แสงสีฟ้าหลุดไปเกือบหมด เหลือแต่สีส้มแดงเข้าตาเรา —
              ท้องฟ้าจึงกลายเป็นสีส้มแดงสวยงาม
            </p>
          </div>

          {/* End-of-article quiz */}
          <div className="card" style={{ marginTop: 36, background: 'var(--cream-50)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <YungMascot size={48} mood="thinking" />
              <div>
                <div className="kicker">คำถามท้ายเรื่อง</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>เข้าใจมากแค่ไหนนะ?</div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-md)', marginBottom: 14 }}>
              ทำไมตอนพระอาทิตย์ตก ท้องฟ้าถึงเป็นสีส้ม?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'a', t: 'เพราะพระอาทิตย์เปลี่ยนสีตอนกลางคืน' },
                { id: 'b', t: 'เพราะแสงเดินไกลขึ้น แสงสีฟ้าหลุดไป', correct: true },
                { id: 'c', t: 'เพราะอากาศเปลี่ยนเป็นสีส้ม' },
              ].map(o => {
                const picked = answered === o.id
                const right  = picked && (o as any).correct
                const wrong  = picked && !(o as any).correct
                return (
                  <button key={o.id} onClick={() => setAnswered(o.id)}
                    style={{
                      textAlign: 'left', padding: 14,
                      background: right ? 'var(--sage-soft)' : wrong ? '#F5DCD2' : 'var(--surface)',
                      border: '1.5px solid ' + (right ? 'var(--sage)' : wrong ? '#D9846B' : 'var(--rule)'),
                      borderRadius: 'var(--r-md)', cursor: 'pointer',
                      color: 'var(--ink-900)', fontSize: 'var(--text-base)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'var(--cream-100)', border: '1px solid var(--rule-2)',
                      display: 'grid', placeItems: 'center',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)',
                      flexShrink: 0,
                    }}>{o.id.toUpperCase()}</span>
                    {o.t}
                  </button>
                )
              })}
            </div>
            {answered === 'b' && (
              <div className="pop mt-4" style={{ display: 'flex', gap: 10, color: 'var(--ok)', alignItems: 'center' }}>
                <Sparkles size={16} /> เก่งมาก! ได้รับ <b>+10 ดาว</b> · อ่านเข้าใจเร็วจัง
              </div>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="kicker">ฟังก์ชันอ่าน</div>
            <div className="col mt-2" style={{ gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>
                🔊 ฟังบทความนี้
              </button>
              <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>
                📖 อ่านพร้อมไฮไลต์
              </button>
              <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>
                Aa ปรับขนาดตัวอักษร
              </button>
            </div>
          </div>

          <div className="card">
            <div className="kicker">วิดีโอที่เกี่ยวข้อง</div>
            <div className="media-ph mt-3" style={{
              aspectRatio: '16/9', position: 'relative',
              background: 'linear-gradient(180deg, #6FA0C6, #D9846B)',
              borderRadius: 'var(--r-md)', overflow: 'hidden',
            }}>
              <Play size={36} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', marginTop: 10 }}>
              การกระเจิงแสง
            </div>
            <div className="muted" style={{ fontSize: 'var(--text-xs)' }}>4 นาที</div>
          </div>

          <div className="card-flat" style={{ background: 'var(--rust-tint)', borderColor: 'var(--rust-soft)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)' }}>อยากเก่งเรื่องนี้?</div>
            <p style={{ color: 'var(--ink-800)', fontSize: 'var(--text-sm)', margin: '8px 0 14px' }}>
              เล่นเกมจับคู่ปรากฏการณ์ทางธรรมชาติ
            </p>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              onClick={() => ctx.navigate('math')}>
              ลองเลย <ArrowRight size={12} />
            </button>
          </div>

          <div className="card">
            <div className="kicker">คะแนนอ่านของคุณ</div>
            <div className="row mt-3" style={{ alignItems: 'center', gap: 8 }}>
              <Star size={20} color="var(--mustard)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>
                {ctx.user.stars}
              </div>
              <span className="muted" style={{ fontSize: 'var(--text-xs)' }}>ดาวสะสม</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
