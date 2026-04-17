import {Draggable} from '@hello-pangea/dnd'
import axios from 'axios'
import {formatDistanceToNow, isPast, parseISO} from 'date-fns'

const LABEL_COLORS = {
    feature: '#4CAF50',
    bug: '#f44336',
    urgent: '#FF9800',
    design: '#9C27B0',
}

function Card({card, index, onCardDeleted}) {
    const handleDelete = async () => {
        await axios.delete(`/api/cards/${card.id}`)
        onCardDeleted(card.id)
    }

    //Check if due date has passed
    const isOverdue = card.due_date && isPast(parseISO(card.due_date))&&card.column_name !=='done'

    //timestamp "X ago"
    const createdAgo = card.created_at
        ? formatDistanceToNow(new Date(card.created_at), {addSuffix:true})
        :null

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
                        borderLeft: isOverdue? '4px solid #f44336' : '4px solid transparent',
                        ...provided.draggableProps.style
                    }}
                >
                    {/*Color label badge */}
                    {card.label && LABEL_COLORS[card.label]&& (
                        <span style={{
                            display: 'inline-block',
                            background: LABEL_COLORS[card.label],
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


                    <strong style={{display: 'block'}}>{card.title}</strong>
                    {card.description && (
                        <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#555'}}>{card.description}</p>
                    )}

                    {/*Due Date*/}
                    {card.due_date && (
                        <p style={{fontSize: '0.75rem', coor: isOverdue ? '#f44336' : '#888', marginTop: '0.25rem'}}>
                            Due: {card.due_date}{isOverdue ? '— Overdue' : ''}
                        </p>
                    )}

                    {/*Timestamp*/}
                    {createdAgo && (
                        <p style={{fontSize: '0.7rem', color: '#bbb', marginTop: '0.25rem'}}>
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
                            padding:  0
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </Draggable>
    )
}

export default Card