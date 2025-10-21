import React from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"

import Register from "./pages/Register"
// import Movie from "./pages/Movie"
// import Actor from "./pages/Actor"
import Home from "./pages/Home"
import MovieActorsPage from "./pages/MovieActorsPage"
import ActorPage from "./pages/ActorPage"
import MoviePage from "./pages/MoviePage"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import Logout from "./pages/Logout"


function App() {
  
  const username = localStorage.getItem("username") || "Invité";

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/movies/:id/actors" element={<MovieActorsPage />} />
        <Route path="/actors/:id" element={<ActorPage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
