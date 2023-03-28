import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png';
import Navbar from './Navbar';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 7;

  useEffect(() => {
    if (response) {
      const chaptersList = response.split('Chapter').slice(1);
      setChapters(chaptersList);
    }
  }, [response]);

  const handleNext = () => {
    if (currentPage * chaptersPerPage < chapters.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          {chapters.length > 0 && (
            <div>
              <h3>Response:</h3>
              <div className="outlined-box">
                {chapters
                  .slice(
                    (currentPage - 1) * chaptersPerPage,
                    currentPage * chaptersPerPage
                  )
                  .map((chapter, index) => (
                    <button key={index} className="chapter-button">
                      Chapter{chapter}
                    </button>
                  ))}
              </div>
              <div className="chapter-navigation">
                <button onClick={handlePrevious}>Previous</button>
                <button onClick={handleNext}>Next</button>
              </div>
              <button className="close-button" onClick={() => setChapters([])}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
