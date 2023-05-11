import React from 'react'
import { BarLoader } from 'react-spinners';

export const UnAuthorized=()=>{
    return(
        <div>
                <br></br>
                <br></br>
                <br></br>
                <center>
                        <h2 className='no_pics'>Please Login to Proceed !</h2>
                        <br></br>
                        <h2 className='no_pics'>Redirecting to Login Page !</h2>
                        <br></br>
                        <br></br>
                        <div className="bar_loading">
                            <BarLoader
                            size={100}
                            color="green"
                            />
                        </div>
                </center>
        </div>
    )
}