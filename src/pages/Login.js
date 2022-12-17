/* eslint-disable */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
// 112
import { AuthContext } from '../helpers/AuthContext';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    let navigate = useNavigate();

    const login = () => {
        const data = {username: username, password: password};
        axios.post("http://localhost:3001/auth/login", data).then((response)=>{
            if(response.data.error){
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                // 126
                setAuthState({username: response.data.username, id: response.data.id, status: true});
                navigate('/');
            }
        })
    }
  return (
    <div className="loginPage">
        <img src={process.env.PUBLIC_URL+"/banner/login-banner.jpg"} alt="login page banner" />
        <div className="loginContainer">
            <div className="loginSection">
                {/* <img className="login-logo" src={process.env.PUBLIC_URL +"/logo/dongseo_logo.png"} /> */}
                <p className="login-welcome">Welcome Back</p>
                <label>Username: </label>
                <input type="text" onChange={(e)=>{
                    setUsername(e.target.value);
                }} placeholder=" ID를 입력하세요" />
                <label>Password: </label>
                <input type="password" placeholder=" PW를 입력하세요" onChange={(e)=>{
                    setPassword(e.target.value);
                }}/>
                <a className="login-btn" onClick={login}>Login</a>
            </div>
        </div>
    </div>
  )
}

export default Login;