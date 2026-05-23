import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, BookOpen, Star, User, Trophy } from 'lucide-react'

import {
  ProgressBar, LessonCard, QuizCard, FeedbackToast, Modal,
  StarBadge, XPBadge, CoinBadge, StreakCounter, WeekDots,
  AvatarSelector, FlashCard, AudioButton,
  DrawingCanvas, LevelMap, CharacterMascot,
} from '@/components/edu'

/* ── Section wrapper ── */
function Sec({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0, 0, 0.58, 1] }}
    >
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-neutral-900" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
        {sub && <p className="text-[14px] text-neutral-500 mt-1">{sub}</p>}
      </div>
      {children}
    </motion.section>
  )
}

/* ── Demo data ── */
const QUIZ_QUESTIONS = [
  {
    question: '🐧 เพนกวินอาศัยอยู่ที่ไหน?',
    options: ['แอฟริกา', 'แอนตาร์กติกา', 'อาร์กติก', 'ออสเตรเลีย'],
    correctIndex: 1,
  },
  {
    question: '🌍 โลกของเราโคจรรอบดาวอะไร?',
    options: ['ดวงจันทร์', 'ดาวอังคาร', 'ดวงอาทิตย์', 'ดาวพฤหัสบดี'],
    correctIndex: 2,
  },
]

const AVATARS = [
  { id: 'chick',   emoji: '🐔', name: 'ไก่น้อย', color: 'bg-[#FFF0FA]' },
  { id: 'lion',    emoji: '🦁', name: 'สิงโต',  color: 'bg-[#FFF7ED]' },
  { id: 'penguin', emoji: '🐧', name: 'เพนกวิน', color: 'bg-[#EFF6FF]' },
  { id: 'fox',     emoji: '🦊', name: 'จิ้งจอก', color: 'bg-[#FFF7ED]' },
  { id: 'bear',    emoji: '🐻', name: 'หมี',    color: 'bg-[#FAFAF0]' },
  { id: 'cat',     emoji: '🐱', name: 'แมว',   color: 'bg-[#FDF4FF]', locked: true },
  { id: 'rabbit',  emoji: '🐰', name: 'กระต่าย', color: 'bg-[#F0FFF4]', locked: true },
  { id: 'dragon',  emoji: '🐲', name: 'มังกร',  color: 'bg-[#FFF0FA]', locked: true },
]

const LEVELS = [
  { id: 1, title: 'บทที่ 1: ABC',       status: 'completed' as const, stars: 3, icon: '🔤' },
  { id: 2, title: 'บทที่ 2: ตัวเลข',   status: 'completed' as const, stars: 2, icon: '🔢' },
  { id: 3, title: 'บทที่ 3: สี',        status: 'completed' as const, stars: 3, icon: '🎨' },
  { id: 4, title: 'บทที่ 4: สัตว์',    status: 'current'   as const, stars: 0, icon: '🐾' },
  { id: 5, title: 'บทที่ 5: ธรรมชาติ', status: 'locked'    as const, icon: '🌿' },
  { id: 6, title: 'บทที่ 6: ร่างกาย',  status: 'locked'    as const, icon: '🧠' },
]

const NAV_ITEMS = [
  { id: 'home',   label: 'หน้าแรก',  icon: <Home size={20} /> },
  { id: 'learn',  label: 'เรียน',   icon: <BookOpen size={20} /> },
  { id: 'trophy', label: 'รางวัล',  icon: <Trophy size={20} />, badge: 3 },
  { id: 'stars',  label: 'ดาว',     icon: <Star size={20} /> },
  { id: 'me',     label: 'โปรไฟล์', icon: <User size={20} /> },
]

export default function EduDemo() {
  const [quizIdx, setQuizIdx]           = useState(0)
  const [feedback, setFeedback]         = useState<{ visible: boolean; correct: boolean }>({ visible: false, correct: false })
  const [modalOpen, setModalOpen]       = useState(false)
  const [selectedAvatar, setAvatar]     = useState('chick')
  const [activeNav, setActiveNav]       = useState('learn')
  const [mascotMood, setMascotMood]     = useState<'happy' | 'excited' | 'sad' | 'thinking'>('happy')
  const [mascotSpeech, setMascotSpeech] = useState<string | undefined>('สวัสดีค่า! มาเรียนด้วยกันเลย 🎉')

  const q = QUIZ_QUESTIONS[quizIdx % QUIZ_QUESTIONS.length]

  function handleAnswer(correct: boolean) {
    setFeedback({ visible: true, correct })
    setMascotMood(correct ? 'excited' : 'sad')
    setMascotSpeech(correct ? 'เก่งมากเลย! ถูกต้องเลย 🎉' : 'ไม่เป็นไรนะ ลองอีกครั้ง!')
  }

  function nextQuiz() {
    setFeedback({ visible: false, correct: false })
    setQuizIdx(i => i + 1)
    setMascotMood('happy')
    setMascotSpeech('ข้อต่อไปพร้อมมั้ย? 💪')
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-[var(--font-sans)] pb-20">

      {/* Header */}
      <div className="bg-brand-pink text-white px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold opacity-80 mb-1">สวัสดี, น้องไก่! 👋</p>
            <h1 className="text-[28px] font-black" style={{ fontFamily: 'var(--font-display)' }}>
              มาเรียนกันเลย!
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <StreakCounter days={7} active size="sm" />
            <XPBadge xp={420} size="sm" />
          </div>
        </div>
        {/* Week dots */}
        <div className="max-w-2xl mx-auto mt-5">
          <WeekDots activeDays={5} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-0">

        {/* 01 Progress */}
        <Sec title="📊 Progress Bar" sub="แสดงความก้าวหน้าบทเรียน">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6 space-y-5">
            <ProgressBar value={72} label="วิทยาศาสตร์" color="blue" />
            <ProgressBar value={45} label="คณิตศาสตร์" color="yellow" />
            <ProgressBar value={90} label="ภาษาอังกฤษ" color="green" size="lg" />
            <ProgressBar value={30} label="ศิลปะ" color="pink" size="sm" showPercent={false} />
          </div>
        </Sec>

        {/* 02 Badges */}
        <Sec title="⭐ Badges & Rewards" sub="ดาว, XP, เหรียญ">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6 flex flex-wrap gap-6 items-center">
            <StarBadge count={3} size="lg" />
            <StarBadge count={2} size="md" />
            <StarBadge count={1} size="sm" />
            <XPBadge xp={150} size="lg" />
            <XPBadge xp={50} size="md" />
            <CoinBadge count={1250} size="md" />
          </div>
        </Sec>

        {/* 03 Streak */}
        <Sec title="🔥 Streak Counter" sub="เรียนต่อเนื่องกี่วัน">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6 flex flex-wrap gap-8 items-center justify-center">
            <StreakCounter days={7}  active size="lg" />
            <StreakCounter days={14} active size="md" />
            <StreakCounter days={3}  active={false} size="sm" />
          </div>
        </Sec>

        {/* 04 Lesson Cards */}
        <Sec title="📚 Lesson Cards" sub="การ์ดบทเรียนแต่ละหัวข้อ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LessonCard title="สัตว์ในป่า" subject="วิทยาศาสตร์" icon="🦁" xp={30} duration="8 นาที" status="available" />
            <LessonCard title="การบวกเลข" subject="คณิตศาสตร์" icon="➕" xp={20} duration="5 นาที" status="completed" stars={3} />
            <LessonCard title="Hello World" subject="ภาษาอังกฤษ" icon="👋" xp={25} duration="6 นาที" status="completed" stars={2} />
            <LessonCard title="ระบบสุริยะ" subject="วิทยาศาสตร์" icon="🌍" xp={40} duration="10 นาที" status="locked" />
          </div>
        </Sec>

        {/* 05 Quiz */}
        <Sec title="❓ Quiz Card" sub="ตอบถูกรับ XP ทันที">
          <QuizCard
            key={quizIdx}
            question={q.question}
            options={q.options}
            correctIndex={q.correctIndex}
            questionNumber={(quizIdx % QUIZ_QUESTIONS.length) + 1}
            totalQuestions={QUIZ_QUESTIONS.length}
            onAnswer={handleAnswer}
          />
          {feedback.visible && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={nextQuiz}
                className="bg-brand-pink text-white font-bold px-8 py-3 rounded-full hover:bg-[#E63AAE] transition-colors cursor-pointer"
              >
                ข้อถัดไป →
              </button>
            </div>
          )}
        </Sec>

        {/* 06 Flash Card */}
        <Sec title="🃏 Flash Card" sub="แตะเพื่อพลิก — ท่องจำคำศัพท์">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FlashCard
              front={<><span className="text-[48px]">🐘</span><br />Elephant</>}
              back="ช้าง (chāng)"
            />
            <FlashCard
              front={<><span className="text-[48px]">🦋</span><br />Butterfly</>}
              back="ผีเสื้อ (phī seūa)"
              frontBg="bg-[#EFF6FF]"
              backBg="bg-[#FFF0FA]"
            />
          </div>
        </Sec>

        {/* 07 Audio Button */}
        <Sec title="🔊 Audio Button" sub="กดฟังเสียงคำ/ประโยค">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-8">
            <div className="flex flex-wrap gap-10 items-end justify-center">
              <AudioButton label="ฟังคำว่า\n'Apple'" size="lg" />
              <AudioButton label="ฟังประโยค" size="md" />
              <AudioButton size="sm" />
            </div>
          </div>
        </Sec>

        {/* 08 Avatar Selector */}
        <Sec title="🐾 Avatar Selector" sub="เลือกตัวละคร — ล็อกตัวที่ยังไม่ได้ปลดล็อก">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6">
            <AvatarSelector
              avatars={AVATARS}
              selected={selectedAvatar}
              onSelect={setAvatar}
              columns={4}
            />
            <p className="text-center text-[13px] text-neutral-500 mt-4">
              เลือกอยู่: <strong>{AVATARS.find(a => a.id === selectedAvatar)?.name}</strong>
            </p>
          </div>
        </Sec>

        {/* 09 Character Mascot */}
        <Sec title="🐔 Character Mascot" sub="ตัวนำทาง — อารมณ์เปลี่ยนตามผลตอบสนอง">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6">
            <div className="flex justify-center mb-5">
              <CharacterMascot mood={mascotMood} speech={mascotSpeech} size="lg" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {(['happy', 'excited', 'thinking', 'sad'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMascotMood(m); setMascotSpeech(
                    m === 'happy'    ? 'สวัสดีค่า! 😊' :
                    m === 'excited'  ? 'ยอดเยี่ยมมาก!! 🤩' :
                    m === 'thinking' ? 'อืมม... ลองคิดดูนะ 🤔' :
                    'ไม่เป็นไรนะ 😢',
                  )}}
                  className="px-4 py-2 rounded-full border border-neutral-300 text-[13px] font-bold cursor-pointer hover:border-brand-pink hover:text-brand-pink transition-colors"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Sec>

        {/* 10 Modal */}
        <Sec title="💬 Modal / Dialog" sub="popup สรุปผล, ยืนยัน, อธิบาย">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-6 text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-brand-pink text-white font-bold px-8 py-3 rounded-full hover:bg-[#E63AAE] transition-colors cursor-pointer"
            >
              เปิด Modal ตัวอย่าง
            </button>
          </div>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="🏆 ผ่านแบบทดสอบแล้ว!">
            <div className="text-center py-4">
              <div className="text-[64px] mb-4">🎉</div>
              <StarBadge count={3} size="lg" className="justify-center mb-4" />
              <p className="text-[16px] font-bold text-neutral-700 mb-2">คะแนน: 80/100</p>
              <XPBadge xp={30} size="md" className="mx-auto" />
              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 w-full bg-brand-pink text-white font-bold py-3 rounded-full hover:bg-[#E63AAE] transition-colors cursor-pointer"
              >
                เยี่ยมมาก! ต่อไป →
              </button>
            </div>
          </Modal>
        </Sec>

        {/* 11 Level Map */}
        <Sec title="🗺 Level Map" sub="แผนที่บทเรียนแบบ Duolingo">
          <div className="bg-white rounded-[var(--radius-sm)] border border-neutral-200 p-8">
            <LevelMap
              levels={LEVELS}
              onSelect={id => alert(`เลือก Level ${id}`)}
            />
          </div>
        </Sec>

        {/* 12 Drawing Canvas */}
        <Sec title="✏️ Drawing Canvas" sub="วาดรูปตอบคำถาม / ฝึกเขียน — บันทึกเป็น PNG ได้">
          <DrawingCanvas width={600} height={320} />
        </Sec>

        {/* 13 Bottom Nav (preview box) */}
        <Sec title="📱 Bottom Nav Bar" sub="navigation แบบ mobile-first">
          <div className="bg-neutral-900 rounded-[var(--radius-sm)] overflow-hidden">
            <div className="h-32 flex items-center justify-center">
              <p className="text-white/40 text-[14px]">— content area —</p>
            </div>
            <div className="relative bg-white border-t border-neutral-200">
              <div className="flex items-stretch justify-around h-16">
                {NAV_ITEMS.map(item => {
                  const isActive = item.id === activeNav
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className="relative flex flex-col items-center justify-center gap-0.5 flex-1 cursor-pointer"
                    >
                      {isActive && (
                        <motion.div layoutId="demo-nav-bg"
                          className="absolute top-2 inset-x-2 h-8 rounded-full bg-[#FFF0FA]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {item.badge != null && item.badge > 0 && (
                        <span className="absolute top-1.5 right-2 min-w-[18px] h-[18px] rounded-full bg-brand-pink text-white text-[10px] font-black flex items-center justify-center px-1 z-10">
                          {item.badge}
                        </span>
                      )}
                      <span className={`relative z-10 ${isActive ? 'text-brand-pink' : 'text-neutral-400'}`}>{item.icon}</span>
                      <span className={`relative z-10 text-[10px] font-bold ${isActive ? 'text-brand-pink' : 'text-neutral-400'}`}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Sec>

      </div>

      {/* Feedback Toast overlay */}
      <FeedbackToast
        type={feedback.correct ? 'correct' : 'incorrect'}
        xp={feedback.correct ? 30 : undefined}
        message={feedback.correct ? 'ฉลาดมาก เก่งมากเลย!' : 'คำตอบที่ถูกต้องคือข้อ B นะ'}
        visible={feedback.visible}
        onDone={() => setFeedback(f => ({ ...f, visible: false }))}
      />
    </div>
  )
}
