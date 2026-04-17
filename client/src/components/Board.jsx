import { useEffect, useState } from 'react'
import axios from 'axios'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'

const COLUMNS = ['todo', 'inprogress', 'done']

function Board({ search, dark, customLabels, onAddCustomLabel }) {
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
    const { draggableId, source, destination } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    const sourceCol = source.droppableId
    const destCol = destination.droppableId
    const draggedId = parseInt(draggableId)

    setCards(prev => {
      const draggedCard = prev.find(c => c.id === draggedId)
      if (!draggedCard) return prev

      if (sourceCol === destCol) {
        // Same-column reorder: operate on full (unfiltered) column card list
        const colCards = prev.filter(c => c.column_name === sourceCol)
        const otherCards = prev.filter(c => c.column_name !== sourceCol)
        const fromIdx = colCards.findIndex(c => c.id === draggedId)
        const reordered = [...colCards]
        reordered.splice(fromIdx, 1)
        reordered.splice(destination.index, 0, draggedCard)
        return [...otherCards, ...reordered]
      } else {
        // Cross-column move
        const sourceColCards = prev.filter(c => c.column_name === sourceCol && c.id !== draggedId)
        const destColCards = prev.filter(c => c.column_name === destCol)
        const otherCards = prev.filter(c => c.column_name !== sourceCol && c.column_name !== destCol)
        const updatedCard = { ...draggedCard, column_name: destCol }
        const newDestColCards = [...destColCards]
        newDestColCards.splice(destination.index, 0, updatedCard)
        return [...otherCards, ...sourceColCards, ...newDestColCards]
      }
    })

    // Only call API for column changes
    if (sourceCol !== destCol) {
      await axios.patch(`/api/cards/${draggableId}`, { column_name: destCol })
    }
  }

  const handleCardCreated = (newCard) => setCards(prev => [...prev, newCard])
  const handleCardDeleted = (id) => setCards(prev => prev.filter(card => card.id !== id))

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {COLUMNS.map(col => (
          <Column
            key={col}
            columnId={col}
            cards={getCardsByColumn(col)}
            onCardCreated={handleCardCreated}
            onCardDeleted={handleCardDeleted}
            dark={dark}
            customLabels={customLabels}
            onAddCustomLabel={onAddCustomLabel}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

export default Board