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
    const [addressinfo,setAddressInfo]=useState("")
    const [citylst,setCityLst]=useState([])
    const [pincodeflag,setPincodeFlag]=useState(false)
    
    const viewproduct=cont.viewdetails

    useEffect(()=>{
        gettotalprice()
        getcities()
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
        setLoading(false)
    }

    console.log(citylst)
    
    const payment=()=>{
        var options={
            key:"rzp_test_NbsiaD51zVYHcz",
            key_secret:"pIGyzXeMV5SV8zh5wjFtPdAv",
            amount:totalprice*100,
            currency:"INR",
            name:"Shop Easy",
            description:"For ordering the products",
            handler:function(response){
                console.log(response.razorpay_payment_id)
                editqty(response.razorpay_payment_id)
            },
            prefill:{
                name:cont.username,
                email:cont.useremail
            },
            theme:{
                color:"blue"
            }
        }
        var pay=new window.Razorpay(options)
        pay.open()
    }

    const addPaymentDetails=(orderid,paymentid)=>{
        const data={
            paymentid:paymentid,
            orderid:orderid,
            amount:totalprice
        }
        axios.post('/admin/payment/addpaymentdetail',data).then((res)=>{
            if(res.data.status)
                toast.success('Order Placed Successfully')
            else    
                toast.error('Error occured in adding the payment details')
        })
    }

    const deliver=(orderid,paymentid)=>{
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
                addPaymentDetails(orderid,paymentid)
            else
                toast.error('Internal Server Error !Try after some time')
        })
    }

    const placeorder=(paymentid)=>{
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
                deliver(res.data.msg,paymentid)
            else
                toast.error(res.data.msg)
        })
    }

    const editqty=(paymentid)=>{
        let flag=true
        viewproduct.map((x)=>{
            const data={
                id:x.ProductId,
                ordered_qty:x.Qty
            }
            axios.put("/admin/product/autoedit",data).then((res)=>{
                if(res.data.status){
                    flag=false
                }
                else
                    toast.error(res.data.msg)
            })
        })
        if(flag)
            placeorder(paymentid)
    }

    const checkqty=(e)=>{
        e.preventDefault()
        let checkflag=true
        viewproduct.map((x)=>{
            const data={
                id:x.ProductId,
                ordered_qty:x.Qty
            }
            axios.post("/user/order/checkqty",data).then((res)=>{
                if(!res.data.msg)
                    checkflag=false
            })
        })
        if(checkflag)
            payment()
        else
            toast.warning('Please reduce teh quantity ! Order Failed')
    }

    const gettotalprice=()=>{
        let total=0
        viewproduct.map((x)=>{
            total+=(x.Price)*(x.Qty)
        })
        setTotalPrice(total)
    }

    console.log(viewproduct)

    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <div>
                    <br></br>
                    <br></br>
                    <div className='search'>
                        <h3 className='title'>Order Details</h3>
                    </div>
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
                        <br></br>
                        <br></br>
                        </div>
                        <div className='orders'>
                        <h3 className='title' style={{color:"green"}}>Delivery Details</h3>
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
                                    <label>Choose City :</label>
                                    <select value={address} onChange={(e)=>{setAddress(e.target.value);if(e.target.value!==""){setPincodeFlag(true)}else{setPincodeFlag(false)}}} className="form-control" required>
                                        <option value="">Choose City</option>
                                        {citylst.map((x)=>
                                            <option value={x}>{x}</option>
                                        )}
                                    </select>

                                </div>
                                <br></br>
                                {pincodeflag?
                                <div className="form-group">
                                    <label>Pincode :</label>
                                    <select value={pincode} onChange={(e)=>setPincode(e.target.value)} className="form-control" required>
                                        <option value="">Choose Pincode</option>
                                        {addressinfo.map((x)=>
                                            (x.City===address)?
                                            <option value={x.Pincode}>{x.Pincode}</option>:""
                                        )}
                                    </select>
                                </div>:""}
                                <br></br>
                                <div>
                                    <center>
                                    <button type="submit" className="btn btn-primary">Pay ₹ {totalprice}</button>
                                    </center>
                                    <br></br>
                                </div> 
                                </form>
                            </div>
                        </div>
                        </div>
                </div>
                </div>
            }
        </div>
    )
}