import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';
import Navbar from './Navbar';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    const text = data.choices[0].text.trim();
    console.log(text);
    setResponse(text);
    setMessage('');
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <h1 className="Heading">Hello I am Chapterly my job is to breakdown <br /> and summarize books on finance and <br /> well-being to help you <br />improve yourself <br />and enrich your life</h1>
        <div className="message-input-container">
          <form className="message-input-form" onSubmit={handleSubmit}>
            <label className="search-label">
              Please Enter A Book Title
              <input type="text" value={message} onChange={handleChange} />
            </label>
            <button type="submit">Send</button>
          </form>
        </div>
        <img src={logo} className="logo" alt="logo" />
        <div className="response">
          {response && (
            <div>
              <h3>Response:</h3>
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
