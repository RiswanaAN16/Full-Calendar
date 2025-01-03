import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import "../../src/App.css";

const GoogleSignInButton = () => {
  const [clientId, setClientId] = useState(() => localStorage.getItem('clientId') || '');
  const [events, setEvents] = useState([]);

  const handleSignIn = () => {
    if (!clientId.trim()) {
      alert('Client ID is required!');
      return;
    }

    const currentPort = window.location.port;
    const redirectUri = `http://localhost:5000/api/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/calendar.readonly';
    const responseType = 'token';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
    localStorage.setItem('clientId', clientId);
    window.location.href = authUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      fetchEvents(accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchEvents = (accessToken) => {
    const calendarApiUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    fetch(calendarApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = formatEvents(data.items);
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const formatEvents = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data structure:', data);
      return [];
    }
    return data.map((event) => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));
  };

  return (
    <div>
      <h1 className="title">Google Calendar Integration</h1>
      <div className="google-signin-container">
        <div className="signin-form">
          <input
            type="text"
            placeholder="Enter Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="client-id-input"
          />
          <button onClick={handleSignIn} className="googlebtn">
            <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
          </button>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={(eventInfo) => (
          <div className="event-details">
            {eventInfo.event.title}
          </div>
        )}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
      />
    </div>
  );
};

export default GoogleSignInButton;
