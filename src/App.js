import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

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
    <div className="App">
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
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
