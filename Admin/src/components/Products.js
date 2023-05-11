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
import { NavigationBar } from './Navbar';
import { UnAuthorized } from './UnAuthorized';

export const Product=()=>{
    const [loading,setLoading]=useState(true)
    
    const [products,setProducts]=useState([])
    const [editflag,setEditFlag]=useState(false)
    const [changeqty,setChangeQty]=useState(0)
    const [changeproduct,setChangeProduct]=useState("")
    const [productid,setProductId]=useState("")
    const navigate=useNavigate()

    useEffect(()=>{
        if(!localStorage.getItem("shopeasy_token")){
            setLoading(false)
            setTimeout(()=>{
                navigate("/login")
            },3000)
        }
        else{
            getproducts()
        }
    },[])

    const getproducts=()=>{
        axios.get("/admin/product/getallproducts").then((res)=>{
            setProducts(res.data.msg)
            setLoading(false)
        })
    }

    const save=()=>{
        const datas={
            qty:changeqty,
            id:productid
        }
        axios.put("/admin/product/editproduct",datas).then((res)=>{
            if(res.data.status){
                toast.success("Quantity Updated Successfully")
                setEditFlag(false)
                getproducts()
            }
            else{
                toast.error("Failed to update Quantity !")
            }
        })
    }

    const deleteprod=()=>{
        axios.delete(`/admin/product/deleteproduct/${productid}`).then((res)=>{
            if(res.data.status){
                toast.success("Product Deleted Successfully")
                setEditFlag(false)
                getproducts()
            }
            else{
                toast.error("Failed to delete the Product !")
            }
        })
    }

    return(
        <div className='container-fluid'>
            {loading?
            <Loading/>:
            <div>
                <NavigationBar/>
                {localStorage.getItem("shopeasy_token")?<div>
                <br></br>
                <br></br>
                <h1 className="title" style={{textAlign:"center"}}>Products</h1>
                <br></br>
                <div className='container-fluid'>
                    {editflag?
                    <div className="row">
                        <h3 style={{textAlign:"center"}}>Edit Quantity</h3>
                        <div className='col-md-4'>
                            <h5>{changeproduct}</h5>
                        </div>
                        <div className='col-md-4'>
                            <input type="number" placeholder="Enter quantity" value={changeqty} onChange={(e)=>setChangeQty(e.target.value)} className="form-control"></input>
                        </div>
                        <div className='col-md-4'>
                            <button className="btn btn-success" onClick={save}>Save</button>
                            <button className="btn btn-secondary" style={{position:"relative",left:"4px"}} onClick={deleteprod}>Delete</button>
                        </div>
                    </div>:""}
                    <br></br>
                    <div className="row">
                        <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Available Quantity</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {products.map((x)=>
                                <tr>
                                    <td>{x.Name}</td>
                                    <td><img src={x.Image} width="40" height="40"/></td>
                                    <td>{x.Available_Qty}</td>
                                    <td>₹ {x.Price}</td>
                                    <td>{x.Category}</td>
                                    <td><button className='btn btn-primary' onClick={()=>{setEditFlag(true);setChangeQty(x.Available_Qty);setChangeProduct(x.Name);setProductId(x._id);window.scrollTo({top:0,behaviour:'Smooth'})}}>Edit</button></td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                    <div className='container-fluid'>
                        
                    </div>
                </div>
                </div>:<UnAuthorized/>}
            </div>
            }
            <ToastContainer/>
        </div>
    )
}