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

export const Shopping=()=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [qty,setQty]=useState(0)
    const navigate=useNavigate()
    const cont=useContext(context)

    useEffect(()=>{
        cont.setViewDetails([])
        axios.get("/admin/product/getallproducts").then((res)=>{
            if(res.data.status){
                setProducts(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
            setLoading(false)
        })
    },[])
    console.log(cont.useremail)
    const addtocart=(x)=>{
        const datas={
            email:cont.useremail,
            productid:x._id,
            productname:x.Name,
            image:x.Image,
            price:x.Price,
            category:x.Category,
            qty:qty,
        }
        axios.post("/user/cart/addtocart",datas).then((res)=>{
            if(res.data.status){
                toast.success("Item Added to Cart Successfully !")
                setQty(0)
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }
    
    const view=(x)=>{
        cont.setViewDetails([...cont.viewdetails,x])
        navigate("/view")
    }

    const book=(x)=>{
        const datas={
            ProductName:x.Name,
            ProductId:x._id,
            Qty:qty,
            Price:x.Price,
            Image:x.Image,
            Category:x.Category
        }
        cont.setViewDetails([...cont.viewdetails,datas])
        navigate("/book")
    }

    console.log(products)
    console.log(qty)
    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <br></br>
                    <br></br>
                    <h1 className='title'>Shop Easy</h1>
                    <br></br>
                    <div className="row">
                        {products.map((x)=>
                            <div className="col-md-3">
                                <div className="card" style={{width:"300px"}}>
                                {x.Discount!=0?<button className="btn btn-success">Available at {x.Discount} % OFFER</button>:<button className="btn btn-success">No Offers Available</button>}
                                <img src={x.Image} height="300" class="card-img-top" alt="Products"/>
                                <hr></hr>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{x.Name}</h5>
                                    <h5 className="card-title">₹ {x.Price}</h5>
                                    <p className="card-text">Available Qty: {x.Available_Qty}</p>
                                    <button className="btn btn-danger" onClick={()=>view(x)}>View Product</button>
                                    <br></br>
                                    <br></br>
                                    <input type="number" id={x._id} onChange={(e)=>setQty(e.target.value)} placeholder="Qty:" className="form-control inputfield"/>
                                    <br></br>
                                    <button className="btn btn-primary" onClick={()=>{book(x)}}>Buy Now</button>
                                    <button className="btn btn-success" onClick={()=>{addtocart(x)}} style={{position:"relative",left:"3px"}}>Add to Cart</button>
                                </div>
                                </div>
                            </div>
                            
                        )}
                    </div>
                </div>
            }
            <ToastContainer/>
        </div>
    )
}