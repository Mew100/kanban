import { useEffect, useState } from 'react'
import axios from 'axios'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './Column'

const COLUMNS = ['todo', 'inprogress', 'done']
const ORDER_KEY = 'kando_card_order' // localStorage key for persisted card order

// Returns a map of { [columnId]: [id, id, ...] } from localStorage
function loadSavedOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || '{}')
  } catch {
    return {}
  }
}

// Saves the current order map to localStorage
function saveOrder(cards) {
  const order = {}
  for (const col of COLUMNS) {
    order[col] = cards
      .filter(c => c.column_name === col)
      .map(c => c.id)
  }
  localStorage.setItem(ORDER_KEY, JSON.stringify(order))
}

// Applies a saved order map to a flat cards array.
// Cards missing from the saved order are appended at the end of their column.
function applyOrder(cards, savedOrder) {
  const result = []
  for (const col of COLUMNS) {
    const colCards = cards.filter(c => c.column_name === col)
    const ids = savedOrder[col]
    if (!ids || ids.length === 0) {
      result.push(...colCards)
      continue
    }
    const indexed = Object.fromEntries(colCards.map(c => [c.id, c]))
    const ordered = ids.map(id => indexed[id]).filter(Boolean)
    const unseen = colCards.filter(c => !ids.includes(c.id))
    result.push(...ordered, ...unseen)
  }
  return result
}

function Board({ search, dark, customLabels, onAddCustomLabel }) {
  const [cards, setCards] = useState([])

  useEffect(() => {
    axios.get('/api/cards').then(res => {
      const savedOrder = loadSavedOrder()
      const ordered = applyOrder(res.data, savedOrder)
      setCards(ordered)
    })
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

      let next

      if (sourceCol === destCol) {
        // Same-column reorder
        const colCards = prev.filter(c => c.column_name === sourceCol)
        const otherCards = prev.filter(c => c.column_name !== sourceCol)
        const fromIdx = colCards.findIndex(c => c.id === draggedId)
        const reordered = [...colCards]
        reordered.splice(fromIdx, 1)
        reordered.splice(destination.index, 0, draggedCard)
        next = [...otherCards, ...reordered]
      } else {
        // Cross-column move
        const sourceColCards = prev.filter(c => c.column_name === sourceCol && c.id !== draggedId)
        const destColCards = prev.filter(c => c.column_name === destCol)
        const otherCards = prev.filter(c => c.column_name !== sourceCol && c.column_name !== destCol)
        const updatedCard = { ...draggedCard, column_name: destCol }
        const newDestColCards = [...destColCards]
        newDestColCards.splice(destination.index, 0, updatedCard)
        next = [...otherCards, ...sourceColCards, ...newDestColCards]
      }

      // Persist order after every drag
      saveOrder(next)
      return next
    })

    // Only call API for column changes
    if (sourceCol !== destCol) {
      await axios.patch(`/api/cards/${draggableId}`, { column_name: destCol })
    }
  }

  const handleCardCreated = (newCard) => {
    setCards(prev => {
      const next = [...prev, newCard]
      saveOrder(next)
      return next
    })
  }

  const handleCardDeleted = (id) => {
    setCards(prev => {
      const next = prev.filter(card => card.id !== id)
      saveOrder(next)
      return next
    })
  }

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