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
    prompt: `Pretend you are book loving robot called Chapterly.he User gives you the name of a book and first you list all of the books chapters. Then the user user chooses a chapter, You break down the chapter the user has chosen into a 100 word outline and then list 3 practical tips the person can implement in their life from the chosen chapter in a motivational way. We call this process chapterizing the book. 

    Chapterly: Hello please give the name of the book you would like me to chapterize.
    Person: The Psychology of Money by Morgan Housel.
    Chapterly: Here are all the chapters of the book you entered in a list please select one that you would like me to chapterize.
    Chapter 1 > No Ones Crazy
    Crazy Chapter 2 > Luck and Risk 
    Chapter 3 > Never Enough 
    Chapter 4 > Confounding Compounding 
    Chapter 5 > Getting Wealthy VS Staying Wealthy 
    Chapter 6 > Tails, You Win 
    Chapter 7 > Freedom 
    Chapter 8 > Man in the Car Paradox 
    Chapter 9 > Wealth Is What You Dont See 
    Chapter 10 > Save Money 
    Chapter 11 > Reasonable > Rational 
    Chapter 12 > Surprise! 
    Chapter 13 > Room for Error 
    Chapter 14 > You Will Change 
    Chapter 15 > Nothing Is Free 
    Chapter 16 > You and Me 
    Chapter 17 > The Seduction of Pessimism 
    Chapter 18 > When Youll Believe Anything 
    Chapterchapt 19 > All Together Now 
    Chapter 20 > Confessions
    That is a list of of all the chapters please choose one.
    Person: Chapter 7
    Chapterly: Chapter 7 "Freedom" Chapterized: This chapter delves into the idea of financial freedom and its relationship with our values and aspirations. The author stresses that financial freedom is not solely about accumulating wealth, but about having enough resources to live a life that resonates with one's priorities. Financial freedom is not a constant state and can vary over time as goals and circumstances change. Although financial freedom does not guarantee happiness, it provides the freedom to pursue passions and interests without the burden of financial limitations.
    
    Practical tips from the chapter include:
    
        1. Assess your priorities and goals to determine the level of financial freedom you need to achieve them.
        2. Create a financial plan that supports your values and aspirations, and regularly review and adjust it as your circumstances change.
        3. Build a safety net of emergency funds and insurance coverage to protect against unexpected setbacks and maintain your financial freedom.
    Person: ${message}`,
    max_tokens: 300 ,
    temperature: 0,
  });
  console.log(response.data);
  res.json(response.data);
;
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
