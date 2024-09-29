import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import { CSSTransition , TransitionGroup} from 'react-transition-group';

const App = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const events = ['Stem Cell Donation Drive', 'Blood Donation Camp', 'Marathon Event'];

  // Load users from a CSV file on component mount
  React.useEffect(() => {
    fetch('/participantsnew.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (result) => {
            setUsers(result.data.map((row) => row[0].trim().toLowerCase()));
          }
        });
      });
  }, []);

  const handleDownload = () => {
    const userName = name.trim().toLowerCase();

    if (!selectedEvent) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select an event',
        text: 'You must select an event to get your certificate.',
        confirmButtonText: 'OK',
        position: 'center'
      });
      return;
    }

    if (userName && users.includes(userName)) {
      const img = new Image();
      img.src ='/certificate_stem.png';

      img.onload = () => {
        const doc = new jsPDF('landscape', 'px', 'a4');
        doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);

        const textWidth = doc.getTextWidth(name);
        const pageWidth = doc.internal.pageSize.getWidth();
        const xPosition = (pageWidth - textWidth) / 2;

        doc.text(name, xPosition, 196);

        doc.save(`${name}-certificate.pdf`);
        
        Swal.fire({
          icon: 'success',
          title: 'Certificate is downloading!',
          text: 'Check your Downloads section.',
          confirmButtonText: 'OK',
          position: 'center'
        });
      };
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Name not found',
        text: 'Sorry, your name was not found in the records.',
        confirmButtonText: 'OK',
        position: 'center'
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: 'url(nss1.jpg)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(1.2)',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Neat center div with shadow and rounded corners */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Lighter background
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',  // More subtle shadow
        textAlign: 'center',
        width: '60%',
        maxWidth: '600px',
        minWidth: '300px',
        animation: 'fade-in 1s'
      }}>
        <h1 style={{
          fontSize: '4vw',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'fade-in 2s'
        }}>Certificate Section</h1>

        {/* Event Selection */}
        <div style={{ marginBottom: '30px', position: 'relative' }}>
          <button onClick={() => setDropdownVisible(!isDropdownVisible)} style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            outline: 'none'
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
            onFocus={(e) => e.target.style.boxShadow = '0px 0px 8px rgba(0, 123, 255, 0.7)'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}>
            {selectedEvent ? `Event: ${selectedEvent}` : 'Select an Event'}
          </button>

          <CSSTransition in={isDropdownVisible} timeout={300} classNames="fade" unmountOnExit>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '10px 0',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',  // Subtle shadow
              position: 'absolute',
              width: '100%',
              zIndex: 1,
              animation: 'slide-down 0.4s ease-out',  // Animation for dropdown
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {events.map(event => (
                <li key={event} onClick={() => { setSelectedEvent(event); setDropdownVisible(false); }} style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f1f1f1'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
                  {event}
                </li>
              ))}
            </ul>
          </CSSTransition>
        </div>

        {selectedEvent && (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                padding: '15px',
                width: '80%',
                maxWidth: '400px',
                fontSize: '16px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0px 0px 10px rgba(0, 123, 255, 0.5)'}
              onBlur={(e) => e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'}
            />
            <button onClick={handleDownload} style={{
              padding: '15px 30px',
              fontSize: '16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s, transform 0.3s'
            }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007BFF';
                e.target.style.transform = 'scale(1)';
              }}>
              Get your Certificate
            </button>

            {/* Back button */}
            <button onClick={() => setSelectedEvent('')} style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'all 0.3s',
              display: 'block',  // Ensure it is separate from the main button
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
