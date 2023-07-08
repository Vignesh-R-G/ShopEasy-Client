import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import { context } from './Context';
import {Loading} from './Loading'
import Table from 'react-bootstrap/Table'
import delivery from '../images/delivery.jpg'
import delivered from '../images/delivered.jpg'
import { NavigationBar } from './Navbar';


export const Myorders=()=>{
    const [loading,setLoading]=useState(true)
    const [orders,setOrders]=useState([])
    const cont=useContext(context)
    const navigate=useNavigate()

    useEffect(()=>{
            getallorders()
    },[])

    const getallorders=()=>{
        axios.get(`/user/history/getorderidinhistory/${cont.useremail}`).then((res)=>{
            if(res.data.status){
                console.log(res.data.msg)
                ordersmap(res.data.msg)
            }
        })
    }

    const ordersmap = async (distinctIds) => {
        const allOrders = [];
        for (const id of distinctIds) {
          const res = await axios.get(`/user/history/getordersofuser/${id.Order_Id}`)
          const payment_res=await axios.get(`/admin/payment/getpaymentdetail/${id.Order_Id}`)

          //To avoid storing empty lists

          if(res.data.status){
            if(res.data.msg.length!=1 && res.data.msg.length!=0){
                const l=res.data.msg
                l[0].paymentid=payment_res.data.msg.PaymentId
                
                allOrders.push(l)
            }
          }
        }
        setLoading(false);
        setOrders(allOrders);
    }

    const clearhistory=(orderid)=>{
        console.log(orderid)
        if(window.confirm('Are you sure to clear this history ? Remember you cannot get it back!')){
            axios.delete(`/user/history/deleteparticularhistory/${orderid}`).then((res)=>{
                if(res.data.status){
                    toast.success('History Cleared Successfully')
                    setLoading(true)
                    getallorders()
                }
                else
                    toast.error(res.data.msg)
            })
        }
    }

    const cancelbooking=(orderid)=>{
        if(window.confirm('Are you sure to cancel the booking ?')){
            axios.delete(`/user/order/cancelorder/${orderid}`).then((res)=>{
                if(res.data.status){
                    toast.success('Order Cancelled Successfully')
                    changeqtywhencancelling()
                }
                else{
                    toast.error(res.data.msg)
                }
            })
        }
    }

    const changeqtywhencancelling=()=>{
        setLoading(true)
        for(const order of orders){
            for(const x of order){
                const data={
                    id:x.ProductId,
                    ordered_qty:x.Qty
                }
                axios.put('/admin/product/autoeditwhencancelling',data).then((res)=>{
                    if(res.data.status){
                        getallorders()
                    }
                })
            }
        }
    }

    const deleteentirehistory=()=>{
        console.log('Executing')
        if(window.confirm('Are you sure to clear this history ? Remember you cannot get it back!')){
            axios.delete(`/user/history/deleteentirehistory/${cont.useremail}`).then((res)=>{
                if(res.data.status){
                    toast.success('History Cleared Successfully')
                    setLoading(true)
                    getallorders()
                }
                else
                    toast.error(res.data.msg)
            })
        }
    }

    console.log(orders)

    return(
        <div className="container-fluid">
            {loading?
                <Loading/>
                :<div>
                    <NavigationBar/>
                    
                    <br></br>
                    <br></br>
                    <div>
                        {orders.length==0?<h3 style={{textAlign:"center",color:"blue"}}>No Orders Found</h3>:<div>
                        <div>
                            <center>
                                <div className='orders'>
                                <h3>Are you need to clear your entire order history ?</h3>
                                <br></br>
                                <button className='btn btn-success' onClick={()=>deleteentirehistory()}>Clear Entire History</button>
                                </div>
                            </center>
                        </div>
                        <br></br>
                        <br></br>
                        {orders.map((x,index)=>
                            <div>
                            <div style={{borderRadius:"5px",padding:"10px"}} className='table_top'>
                            {x[0].Status==="In Progress"?
                            <div className='order'>
                                <center>
                                    <p>Expected Delivery Date: 12/06/2023</p>
                                </center>
                            </div>:""}
                            <br></br>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>MobileNo</th>
                                        <th>Address</th>
                                        <th>Pincode</th>
                                        <th>Ordered Date</th>
                                        <th>Payment Id</th>
                                    </tr>
                                    <tr>
                                        <td>{x[0].Name}</td>
                                        <td>{x[0].MobileNumber}</td>
                                        <td>{x[0].Address}</td>
                                        <td>{x[0].Pincode}</td>
                                        <td>{x[0].OrderedDate}</td>
                                        <td>{x[0].paymentid}</td>
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
                            <Table responsive striped bordered hover className='table_bottom'>
                                <thead>
                                    
                                        {(x[0].Status==='Delivered')?
                                        <tr>
                                            <th>Total Price</th>
                                            <td>₹ {x[x.length-1]}</td>
                                            <th>Status</th>
                                            <td>{x[0].Status}</td>
                                            <th>Action</th>
                                            <th>
                                                <button className="btn btn-primary" onClick={()=>clearhistory(x[0].OrderId)}>Clear History</button>
                                            </th>
                                        </tr>
                                        :
                                        <tr>
                                            {(x[0].Status==="In Progress")?
                                            <td>
                                                <marquee direction="righttoleft">
                                                    <img src={delivery} height="100"></img>
                                                </marquee> 
                                            </td>:
                                            ""}
                                            <th>Total Price</th>
                                            <td>₹ {x[x.length-1]}</td>
                                            <th>Status</th>
                                            <td>{x[0].Status}</td>
                                            <th>Action</th>
                                            <th>
                                                <button className="btn btn-success" onClick={()=>cancelbooking(x[0].OrderId)}>Cancel Booking</button>
                                            </th>
                                            <th>
                                                <button className="btn btn-primary" onClick={()=>clearhistory(x[0].OrderId)}>Clear History</button>
                                            </th>
                                        </tr>}
                                    
                                </thead>
                            </Table>
                            
                            </div>
                            <br></br>
                            <br></br>
                            </div>
                        )}
                        </div>}
                    </div>
                
                </div>}
                
        </div>
    )
}