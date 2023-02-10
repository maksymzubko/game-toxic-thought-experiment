import React from 'react';
import dogWarnImg from './assets/dog-warn.png'
import './style.css'

const LoginRequired = () => {
    return (
        <div className="login-required">
            <div className="modal">
                <img src={dogWarnImg} alt=""/>
                <h1>ooops!</h1>
                <p>please login to do that</p>
            </div>
        </div>
    );
};

export default LoginRequired;
