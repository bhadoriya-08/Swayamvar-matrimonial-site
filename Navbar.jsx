import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './../Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [lookingFor, setLookingFor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleSearch = () => {
  if (lookingFor) {
    navigate(`/search-results/${lookingFor}`);
  } else {
    alert('Please select a gender before searching!');
  }
};


  return (
    <div className="nav">
      <div className="logo-section">
        <img src="/image/logo.png" alt="logo" className="logo-image" />
        <span className="logo-text">SWAYAMVAR</span>
      </div>

      <div className="search-links-section">
        {!user && (
          <>
            <select
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="gender-dropdown"
            >
              <option value="">Looking for</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button onClick={handleSearch} className="search-button">Search</button>
          </>
        )}

        <Link to="/">Home</Link>

        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            <Link to="/liked" className="liked-button">Liked</Link>
            <Link to={`/UserData/${user.uid}`} className="user-profile">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
