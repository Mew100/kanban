import { Draggable } from '@hello-pangea/dnd'
import axios from 'axios'
import { formatDistanceToNow, isPast, parseISO } from 'date-fns'

const LABEL_COLORS = {
  finished:   '#4CAF50',   // green
  upcoming:   '#F9C74F',   // yellow
  'at-risk':  '#FF9800',   // orange
  overdue:    '#f44336',   // red
  'in-progress': '#b39ddb', // light violet
  'on-track': '#2196F3',   // blue
}

function Card({ card, index, onCardDeleted }) {
  const handleDelete = async () => {
    await axios.delete(`/api/cards/${card.id}`)
    onCardDeleted(card.id)
  }

  const isOverdue = card.due_date && isPast(parseISO(card.due_date)) && card.column_name !== 'done'

  // ✅ fix Bug 4: append 'Z' so JS treats the SQLite timestamp as UTC
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
            background: 'white',
            borderRadius: '6px',
            marginBottom: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: isOverdue ? '4px solid #f44336' : '4px solid transparent',
            overflow: 'hidden',  // keeps the color strip inside the rounded corners
            ...provided.draggableProps.style
          }}
        >
          {/* Color strip at top of card based on label */}
          {labelColor && (
            <div style={{
              height: '6px',
              background: labelColor,
              width: '100%'
            }} />
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

            <strong style={{ display: 'block' }}>{card.title}</strong>

            {card.description && (
              <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#555' }}>
                {card.description}
              </p>
            )}

            {/* Due date */}
            {card.due_date && (
              <p style={{ fontSize: '0.75rem', color: isOverdue ? '#f44336' : '#888', marginTop: '0.25rem' }}>
                {/* ✅ fix Bug 3: was 'coor' (typo), now 'color' */}
                📅 Due: {card.due_date}{isOverdue ? ' — Overdue' : ''}
              </p>
            )}

            {/* Timestamp */}
            {createdAgo && (
              <p style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '0.25rem' }}>
                Created {createdAgo}
              </p>
            )}

            <button
              onClick={handleDelete}
              style={{
                marginTop: '0.5rem',
                color: '#999',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: 0
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