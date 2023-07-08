import React from 'react'
import {useState} from 'react'

export const context=React.createContext()

export const Context=(props)=>{

    const [adminname,setAdminName]=useState("")
    const [adminemail,setAdminEmail]=useState("")
    const [verifylogin,setVerifyLogin]=useState(false)
    const [viewdate,setViewDate]=useState("")
    
    return(
        <div>
            <context.Provider value={{adminname,setAdminName,adminemail,setAdminEmail,verifylogin,setVerifyLogin,viewdate,setViewDate}}>{props.children}</context.Provider>
        </div>
    )
}