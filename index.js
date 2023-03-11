const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/', (req, res) => {
  const message = req.body.message;
  // Do something with the message, e.g. send it to the OpenAI API
  const response = {
    message: `You sent the message "${message}"`
  };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});