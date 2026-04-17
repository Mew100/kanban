import {useState} from 'react'
import axios from 'axios'

function NewCardForm({columnId, onCardCreated}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        const res = await axios.post('/api/cards', {
            title,
            description,
            column_name: columnId
        })

        onCardCreated(res.data)
        setTitle('')
        setDescription('')
    }

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '1rem'}}>
            <input
                type="text"
                placeholder="Card title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{width:'100%', marginBottom: '0.5rem', padding: '0.4rem'}}
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{width: '100%', marginBottom: '0.5rem', padding: '0.4rem'}}
            />
            <button type="submit" style={{width:'100%'}}>Add Card</button> 
        </form>
    )
}

export default NewCardForm