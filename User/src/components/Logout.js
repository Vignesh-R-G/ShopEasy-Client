import React,{useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { context } from "./Context";
export const Logout=()=>{
    const det=useContext(context)
    const navigate=useNavigate()
    useEffect(()=>{
        localStorage.removeItem("shopeasyuser_token")
        det.setUserName("")
        det.setUserEmail("")
        navigate("/")
    },[])
}