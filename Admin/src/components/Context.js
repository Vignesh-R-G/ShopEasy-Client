import React from 'react'
import {useState} from 'react'

export const context=React.createContext()

export const Context=(props)=>{

    const [adminname,setAdminName]=useState("")
    const [adminemail,setAdminEmail]=useState("")
    const [verifylogin,setVerifyLogin]=useState(false)
    
    return(
        <div>
            <context.Provider value={{adminname,setAdminName,adminemail,setAdminEmail,verifylogin,setVerifyLogin}}>{props.children}</context.Provider>
        </div>
    )
}