import React from 'react'
import '../bootstrap.min.css'
import {useState,useEffect,useContext} from 'react'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import {Loading} from './Loading'
import { context } from './Context'; 
import '../css/Shopping.css'
import { NavigationBar } from './Navbar'

export const SelectedProduct=({x,functions})=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [totalprice,setTotalPrice]=useState(0)
    const [updateflag,setUpdateFlag]=useState(false)
    const [updateqty,setUpdateQty]=useState(x.Qty)
    const [discountprice,setDiscountPrice]=useState(0)
    const cont=useContext(context)
    const navigate=useNavigate()

    return(
        <tr>
            <td>{x.ProductName}</td>
            <td><img src={x.Image} width="50" height="50"/></td>
            <td>{x.Qty}</td>
            <td>₹ {x.Price}</td>
            <td>{x.Category}</td>
        </tr>
    )
}