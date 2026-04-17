import { useState } from 'react'
import Board from './components/Board'
import logo from './assets/logo.png'

const WALLPAPERS = [
  { label: 'None', value: null },
  { label: 'Ocean', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80' },
  { label: 'Forest', value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80' },
  { label: 'Mountains', value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80' },
  { label: 'City', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80' },
]

function App() {
  const [search, setSearch] = useState('')
  const [dark, setDark] = useState(false)
  const [wallpaper, setWallpaper] = useState(null)
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#1a1a2e' : '#e2e8f0',
      color: dark ? '#f1f5f9' : '#1e293b',
      position: 'relative',
    }}>

      {/* Wallpaper */}
      {wallpaper && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.45)',
        }} />
      )}

      {/* Navbar */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.6rem 1.5rem',
        background: dark ? 'rgba(15,15,30,0.85)' : 'rgba(0,82,155,0.9)',
        backdropFilter: 'blur(6px)',
        color: 'white',
      }}>
        {/* Left: search */}
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '0.35rem 0.75rem', borderRadius: '4px',
            border: 'none', fontSize: '0.85rem', width: '200px',
            background: 'rgba(255,255,255,0.2)', color: 'white',
          }}
        />

        {/* Center: logo */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={logo} alt="Kando" style={{ height: '36px', filter: 'invert(1) brightness(2)' }} />
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            onChange={e => setWallpaper(e.target.value || null)}
            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: 'none', fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            {WALLPAPERS.map(w => (
              <option key={w.label} value={w.value || ''}>{w.label}</option>
            ))}
          </select>
          <button
            onClick={() => setDark(d => !d)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {dark ? '☀ Light' : '☾ Dark'}
          </button>
          <button
            onClick={() => setShowAbout(true)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            About
          </button>
        </div>
      </div>

      {/* Board */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Board search={search} dark={dark} />
      </div>

      {/* About modal */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#1e1e2e' : 'white',
              color: dark ? '#f1f5f9' : '#1e293b',
              borderRadius: '12px', padding: '2rem', maxWidth: '480px', width: '90%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img src={logo} alt="Kando" style={{ height: '48px', filter: dark ? 'invert(1) brightness(2)' : 'none' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>About Kando</h2>
            </div>
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              <strong>Kando</strong> is a double win of a name — a pun on <em>Kanban</em> and the <em>"Can-do"</em> attitude. It's a board built with the belief that getting things done should feel empowering, not overwhelming.
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              The logo was inspired by <strong>Kendo</strong> — the Japanese martial art of sword fighting. Just like Kendo demands focus, discipline, and decisiveness, Kando is built to help you cut through the noise and move your work forward with intention.
            </p>
            <p style={{ fontSize: '0.85rem', color: dark ? '#94a3b8' : '#64748b' }}>
              A name that sounds like confidence. A logo that means it.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              style={{ marginTop: '1.5rem', padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#0052a3', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App