import { useState } from 'react'
import axios from 'axios'

const DEFAULT_LABELS = [
  { value: '', display: 'No label', color: null },
  { value: 'finished',    display: 'Finished',     color: '#4CAF50' },
  { value: 'upcoming',   display: 'Upcoming',     color: '#F9C74F' },
  { value: 'at-risk',    display: 'At Risk',      color: '#FF9800' },
  { value: 'overdue',    display: 'Overdue',      color: '#f44336' },
  { value: 'in-progress', display: 'In Progress', color: '#b39ddb' },
  { value: 'on-track',   display: 'On Track',     color: '#2196F3' },
]

function NewCardForm({ columnId, onCardCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [customLabels, setCustomLabels] = useState([])
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#888888')
  const [showAddLabel, setShowAddLabel] = useState(false)

  const allLabels = [...DEFAULT_LABELS, ...customLabels]

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return
    const custom = { value: newLabelName.toLowerCase(), display: newLabelName, color: newLabelColor }
    setCustomLabels(prev => [...prev, custom])
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
      background: 'transparent', border: '1px dashed #aaa',
      borderRadius: '4px', cursor: 'pointer', color: '#666'
    }}>+ Add card</button>
  )

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <input type="text" placeholder="Card title" value={title}
        onChange={e => setTitle(e.target.value)} autoFocus
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input type="text" placeholder="Description (optional)" value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <select value={label} onChange={e => setLabel(e.target.value)}
        style={{ width: '100%', marginBottom: '0.25rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        {allLabels.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.display}</option>
        ))}
      </select>

      {/* Add custom label */}
      {!showAddLabel ? (
        <button type="button" onClick={() => setShowAddLabel(true)}
          style={{ fontSize: '0.75rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}>
          + Add custom label
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <input type="text" placeholder="Label name" value={newLabelName}
            onChange={e => setNewLabelName(e.target.value)}
            style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
          />
          <input type="color" value={newLabelColor}
            onChange={e => setNewLabelColor(e.target.value)}
            style={{ width: '36px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
          />
          <button type="button" onClick={handleAddLabel}
            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', background: '#0079bf', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>
            Add
          </button>
        </div>
      )}

      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', background: '#0079bf', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Card
        </button>
        <button type="button" onClick={() => setIsOpen(false)}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default NewCardForm