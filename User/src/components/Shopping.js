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
import { NavigationBar } from './Navbar'
import { Products } from './Products';
import {Carouselimage} from './Carousel'

export const Shopping=()=>{
    const [loading,setLoading]=useState(true)
    const [products,setProducts]=useState([])
    const [qty,setQty]=useState(0)
    const [chosencategory,setChosenCategory]=useState("")
    const [filter,setFilter]=useState([])
    const [search,setSearch]=useState("")
    const navigate=useNavigate()
    const cont=useContext(context)

    useEffect(()=>{
        cont.setViewDetails([])
        axios.get("/admin/product/getallproducts").then((res)=>{
            if(res.data.status){
                setProducts(res.data.msg)
                setFilter(res.data.msg)
            }
            else{
                toast.error(res.data.msg)
            }
            setLoading(false)
        })
    },[])

    const modifycategory=(e)=>{
        console.log(e.target.value)
        setChosenCategory(e.target.value)
        if(e.target.value==="")
            filters(e.target.value,search)
    }

    const filters=(category,searchtext)=>{
        console.log(category)
        if(searchtext==="" && category===""){
            setFilter(products)
        }
        else{
            const lst=[]
            if(searchtext!=="" && category===""){
                products.map((x)=>{
                    console.log(x.Name)
                    if(x.Name.toLowerCase().includes(searchtext.toLowerCase())){
                        lst.push(x)
                    }
                })
            }
            else if(searchtext==="" && category!==""){
                products.map((x)=>{
                    console.log(x.Name)
                    if(x.Category===category){
                        lst.push(x)
                    }
                })
            }
            else{
                products.map((x)=>{
                    console.log(x.Name)
                    if(x.Category===category && x.Name.toLowerCase().includes(searchtext.toLowerCase())){
                        lst.push(x)
                    }
                }) 
            }
            setFilter(lst)
        }
    }

    const modifyinput=(e)=>{
        setSearch(e.target.value)
        if(e.target.value==="")
            filters(chosencategory,e.target.value)
    }

    return(
        <div className='container-fluid'>
            {loading?
                <Loading/>:
                <div>
                    <NavigationBar/>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className='row search'>
                        <div className='col-md-2'></div>
                        <div className='col-md-2'>
                            <select className="form-control" value={chosencategory} onChange={modifycategory}> 
                                <option value="">Choose Category</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Gadgets">Gadgets</option>
                                <option value="Television">Television</option>
                                <option value="Air Conditioners">Air Conditioners</option>
                            </select>
                        </div>
                        <div className='col-md-4'>
                        <input type="text" placeholder="Enter the product name to filter" className='form-control'  onChange={modifyinput}></input>
                        </div>
                        <div className='col-md-4'>
                            <button onClick={()=>filters(chosencategory,search)} className='btn btn-success'>Filter Products</button>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        {filter.map((y)=>
                            <Products x={y}/>
                        )}
                    </div>
                </div>
            }
            <ToastContainer/>
        </div>
    )
}