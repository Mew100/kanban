import { useState } from 'react'
import axios from 'axios'

const LABEL_OPTIONS = [
  { value: '', display: 'No label' },
  { value: 'feature', display: 'Feature', color: '#4CAF50' },
  { value: 'bug', display: 'Bug', color: '#f44336' },
  { value: 'urgent', display: 'Urgent', color: '#FF9800' },
  { value: 'design', display: 'Design', color: '#9C27B0' },
]

function NewCardForm({ columnId, onCardCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isOpen, setIsOpen] = useState(false)  // ✅ fix Bug 2: boolean not string

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const res = await axios.post('/api/cards', {
      title,
      description,
      column_name: columnId,
      label,
      due_date: dueDate
    })

    onCardCreated(res.data)
    setTitle('')
    setDescription('')
    setLabel('')
    setDueDate('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          marginTop: '0.5rem',
          padding: '0.4rem',
          background: 'transparent',
          border: '1px dashed #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
          color: '#666'
        }}
      >
        + Add card
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <input
        type="text"
        placeholder="Card title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <select
        value={label}
        onChange={e => setLabel(e.target.value)}  // ✅ fix Bug 1: setLabel not setTitle
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        {LABEL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.display}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', background: '#0079bf', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Card
        </button>
        <button type="button" onClick={() => setIsOpen(false)} style={{ padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default NewCardForm