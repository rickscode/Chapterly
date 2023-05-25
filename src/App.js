import React, { useState, useEffect, useRef } from 'react';
import './App.css';
// import logo from './logo.png';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [summary, setSummary] = useState({ text: '', tips: [] });
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utterancesRef = useRef([]);
  const [showChapters, setShowChapters] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const chaptersPerPage = 3;

  useEffect(() => {
    if (response) {
      const chaptersList = response.split('Chapter').slice(1);
      setChapters(chaptersList);
    }
  }, [response]);

  useEffect(() => {
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
    }
  
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);
  
  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    console.log('Available voices:', availableVoices);
    setVoices(availableVoices);
    setSelectedVoice(availableVoices[1]); // set the second voice as the default
  };
  
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
  setShowChapters(true); // Show chapters when a book is found
};

  const handleChapterClick = async (chapter) => {
    setSelectedChapter(chapter);
  
    const chapterNumber = chapter.trim().split(' ')[0]; 
  
    const response = await fetch('http://localhost:3001/chapter-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookTitle: bookTitle,  
        chapterNumber: chapterNumber, 
      }),
    });
  
    const data = await response.json();
  
    if (data.error) {
      console.error(data.error);
    } else {
      const text = data.choices[0].text.trim();
      console.log('Summary:', text);
      setSummary({ text });
    }
  };
  
  const speak = (text) => {
    console.log(text);
    const synth = window.speechSynthesis;
    synth.cancel(); // cancel any ongoing speech
  
    // Clear previous utterances
    utterancesRef.current = [];
  
    const sentences = text.match(/(?:[^.!?]+[.!?]+)|\s+$/g); // split text into sentences
    // console.log('Sentences:', sentences);

    const newUtterances = sentences.map((sentence) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.voice = selectedVoice; // set the selected voice
      utterance.onend = handleUtteranceEnd;

      utterance.volume = 1;

    console.log('Utterance volume:', utterance.volume);
      return utterance;
    });

      console.log('Utterances:', newUtterances);

  
    newUtterances.forEach((utterance) => {
      synth.speak(utterance);
    });
  
    utterancesRef.current = newUtterances;
  };
  
  
  const handleUtteranceEnd = (event) => {
    console.log('Utterance ended:', event.utterance.text);

    utterancesRef.current = utterancesRef.current.filter(
      (utterance) => utterance !== event.utterance
    );
  };
  
  

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="App">
        <h1 className="Heading">Chapterly</h1>
        <div className="message-input-container">
          <form className="message-input-form" onSubmit={handleSubmit}>
            <label className="search-label">
              Please Enter A Book Title And Author
              <input className="input" type="text" value={message} onChange={handleChange} />
            </label>
            <button className="search" type="submit">Send</button>
          </form>
        </div>
        {/* <img src={logo} className="logo" alt="logo" /> */}
        <div className="response">
          {response && (
            <div>
              {showChapters && (
                <>
                  <div className="book-info">
                    <h2>Title: {bookTitle}</h2>
                    <h4>Author: {bookAuthor}</h4>
                  </div>
                  {chapters.length > 0 && (
                    <>
                      <div className="outlined-box">
                        {chapters
                          .slice(
                            (currentPage - 1) * chaptersPerPage,
                            currentPage * chaptersPerPage
                          )
                          .map((chapter, index) => (
                            <button
                              key={index}
                              className="chapter-button"
                              onClick={() => handleChapterClick(chapter)}
                            >
                              Chapter{chapter}
                            </button>
                          ))}
                      </div>
                      <div className="chapter-navigation">
                        <button onClick={handlePrevious}>Previous</button>
                        <button onClick={handleNext}>Next</button>
                        <button className="close-button" onClick={() => setShowChapters(false)}>
                    Close
                  </button>
                      </div>
                    </>
                  )}
                  {/* <button className="close-button" onClick={() => setShowChapters(false)}>
                    Close
                  </button> */}
                </>
              )}

              {selectedChapter && summary && (
                <div className="summary-overlay">
                  <div className="summary-container">
                    <h3>Chapterized:</h3>
                    <p>{summary.text}</p>
                    <button onClick={() => speak(summary.text)}>Play Summary</button>
                    <select
                      value={selectedVoice ? selectedVoice.voiceURI : ''}
                      onChange={(e) =>
                        setSelectedVoice(
                          voices.find((voice) => voice.voiceURI === e.target.value)
                        )
                      }
                    >
                      {voices.map((voice, index) => (
                        <option key={index} value={voice.voiceURI}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                    <button className="close-button" onClick={() => setSummary(null)}>
                      Close
                    </button>
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