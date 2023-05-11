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
import Table from 'react-bootstrap/Table'
import { NavigationBar } from './Navbar';

export const Booking=()=>{
    const [loading,setLoading]=useState(true)
    const cont=useContext(context)
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [mno,setMno]=useState("")
    const [address,setAddress]=useState("")
    const [pincode,setPincode]=useState("")
    const [totalprice,setTotalPrice]=useState(0)
    
    const viewproduct=cont.viewdetails

    useEffect(()=>{
        gettotalprice()
    },[])

    

    const deliver=(orderid)=>{
        const deliverydata={
            name:name,
            email:cont.useremail,
            mno:mno,
            address:address,
            pincode:pincode,
            orderid:orderid
        }
        axios.post("/user/delivery/deliverydetails",deliverydata).then((res)=>{
            if(res.data.status)
                toast.success('Order Placed Successfully')
            else
                toast.error('Internal Server Error !Try after some time')
        })
    }

    const placeorder=()=>{
        const lst=[]
        console.log(viewproduct)
        viewproduct.map((x)=>{
            const data={
                email:cont.useremail,
                productid:x.ProductId,
                productname:x.ProductName,
                qty:x.Qty,
                price:x.Price,
                image:x.Image,
                category:x.Category
            }
            lst.push(data)
        })
        console.log(lst)
        axios.post('/user/order/placeorder',lst).then((res)=>{
            if(res.data.status)
                deliver(res.data.msg)
            else    
                toast.error('Internal Server Error')
        })
    }

    const editqty=()=>{
        viewproduct.map((x)=>{
            const datas={
                id:x.ProductId,
                ordered_qty:x.Qty
            }
            axios.put("/admin/product/autoedit",datas).then((res)=>{
                if(res.data.status)
                    placeorder()
                else
                    toast.error(res.data.msg)
            })
        })
    }

    const checkqty=(e)=>{
        e.preventDefault()
        let checkflag=true
        viewproduct.map((x)=>{
            const datas={
                id:x.ProductId,
                ordered_qty:x.Qty
            }
            axios.post("/user/order/checkqty",datas).then((res)=>{
                if(!res.data.msg)
                    checkflag=false
            })
        })
        if(checkflag)
            editqty()
        else
            toast.error('Please reduce teh quantity ! Order Failed')
    }

    const gettotalprice=()=>{
        let total=0
        viewproduct.map((x)=>{
            total+=(x.Price)*(x.Qty)
        })
        setTotalPrice(total)
        setLoading(false)
    }

    console.log(viewproduct)

    return(
        <div className='container container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <br></br>
                    <br></br>
                    <h1 className='title'>Order</h1>
                    <br></br>
                    <div>
                            
                    <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                            {viewproduct.map((x)=>
                                <tr>
                                    <td>{x.ProductName}</td>
                                    <td><img src={x.Image} width="50" height="50"/></td>
                                    <td>{x.Qty}</td>
                                    <td>₹ {x.Price}</td>
                                    <td>{x.Category}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <br></br>
                        <Table responsive striped bordered hover>
                            <thead>
                                <th>Total Price :</th>
                                <th>₹ {totalprice}</th>
                            </thead>
                        </Table>
                            
                        </div>
                        <h1 className='title'>Delivery Details</h1>
                        <div className='row'>
                            <div className='col-md-2'></div>
                            <div className='col-md-8'>
                                <form onSubmit={checkqty}>
                                <div className="form-group">
                                    <label>Name :</label>
                                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className="form-group">
                                    <label>Mobile Number :</label>
                                    <input type="number" value={mno} onChange={(e)=>setMno(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className="form-group">
                                    <label>Address :</label>
                                    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className="form-group">
                                    <label>Pincode :</label>
                                    <input type="text" value={pincode} onChange={(e)=>setPincode(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div>
                                    <center>
                                    <button type="submit" className="btn btn-primary">Place Order</button>
                                    </center>
                                    <br></br>
                                </div> 
                                </form>
                            </div>
                        </div>
                </div>
            }
        </div>
    )
}