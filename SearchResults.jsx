import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import './SearchResults.css';


function SearchResults() {
  const { gender } = useParams();
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsersByGender = async () => {
      if (!gender) {
        setError('No gender selected!');
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const genderQuery = query(usersRef, where('gender', '==', gender));

        const querySnapshot = await getDocs(genderQuery);

        if (querySnapshot.empty) {
          setMatchedUsers([]);
        } else {
          const usersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatchedUsers(usersList);
        }

      } catch (err) {
        console.error('Error fetching users by gender:', err);
        setError('Failed to fetch users!');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersByGender();
  }, [gender]);

  if (loading) {
    return <p className="loading">Loading profiles...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (matchedUsers.length === 0) {
    return <p className="no-matches">No profiles found for "{gender}" 😔</p>;
  }

  return (
    <div className="search-results-container">
      <h2 className="search-results-heading">Profiles looking for: {gender}</h2>

      <div className="results-list">
        {matchedUsers.map((user) => (
          <div key={user.id} className="profile-card">
            <img
              src={`/image/${user.gender?.toLowerCase() === 'male' ? 'userpic_male1.webp' : 'userpic_fem1.jpeg'}`}
              alt="profile_pic"
              className="user-avatar"
            />
            <h3 className="profile-name">{user.name}</h3>
            <p><strong>Age:</strong> {user.age || 'N/A'}</p>
            <p><strong>Location:</strong> {user.location || 'N/A'}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Religion:</strong> {user.religion || 'N/A'}</p>
            <p><strong>Caste:</strong> {user.caste || 'N/A'}</p>
            <p><strong>Income:</strong> {user.income || 'N/A'}</p>
            <p><strong>Interests:</strong> {user.interest?.join(', ') || 'N/A'}</p>
            <button
        className="like-login-button"
        onClick={() => window.location.href = '/login'}
      >
         Like
      </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
