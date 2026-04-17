const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001

app.use(cors());
app.use(express.json());

// Get all cards (fetch)
app.get('/api/cards', (req, res) => {
    const cards = db.prepare('SELECT* FROM cards ORDER BY created_at ASC').all();
    res.json(cards);
});

// Create a card 
app.post('/api/cards', (req,res) => {
    const { title, description, column_name, label, due_date } = req.body;
    if (!title) return res.status(400).json({error: 'Title is required'});
    const result = db.prepare(
        'INSERT INTO cards (title, description, column_name, label, due_date) VALUES (?, ?, ?, ?, ?)'
    ).run(title, description || '', column_name || 'todo', label || '', due_date || '');
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(card);
});

// Update a card (move, edit, etc.)
app.patch('/api/cards/:id', (req,res) => {
    const {id} = req.params;
    const {title, description, column_name, label, due_date} = req.body;
    const card = db.prepare('SELECT * FROM cards WHERE id= ?').get(id);
    if (!card) return res.status(404).json ({error: 'Card not found'});
    db.prepare(
        'UPDATE cards SET title = ?, description = ?, column_name = ?, label = ?, due_date = ? WHERE id= ?'
    ).run(
        title ?? card.title,
        description ?? card.description,
        column_name ?? card.columm_name,
        label ?? card.label,
        due_date ?? card.due_date,
        id
    );
    const updated = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    res.json(updated);
})

// Delete a card
app.delete('/api/cards/:id', (req,res) => {
    const {id} = req.params;
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    if (!card) return res.status(404).json({error: 'Card not found'});
    db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    res.json({message: 'Card deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});