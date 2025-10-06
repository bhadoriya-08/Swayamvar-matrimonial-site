import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import './liked.css';

function LikedProfiles() {
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const likedIds = userDocSnap.data().likedProfiles || [];

            const likedProfiles = await Promise.all(
              likedIds.map(async (id) => {
                const profileDoc = await getDoc(doc(db, "users", id));
                return profileDoc.exists() ? { id: profileDoc.id, ...profileDoc.data() } : null;
              })
            );

            setLikedUsers(likedProfiles.filter(user => user !== null));
          }
        }
      } catch (error) {
        console.error("Error fetching liked profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProfiles();
  }, []);

  const startChatWith = async (otherUserId) => {
    const user = auth.currentUser;
    if (!user) return;

    const chatId = [user.uid, otherUserId].sort().join("_");

    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [user.uid, otherUserId],
        messages: [],
        lastUpdated: new Date()
      });
    }

    navigate(`/chat/${chatId}`);
  };

  const handleViewProfile = (userId) => {
    navigate(`/UserData/${userId}`);
  };

  if (loading) return <p className="loading">Loading liked profiles...</p>;
  if (likedUsers.length === 0) return <p className="no-matches">You haven't liked anyone yet.</p>;

  return (
    <div className="liked-profiles-container">
      <h2 className="liked-heading">Your Liked Profiles</h2>

      <div className="liked-profiles-list">
        {likedUsers.map((user) => (
          <div key={user.id} className="liked-profile-card">
            <img
              src={`/image/${user.gender?.toLowerCase() === 'male' ? 'userpic_male1.webp' : 'userpic_fem1.jpeg'}`}
              alt="profile_pic"
              className="user-avatar"
            />
            <h3 className="liked-name">{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Religion:</strong> {user.religion}</p>
            <p><strong>Caste:</strong> {user.caste}</p>
            <p><strong>Income:</strong> {user.income}</p>

            <button className="view-profile-button" onClick={() => handleViewProfile(user.id)}>
              View Full Profile
            </button>
            <button onClick={() => startChatWith(user.id)} className="message-button">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikedProfiles;
