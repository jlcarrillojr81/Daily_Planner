const dotenv = require('dotenv');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = process.env.PORT;
// const pool = new Pool ({
//     user: 'josephcarrillo',
//     host: 'localhost',
//     database: 'daily_planner',
//     password: '',
//     port: 5432
// });

const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
});

// get all
app.get("/events", async (req, res) => {
    try{
         const result = await pool.query("SELECT * FROM events");
         res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).send('Error fetching Events from daily_planner Database!')
    }
});

// get one
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).send(' not found!'); 
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching Events from daily_planner database');
    }
  });

// post 
app.post('/events', async (req, res) => {
  const { time, activity, location, notes } = req.body;
  try {
    const result = await pool.query('INSERT INTO events (time, activity, location, notes) VALUES ($1, $2, $3, $4) RETURNING *', [time, activity, location, notes]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting Events into daily_planner database' });
  }
});

// update
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { time, activity, location, notes } = req.body;

  try {
    const result = await pool.query('UPDATE events SET time = $1, activity = $2, location = $3, notes = $4 WHERE id = $5 RETURNING *', [time, activity, location, notes, id]);

    if (result.rowCount === 0) {
      res.status(404).send('Event not found!');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating Event in daily_planner database');
  }
});

// delete
app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('Events not found');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting Events from daily_planner database');
    }
  });

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});