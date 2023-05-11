import React from 'react'
import BarLoader from 'react-spinners/SyncLoader'
import '../css/Loading.css'
export const Loading=()=>{
    return(
        <div className='loading'>
            <BarLoader color="#0077FE"/>
        </div>
    )
}