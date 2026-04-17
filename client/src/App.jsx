import { useState, useRef } from 'react'
import Board from './components/Board'
import logo from './assets/logo.png'

const WALLPAPERS = [
  { label: 'None', value: '' },
  { label: 'Ocean', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80' },
  { label: 'Forest', value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80' },
  { label: 'Mountains', value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80' },
  { label: 'City', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80' },
]

function App() {
  const [search, setSearch] = useState('')

  // Persist dark mode to localStorage
  const [dark, setDark] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kando_dark') ?? 'false') } catch { return false }
  })

  // Persist wallpaper to localStorage
  const [wallpaper, setWallpaper] = useState(() => {
    try { return localStorage.getItem('kando_wallpaper') || null } catch { return null }
  })

  // Controlled select value so "Upload image..." can be chosen repeatedly
  const [wallpaperSelect, setWallpaperSelect] = useState(() => {
    try {
      const saved = localStorage.getItem('kando_wallpaper') || ''
      // Only pre-select if it's one of the preset values
      return WALLPAPERS.find(w => w.value === saved) ? saved : ''
    } catch { return '' }
  })

  const [showAbout, setShowAbout] = useState(false)
  const fileInputRef = useRef(null)

  // Persist custom labels to localStorage
  const [customLabels, setCustomLabels] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kando_custom_labels') || '[]') } catch { return [] }
  })

  const handleAddCustomLabel = (label) => {
    setCustomLabels(prev => {
      const updated = [...prev, label]
      localStorage.setItem('kando_custom_labels', JSON.stringify(updated))
      return updated
    })
  }

  const toggleDark = () => {
    setDark(d => {
      const next = !d
      localStorage.setItem('kando_dark', JSON.stringify(next))
      return next
    })
  }

  const handleWallpaperChange = (e) => {
    const val = e.target.value
    if (val === '__upload__') {
      // Reset select so the same option can be chosen again next time
      setWallpaperSelect('')
      fileInputRef.current.click()
    } else {
      setWallpaperSelect(val)
      setWallpaper(val || null)
      localStorage.setItem('kando_wallpaper', val || '')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setWallpaper(url)
    // Can't persist blob URLs across sessions; clear any saved preset
    localStorage.removeItem('kando_wallpaper')
    // Reset file input so the same file can be re-uploaded if needed
    e.target.value = ''
  }

  const navBg = dark ? 'rgba(15,15,30,0.92)' : 'rgba(0,82,155,0.95)'

  return (
    <div style={{
      minHeight: '100vh',
      background: dark ? '#1a1a2e' : '#e2e8f0',
      color: dark ? '#f1f5f9' : '#1e293b',
    }}>

      {/* Wallpaper layer */}
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
        background: navBg,
        backdropFilter: 'blur(6px)',
        color: 'white',
      }}>

        {/* Left: search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            className="nav-search"
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.35rem 0.75rem', borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.4)',
              fontSize: '0.85rem', width: '200px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              outline: 'none',
            }}
          />
        </div>

        {/* Center: logo */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}>
          <img src={logo} alt="Kando" style={{ height: '36px', filter: 'invert(1) brightness(2)' }} />
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>

          {/* Wallpaper select */}
          <select
            value={wallpaperSelect}
            onChange={handleWallpaperChange}
            style={{
              padding: '0.3rem 0.5rem', borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {WALLPAPERS.map(w => (
              <option key={w.label} value={w.value} style={{ background: '#1e3a5f', color: 'white' }}>
                {w.label}
              </option>
            ))}
            <option value="__upload__" style={{ background: '#1e3a5f', color: 'white' }}>
              📁 Upload image...
            </option>
          </select>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px', padding: '0.35rem 0.75rem',
              color: 'white', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            {dark ? '☀ Light' : '☾ Dark'}
          </button>

          {/* About */}
          <button
            onClick={() => setShowAbout(true)}
            style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px', padding: '0.35rem 0.75rem',
              color: 'white', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            About
          </button>
        </div>
      </div>

      {/* Board */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <Board
          search={search}
          dark={dark}
          customLabels={customLabels}
          onAddCustomLabel={handleAddCustomLabel}
        />
      </div>

      {/* About modal */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#1e1e2e' : 'white',
              color: dark ? '#f1f5f9' : '#1e293b',
              borderRadius: '12px', padding: '2rem',
              maxWidth: '480px', width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <img src={logo} alt="Kando" style={{ height: '48px', filter: dark ? 'invert(1) brightness(2)' : 'none' }} />
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>About Kando</h2>
            </div>
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              <strong>Kando</strong> is a double win of a name — a pun on <em>Kanban</em> and the <em>"Can-do"</em> attitude. Built with the belief that getting things done should feel empowering, not overwhelming.
            </p>
            <p style={{ marginBottom: '1rem', lineHeight: '1.7' }}>
              The logo was inspired by <strong>Kendo</strong> — the Japanese martial art of sword fighting. Just like Kendo demands focus, discipline, and decisiveness, Kando helps you cut through the noise and move work forward with intention.
            </p>
            <p style={{ marginBottom: '1.25rem', lineHeight: '1.7' }}>
              Built by <strong>Raymund Sean Clapano</strong>.
            </p>
            <p style={{ fontSize: '0.82rem', color: dark ? '#94a3b8' : '#64748b', marginBottom: '1.5rem' }}>
              A name that sounds like confidence. A logo that means it.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '6px',
                border: 'none', background: '#0052a3',
                color: 'white', cursor: 'pointer', fontSize: '0.9rem'
              }}
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