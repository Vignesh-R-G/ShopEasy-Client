import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import { context } from './Context';
import {Loading} from './Loading'
import Table from 'react-bootstrap/Table'
import '../css/Product.css'
import { NavigationBar } from './Navbar'
import { UnAuthorized } from './UnAuthorized';

export const AddProduct=()=>{
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const [name,setName]=useState("")
    const [price,setPrice]=useState(0)
    const [qty,setQty]=useState(0)
    const [image,setImage]=useState("")
    const [category,setCategory]=useState("")
    const [description,setDescription]=useState("")
    const [discount,setDiscount]=useState(0)

    useEffect(()=>{
        if(!localStorage.getItem("shopeasy_token")){
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
    },[])

    const addproduct=(e)=>{
        e.preventDefault()
        const datas={
            name:name,
            price:price,
            qty:qty,
            image:image,
            category:category,
            description:description,
            discount:discount
        }
        axios.post("/admin/product/addproduct",datas).then((res)=>{
            if(res.data.status){
                toast.success("Product Added Successfully !")
            }
            else{
                toast.error("Failed to Add the Product !")
            }
        })
    }

    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>
            :<div>
            <NavigationBar/>
            {localStorage.getItem("shopeasy_token")?<div>
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
                    <br></br>
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <h1 className="title" style={{textAlign:"center"}}>Add Product</h1>
                        <form onSubmit={addproduct}>
                            <div className='form-group'>
                                <label>Product Name :</label>
                                <input type="text"className='form-control' value={name} onChange={(e)=>setName(e.target.value)} required></input>
                            </div>
                            <div className='form-group'>
                                <label>Image URL :</label>
                                <input type="text"className='form-control' value={image} onChange={(e)=>setImage(e.target.value)} required></input>
                            </div>
                            <div className='form-group'>
                                <label>Price :</label>
                                <input type="number"className='form-control' value={price} onChange={(e)=>setPrice(e.target.value)} required></input>
                            </div>
                            <div className='form-group'>
                                <label>Available Quantity :</label>
                                <input type="number"className='form-control'value={qty} onChange={(e)=>setQty(e.target.value)} required></input>
                            </div>
                            <div className='form-group'>
                                <label>Description :</label>
                                <input type="text"className='form-control' value={description} onChange={(e)=>setDescription(e.target.value)} required></input>
                            </div>
                            <div className='form-group'>
                                <label>Category :</label>
                                <select className='form-control' value={category} onChange={(e)=>setCategory(e.target.value)} required>
                                    <option>Choose Category:</option>
                                    <option>Mobiles</option>
                                    <option>Laptops</option>
                                    <option>Gadgets</option>
                                    <option>Television</option>
                                    <option>Air Conditioners</option>
                                </select>
                                <label>Discount :</label>
                                <input type="number" placeholder="Enter If Available" value={discount} className='form-control' onChange={(e)=>setDiscount(e.target.value)}/>
                            </div>
                            <br></br>
                            <button className='btn btn-success' type="submit">Add Product</button>
                            <br></br>
                        </form>
                    </div>
                </div>
                </div>:<UnAuthorized/>}
            </div>}
            <ToastContainer/>
        </div>
    )
}