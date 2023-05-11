import React from 'react'
import '../bootstrap.min.css'
import {useState,useEffect,useContext} from 'react'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import {Loading} from './Loading' 
import { context } from './Context'
import Table from 'react-bootstrap/Table'
import { NavigationBar } from './Navbar';

export const Cart=()=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [totalprice,setTotalPrice]=useState(0)
    const [updateflag,setUpdateFlag]=useState(false)
    const [updateqty,setUpdateQty]=useState(0)
    const [executed,setExecuted]=useState(false)
    const cont=useContext(context)
    const navigate=useNavigate()

    useEffect(()=>{
        cont.setViewDetails([])
        getproducts()
    },[executed])

    const getproducts=()=>{
        axios.get(`/user/cart/viewcart/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                setProducts(res.data.msg)
                gettotalprice(res.data.msg)
                if(!executed)
                    updateDefaultState(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
            
        })
    }

    const removeFromCart=(x)=>{
        axios.delete(`user/cart/removefromcart/${x.ProductId}/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                toast.success('Item removed successfully')
                console.log(res.data.msg)
                getproducts()
            }
        })
    }

    const modifyqty=(x)=>{
        const datas={
            email:cont.useremail,
            id:x.ProductId,
            qty:updateqty
        }
        axios.put("/user/cart/modifyqty",datas).then((res)=>{
            if(res.data.status){
                toast.success('Cart Updated Successfully')
                getproducts()
                setUpdateFlag(false)
                setUpdateQty(0)
            }
        })
    }

    const gettotalprice=(items)=>{
        let total=0
        items.map((x)=>{
            total+=(x.Price)*(x.Qty)
        })
        setTotalPrice(total)
        setLoading(false)
    }

    const changeState=(items)=>{
        const datas={
            id:items.ProductId,
            email:cont.useremail
        }
        axios.put("/user/cart/editstate",datas).then((res)=>{
            if(res.data.status){
                console.log('State Changed !')
                getproducts()
            }
            else
                toast.error(res.data.msg)
        })
    }

    const updateDefaultState=(items)=>{
        items.map((x)=>{
            const datas={
                id:x.ProductId,
                email:cont.useremail
            }
            axios.put("/user/cart/editstatebeforenavigate",datas).then((res)=>{
                if(res.data.status){
                    setExecuted(true)
                    console.log(res.data.msg)
                }
                else
                    toast.error(res.data.msg)
            })
        })
    }

    const buy=()=>{
        const lst = products.filter((x) => x.State===true)
        cont.setViewDetails(lst)
        navigate('/book')
    }

    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <br></br>
                    <br></br>
                    <h1 className='title'>Cart</h1>
                    <br></br>
                    <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Add to Buy</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {products.map((x)=>
                                <tr>
                                    <td>{x.ProductName}</td>
                                    <td><img src={x.Image} width="50" height="50"/></td>
                                    {updateflag?<td><input type="number" id={x.ProductId} className="form-control" onChange={(e)=>setUpdateQty(e.target.value)} placeholder="Enter Quantity"></input>
                                    <br></br>
                                    <button className="btn btn-primary" onClick={()=>modifyqty(x)}>Set Qty</button></td>:
                                    <td>{x.Qty}</td>}
                                    <td>₹ {x.Price}</td>
                                    <td>{x.Category}</td>
                                    <td><input type="checkbox" onChange={()=>changeState(x)}></input></td>
                                    <td><button className='btn btn-primary' onClick={()=>removeFromCart(x)}>Remove</button>
                                    
                                    <button style={{position:"relative",left:"3px"}} onClick={()=>setUpdateFlag(true)} className='btn btn-success'>Edit</button></td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <br></br>
                        <Table responsive striped bordered hover>
                            <thead>
                                <th>Total Price :</th>
                                <th>₹ {totalprice}</th>
                            </thead>
                        </Table>
                        <div>
                            <center>
                                <button className='btn btn-success' onClick={buy}>Buy Now</button>
                            </center>
                        </div>
                </div>}
        </div>
    )
}