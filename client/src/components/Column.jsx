import {Droppable} from '@hello-pangea/dnd'
import Card from './Card'
import NewCardForm from './NewCardForm'

const COLUMN_LABELS = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
}

function Column({columnId, cards, onCardCreated, onCardDeleted}) {
    return (
        <div style={{background: '#f4f4f4', padding: '1rem', borderRadius: '8px', width: '300px'}}>
            <h2>{COLUMN_LABELS[columnId]}</h2>

            <Droppable droppableId={columnId}>
                {(provided) => (
                    <div
                        ref={provided.innerRed}
                        {...provided.droppableProps}
                        style={{minHeight: '100px'}}
                    >
                        {cards.map((card, index) => (
                            <Card
                                key={card.id}
                                card={card}
                                index={index}
                                onCardDeleted={onCardDeleted}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            
            <NewCardForm columnId={columnId} onCardCreated={onCardCreated} />
        </div>
    )
}

export default Column