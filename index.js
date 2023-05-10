const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables from .env file
require('dotenv').config();

console.log(process.env.OPENAI_API_KEY, process.env.OPENAI_ORG_ID);



// Configure OpenAI API
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Configure Express server
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
  const message = req.body.message;
  // Do something with the message, e.g. send it to the OpenAI API
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Pretend you are book loving robot called Chapterly. The user gives you the title of a a book and then you give title of book back and its author then list the chapters.\n\nQ: think and grow rich\nA: Title: Think And Grow Rich Author: Napoleon Hill Chapter 1: The Power of Thought Chapter 2: Desire: The Starting Point of All Achievement Chapter 3: Faith Visualization of, and Belief in Attainment of Desire Chapter 4: Auto-Suggestion: The Medium for Influencing the Subconscious Mind Chapter 5: Specialized Knowledge: Personal Experiences or Observations Chapter 6: Imagination: The Workshop of the Mind Chapter 7: Organized Planning: The Crystallization of Desire into Action Chapter 8: Decision: The Mastery of Procrastination Chapter 9: Persistence: The Sustenance of Effort Toward a Definite End Chapter 10: Power of the Master Mind: The Driving Force Chapter 11: The Mystery of Sex Transmutation Chapter 12: The Subconscious Mind: The Connecting Link Chapter 13: The Brain: A Broadcasting and Receiving Station for Thought Chapter 14: The Sixth Sense: The Door to the Temple of Wisdom\n\nQ: thinking fast and slow \nA: Title: Thinking Fast And Slow Author: Daniel Kahneman Chapter 1: The Characters of the Story Chapter 2: The Primitive Brain Chapter 3: The Associative Machine Chapter 4: System 1: Fast, Automatic, and Effortless Chapter 5: System 2: Slow, Deliberate, and Effortful Chapter 6: The Experiences of Thinking Chapter 7: The Inside View and the Outside View Chapter 8: Overconfidence Chapter 9: Substitution Chapter 10: Emotions Chapter 11: Judgment and Decision Making Chapter 12: The Science of Choice Chapter 13: Heuristics and Biases Chapter 14: The Machines in Our Heads Chapter 15: The World of Risk Chapter 16: The Laws of Intuitive Heuristics Chapter 17: The Illusion of Understanding Chapter 18: The Illusion of Validity Chapter 19: The Illusion of Skill Chapter 20: The Illusion of Stability\n\nQ: The Psychology of Money by Morgan Housel\n\nA: Title: The Psychology of Money Author: Morgan Housel Chapter 1: The Power of Compounding Chapter 2: The Paradox of Thrift Chapter 3: The Psychology of Loss Aversion Chapter 4: The Psychology of Risk Chapter 5: The Psychology of Greed Chapter 6: The Psychology of Fear Chapter 7: The Psychology of Status Chapter 8: The Psychology of Time Chapter 9: The Psychology of Money and Happiness Chapter 10: The Psychology of Money and Relationships Chapter 11: The Psychology of Money and Self-Worth Chapter 12: The Psychology of Money and Generosity Chapter 13: The Psychology of Money and Legacy\n\n\nQ:atomic habits james clear\nA: Title: Atomic Habits Author: James Clear Chapter 1: The Surprising Power of Atomic Habits Chapter 2: The Habits of Successful People Chapter 3: Make It Obvious Chapter 4: Make It Attractive Chapter 5: Make It Easy Chapter 6: Make It Satisfying Chapter 7: The Role of Family and Friends Chapter 8: The Law of Least Effort Chapter 9: The 2-Minute Rule Chapter 10: The 4 Laws of Behavior Change Chapter 11: Motivation Is Overrated Chapter 12: How to Find Motivation Chapter 13: The Secret to Self-Control Chapter 14: The Counterintuitive Approach to Habits Chapter 15: How to Stick with Good Habits Every Day Chapter 16: The Aggregation of Marginal Gains Chapter 17: The Plateau of Latent Potential Chapter 18: How to Create New Habits Chapter 19: How to Stop Bad Habits Chapter 20: The Goldilocks Rule\n\n\nQ: mastery Title: Mastery Author: Robert Greene Chapter 1: The Life of Apprenticeship Chapter 2: The Power of Practice Chapter 3: The Mystery of Motivation Chapter 4: The Sources of Creativity Chapter 5: The Keys to Creativity Chapter 6: The Laws of Learning Chapter 7: The Pursuit of Purpose Chapter 8: The Principles of Mastery Chapter 9: The Practice of Focus Chapter 10: The Habits of Mind Chapter 11: The Cultivation of Will Chapter 12: The Laws of Self-Discovery Chapter 13: The Art of Reflection Chapter 14: The Path of Insight Chapter 15: The Principles of Self-Knowledge Chapter 16: The Practice of Self-Examination Chapter 17: The Laws of Self-Mastery Q: ${message}`,
  temperature: 0,
  max_tokens: 435,
  // top_p: 1,
  // frequency_penalty: 0,
  // presence_penalty: 0,
  // stop: ["\n"],
  });
  console.log(response.data);
  res.json(response.data);
;
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

