import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';

function App() {

  return (
    <div className="w-full h-full bg-slate-900 border-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="/game" element={<Game />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
