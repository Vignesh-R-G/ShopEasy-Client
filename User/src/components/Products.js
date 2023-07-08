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
import { NavigationBar } from './Navbar';

export const Products=({x})=>{

    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [qty,setQty]=useState(1)
    const [discountprice,setDiscountPrice]=useState(0)
    const navigate=useNavigate()
    const cont=useContext(context)

    useEffect(()=>{
        let discount=x.Price-((x.Discount*x.Price)/100)
        setDiscountPrice(discount)
    },[])
    const addtocart=(y)=>{
        const data={
            email:cont.useremail,
            productid:y._id,
            productname:y.Name,
            image:y.Image,
            price:discountprice,
            category:y.Category,
            qty:qty,
        }
        axios.post("/user/cart/addtocart",data).then((res)=>{
            if(res.data.status){
                toast.success("Item Added to Cart Successfully !")
                setQty(1)
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }
    
    const view=(y)=>{
        const data={
            Name:y.Name,
            _id:y._id,
            Available_Qty:y.Available_Qty,
            Price:discountprice,
            Image:y.Image,
            Category:y.Category,
            Discount:y.Discount,
            Description:y.Description
        }
        cont.setViewDetails([...cont.viewdetails,data])
        navigate("/view")
    }

    const book=(y)=>{
        const data={
            ProductName:y.Name,
            ProductId:y._id,
            Qty:qty,
            Price:discountprice,
            Image:y.Image,
            Category:y.Category
        }
        cont.setViewDetails([...cont.viewdetails,data])
        navigate("/book")
    }

    return(
            (x.Available_Qty==0)?"":
            <div className="col-md-4" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px"}}>
                <div className="card" style={{width:"300px"}}>
                {x.Discount!=0?<div  style={{float:"right"}} className="btn btn-success">Available at {x.Discount} % OFFER</div>:<div className="btn btn-success">No Offers Available</div>}
                <img src={x.Image} height="280"  class="card-img-top" alt="Products"/>
                <hr></hr>
                <div className="card-body text-center">
                    <h5 className="card-title">{x.Name}</h5>
                    {x.Discount!=0?
                    <div>
                        <s className="card-title">₹ {x.Price}</s>
                        <h5 className='card-title'>₹ {discountprice}</h5>
                    </div>
                    :<div>
                        <br></br>
                        <h5 className='card-title'>₹ {x.Price}</h5>
                    </div>}
                    <button className="btn btn-danger" onClick={()=>view(x)}>View Product</button>
                    <br></br>
                    <br></br>
                    <input type="number" id={x._id} onChange={(e)=>setQty(e.target.value)} value={qty} placeholder="Qty:" className="form-control inputfield"/>
                    <br></br>
                    <button className="btn btn-primary" onClick={()=>{book(x)}}>Buy Now</button>
                    <button className="btn btn-success" onClick={()=>{addtocart(x)}} style={{position:"relative",left:"3px"}}>Add to Cart</button>
                </div>
                </div>
            </div>
    )
}