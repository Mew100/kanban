import { Draggable } from '@hello-pangea/dnd'
import axios from 'axios'
import { useState } from 'react'
import { formatDistanceToNow, isPast, parseISO } from 'date-fns'

const LABEL_COLORS = {
  finished:     '#4CAF50',
  upcoming:     '#F9C74F',
  'at-risk':    '#FF9800',
  overdue:      '#f44336',
  'in-progress':'#b39ddb',
  'on-track':   '#2196F3',
}

function Card({ card, index, onCardDeleted, dark }) {
  const [deleteHovered, setDeleteHovered] = useState(false)

  const handleDelete = async () => {
    await axios.delete(`/api/cards/${card.id}`)
    onCardDeleted(card.id)
  }

  const isOverdue = card.due_date && isPast(parseISO(card.due_date)) && card.column_name !== 'done'
  const createdAgo = card.created_at
    ? formatDistanceToNow(new Date(card.created_at + 'Z'), { addSuffix: true })
    : null
  const labelColor = card.label ? LABEL_COLORS[card.label] : null

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            background: dark ? '#1e1e2e' : 'white',
            borderRadius: '6px',
            marginBottom: '0.5rem',
            boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: isOverdue ? '4px solid #f44336' : '4px solid transparent',
            overflow: 'hidden',
            ...provided.draggableProps.style
          }}
        >
          {/* Color strip */}
          {labelColor && (
            <div style={{ height: '6px', background: labelColor, width: '100%' }} />
          )}

          {/* Card body */}
          <div style={{ padding: '0.75rem' }}>

            {/* Label badge */}
            {card.label && labelColor && (
              <span style={{
                display: 'inline-block',
                background: labelColor,
                color: 'white',
                fontSize: '0.7rem',
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                marginBottom: '0.4rem',
                textTransform: 'capitalize'
              }}>
                {card.label}
              </span>
            )}

            <strong style={{ display: 'block', color: dark ? '#f1f5f9' : '#1e293b' }}>
              {card.title}
            </strong>

            {card.description && (
              <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: dark ? '#94a3b8' : '#555' }}>
                {card.description}
              </p>
            )}

            {card.due_date && (
              <p style={{ fontSize: '0.75rem', color: isOverdue ? '#f44336' : (dark ? '#94a3b8' : '#888'), marginTop: '0.25rem' }}>
                📅 Due: {card.due_date}{isOverdue ? ' — Overdue' : ''}
              </p>
            )}

            {createdAgo && (
              <p style={{ fontSize: '0.7rem', color: dark ? '#475569' : '#bbb', marginTop: '0.25rem' }}>
                Created {createdAgo}
              </p>
            )}

            <button
              onClick={handleDelete}
              onMouseEnter={() => setDeleteHovered(true)}
              onMouseLeave={() => setDeleteHovered(false)}
              style={{
                marginTop: '0.5rem',
                color: deleteHovered ? '#fff' : '#999',
                background: deleteHovered ? '#ef4444' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: deleteHovered ? '0.2rem 0.5rem' : '0.2rem 0',
                transition: 'all 0.15s ease',
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Card