import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import { CSSTransition } from 'react-transition-group';

const App = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const events = ['Stem Cell Donation Drive', 'Beach Cleanup Drive', 'Blood Donation Camp', 'Marathon Event'];

  // Function to get the certificate template image based on the event
  const getCertificateImage = (event) => {
    switch (event) {
      case 'Stem Cell Donation Drive':
        return '/certificate_stem.png';
      case 'Beach Cleanup Drive':
        return '/certificate_beach.png';
      case 'Blood Donation Camp':
        return '/certificate_blood.png';
      case 'Marathon Event':
        return '/certificate_marathon.png';
      default:
        return '';
    }
  };

  // Function to load the CSV for the selected event
  const loadCSVForEvent = (event) => {
    let csvFilePath = '';
    switch (event) {
      case 'Stem Cell Donation Drive':
        csvFilePath = '/participants_stem.csv';
        break;
      case 'Beach Cleanup Drive':
        csvFilePath = '/beachcleanup.csv';
        break;
      case 'Blood Donation Camp':
        csvFilePath = '/participants_blood.csv';
        break;
      case 'Marathon Event':
        csvFilePath = '/participants_marathon.csv';
        break;
      default:
        return;
    }

    // Fetch the corresponding CSV file and load the users
    fetch(csvFilePath)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          complete: (result) => {
            // Map the names from the CSV, and make them lowercase for comparison
            setUsers(result.data.map((row) => row[0].trim().toLowerCase()));
          },
        });
      });
  };

  // Function to get the font settings for different events
  const getFontForEvent = (event) => {
    switch (event) {
      case 'Stem Cell Donation Drive':
        return { font: 'helvetica', style: 'bold', size: 32 }; // Dark teal color for text
      case 'Beach Cleanup Drive':
        return { font: 'times', style: 'italic', size: 35 }; // Sea green color for text
      case 'Blood Donation Camp':
        return { font: 'courier', style: 'normal', size: 30 }; // Red color for text
      case 'Marathon Event':
        return { font: 'arial', style: 'bolditalic', size: 36 }; // Bold italic with orange text
      default:
        return { font: 'helvetica', style: 'bold', size: 32 }; // Default to black text
    }
  };

  // Function to handle the event selection and load the appropriate CSV
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    loadCSVForEvent(event); // Load the appropriate CSV when an event is selected
    setDropdownVisible(false); // Close the dropdown after selection
  };

  // Function to handle certificate download
  const handleDownload = () => {
    const userName = name.trim().toLowerCase();

    if (!selectedEvent) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select an event',
        text: 'You must select an event to get your certificate.',
        confirmButtonText: 'OK',
        position: 'center',
      });
      return;
    }

    if (userName && users.includes(userName)) {
      const imgSrc = getCertificateImage(selectedEvent);
      const { font, style, size } = getFontForEvent(selectedEvent); // Get the specific font settings

      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
          const doc = new jsPDF('landscape', 'px', 'a4');
          doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

          // Set the font style for the event-specific certificate
          doc.setFont(font, style);
          doc.setFontSize(size);

          const textWidth = doc.getTextWidth(name);
          const pageWidth = doc.internal.pageSize.getWidth();
          const xPosition = (pageWidth - textWidth) / 2;

          // Adjusted the vertical position of the name
          doc.text(name, xPosition, 175); // Changed y-coordinate to 190 for higher position

          doc.save(`${name}-${selectedEvent}-certificate.pdf`);

          Swal.fire({
            icon: 'success',
            title: 'Certificate is downloading!',
            text: 'Check your Downloads section.',
            confirmButtonText: 'OK',
            position: 'center',
          });
        };
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Name not found',
        text: 'Sorry, your name was not found in the records for this event.',
        confirmButtonText: 'OK',
        position: 'center',
      });
    }
  };

  return (
    <div
      style={{
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
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lighter background
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)', // More subtle shadow
          textAlign: 'center',
          width: '60%',
          maxWidth: '600px',
          minWidth: '300px',
          animation: 'fade-in 1s',
        }}
      >
        <h1
          style={{
            fontSize: '4vw',
            marginBottom: '20px',
            textAlign: 'center',
            animation: 'fade-in 2s',
          }}
        >
          Certificate Section
        </h1>

        {/* Event Selection */}
        <div style={{ marginBottom: '30px', position: 'relative' }}>
          <button
            onClick={() => setDropdownVisible(!isDropdownVisible)}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              outline: 'none',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
            onFocus={(e) => (e.target.style.boxShadow = '0px 0px 8px rgba(0, 123, 255, 0.7)')}
            onBlur={(e) => (e.target.style.boxShadow = 'none')}
          >
            {selectedEvent ? `Event: ${selectedEvent}` : 'Select an Event'}
          </button>

          <CSSTransition in={isDropdownVisible} timeout={300} classNames="fade" unmountOnExit>
            <ul
              style={{
                listStyle: 'none',
                padding: '0',
                margin: '10px 0',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
                position: 'absolute',
                width: '100%',
                zIndex: 1,
                animation: 'slide-down 0.4s ease-out', // Animation for dropdown
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {events.map((event) => (
                <li
                  key={event}
                  onClick={() => handleEventSelect(event)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#f1f1f1')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
                >
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
                borderRadius: '5px',
                border: '1px solid #ddd',
                width: '100%',
                marginBottom: '20px',
                outline: 'none',
                fontSize: '16px',
              }}
            />
            <button
              onClick={handleDownload}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                outline: 'none',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
              onFocus={(e) => (e.target.style.boxShadow = '0px 0px 8px rgba(40, 167, 69, 0.7)')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            >
              Get Your Certificate
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
