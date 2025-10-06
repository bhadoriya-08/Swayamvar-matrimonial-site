import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../Firebase';
import './Register.css'
import {  useNavigate  } from 'react-router-dom'
import { useState } from 'react'

const Register = () =>
{
    const [emailID, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
   const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        await createUserWithEmailAndPassword(auth, emailID, password);
        navigate("/Register2")
       alert('Register succesful!');
    }catch(err){
        alert(err);
    }
   }
return(
    <>
    <form onSubmit={handleSubmit}>
     <label htmlFor="EmailId">enter your EmailId:</label> 
     <input id="EmailId" type='email' value={emailID} onChange={(e)=> setEmail(  e.target.value)}required/>
     <label>Password:</label>
     <input id="password" type ='password' value={password} onChange={(e)=> setPassword(e.target.value)} required/>
     <button type='submit'>Register</button>
     </form>
    
    </>
);
};
export default Register;
