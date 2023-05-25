const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const sqlite3 = require('sqlite3').verbose();

console.log(process.env.OPENAI_API_KEY, process.env.OPENAI_ORG_ID);

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let db = new sqlite3.Database('./my_database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the my_database database.');
});

app.post('/', async (req, res) => {
  try {
    const message = req.body.message;
    
    db.get(`SELECT * FROM books WHERE title = ?`, [message], async (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      // If the book exists in the database, return it directly
      if (row) {
        res.json(row);
      } else {
        // If the book doesn't exist in the database, get it from OpenAI and save it
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Pretend you are book loving robot called Chapterly. The user gives you the title of a a book and then you give title of book back and its author then list the chapters.\n\nQ: think and grow rich\nA: Title: Think And Grow Rich Author: Napoleon Hill Chapter 1: The Power of Thought Chapter 2: Desire: The Starting Point of All Achievement Chapter 3: Faith Visualization of, and Belief in Attainment of Desire Chapter 4: Auto-Suggestion: The Medium for Influencing the Subconscious Mind Chapter 5: Specialized Knowledge: Personal Experiences or Observations Chapter 6: Imagination: The Workshop of the Mind Chapter 7: Organized Planning: The Crystallization of Desire into Action Chapter 8: Decision: The Mastery of Procrastination Chapter 9: Persistence: The Sustenance of Effort Toward a Definite End Chapter 10: Power of the Master Mind: The Driving Force Chapter 11: The Mystery of Sex Transmutation Chapter 12: The Subconscious Mind: The Connecting Link Chapter 13: The Brain: A Broadcasting and Receiving Station for Thought Chapter 14: The Sixth Sense: The Door to the Temple of Wisdom\n\nQ: ${message}`,
          temperature: 0,
          max_tokens: 435,    
        });
        console.log(response.data);

        // Save the book details in the database
        db.run(`INSERT INTO books(title, details) VALUES(?, ?)`, [message, JSON.stringify(response.data)], (err) => {
          if (err) {
            return console.log(err.message);
          }
        });

        res.json(response.data);
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/chapter-summary', async (req, res) => {
  try {
    const { bookTitle, chapterNumber } = req.body;
    
    db.get(`SELECT * FROM chapter_summaries WHERE book_title = ? AND chapter_number = ?`, [bookTitle, chapterNumber], async (err, row) => {
      if (err) {
        return console.error(err.message);
      }

      // If the chapter summary exists in the database, return it directly
      if (row) {
        res.json(row);
      } else {
        // If the chapter summary doesn't exist in the database, get it from OpenAI and save it
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Summarize Chapter ${chapterNumber} of "${bookTitle}", which covers ${chapterSynopsis}, in 100 words and provide 3 practical life tips`,
          temperature: 0.7,
          max_tokens: 150,    
        });
        console.log(response.data);

        // Save the chapter summary in the database
        db.run(`INSERT INTO chapter_summaries(book_title, chapter_number, summary, tips) VALUES(?, ?, ?, ?)`, 
          [bookTitle, chapterNumber, response.data.choices[0].text, ""], 
          (err) => {
            if (err) {
              return console.log(err.message);
            }
          });

        res.json(response.data);
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
    process.exit(1);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
