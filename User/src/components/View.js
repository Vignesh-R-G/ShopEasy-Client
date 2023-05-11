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
import '../css/Shopping.css'

export const View=()=>{
    const[loading,setLoading]=useState(true)
    const cont=useContext(context)
    const viewproduct=cont.viewdetails
    console.log(viewproduct)

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        },2000)
    },[])

    const addtocart=(x)=>{
        const datas={
            email:cont.useremail,
            productid:x._id,
            productname:x.Name,
            image:x.Image,
            price:x.Price,
            category:x.Category,
            qty:x.Available_Qty
        }
        axios.post("/user/cart/addtocart",datas).then((res)=>{
            if(res.data.status){
                toast.success("Item Added to Cart Successfully !")
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }

    return(
        <div className='container-fluid'>
        {loading?
            <Loading/>
            :<div>
                <NavigationBar/>
                <br></br>
                <br></br>
                <br></br>
                <h1 className='title'>{viewproduct[0].Name}</h1>
                <br></br>
                <hr></hr>
                <br></br>

                <div>
                    <div className="row">
                            <div className='col-md-2'></div>
                            {viewproduct.map((x)=>
                                <div className="col-md-3">
                                    <center>
                                        {x.Discount!=0?<button className="btn btn-success">Available at {x.Discount} % OFFER</button>:<button className="btn btn-success">No Offers Available</button>}
                                    </center>
                                    <img src={x.Image}  height="400"  className="card-img-top image" alt="Products"/>
                                </div>
                            )}
                            <div className='col-md-2'></div>
                            <div className='col-md-3'>
                                <br></br>
                                <h1 style={{color:"blueviolet"}}>Product Details</h1>
                                <br></br>
                                <br></br>
                                
                                <h5>Product Name :          <span style={{color:"blue"}}>{viewproduct[0].Name}</span></h5>
                                <h5>Available Quantity :    <span style={{color:"blue"}}>{viewproduct[0].Available_Qty}</span></h5>
                                <h5>Price :                 <span style={{color:"blue"}}>₹ {viewproduct[0].Price}</span></h5>
                                <h5>Product Category :      <span style={{color:"blue"}}>{viewproduct[0].Category}</span></h5>
                                <br></br>
                                <button className="btn btn-success">Buy Now</button>
                                
                            </div>
                        </div>
                        <br></br>
                        <hr></hr>
                        <h1 className='title'>Features</h1>
                        <hr></hr>
                        <br></br>
                        <p style={{fontSize:"18px"}}>{viewproduct[0].Description}</p>
                        <br></br>
                        <hr></hr>
                </div>
            </div>}
        </div>
    )
}