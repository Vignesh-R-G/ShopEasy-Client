import React from 'react'
import {useState} from 'react'

export const context=React.createContext()

export const Context=(props)=>{

    const [username,setUserName]=useState("")
    const [useremail,setUserEmail]=useState("")
    const [verifylogin,setVerifyLogin]=useState(false)
    const [viewdetails,setViewDetails]=useState([])
    
    return(
        <div>
            <context.Provider value={{username,setUserName,useremail,setUserEmail,verifylogin,setVerifyLogin,viewdetails,setViewDetails}}>{props.children}</context.Provider>
        </div>
    )
}