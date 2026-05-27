import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { YungLogo } from '@/components/YungLogo'
import { YungMascot } from '@/components/YungMascot'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

interface LoginPageProps {
  navigate?: (id: string) => void
}

export default function LoginPage({ navigate }: LoginPageProps = {}) {
  const go = (id: string) => navigate?.(id)

  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [remember,      setRemember]      = useState(true)
  const [loading,       setLoading]       = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    /* Mock auth — replace with real API call later */
    setTimeout(() => go('home'), 700)
  }
  function handleGoogle() {
    setLoading(true)
    setTimeout(() => go('home'), 700)
  }

  return (
    <div className="auth-layout">
      {/* ── Form column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          {/* Top: back + logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
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
            ยินดีต้อนรับกลับ
          </h1>
          <p className="muted" style={{ fontSize: 'var(--text-base)', margin: '0 0 32px' }}>
            เข้าสู่ระบบเพื่อเรียนรู้ต่อกับน้องยัง
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
              transition: 'background 150ms, border 150ms',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--cream-50)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}>
            <GoogleIcon size={20} /> เข้าใช้ด้วย Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: 'var(--ink-500)', fontSize: 'var(--text-xs)' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
            หรือ
            <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
          </div>

          {/* Email + password form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
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
                <input id="password" type={showPassword ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="auth-input"
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-700)', cursor: 'pointer' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                จดจำการเข้าใช้
              </label>
              <button type="button"
                style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--rust)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                ลืมรหัสผ่าน?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : <>เข้าสู่ระบบ <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 'var(--text-sm)', color: 'var(--ink-600)' }}>
            ยังไม่มีบัญชี?{' '}
            <button type="button" onClick={() => go('signup')}
              style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--rust)', fontWeight: 600, fontSize: 'inherit' }}>
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>

      {/* ── Decorative panel (hidden on mobile) ── */}
      <div className="auth-decoration"
        style={{
          background: 'var(--rust-tint)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 40, position: 'relative', overflow: 'hidden',
        }}>
        {/* Soft blob */}
        <div style={{
          position: 'absolute', inset: '15% 10% 20% 8%',
          background: 'rgba(255,255,255,.4)',
          borderRadius: '55% 45% 60% 40% / 50% 60% 40% 50%',
          border: '1px solid var(--rust-soft)',
        }} />
        <div className="yct-bob" style={{ position: 'relative', zIndex: 1 }}>
          <YungMascot size={260} mood="happy" interactive />
        </div>
        <div style={{ marginTop: 32, textAlign: 'center', maxWidth: 360, position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--yct-display)', fontSize: 'var(--text-2xl)', fontWeight: 380,
            letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 12px', color: 'var(--ink-900)',
          }}>
            น้องยังรอเรียนกับลูก<br />อยู่นะ
          </h2>
          <p style={{ color: 'var(--ink-700)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            ความก้าวหน้าและรางวัลของลูกจะถูกบันทึกไว้
            ทุกครั้งที่กลับมาเรียน
          </p>
        </div>
      </div>
    </div>
  )
}
