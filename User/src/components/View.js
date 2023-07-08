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
    const [review,setReview]=useState([])
    const [newreview,setNewReview]=useState("")
    const navigate=useNavigate()
    console.log(viewproduct)

    useEffect(()=>{
        setTimeout(()=>{
            getreview()
        },2000)
    },[])

    const getreview=()=>{
        axios.get(`/user/review/getreviews/${viewproduct[0]._id}`).then((res)=>{
            if(res.data.status){
                setReview(res.data.msg)
                setLoading(false)
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }

    const addReview=()=>{
        const data={
            productid:viewproduct[0]._id,
            username:cont.username,
            userreview:newreview,
            useremail:cont.useremail
        }
        if(newreview!==""){
            axios.post('/user/review/addreview',data).then((res)=>{
                if(res.data.status){
                    toast.success('Review Added Successfully !')
                    getreview()
                }
                else{
                    toast.error(res.data.msg)
                }
            })
            setNewReview("")
        }
    }

    const deleteReview=(reviewid)=>{
        axios.delete(`/user/review/deletereview/${reviewid}`).then((res)=>{
            if(res.data.status){
                toast.success(res.data.msg)
                getreview()
            }
            else{
                toast.error(res.data.msg)
            }
        })
    }

    const buy=(y)=>{
        const data={
            ProductName:y.Name,
            ProductId:y._id,
            Qty:1,
            Price:y.Price,
            Image:y.Image,
            Category:y.Category
        }
        const lst=[]
        lst.push(data)
        cont.setViewDetails(lst)
        navigate("/book")
    }

    return(
        <div className='container-fluid'>
        {loading?
            <Loading/>
            :<div>
                <NavigationBar/>
                <br></br>
                <br></br>
                {(viewproduct[0].Name==="" || viewproduct[0].Name===undefined)?
                <h3 className='title'>No Products Found</h3>:
                <div>
                <div className='search'>
                    <h3 className='title'>{viewproduct[0].Name}</h3>
                </div>
                <br></br>
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
                                <h3 style={{color:"green"}}>Product Details</h3>
                                <br></br>
                                <br></br>
                                
                                <h5>Product Name :          <span style={{color:"blue"}}>{viewproduct[0].Name}</span></h5>
                                <h5>Price :                 <span style={{color:"blue"}}>₹ {viewproduct[0].Price}</span></h5>
                                <h5>Product Category :      <span style={{color:"blue"}}>{viewproduct[0].Category}</span></h5>
                                <br></br>
                                <button className="btn btn-success" onClick={()=>buy(viewproduct[0])}>Buy Now</button>
                                
                            </div>
                        </div>
                        <br></br>
                        <div className='search'>
                            <h3 className='title'>Features</h3>
                        </div>
                        <br></br>
                        <p style={{fontSize:"18px"}}>{viewproduct[0].Description}</p>
                        <br></br>
                        <div className='search'>
                            <h3 className='title'>Reviews</h3>
                        </div>
                        <br></br>
                        <div className='row'>
                            <div className='col-md-4'></div>
                            <div className='col-md-4'>
                                <input type="text" className="form-control" placeholder="Type your review here" value={newreview} onChange={(e)=>setNewReview(e.target.value)}></input>
                            </div>
                            <div className='col-md-4'>
                                <button className='btn btn-success' onClick={()=>addReview()}>Add Review</button>
                            </div>
                        </div>
                        <div>
                            <br></br>
                            <br></br>
                            {review.length===0?<h3 style={{color:"green",textAlign:"center"}}>No Reviews Found !</h3>:<div>
                            {review.map((x)=><div>
                                <div className='views'>
                                    <h5 style={{color:"green"}}>{x.UserName}</h5>
                                    <p style={{color:"blueviolet"}}>Posted On : {x.Date}</p>
                                    <p>{x.Review}</p>
                                    {x.UserEmail===cont.useremail?
                                        <button className='btn btn-outline-success' onClick={()=>deleteReview(x._id)}>Delete</button>:""
                                    }
                                </div>
                                <br></br>
                            </div>)}
                            </div>}
                        </div>
                        <br></br>
                        <br></br>
                </div>
                </div>}
            </div>}
        </div>
    )
}