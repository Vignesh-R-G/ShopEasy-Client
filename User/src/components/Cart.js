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
import { NavigationBar } from './Navbar'
import { CartProduct } from './CartProducts'
import { SelectedProduct } from './SelectedProduct';

export const Cart=()=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [totalprice,setTotalPrice]=useState(0)
    const [selectedprice,setSelectedPrice]=useState(0)
    const [updateflag,setUpdateFlag]=useState(false)
    const [updateqty,setUpdateQty]=useState(0)
    const [lst,setLst]=useState([])
    const cont=useContext(context)
    const navigate=useNavigate()

    useEffect(()=>{
        cont.setViewDetails([])
        getproducts()
    },[])

    const gettotalprice=(items)=>{
        let total=0
        items.map((x)=>{
            total+=(x.Price)*(x.Qty)
        })
        setTotalPrice(total)
        setLoading(false)
    }

    const getproducts=()=>{
        axios.get(`/user/cart/viewcart/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                setProducts(res.data.msg)
                gettotalprice(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }

    const getselectedprice=(items)=>{
        let total=0
        products.map((x)=>{
            if(items.includes(x.ProductId))
                total+=(x.Price)*(x.Qty)
        })
        setSelectedPrice(total)
    }

    const updateState=(x)=>{
        if(lst.includes(x)){
            const l=lst.filter((y)=>y!=x)
            setLst(l)
            getselectedprice(l)
        }
        else{
            const l=lst
            l.push(x)
            setLst([...lst,x])
            getselectedprice(l)
        }
    }
    console.log(lst)

    
    const buy=()=>{
        const l = products.filter((x) =>  lst.includes(x.ProductId))
        cont.setViewDetails(l)
        navigate('/book')
    }
    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <div>
                    <br></br>
                    <br></br>
                    <div className='search'>
                        <h1 className='title'>Cart</h1>
                    </div>
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
                                {products.map((y)=>
                                    <CartProduct x={y} functions={{getproducts,updateState}}/>
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
                        <br></br>
                        <div className='search'>
                            <h4 className='title' style={{color:"green"}}>Selected Products</h4>
                        </div>
                        <br></br>
                        <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((y)=>
                                    lst.includes(y.ProductId)?
                                    <SelectedProduct x={y} functions={{getproducts,updateState}}/>:""
                                )}
                            </tbody>
                        </Table>
                        <Table responsive striped bordered hover>
                            <thead>
                                <th>Total Price :</th>
                                <th>₹ {selectedprice}</th>
                            </thead>
                        </Table>
                        <div>
                            <center>
                                <button className='btn btn-success' onClick={()=>buy()}>Buy Now</button>
                            </center>
                        </div>
                        </div>
                </div>}
        </div>
    )
}