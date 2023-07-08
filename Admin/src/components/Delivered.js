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
    const [date,setDate]=useState("")
    const cont=useContext(context)
    const [citylst,setCityLst]=useState([])
    const [addressinfo,setAddressInfo]=useState([])
    const [pincode,setPincode]=useState("")
    const [address,setAddress]=useState("")
    const [filterorders,setFilterOrders]=useState([])
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
            getcities()
        }
    },[])

    const getcities=()=>{
        axios.get("/admin/pincode/getpincode").then((res)=>{
            if(res.data.status){
                setAddressInfo(res.data.msg)
                cityinfo(res.data.msg)
            }
        })
    }

    const cityinfo=(info)=>{
        const lst1=[]
        for(const x of info){
            if(!lst1.includes(x.City))
                lst1.push(x.City)
        }
        setCityLst(lst1)
    }

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
        setLoading(false)
        setOrders(allOrders)
        setFilterOrders(allOrders)
    }

    const filter=(date,pincode,address)=>{
        
        if(date==="" && pincode==="" && address===""){
            setFilterOrders(orders)
        }
        else{
            if(date!=="" && pincode==="" && address===""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].OrderedDate===date){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date!=="" && pincode!=="" && address===""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].OrderedDate===date && x[0].Pincode===pincode){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date!=="" && pincode!=="" && address!==""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].OrderedDate===date && x[0].Pincode===pincode && x[0].Address==address){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date==="" && pincode!=="" && address!==""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].Pincode===pincode && x[0].Address===address){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date!=="" && pincode==="" && address!==""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].OrderedDate===date && x[0].Address===address){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date==="" && pincode==="" && address!==""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].Address===address){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }
            else if(date==="" && pincode!=="" && address===""){
                const lst=[]
                orders.map((x)=>{
                    if(x[0].Pincode===pincode){
                        lst.push(x)
                    }
                })
                setFilterOrders(lst)
            }

        }
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
                    <br></br>
                    <div>
                        {orders.length==0?<h3 style={{textAlign:"center"}}>No Orders Found</h3>:<div>
                        <div className='row'>
                            <div className='col-md-4'></div>
                            <div className='col-md-4 orders'>
                            <h3 className='title'>Filter Orders</h3>
                                <label>Date :</label>
                                <input type="date" onChange={(e)=>{setDate(e.target.value);filter(e.target.value,pincode,address)}} placeholder="Enter the date" className='form-control'></input>
                                <br></br>
                                <label>City :</label>
                                <select onChange={(e)=>{setAddress(e.target.value);filter(date,pincode,e.target.value)}} className='form-control'>
                                    <option value="">Choose City</option>
                                    {citylst.map((x)=>
                                        <option value={x}>{x}</option>
                                    )}
                                </select>
                                <br></br>
                                <label>Pincode :</label>
                                <select onChange={(e)=>{setPincode(e.target.value);filter(date,e.target.value,address)}} className='form-control'>
                                        <option value="">Choose Pincode</option>
                                        {addressinfo.map((x)=>
                                            <option value={x.Pincode}>{x.Pincode}</option>
                                        )}
                                </select>
                                <br></br>
                            </div>
                            <div className='col-md-4'></div>
                        </div>
                        
                        <br></br>
                        <br></br>
                        {filterorders.map((x,index)=>
                            <div>
                            <div style={{borderRadius:"5px",padding:"10px"}} className='table_top'>
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
                                        <td>{x[0].Name}</td>
                                        <td>{x[0].MobileNumber}</td>
                                        <td>{x[0].Address}</td>
                                        <td>{x[0].Pincode}</td>
                                        <td>{x[0].OrderedDate}</td>
                                    </tr>
                                </thead>
                            </Table>
                            <div>
                                <Table responsive striped bordered hover>
                                <thead>
                                    {x.map((items,index)=>
                                        (index===x.length-1)?"":
                                        <tr>
                                            <th>Product Name</th>
                                            <td>{items.ProductName}</td>
                                            <th>Quantity</th>
                                            <td>{items.Qty}</td>
                                            <th>Price (Per Qty)</th>
                                            <td>₹ {items.Price}</td>
                                        </tr>
                                    )}
                                </thead>
                                </Table>
                            </div>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Total Price</th>
                                        <td>₹ {x[x.length-1]}</td>
                                        <th>Status</th>
                                        <td>{x[0].Status}</td>
                                    </tr>
                                </thead>
                            </Table>
                            
                            </div>
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