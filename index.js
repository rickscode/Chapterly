const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables from .env file
require('dotenv').config();


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
    prompt: `Pretend you are book loving robot called Chapterly. The user gives you the title of a a book and then you list the chapters.\n    \n    Q: The Psychology of Money by Morgan Housel\n    A: Chapter 1 \"No One’s Crazy\" Chapter 2 \"Luck and Risk\" Chapter 3 \"Never Enough\" Chapter 4 \"Confounding Compounding\" Chapter 5 \"Getting Wealthy VS Staying Wealthy\" Chapter 6 \"Tails, You Win\" Chapter 7 \"Freedom\"Chapter 8 \"Man in the Car Paradox\" Chapter 9 \"Wealth Is What You Don’t See\" Chapter 10 \"Save Money\" Chapter 11 \"Reasonable > Rational\" Chapter 12 \"Surprise!\" Chapter 13 \"Room for Error\" Chapter 14 \"You Will Change\" Chapter 15 \"Nothing Is Free\" Chapter 16 \"You and Me\" Chapter 17 \"The Seduction of Pessimism\" Chapter 18 When You’ll Believe Anything\" Chapterchapt 19 \"All Together Now\" Chapter 20 \"Confessions\"\n\nQ: The Psychology of Money by Morgan Housel\nA: Chapter 1 \"No One’s Crazy\" Chapter 2 \"Luck and Risk\" Chapter 3 \"Never Enough\" Chapter 4 \"Confounding Compounding\" Chapter 5 \"Getting Wealthy VS Staying Wealthy\" Chapter 6 \"Tails, You Win\" Chapter 7 \"Freedom\"Chapter 8 \"Man in the Car Paradox\" Chapter 9 \"Wealth Is What You Don’t See\" Chapter 10 \"Save Money\" Chapter 11 \"Reasonable > Rational\" Chapter 12 \"Surprise!\" Chapter 13 \"Room for Error\" Chapter 14 \"You Will Change\" Chapter 15 \"Nothing Is Free\" Chapter 16 \"You and Me\" Chapter 17 \"The Seduction of Pessimism\" Chapter 18 \"When You’ll Believe Anything\" Chapter 19 \"All Together Now\" Chapter 20 \"Confessions\"\n\nQ: think and grow rich\nA: Chapter 1: The Power of Thought Chapter 2: Desire: The Starting Point of All Achievement Chapter 3: Faith Visualization of, and Belief in Attainment of Desire Chapter 4: Auto-Suggestion: The Medium for Influencing the Subconscious Mind Chapter 5: Specialized Knowledge: Personal Experiences or Observations Chapter 6: Imagination: The Workshop of the Mind Chapter 7: Organized Planning: The Crystallization of Desire into Action Chapter 8: Decision: The Mastery of Procrastination Chapter 9: Persistence: The Sustenance of Effort Toward a Definite End Chapter 10: Power of the Master Mind: The Driving Force Chapter 11: The Mystery of Sex Transmutation Chapter 12: The Subconscious Mind: The Connecting Link Chapter 13: The Brain: A Broadcasting and Receiving Station for Thought Chapter 14: The Sixth Sense: The Door to the Temple of Wisdom\n\nQ: thinking fast and slow Chapter 1: The Characters of the Story Chapter 2: The Primitive Brain Chapter 3: The Associative Machine Chapter 4: System 1: Fast, Automatic, and Effortless Chapter 5: System 2: Slow, Deliberate, and Effortful Chapter 6: The Experiences of Thinking Chapter 7: The Inside View and the Outside View Chapter 8: Overconfidence Chapter 9: Substitution Chapter 10: Emotions Chapter 11: Judgment and Decision Making Chapter 12: The Science of Choice Chapter 13: Heuristics and Biases Chapter 14: The Machines in Our Heads Chapter 15: The World of Risk Chapter 16: The Laws of Intuitive Heuristics Chapter 17: The Illusion of Understanding Chapter 18: The Illusion of Validity Chapter 19: The Illusion of Skill Chapter 20: The Illusion of Stability Q: ${message}`,
    max_tokens: 300 ,
    temperature: 0,
  });
  console.log(response.data);
  res.json(response.data);
;
});

// app.post('/', async (req, res) => {
//   const message = req.body.message;
//   // const bookNameRegex = /(\b\w+\b)(?=\sby)/i; // Match any word before "by"
//   const matchBookName = message
//   console.log(`Message: ${message}`);
//   console.log(`Matched book name: ${matchBookName}`);
//   // if (matchBookName) {
//     const bookName = matchBookName;
//   //   const responseText = `Chapterly: Sure, here are the chapters for ${bookName}: Chapter 1, Chapter 2, Chapter 3. Please enter a chapter number if you want me to chapterize a chapter for you.`;
//   //   res.json({
//   //     message: responseText,
//   //   });
//   // } else {
//   //   const bookName = "";
//   //   let chapterNumber = "";
//   //   const bookChapters = {
//   //     "The Psychology of Money by Morgan Housel": {
//   //       1: "No One’s Crazy",
//   //       2: "Luck and Risk",
//   //       // ...
//   //     },
//   //     "The Lean Startup by Eric Ries": {
//   //       1: "The Entrepreneur's Guide to the Galaxy",
//   //       2: "The Lean Startup",
//   //       // ...
//   //     }
//   //   };
//   //   const chapterNumberRegex = /(?<=chapter\s)(\d+)/;
//   //   const matchChapterNumber = message.match(chapterNumberRegex);
//   //   if (matchChapterNumber) {
//   //     chapterNumber = parseInt(matchChapterNumber[0].trim());
//   //   }

//   if (bookName) {
//       // List all the chapters of the book
//       const response = await openai.search({
//         model: "text-davinci-003",
//         query: `${bookName} chapters`,
//         documents: [],
//         file: null,
//         maxRerank: 200,
//         returnMetadata: false,
//       });
//       const bookChaptersList = response.data.map((result) => result.text);
//       let responseText = `Chapterly: Sure, here are the chapters for ${bookName}: `;
//       bookChaptersList.forEach((chapter, index) => {
//         responseText += `Chapter ${index + 1}: ${chapter}, `;
//       });
//       responseText = responseText.slice(0, -2); // remove the extra comma and space at the end of the string
//       res.json({
//         message: responseText,
//       });
//     } else {
//       res.json({
//         message: "Chapterly: Sorry, I couldn't understand your request. Please make sure you provide a book name or a book name and chapter number in your message.",
//       });
//     }
//   }
// );



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

