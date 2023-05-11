import React,{useState,useEffect,useContext} from 'react'
import '../bootstrap.min.css'
import axios from "../axios/Axios";
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from 'react-router-dom'
import { context } from './Context';
import {Loading} from './Loading'
import { NavigationBar } from './Navbar';

export const Login=()=>{

    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const navigate=useNavigate()
    const[loading,setLoading]=useState(true)
    const cont=useContext(context)

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        },1000)
    },[])
    const login=(e)=>{
        const datas={
            email:email,
            password:password
        }
        setLoading(true)
        axios.post("/admin/auth/login",datas).then((res)=>{
            if(res.data.status){
                const token=res.data.token
                localStorage.setItem("shopeasy_token",token)
                cont.setAdminName(res.data.name)
                cont.setAdminEmail(res.data.email)
                setLoading(false)
                toast.success("Signed in successfuly !")
                navigate("/")
            }
            else{
                setLoading(false)
                setTimeout(()=>{
                    toast.error(res.data.msg)
                },1000)     
                
            }
        })
        e.preventDefault()
    }
    return(
        
        <div className='container-fluid'>
            {loading?
                <Loading/>
            :<div>
            <NavigationBar/>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4"> 
                        <div>  
                            <div className='login'>
                                <h1 className='title' style={{textAlign:"center"}}>Admin Login</h1>
                                <br></br>
                            </div>
                            <form onSubmit={login}>
                                <div className="form-group">
                                    <label>Email :</label>
                                    <input type="email" placeholder="Enter your registered email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className="form-group">
                                    <label>Password :</label>
                                    <input type="password" placeholder="Enter your registered Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" required></input>
                                </div>
                                <br></br>
                                <div className="login_button">
                                    <button className="btn btn-primary" type="submit">Login</button>
                                </div>
                                <br></br>
                            </form>
                        </div>
                </div>
                <div className="col-md-4"> </div>
            </div>
            <ToastContainer/>
            </div>}
            </div>
    )
}