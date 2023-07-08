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

export const Viewproduct=({x,getproducts})=>{
    
    const [editflag,setEditFlag]=useState(false)
    const [changeqty,setChangeQty]=useState(x.Available_Qty)
    const [changeproduct,setChangeProduct]=useState("")
    const [productid,setProductId]=useState(x._id)
    const [price,setPrice]=useState(x.Price)
    const [image,setImage]=useState(x.Image)
    const [category,setCategory]=useState(x.Category)
    const [discount,setDiscount]=useState(x.Discount)
    const [name,setName]=useState(x.Name)
    const navigate=useNavigate()

    const save=()=>{
        const data={
            qty:changeqty,
            name:name,
            price:price,
            image:image,
            category:category,
            discount:discount,
            id:productid
        }
        axios.put("/admin/product/editproduct",data).then((res)=>{
            if(res.data.status){
                toast.success("Details Updated Successfully")
                setEditFlag(false)
                getproducts()
            }
            else{
                toast.error("Failed to update the product !")
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
            <tr>
                <td>
                    {!editflag?
                        x.Name:
                        <input type="text" placeholder="Enter Name"  value={name} onChange={(e)=>setName(e.target.value)} className="form-control"></input>
        
                    }
                </td>
                <td>
                    {!editflag?
                        <img src={x.Image} width="40" height="40"/>:
                        <input type="url" placeholder="Enter Image"  value={image} onChange={(e)=>setImage(e.target.value)} className="form-control"></input>
                        
                    }
                </td>
                <td>
                    {!editflag?
                    x.Available_Qty:
                    <input type="number" placeholder="Enter Quantity"  value={changeqty} onChange={(e)=>setChangeQty(e.target.value)} className="form-control"></input>
                    }
                </td>
                <td>
                {!editflag?
                    <p>₹ {x.Price}</p>:
                    <input type="number" placeholder="Enter Price"  value={price} onChange={(e)=>setPrice(e.target.value)} className="form-control"></input>
                    }
                </td>
                <td>
                {!editflag?
                    <p>{x.Discount} %</p>:
                    <input type="number" placeholder="Enter Discount"  value={discount} onChange={(e)=>setDiscount(e.target.value)} className="form-control"></input>
                    }
                </td>
                <td>{!editflag?
                    x.Category:
                    <input type="text" placeholder="Enter Category"  value={category} onChange={(e)=>setCategory(e.target.value)} className="form-control"></input>
                    }</td>
                <td>
                    {editflag?
                    <div>
                    <button className='btn btn-secondary' onClick={()=>save()}>Save</button>
                    <button className='btn btn-success' style={{position:"relative",left:"3px"}} onClick={()=>deleteprod()}>Delete</button>
                    </div>:
                    <button className='btn btn-primary' onClick={()=>{setEditFlag(true)}}>Edit</button>}
                </td>
            </tr>
                
    )
}