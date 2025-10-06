import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase';
import './match.css';

function Matches() {
  const location = useLocation();
  const filters = location.state;

  const [matchedUsers, setMatchedUsers] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setCurrentUserId(user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setLikedProfiles(userData.likedProfiles || []);
          }
        }

        const usersRef = collection(db, "users");
        const allUsersSnapshot = await getDocs(query(usersRef));
        const allUsers = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const matched = allUsers.filter(user => {
          if (!user.gender || !user.religion) return false;

          if (filters.gender && user.gender.toLowerCase() !== filters.gender.toLowerCase()) {
            return false;
          }

          if (filters.religion && user.religion.toLowerCase() !== filters.religion.toLowerCase()) {
            return false;
          }

          let optionalMatch = false;

          if (filters.location && user.location && user.location.toLowerCase() === filters.location.toLowerCase()) {
            optionalMatch = true;
          }

          if (filters.min_age && parseInt(user.age) >= parseInt(filters.min_age)) {
            optionalMatch = true;
          }

          if (filters.max_age && parseInt(user.age) <= parseInt(filters.max_age)) {
            optionalMatch = true;
          }

          if (filters.caste && user.caste && user.caste.toLowerCase() === filters.caste.toLowerCase()) {
            optionalMatch = true;
          }

          if (filters.income && user.income && user.income.toString() === filters.income.toString()) {
            optionalMatch = true;
          }

          return optionalMatch;
        });

        setMatchedUsers(matched);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filters]);

  const handleLike = async (userId) => {
    if (!currentUserId) return;
  
    const userRef = doc(db, "users", currentUserId);
  
    try {
      if (likedProfiles.includes(userId)) {
        
        const updatedLikes = likedProfiles.filter(id => id !== userId);
  
        await updateDoc(userRef, {
          likedProfiles: updatedLikes,
        });
  
        setLikedProfiles(updatedLikes);
      } else {
        
        const updatedLikes = [...likedProfiles, userId];
  
        await updateDoc(userRef, {
          likedProfiles: updatedLikes,
        });
  
        setLikedProfiles(updatedLikes);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  if (loading) return <p className="loading">Loading matches...</p>;
  if (matchedUsers.length === 0) return <p className="no-matches">No matches found 😔</p>;

  const rows = [];
  for (let i = 0; i < matchedUsers.length; i += 3) {
    rows.push(matchedUsers.slice(i, i + 3));
  }

  return (
    <div className="matches-container">
      <h2 className="matches-heading">Matches</h2>

      <div className="matches-list">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="match-row">
            {row.map((user) => (
              <div key={user.id} className="profile-card">
                <h3 className="profile-name">{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Location:</strong> {user.location}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Religion:</strong> {user.religion}</p>
                <p><strong>Caste:</strong> {user.caste}</p>
                <p><strong>Income:</strong> {user.income}</p>
                <p><strong>Interests:</strong> {user.interest?.join(", ") || "Not specified"}</p>

                <button
                   className={`like-button ${likedProfiles.includes(user.id) ? 'liked' : ''}`}
                   onClick={() => handleLike(user.id)}>
                   {likedProfiles.includes(user.id) ? ' 💔 ' : ' 🤍 '}
                </button>
                

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
