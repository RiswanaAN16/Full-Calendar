import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FullCalendar from '@fullcalendar/react'
import FullCalender from './component/fullCalender'
import FullCalendarWithAuth from './component/FullCalendarWithAuth'

function App() {

  return (
    <>
      {/* <FullCalender /> */}
      <FullCalendarWithAuth />
    </>
  )
}

export default App
