import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import { context } from './Context';
import {Loading} from './Loading'
import Table from 'react-bootstrap/Table'
import { NavigationBar } from './Navbar';
import { UnAuthorized } from './UnAuthorized';

export const Delivered=()=>{
    const [loading,setLoading]=useState(true)
    const [orders,setOrders]=useState([])
    const navigate=useNavigate()

    useEffect(()=>{
        if(!localStorage.getItem("shopeasy_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
        else{
        getdistinctorders()
        }
    },[])

    const getdistinctorders=()=>{
        axios.get("/user/order/distinctorders").then((res)=>{
            if(res.data.status){
                ordersmap(res.data.msg)
            }
        })
    }

    const ordersmap = async (distinctIds) => {
        const allOrders = [];
        for (const id of distinctIds) {
          const res = await axios.get(`/user/order/getdeliveredorders/${id}`)
          if(res.data.status){
            //To avoid storing empty lists
            if(res.data.msg.length!=1 && res.data.msg.length!=0)
                allOrders.push(res.data.msg)
          }
        }
        setLoading(false);
        setOrders(allOrders);
    }

     
    return(
        <div className="container-fluid">
            {loading?
                <Loading/>
                :<div>
                    <NavigationBar/>
                    {localStorage.getItem("shopeasy_token")?<div>
                    <br></br>
                    <br></br>
                    <h1 className="title" style={{textAlign:"center"}}>Delivered Orders</h1>
                    <br></br>
                    <div>
                        {orders.length==0?<h3 style={{textAlign:"center"}}>No Orders Found</h3>:<div>
                        {orders.map((x,index)=>
                            <div>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>MobileNo</th>
                                        <th>Address</th>
                                        <th>Pincode</th>
                                        <th>Ordered Date</th>
                                    </tr>
                                    <tr>
                                        <th>{x[0].Name}</th>
                                        <th>{x[0].MobileNumber}</th>
                                        <th>{x[0].Address}</th>
                                        <th>{x[0].Pincode}</th>
                                        <th>{x[0].OrderedDate.slice(0,10)}</th>
                                    </tr>
                                </thead>
                            </Table>
                            <br></br>
                            <div>
                                <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Image</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {x.map((items,index)=>
                                    (index===x.length-1)?"":
                                    <tr>
                                        <td>{items.ProductName}</td>
                                        <td><img src={items.Image} width="40" height="40"/></td>
                                        <td>{items.Qty}</td>
                                        <td>₹ {items.Price}</td>
                                    </tr>
                                )}
                                </tbody>
                                </Table>
                            </div>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>₹ {x[x.length-1]}</td>
                                        <td>{x[0].Status}</td>
                                        
                                    </tr>
                                </tbody>
                            </Table>
                            
                            <br></br>
                            <br></br>
                            
                            </div>
                            
                        )}
                        </div>}
                    </div>
                    </div>:<UnAuthorized/>}
                </div>}
        </div>
    )
}