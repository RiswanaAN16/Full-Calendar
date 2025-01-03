import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import "../../src/App.css";

function FullCalender() {
    const [events, setEvents] = useState([]);

    function renderEventContent(eventInfo) {
        return (
            <div className="event-content">
                <div className="event-header">
                    <span className="event-title">{eventInfo.event.title}</span>
                </div>
                <div className="event-details">
                    {eventInfo.timeText && (
                        <div className="event-time">
                            <FontAwesomeIcon icon={faClock} /> {eventInfo.timeText}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const handleDateClick = (date) => {
        alert(`You clicked on date: ${date.dateStr}`);
    };
    useEffect(() => {
        const fetchEvents = async () => {
            const apiKey = ""; //api key
            const calendarId = ""; //calendar id
            const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.items) {
                    const formattedEvents = data.items.map((item) => ({
                        id: item.id,
                        title: item.kind || "No Title",
                        start: item.start.dateTime || item.start.date,
                        end: item.end?.dateTime || item.end?.date,
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);
    return (
        <div className="full-calendar-container">
            <h1 className="calendar-title">Full Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                eventContent={renderEventContent}
                dateClick={handleDateClick}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                buttonText={{
                    today: "Today",
                    month: "Month",
                    week: "Week",
                    day: "Day",
                }}
            />
        </div>
    );
}

export default FullCalender;
