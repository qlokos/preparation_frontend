import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GuestManagement from './pages/GuestManagement'
import Guest from './pages/Guest'
import HomeEspera from './pages/HomeEspera'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeEspera />} />
        <Route path="/68$@^Vnq9Rm!V5*24PUEP$s66x@E$q24@45" element={<GuestManagement />} />
        <Route path="/invite/:id" element={<Guest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
