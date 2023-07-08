import logo from './logo.svg';
import {Routes,Route} from 'react-router-dom'
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Context } from './components/Context';
import { Product } from './components/Products';
import { Orders } from './components/Orders';
import { Delivered } from './components/Delivered';
import { AddProduct } from './components/AddProduct';
import { Logout } from './components/Logout'


function App() {
    return (
      <div className="App">
        <Context>
          <Routes>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/" element={<Product/>}></Route>
            <Route path="/orders" element={<Orders/>}></Route>
            <Route path="/delivered" element={<Delivered/>}></Route>
            <Route path="/addproduct" element={<AddProduct/>}></Route>
            <Route path="/logout" element={<Logout/>}></Route>
          </Routes>
        </Context>
      </div>
    );
}

export default App;
