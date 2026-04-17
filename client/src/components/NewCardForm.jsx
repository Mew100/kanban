import { useState } from 'react'
import axios from 'axios'

const DEFAULT_LABELS = [
  { value: '', display: 'No label', color: null },
  { value: 'finished',     display: 'Finished',     color: '#4CAF50' },
  { value: 'upcoming',     display: 'Upcoming',     color: '#F9C74F' },
  { value: 'at-risk',      display: 'At Risk',      color: '#FF9800' },
  { value: 'overdue',      display: 'Overdue',      color: '#f44336' },
  { value: 'in-progress',  display: 'In Progress',  color: '#b39ddb' },
  { value: 'on-track',     display: 'On Track',     color: '#2196F3' },
]

function NewCardForm({ columnId, onCardCreated, dark, customLabels = [], onAddCustomLabel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#888888')
  const [showAddLabel, setShowAddLabel] = useState(false)

  const allLabels = [...DEFAULT_LABELS, ...customLabels]

  // Placeholder color: gray in light mode, muted slate in dark mode
  const placeholderColor = dark ? '#64748b' : '#9ca3af'

  const inputStyle = {
    width: '100%', marginBottom: '0.5rem', padding: '0.4rem',
    borderRadius: '4px',
    border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #ccc',
    background: dark ? '#2e2e42' : 'white',
    color: dark ? '#f1f5f9' : '#1e293b',
    fontSize: '0.9rem',
  }

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return
    const custom = {
      value: newLabelName.toLowerCase().replace(/\s+/g, '-'),
      display: newLabelName,
      color: newLabelColor
    }
    onAddCustomLabel(custom)
    setLabel(custom.value)
    setNewLabelName('')
    setShowAddLabel(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    const res = await axios.post('/api/cards', {
      title, description, column_name: columnId, label, due_date: dueDate
    })
    onCardCreated(res.data)
    setTitle(''); setDescription(''); setLabel(''); setDueDate(''); setIsOpen(false)
  }

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} style={{
      width: '100%', marginTop: '0.5rem', padding: '0.4rem',
      background: 'transparent',
      border: dark ? '1px dashed rgba(255,255,255,0.25)' : '1px dashed #aaa',
      borderRadius: '4px', cursor: 'pointer',
      color: dark ? '#94a3b8' : '#666',
    }}>
      + Add card
    </button>
  )

  return (
    <>
      {/* Scoped placeholder styles for this form only */}
      <style>{`
        .kando-form input::placeholder,
        .kando-form textarea::placeholder {
          color: ${placeholderColor};
          opacity: 1;
        }
      `}</style>

      <form className="kando-form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Card title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={inputStyle}
        />
        <select
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={{ ...inputStyle, marginBottom: '0.25rem' }}
        >
          {allLabels.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.display}</option>
          ))}
        </select>

        {!showAddLabel ? (
          <button
            type="button"
            onClick={() => setShowAddLabel(true)}
            style={{
              fontSize: '0.75rem', color: dark ? '#94a3b8' : '#888',
              background: 'none', border: 'none', cursor: 'pointer',
              marginBottom: '0.5rem', padding: 0
            }}
          >
            + Add custom label
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Label name"
              value={newLabelName}
              onChange={e => setNewLabelName(e.target.value)}
              style={{
                flex: 1, padding: '0.3rem', borderRadius: '4px',
                border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #ccc',
                background: dark ? '#2e2e42' : 'white',
                color: dark ? '#f1f5f9' : '#1e293b',
                fontSize: '0.85rem'
              }}
            />
            <input
              type="color"
              value={newLabelColor}
              onChange={e => setNewLabelColor(e.target.value)}
              style={{ width: '36px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
            />
            <button
              type="button"
              onClick={handleAddLabel}
              style={{
                padding: '0.3rem 0.5rem', borderRadius: '4px',
                background: '#0079bf', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem'
              }}
            >
              Add
            </button>
          </div>
        )}

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            style={{
              flex: 1, padding: '0.4rem', borderRadius: '4px',
              background: '#0079bf', color: 'white', border: 'none', cursor: 'pointer'
            }}
          >
            Add Card
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.4rem 0.75rem', borderRadius: '4px',
              border: dark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ccc',
              background: 'transparent', color: dark ? '#f1f5f9' : '#1e293b', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default NewCardForm