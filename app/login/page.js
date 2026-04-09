'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f2ee',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #e5e3df',
        padding: '40px 32px',
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>★</div>
        <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Brava Staff Hub</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>Internal use only</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter access code"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: error ? '1.5px solid #da5346' : '1px solid #e5e3df',
              fontSize: 15,
              marginBottom: 12,
              outline: 'none',
            }}
            autoFocus
          />
          {error && (
            <p style={{ color: '#da5346', fontSize: 13, marginBottom: 12 }}>
              Wrong access code. Try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !pw}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              background: pw ? '#4d6dff' : '#e5e3df',
              color: pw ? '#fff' : '#aaa',
              border: 'none',
              fontWeight: 500,
              fontSize: 15,
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
