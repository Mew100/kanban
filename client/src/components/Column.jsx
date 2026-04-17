import { Droppable } from '@hello-pangea/dnd'
import Card from './Card'
import NewCardForm from './NewCardForm'

const COLUMN_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done'
}

function Column({ columnId, cards, onCardCreated, onCardDeleted, dark, customLabels, onAddCustomLabel }) {
  return (
    <div style={{
      background: dark ? '#2a2a3e' : '#f4f4f4',
      padding: '1rem',
      borderRadius: '8px',
      width: '300px',
      flexShrink: 0,
      border: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{
        color: dark ? '#f1f5f9' : '#1e293b',
        marginBottom: '0.75rem',
        fontSize: '1rem',
        fontWeight: 600,
        flexShrink: 0,
      }}>
        {COLUMN_LABELS[columnId]}
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 400,
          color: dark ? '#64748b' : '#94a3b8',
        }}>
          {cards.length}
        </span>
      </h2>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: '60px',
              maxHeight: 'calc(100vh - 240px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              /* Subtle scrollbar styling */
              scrollbarWidth: 'thin',
              scrollbarColor: dark ? '#475569 transparent' : '#cbd5e1 transparent',
            }}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onCardDeleted={onCardDeleted}
                dark={dark}
                customLabels={customLabels}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div style={{ flexShrink: 0 }}>
        <NewCardForm
          columnId={columnId}
          onCardCreated={onCardCreated}
          dark={dark}
          customLabels={customLabels}
          onAddCustomLabel={onAddCustomLabel}
        />
      </div>
    </div>
  )
}

export default Column