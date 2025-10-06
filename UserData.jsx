import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase';
import './user.css';

function UserData() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setCurrentUserUid(user.uid);
          const currentUserRef = doc(db, "users", user.uid);
          const currentUserSnap = await getDoc(currentUserRef);
          if (currentUserSnap.exists()) {
            const currentUserData = currentUserSnap.data();
            if (currentUserData.role === 'admin') {
              setIsAdmin(true);
            }
          }
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data());
            setEditedProfile(userSnap.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  const handleMatchClick = () => {
    navigate('/search');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>User not found.</p>;

  const profileImage = `/image/${profile.gender?.toLowerCase() === 'male' ? 'userpic_male1.webp' : 'userpic_fem1.jpeg'}`;

  return (
    <div className="user-container">
      <div className="user-header">
        <div className="user-avatar-container">
          <img
            src={profileImage}
            alt="Profile"
            className="user-avatar"
          />
          {currentUserUid === uid && !isEditing && (
            <button onClick={handleEditClick} className="edit-icon-button">✏️</button>
          )}
        </div>
        {currentUserUid === uid && (
          <h2>Welcome, {profile.name ? profile.name : "User"}!</h2>
        )}
      </div>

      <fieldset className="user-fieldset">
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              className="user-input"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              className="user-input"
              placeholder="Email"
            />
            <input
              type="number"
              name="age"
              value={editedProfile.age}
              onChange={handleChange}
              className="user-input"
              placeholder="Age"
            />
            <input
              type="text"
              name="gender"
              value={editedProfile.gender}
              onChange={handleChange}
              className="user-input"
              placeholder="Gender"
            />
            <input
              type="text"
              name="religion"
              value={editedProfile.religion}
              onChange={handleChange}
              className="user-input"
              placeholder="Religion"
            />
            <input
              type="text"
              name="caste"
              value={editedProfile.caste}
              onChange={handleChange}
              className="user-input"
              placeholder="Caste"
            />
            <input
              type="text"
              name="occupation"
              value={editedProfile.occupation}
              onChange={handleChange}
              className="user-input"
              placeholder="Occupation"
            />
            <input
              type="text"
              name="income"
              value={editedProfile.income}
              onChange={handleChange}
              className="user-input"
              placeholder="Income"
            />
            <textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
              className="user-textarea"
              placeholder="Bio"
            />
            <button onClick={handleSaveClick} className="save-button">Save</button>
          </>
        ) : (
          <>
            <p className="user-field"><span className="user-label">Sequential ID:</span> {uid}</p>
            <p className="user-field"><span className="user-label">Name:</span> {profile.name}</p>
            <p className="user-field"><span className="user-label">Email:</span> {profile.email}</p>
            <p className="user-field"><span className="user-label">Age:</span> {profile.age}</p>
            <p className="user-field"><span className="user-label">Gender:</span> {profile.gender}</p>
            <p className="user-field"><span className="user-label">Religion:</span> {profile.religion}</p>
            <p className="user-field"><span className="user-label">Caste:</span> {profile.caste}</p>
            <p className="user-field"><span className="user-label">Occupation:</span> {profile.occupation}</p>
            <p className="user-field"><span className="user-label">Income:</span> {profile.income}</p>
            <p className="user-field"><span className="user-label">Bio:</span> {profile.bio}</p>
          </>
        )}
      </fieldset>

      <div className="user-buttons">
      {currentUserUid === uid && (
        
          <button onClick={handleMatchClick} className="match-button">Match</button>
        )}
        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="back-button">
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default UserData;
