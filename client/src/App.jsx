import {useState} from 'react'
import Board from './components/Board'

function App() {
  const [search, setSearch] = useState('')
  
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: '#0079bf',
        color: 'white'
      }}>
        <h1 style={{margin:0, fontSize: '1.25rem'}}>Kanban Board</h1>
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{
            padding:'0.4rem 0.75rem',
            borderRadius: '4px',
            border: 'none',
            fontSize: '0.9rem',
            width: '220px'
          }}
        />
      </div>
      <Board search={search} />
    </div>
  )
}

export default App