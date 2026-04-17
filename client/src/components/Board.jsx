import {useEffect, useState} from 'react'
import axios from 'axios'
import {DragDropContext} from '@hello-pangea/dnd'
import Column from './Column'

const COLUMNS = ['todo', 'inprogress', 'done']

function Board() {
    const [cards, setCards] = useState([])

    //Fetch all cards from backend
    useEffect(() => {
        axios.get('/api/cards').then(res => setCards(res.data))
    }, [])

    //Group cards by column
    const getCardsByColumn = (column) => 
        cards.filter(card => card.column_name === column)

    //Called when a card is dropped to a new column
    const handleDragEnd = async (result) => {
        const {draggableId, destination} = result
        if (!destination) return //dropped outside any column = return to last destination

        const newColumn = destination.droppableId
        
        //Update backend
        await axios.patch(`/api/cards/${draggableId}`, {column_name: newColumn})

        //Update local state
        setCards(prev => 
            prev.map(card =>
                card.id === parseInt(draggableId)
                    ? {...card, column_name: newColumn}
                    : card
            )
        )
    }

    const handleCardCreated = (newCard) => {
        setCards(prev => [...prev, newCard])
    }

    const handleCardDeleted = (id) => {
        setCards(prev => prev.filter(card => card.id !== id))
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{display: 'flex', gap: '1rem', padding: '1rem'}}>
                {COLUMNS.map(col => (
                    <Column
                        key={col}
                        columnId={col}
                        cards={getCardsByColumn(col)}
                        onCardCreated={handleCardCreated}
                        onCardDeleted={handleCardDeleted}
                    />    
                ))}
            </div>
        </DragDropContext>
    )
}

export default Board