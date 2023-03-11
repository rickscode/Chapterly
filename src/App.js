import React, { useState } from 'react';

function MessageInput() {
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
    setResponse(data.message);
    setMessage('');
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <input type="text" value={message} onChange={handleChange} />
        </label>
        <button type="submit">Send</button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default MessageInput;
