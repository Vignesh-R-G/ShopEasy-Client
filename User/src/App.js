import logo from './logo.svg';
import {Routes,Route} from 'react-router-dom'
import { Shopping } from './components/Shopping';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Context } from './components/Context';
import { Cart } from './components/Cart';
import { Logout } from './components/Logout';
import { Home } from './components/Home';
import { View } from './components/View';
import { Booking } from './components/Booking'
import {Myorders} from './components/Myorders'

function App() {
  return (
    <div className="App">
      <Context>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/shopping" element={<Shopping/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/cart" element={<Cart/>}></Route>
          <Route path="/logout" element={<Logout/>}></Route>
          <Route path="/view" element={<View/>}></Route>
          <Route path="/book" element={<Booking/>}></Route>
          <Route path="/myorders" element={<Myorders/>}></Route>
        </Routes>
      </Context>
    </div>
  );
}

export default App;
