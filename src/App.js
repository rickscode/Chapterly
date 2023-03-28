import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import logo from './logo.png';
import Navbar from './Navbar';
import sound from './Chapter1ofmastery.mp3';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState({ text: '', tips: [] });
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  // const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState('');


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
  const title = text.match(/Title: (.*)Author:/)[1].trim();
  const author = text.match(/Author: (.*)Chapter 1:/)[1].trim();
  setBookTitle(title);
  setBookAuthor(author);
  setMessage('');
};
  
// const handleSubmit = async (event) => {
//   event.preventDefault();
//   const response = await fetch('http://localhost:3001', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ message })
//   });
//   const data = await response.json();
//   const text = data.choices[0].text.trim();
//   console.log(text);
//   setResponse(text);
//   setBookTitle(data.title);
//   setBookAuthor(data.author);
//   setMessage('');

//   // fetch book cover image URL
//   const bookTitleFormatted = data.title.replace(/ /g, '+');
//   const bookAuthorFormatted = data.author.replace(/ /g, '+');
//   const bookCoverResponse = await fetch(`https://bookcover-api.onrender.com/bookcover?book_title=${bookTitleFormatted}&author_name=${bookAuthorFormatted}`);
//   const bookCoverData = await bookCoverResponse.json();
//   if (bookCoverData.error) {
//     setBookCover(null);
//   } else {
//     setBookCover(bookCoverData.cover_url);
//   }
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
    setSummary({ text });
    setAudioFile({ sound });
    console.log(audioFile); // add this line

  };

  //audio 
// eslint-disable-next-line
  const audio = useRef(null);

// const playAudio = () => {
//   audio.current.play();
//   setIsPlaying(true);
// };

// const pauseAudio = () => {
//   audio.current.pause();
//   setIsPlaying(false);
// };

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
              <input className= "input" type="text" value={message} onChange={handleChange} />
            </label>
            <button className="search" type="submit">Send</button>
          </form>
          {/* <audio ref={audio} controls>
  <source src={ sound } type="audio/mp3" />
</audio> */}
        </div>
        <img src={logo} className="logo" alt="logo" />
        <div className="response">
          {response && (
            <div>
              <div className="book-info">
                <h2>Title: {bookTitle}</h2>
                <h4>Author: {bookAuthor}</h4>
                {/* {bookCover && (
    <img src={bookCover} alt={`Cover of ${bookTitle}`} className="book-cover" />
  )} */}
              </div>
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
      <audio ref={audio} controls>
  <source src={ sound } type="audio/mp3" />
</audio>
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
