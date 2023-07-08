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

export const CartProduct=({x,functions})=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [totalprice,setTotalPrice]=useState(0)
    const [updateflag,setUpdateFlag]=useState(false)
    const [updateqty,setUpdateQty]=useState(x.Qty)
    const [discountprice,setDiscountPrice]=useState(0)
    const cont=useContext(context)
    const navigate=useNavigate()


    const removeFromCart=(x)=>{
        axios.delete(`user/cart/removefromcart/${x.ProductId}/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                toast.success('Item removed successfully')
                console.log(res.data.msg)
                functions.getproducts()
            }
        })
    }

    const modifyqty=(x)=>{
        const data={
            email:cont.useremail,
            id:x.ProductId,
            qty:updateqty
        }
        axios.put("/user/cart/modifyqty",data).then((res)=>{
            if(res.data.status){
                toast.success('Cart Updated Successfully')
                functions.getproducts()
                setUpdateFlag(false)
            }
        })
    }

    const changeState=(items)=>{
        functions.updateState(items.ProductId)
    }

    


    return(
        <tr>
            <td>{x.ProductName}</td>
            <td><img src={x.Image} width="50" height="50"/></td>
            {updateflag?<td><input type="number" id={x.ProductId} className="form-control" value={updateqty} onChange={(e)=>setUpdateQty(e.target.value)} placeholder="Enter Quantity"></input></td>:
            <td>{x.Qty}</td>}
            <td>₹ {x.Price}</td>
            <td>{x.Category}</td>
            <td><input type="checkbox" onChange={()=>changeState(x)}></input></td>
            {updateflag?
            <td><button className='btn btn-secondary' onClick={()=>modifyqty(x)}>Save</button></td>:
            <td><button className='btn btn-primary' onClick={()=>removeFromCart(x)}>Remove</button>
            <button style={{position:"relative",left:"3px"}} onClick={()=>setUpdateFlag(true)} className='btn btn-success'>Edit</button></td>}
        </tr>
    )
}