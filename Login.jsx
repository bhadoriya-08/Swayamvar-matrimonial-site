import { useState } from 'react';
import './Login.css';
import Register from './Registration/Register';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { getDoc, doc } from 'firebase/firestore';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const [emailID, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const checkUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailID, password);
      const user = userCredential.user;

  
      const userDetails = doc(db, 'users', user.uid);
      const CurUser = await getDoc(userDetails);

      if (CurUser.exists()) {
        const userData = CurUser.data();
        if (userData.role === 'admin') {
          navigate('/Admin'); 
        } else {
          navigate(`/UserData/${user.uid}`); 
        }
        alert('Login successful!');
      } else {
        alert('No user profile found.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="log-form">
        <div className="Toggle-Button">
          <button onClick={handleToggle}>
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>

        {isLogin ? (
          <div className="login-Form">
            <form onSubmit={checkUser} className="login">
              <fieldset>
                <legend>Login</legend>

                <label className="">Email</label>
                <input
                  className="UserID"
                  type="email"
                  value={emailID}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />

                <label className="pwd">Password</label>
                <input
                  className="pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                <button type="submit">LOGIN</button>
              </fieldset>
            </form>
          </div>
        ) : (
          <Register />
        )}
      </div>
    </>
  );
};

export default Login;
