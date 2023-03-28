import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.png';
import Navbar from './Navbar';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState({ text: '', tips: [] });
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

  // const handleChapterClick = async (chapter) => {
  //   const response = await fetch('http://localhost:3001', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       message: `Summarize chapter "${chapter}" in 100 words and provide 3 practical life tips and an ending message message after the tips saying "I hope you are able to apply these tips in your own life provided by Chapterly.tech"`
  //     }),
  //   });
  //   const data = await response.json();
  //   const text = data.choices[0].text.trim();
  
  //   // Parse text into summary and tips
  //   const summaryStartIndex = text.indexOf('Chapter');
  //   const summaryEndIndex = text.indexOf('Three practical life tips') || ('practical life tips');
  //   const summary = text.substring(summaryStartIndex, summaryEndIndex).trim();
  //   const tipsStartIndex = text.indexOf('Three practical life tips') || ('practical life tips');
  //   // const tipsEndIndex = text.indexOf('1)') - 1;
  //   const tipsEndIndex = text.indexOf('.tech');
  //   const tipsText = text.substring(tipsStartIndex, tipsEndIndex).trim();
  //   const tips = tipsText.split('\n').filter(tip => tip.trim() !== '');
  //   console.log(text);
  //   console.log('Summary:', summary);
  //   console.log('Tips:', tips);
  //   setSummary({ summary: summary, tips: tips });
  // };

  const handleChapterClick = async (chapter) => {
    const response = await fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Summarize chapter "${chapter}" in 100 words and provide 3 practical life tips`
      }),
    });
    const data = await response.json();
    const text = data.choices[0].text.trim();
    console.log(text);
    setSummary({ text }); // Update this line to parse the text into summary and tips.
  };
  
  
  
  
  
  
  

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <h1 className="Heading">Chapterly</h1>
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
      <div className="outlined-box">
        {chapters
          .slice(
            (currentPage - 1) * chaptersPerPage,
            currentPage * chaptersPerPage
          )
          .map((chapter, index) => (
            <button key={index} className="chapter-button" onClick={() => handleChapterClick(chapter)}>
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
      {summary && (
        <div className="summary-overlay">
          <div className="summary-container">
            <h3>Chapterized:</h3>
            <p>{summary.text}</p>
            <button className="close-button" onClick={() => setSummary(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )}
</div>

        </div>
    </>
  );
}

export default App;
