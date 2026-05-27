import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { RouteId, AppCtx, AppUser, SubjectProgress } from '@/types/app'
import LandingPage from '@/pages/LandingPage'
import AppShell from '@/components/AppShell'

/* Page transition variants */
const fullPage = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}
const innerPage = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

const LoginPage    = lazy(() => import('@/pages/LoginPage'))
const SignupPage   = lazy(() => import('@/pages/SignupPage'))

/* ── Hash-based routing helpers ── */
const VALID_ROUTES: RouteId[] = [
  'landing', 'login', 'signup',
  'home', 'journey', 'subjects', 'library', 'worksheets',
  'math', 'coding', 'handwriting', 'article', 'parent', 'brand',
]
function getRouteFromHash(): RouteId {
  const h = window.location.hash.replace(/^#\/?/, '')
  if (!h) return 'landing'
  return (VALID_ROUTES.includes(h as RouteId) ? h : 'landing') as RouteId
}

const HomeScreen    = lazy(() => import('@/pages/HomeScreen'))
const JourneyPage   = lazy(() => import('@/pages/JourneyPage'))
const SubjectsPage  = lazy(() => import('@/pages/SubjectsPage'))
const LibraryPage   = lazy(() => import('@/pages/LibraryPage'))
const WorksheetsPage= lazy(() => import('@/pages/WorksheetsPage'))
const ArticlePage   = lazy(() => import('@/pages/ArticlePage'))
const MathGamePage  = lazy(() => import('@/pages/MathGamePage'))
const CodingGamePage= lazy(() => import('@/pages/CodingGamePage'))
const HandwritingPage=lazy(() => import('@/pages/HandwritingPage'))
const ParentPage    = lazy(() => import('@/pages/ParentPage'))
const BrandPage     = lazy(() => import('@/pages/BrandPage'))

const PAGES: Record<string, React.ComponentType<{ ctx: AppCtx }>> = {
  home:        HomeScreen,
  journey:     JourneyPage,
  subjects:    SubjectsPage,
  library:     LibraryPage,
  worksheets:  WorksheetsPage,
  article:     ArticlePage,
  math:        MathGamePage,
  coding:      CodingGamePage,
  handwriting: HandwritingPage,
  parent:      ParentPage,
  brand:       BrandPage,
}

function PageFallback() {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink-500)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>กำลังโหลด…</div>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState<RouteId>(() => getRouteFromHash())

  /* Sync URL ↔ state — browser back/forward + manual hash edits both work */
  useEffect(() => {
    function onHashChange() {
      setRoute(getRouteFromHash())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const [user, setUser] = useState<AppUser>({
    name: 'น้องอุ๋ม', enName: 'Umm',
    age: 8, avatar: '🦊',
    streak: 7, stars: 184, level: 6,
  })

  const [progress, setProgress] = useState<Record<string, SubjectProgress>>({
    math:    { lessons: 22, total: 40, accuracy: 91, streak: 4 },
    thai:    { lessons: 14, total: 32, accuracy: 87, streak: 2 },
    english: { lessons: 18, total: 30, accuracy: 84, streak: 3 },
    coding:  { lessons:  6, total: 18, accuracy: 95, streak: 1 },
  })

  const bumpProgress = useCallback((subject: string, delta = 1, accuracyHint?: number) => {
    setProgress(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        lessons: Math.min(prev[subject].total, prev[subject].lessons + delta),
        accuracy: accuracyHint == null
          ? prev[subject].accuracy
          : Math.round((prev[subject].accuracy + accuracyHint) / 2),
      },
    }))
  }, [])

  const navigate = useCallback((id: RouteId) => {
    if (id === 'landing') {
      /* Strip hash so the bare URL = landing — keeps things tidy */
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search)
        setRoute('landing')
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      }
    } else {
      /* Setting hash triggers `hashchange` → listener updates state */
      window.location.hash = `/${id}`
    }
  }, [])

  const ctx: AppCtx = { user, setUser, progress, bumpProgress, navigate, route }

  const navWrap = (id: string) => navigate(id as RouteId)

  /* Outer transition uses one of 4 keys: landing / login / signup / app.
     App routes (home, journey, etc.) share key="app" so AppShell doesn't
     unmount when switching between them — only its inner page does. */
  const isAuth   = route === 'login' || route === 'signup'
  const isShell  = route !== 'landing' && !isAuth
  const outerKey = isShell ? 'app' : route

  const PageComponent = PAGES[route]

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={outerKey} {...fullPage}>

        {route === 'landing' && <LandingPage navigate={navWrap} />}

        {route === 'login' && (
          <Suspense fallback={<PageFallback />}>
            <LoginPage navigate={navWrap} />
          </Suspense>
        )}

        {route === 'signup' && (
          <Suspense fallback={<PageFallback />}>
            <SignupPage navigate={navWrap} />
          </Suspense>
        )}

        {isShell && (
          <AppShell route={route} navigate={navigate} ctx={ctx}>
            <Suspense fallback={<PageFallback />}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={route} {...innerPage}>
                  {PageComponent
                    ? <PageComponent ctx={ctx} />
                    : <ComingSoon label={route} />
                  }
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </AppShell>
        )}

      </motion.div>
    </AnimatePresence>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--ink-600)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>{label}</div>
      <div style={{ marginTop: 8 }}>หน้านี้กำลังจัดเตรียม</div>
    </div>
  )
}
