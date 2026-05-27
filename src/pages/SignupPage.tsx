import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { YungLogo } from '@/components/YungLogo'
import { YungMascot } from '@/components/YungMascot'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

interface SignupPageProps {
  navigate?: (id: string) => void
}

export default function SignupPage({ navigate }: SignupPageProps = {}) {
  const go = (id: string) => navigate?.(id)

  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [acceptTos,     setAcceptTos]     = useState(false)
  const [loading,       setLoading]       = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!acceptTos) return
    setLoading(true)
    setTimeout(() => go('home'), 700)
  }
  function handleGoogle() {
    setLoading(true)
    setTimeout(() => go('home'), 700)
  }

  /* Simple password strength check */
  const passwordStrength = password.length >= 10 ? 'strong'
    : password.length >= 6 ? 'ok'
    : password.length > 0 ? 'weak'
    : null

  return (
    <div className="auth-layout">
      {/* ── Form column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <button onClick={() => go('landing')}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> กลับหน้าแรก
            </button>
            <YungLogo size={26} />
          </div>

          <h1 style={{
            fontFamily: 'var(--yct-display)', fontSize: 'var(--text-3xl)', fontWeight: 380,
            letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 8px', color: 'var(--ink-900)',
          }}>
            สมัครสมาชิกฟรี
          </h1>
          <p className="muted" style={{ fontSize: 'var(--text-base)', margin: '0 0 28px' }}>
            เริ่มต้นเรียนกับน้องยัง · ไม่ต้องใช้บัตรเครดิต
          </p>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={loading}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--surface)', color: 'var(--ink-900)',
              border: '1.5px solid var(--rule)', borderRadius: 'var(--r-md)',
              fontSize: 'var(--text-base)', fontFamily: 'var(--yct-sans)', fontWeight: 500,
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 150ms',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--cream-50)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}>
            <GoogleIcon size={20} /> สมัครด้วย Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--ink-500)', fontSize: 'var(--text-xs)' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
            หรือกรอกข้อมูล
            <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="name" className="kicker" style={{ display: 'block', marginBottom: 6 }}>ชื่อผู้ปกครอง</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--ink-500)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input id="name" type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="คุณแม่/คุณพ่อ ..." className="auth-input" />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label htmlFor="email" className="kicker" style={{ display: 'block', marginBottom: 6 }}>อีเมล</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--ink-500)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input id="email" type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" className="auth-input" />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="password" className="kicker" style={{ display: 'block', marginBottom: 6 }}>รหัสผ่าน</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--ink-500)"
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input id="password" type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร" className="auth-input"
                  style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 0, cursor: 'pointer',
                    color: 'var(--ink-500)', padding: 4, display: 'grid', placeItems: 'center',
                  }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {passwordStrength && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 'var(--text-xs)' }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--cream-200)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'ok' ? '60%' : '25%',
                      height: '100%',
                      background: passwordStrength === 'strong' ? 'var(--sage)' : passwordStrength === 'ok' ? 'var(--mustard)' : 'var(--rust)',
                      transition: 'width 200ms, background 200ms',
                    }} />
                  </div>
                  <span style={{ color: 'var(--ink-600)', minWidth: 60, textAlign: 'right' }}>
                    {passwordStrength === 'strong' ? 'แข็งแกร่ง' : passwordStrength === 'ok' ? 'พอใช้' : 'อ่อนเกินไป'}
                  </span>
                </div>
              )}
            </div>

            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              marginTop: 18, marginBottom: 20,
              fontSize: 'var(--text-sm)', color: 'var(--ink-700)', cursor: 'pointer', lineHeight: 1.55,
            }}>
              <input type="checkbox" checked={acceptTos} onChange={e => setAcceptTos(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }} />
              <span>
                ฉันยอมรับ
                <a href="#" style={{ color: 'var(--rust)', fontWeight: 500, textDecoration: 'none', margin: '0 4px' }}>ข้อกำหนดการใช้งาน</a>
                และ
                <a href="#" style={{ color: 'var(--rust)', fontWeight: 500, textDecoration: 'none', margin: '0 4px' }}>นโยบายความเป็นส่วนตัว</a>
              </span>
            </label>

            <button type="submit" disabled={loading || !acceptTos}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
                opacity: (!acceptTos || loading) ? 0.55 : 1,
                cursor: (!acceptTos || loading) ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'กำลังสมัครสมาชิก...' : <>เริ่มเรียนเลย <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 'var(--text-sm)', color: 'var(--ink-600)' }}>
            มีบัญชีแล้ว?{' '}
            <button type="button" onClick={() => go('login')}
              style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--rust)', fontWeight: 600, fontSize: 'inherit' }}>
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>

      {/* ── Decorative panel ── */}
      <div className="auth-decoration"
        style={{
          background: 'var(--rust-tint)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 40, position: 'relative', overflow: 'hidden',
        }}>
        <div style={{
          position: 'absolute', inset: '15% 10% 20% 8%',
          background: 'rgba(255,255,255,.4)',
          borderRadius: '55% 45% 60% 40% / 50% 60% 40% 50%',
          border: '1px solid var(--rust-soft)',
        }} />

        <div className="yct-bob" style={{ position: 'relative', zIndex: 1 }}>
          <YungMascot size={240} mood="cheer" interactive />
        </div>

        <div style={{ marginTop: 28, textAlign: 'center', maxWidth: 360, position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--yct-display)', fontSize: 'var(--text-2xl)', fontWeight: 380,
            letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 16px', color: 'var(--ink-900)',
          }}>
            <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>ฟรี!</em> ตลอดการเรียน 3 บท/วัน
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {[
              'ไม่ต้องใช้บัตรเครดิต',
              'รายงานความก้าวหน้ารายสัปดาห์',
              'ครอบครัวเดียวใช้ได้หลายคน',
              'ไม่มีโฆษณา ปลอดภัยต่อเด็ก',
            ].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-800)', fontSize: 'var(--text-sm)' }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'var(--sage)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Check size={12} color="white" strokeWidth={3} />
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
