import {Draggable} from '@hello-pangea/dnd'
import axios from 'axios'

function Card({card, index, onCardDeleted}) {
    const handleDelete = async () => {
        await axios.delete(`/api/cards/${card.id}`)
        onCardDeleted(card.id)
    }

    return (
        <Draggable draggableId={String(card.id)} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        ...provided.draggableProps.style
                    }}
                >
                    <strong>{card.title}</strong>
                    {card.description && <p style={{margin: '0.25rem 0'}}>{card.description}</p>}
                    {card.label && <span style={{fontSize: '0.75rem', color: '#888'}}>{card.label}</span>}
                    {card.due_date && <p style={{fontSize: '0.75rem', color: '#888'}}>{card.due_date}</p>}
                    <button onClick={handleDelete} style={{marginTop: '0.5rem', color: 'red'}}>Delete</button>
                </div>
            )}
        </Draggable>
    )
}

export default Card