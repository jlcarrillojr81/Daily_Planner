const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const { Pool } = require('pg');

require('dotenv').config();
// dotenv.config();

app.use(express.static('public'));

const pool = new Pool ({
    user: 'josephcarrillo',
    host: 'localhost',
    database: 'daily_planner',
    password: '',
    port: 5432
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
    const { date, time, activity, location, notes } = req.body;
    try {
      const result = await pool.query('INSERT INTO events (date, time, activity, location, notes) VALUES ($1, $2, $3, $4, $5)RETURNING *', [date, time, activity, location, notes]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error inserting Events into daily_planner database');
    }
  });

// update
app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { date, time, activity, location, notes } = req.body;
  
    try {
      const result = await pool.query('UPDATE events SET date_column = $1, time_column = $2, activity = $3, location = $4, notes = $5 WHERE id = $6 RETURNING *', [date, time, activity, location, notes, id]
      );
  
      if (result.rowCount === 0) {
        res.status(404).send('Events not found!');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating Events from daily_planner database');
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
    console.log('Server started on port 3000!')
});