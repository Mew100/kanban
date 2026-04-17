import { useEffect, useState } from 'react'
import axios from 'axios'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'

const COLUMNS = ['todo', 'inprogress', 'done']

function Board({ search, dark }) {
  const [cards, setCards] = useState([])

  useEffect(() => {
    axios.get('/api/cards').then(res => setCards(res.data))
  }, [])

  const getCardsByColumn = (column) =>
    cards.filter(card =>
      card.column_name === column &&
      card.title.toLowerCase().includes(search.toLowerCase())
    )

  const handleDragEnd = async (result) => {
    const { draggableId, destination } = result
    if (!destination) return
    const newColumn = destination.droppableId
    await axios.patch(`/api/cards/${draggableId}`, { column_name: newColumn })
    setCards(prev =>
      prev.map(card =>
        card.id === parseInt(draggableId)
          ? { ...card, column_name: newColumn }
          : card
      )
    )
  }

  const handleCardCreated = (newCard) => setCards(prev => [...prev, newCard])
  const handleCardDeleted = (id) => setCards(prev => prev.filter(card => card.id !== id))

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem', overflowX: 'auto' }}>
        {COLUMNS.map(col => (
          <Column
            key={col}
            columnId={col}
            cards={getCardsByColumn(col)}
            onCardCreated={handleCardCreated}
            onCardDeleted={handleCardDeleted}
            dark={dark}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

export default Board