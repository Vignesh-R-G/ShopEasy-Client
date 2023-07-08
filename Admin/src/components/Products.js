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
import { Viewproduct } from './Viewproduct';

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

    return(
        <div className='container-fluid'>
            {loading?
            <Loading/>:
            <div>
                <NavigationBar/>
                {localStorage.getItem("shopeasy_token")?<div>
                <br></br>
                <br></br>
                <div className='title_top'>
                    <h1 className="title" style={{textAlign:"center"}}>Products</h1>
                </div>
                <br></br>
                <div className='container-fluid'>
                    <br></br>
                    <div className="row">
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Available Quantity</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Category</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((x)=>
                                    <Viewproduct x={x} getproducts={getproducts}/>
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