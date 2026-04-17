import { Droppable } from '@hello-pangea/dnd'
import Card from './Card'
import NewCardForm from './NewCardForm'

const COLUMN_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done'
}

function Column({ columnId, cards, onCardCreated, onCardDeleted, dark }) {
  return (
    <div style={{
      background: dark ? '#2a2a3e' : '#f4f4f4',
      padding: '1rem',
      borderRadius: '8px',
      width: '300px',
      flexShrink: 0,
      border: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
    }}>
      <h2 style={{
        color: dark ? '#f1f5f9' : '#1e293b',
        marginBottom: '0.75rem',
        fontSize: '1rem',
        fontWeight: 600,
      }}>
        {COLUMN_LABELS[columnId]}
      </h2>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: '100px' }}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onCardDeleted={onCardDeleted}
                dark={dark}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <NewCardForm columnId={columnId} onCardCreated={onCardCreated} dark={dark} />
    </div>
  )
}

export default Column