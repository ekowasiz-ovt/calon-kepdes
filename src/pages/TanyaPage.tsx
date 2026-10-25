import { useEffect, useRef, useState, type FormEvent } from 'react'
import { PaperPlaneRight, Robot, User } from '@phosphor-icons/react'
import { useTanya } from '../hooks/useTanya'

type ChatMessage = { id: number; role: 'assistant' | 'user'; text: string }

const exampleQuestions = [
  'Ada program UMKM apa?',
  'Bagaimana cara mengurus surat?',
  'Kapan perbaikan jalan Dusun X?',
  'Informasi potensi pertanian?',
]

const welcomeMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  text: 'Halo! Saya Tanya Karanganyar. Asisten informasi desa. Silakan tanyakan apa yang Anda butuhkan.',
}

function messageId() {
  return Date.now() + Math.random()
}

export function TanyaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [question, setQuestion] = useState('')
  const mutation = useTanya()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, mutation.isPending])

  async function askQuestion(rawQuestion: string) {
    const text = rawQuestion.trim()
    if (!text || mutation.isPending) return

    setMessages((current) => [...current, { id: messageId(), role: 'user', text }])
    setQuestion('')

    try {
      const answer = await mutation.mutateAsync(text)
      setMessages((current) => [...current, {
        id: messageId(),
        role: 'assistant',
        text: answer || 'Terima kasih, pertanyaan Anda kami catat. Silakan hubungi kantor desa untuk informasi lebih lanjut.',
      }])
    } catch {
      setMessages((current) => [...current, {
        id: messageId(),
        role: 'assistant',
        text: 'Maaf, terjadi kendala. Coba lagi.',
      }])
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void askQuestion(question)
  }

  return (
    <div className="tanya-page kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Tanya Desa</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Tanya Karanganyar</h1>
        <p className="kampanye-lead">
          Tanyakan hal seputar layanan dan program desa. Jawaban diambil dari daftar pertanyaan yang
          tersedia.
        </p>
      </div>

      <div className="tanya-content">
        <section className="tanya-conversation" aria-label="Percakapan dengan Tanya Karanganyar" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`tanya-message tanya-message--${message.role}`}>
              {message.role === 'assistant' && (
                <span className="tanya-avatar tanya-avatar--bot"><Robot size={20} aria-hidden="true" /></span>
              )}
              <p>{message.text}</p>
              {message.role === 'user' && (
                <span className="tanya-avatar tanya-avatar--user"><User size={18} aria-hidden="true" /></span>
              )}
            </div>
          ))}

          {mutation.isPending && (
            <div className="tanya-message tanya-message--assistant" role="status" aria-label="Sedang mengetik">
              <span className="tanya-avatar tanya-avatar--bot"><Robot size={20} aria-hidden="true" /></span>
              <div className="tanya-typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </section>

        <section className="tanya-examples" aria-label="Contoh pertanyaan">
          <h2>Contoh pertanyaan</h2>
          <div className="tanya-examples__list">
            {exampleQuestions.map((example) => (
              <button
                key={example}
                type="button"
                disabled={mutation.isPending}
                className="tanya-example"
                onClick={() => void askQuestion(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        <form className="tanya-composer" onSubmit={handleSubmit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Tulis pertanyaan Anda..."
            aria-label="Tulis pertanyaan Anda"
            maxLength={300}
          />
          <button type="submit" disabled={!question.trim() || mutation.isPending} aria-label="Kirim pertanyaan">
            <PaperPlaneRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}