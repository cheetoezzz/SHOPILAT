import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import ProductPage from '../pages/ProductPage';

function App() {
  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-200">
      
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/products" element={<ProductPage/>} />
      </Routes>
    </div>
  )
}

export default App;
