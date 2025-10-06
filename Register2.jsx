import React from 'react'
import { useState } from 'react';
import  './Register.css'

import { auth } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc,doc } from 'firebase/firestore';
import { db} from '../../Firebase';

function Register2() {
    const [formData,setFormData] =useState({
        Name:"",
        age:"",
        gender:"",
        religion:"",
        caste:"",
        occupation:"",
        bio:"",
        income:"",
        photo: "",
    })
    
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const nextPage = async (e) => {
        e.preventDefault();
        try {
          const user = auth.currentUser;
          if (!user) throw new Error("User not authenticated");
          
          

          await setDoc(doc(db, "users", user.uid), {
            name: formData.Name,
            age: formData.age,
            gender: formData.gender,
            religion: formData.religion,
            caste: formData.caste,
            occupation: formData.occupation,
            bio: formData.bio,
            income: formData.income,
            email: user.email,
            uid: user.uid,
            photo: formData.photo,
            role: "user",
           
          });
          console.log('User document created! Navigating now...');
    
          
          setTimeout(() => {
            navigate(`/UserData/${user.uid}`);
          }, 500); 
        } catch (err) {
          alert(err.message);
        }
      };
  return (
    <div>
       <div className="Register-Container">
    
    <form title='Register' onSubmit={nextPage}>
       <fieldset>
           <legend>Registeration</legend>
       

       <label className='name'> Name </label> 
       <input name='Name' type='text' value={formData.Name} onChange={handleChange} required/>
       <label className='age'> Age </label>
       <input  name='age' type='number' value={formData.age} onChange={handleChange}required/><br/>
       <label className='gender'> Gender </label>
       <select name='gender' id='gender'className='gender' value={formData.gender} onChange={handleChange}>
           <option value="">--your Gender--</option>
           <option value="Male">Male</option>
           <option value="Female">Female</option>
       </select>
       <label for='Religion'> Religion</label>
        <select name='religion' id="Religion" className="Religion"  value={formData.religion} onChange={handleChange}>
           <option value="">--your Religion--</option>
           <option value="Hindu">Hindu</option>
           <option value="Muslim">Muslim</option>
           <option value="Sikh">Sikh</option>
           <option value="Christian">Christian</option>
           <option value="Jain">Jain</option>
           <option value="Bhudhism">Bhudh</option>
           <option value="other" >other</option>
        </select>
                 


<label htmlFor="caste" className="block font-semibold mb-1">Caste</label>
      <select
        name="caste"
        value={formData.caste}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Caste</option>
          <option value="Brahmin">Brahmin</option>
          <option value="Kshatriya">Kshatriya (Rajput, Thakur)</option>
          <option value="Vaishya">Vaishya (Bania, Agarwal, Jain)</option>
          <option value="Kayastha">Kayastha</option>
          <option value="Chamar">Chamar</option>
          <option value="Balmiki">Balmiki</option>
          <option value="Dhanuk">Dhanuk</option>
          <option value="Paswan">Paswan (Dusadh)</option>
          <option value="Meghwal">Meghwal</option>
          <option value="Bhil">Bhil</option>
          <option value="Gond">Gond</option>
          <option value="Santhal">Santhal</option>
          <option value="Munda">Munda</option>
          <option value="Oraon">Oraon</option>
          <option value="Yadav">Yadav</option>
          <option value="Kurmi">Kurmi</option>
          <option value="Koeri">Koeri (Kushwaha)</option>
          <option value="Nai">Nai (Barber)</option>
          <option value="Teli">Teli</option>
          <option value="Kumhar">Kumhar</option>
          <option value="Lohar">Lohar</option>
          <option value="Syed">Syed</option>
          <option value="Sheikh">Sheikh</option>
          <option value="Pathan">Pathan</option>
          <option value="Ansari">Ansari (Julaha)</option>
          <option value="Qureshi">Qureshi</option>
          <option value="Momin">Momin</option>
          <option value="Malik">Malik</option>
          <option value="Roman Catholic">Roman Catholic</option>
          <option value="Protestant">Protestant</option>
          <option value="Syrian Christian">Syrian Christian</option>
          <option value="Pentecostal">Pentecostal</option>
          <option value="Jat Sikh">Jat Sikh</option>
          <option value="Ramgarhia">Ramgarhia</option>
          <option value="Mazhabi Sikh">Mazhabi Sikh</option>
          <option value="Khatri Sikh">Khatri Sikh</option>
          <option value="Other">Other</option>
      </select>
      {formData.caste === "Other" && (
  <div>
    <label htmlFor="otherCaste">Please specify:</label>
    <input
      type="text"
      name="otherCaste"
      value={formData.otherCaste || ""}
      onChange={(e) =>
        setFormData((prevData) => ({
          ...prevData,
          caste: e.target.value, 
        }))
      }
      placeholder="Enter your caste"
    />
  </div>
)}
      <label htmlFor='occ'>occupation:</label>
      <input name='occupation' id="occ" type="text" value={formData.occupation} onChange={handleChange}/>
      <input name='bio' type='text' placeholder='enter bio about yourself' value={formData.bio} onChange={handleChange}/>
      <label htmlFor='income'>income:</label>
      <input type='text' name="income" value={formData.income} onChange={handleChange} />  
      <br/>
       <button type='submit'>Next</button>
       </fieldset>
   </form>
   </div>
  </div>
  )
};

export default Register2
