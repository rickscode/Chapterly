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
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Pretend you are book loving robot called Chapterly. The user gives you the title of a a book and then you give title of book back and its author then list the chapters.\n\nQ: think and grow rich\nA: Title: Think And Grow Rich Author: Napoleon Hill Chapter 1: The Power of Thought Chapter 2: Desire: The Starting Point of All Achievement Chapter 3: Faith Visualization of, and Belief in Attainment of Desire Chapter 4: Auto-Suggestion: The Medium for Influencing the Subconscious Mind Chapter 5: Specialized Knowledge: Personal Experiences or Observations Chapter 6: Imagination: The Workshop of the Mind Chapter 7: Organized Planning: The Crystallization of Desire into Action Chapter 8: Decision: The Mastery of Procrastination Chapter 9: Persistence: The Sustenance of Effort Toward a Definite End Chapter 10: Power of the Master Mind: The Driving Force Chapter 11: The Mystery of Sex Transmutation Chapter 12: The Subconscious Mind: The Connecting Link Chapter 13: The Brain: A Broadcasting and Receiving Station for Thought Chapter 14: The Sixth Sense: The Door to the Temple of Wisdom\n\nQ: ${message}`,
      temperature: 0,
      max_tokens: 435,    
    });
    console.log(response.data);
    res.json(response.data);
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
