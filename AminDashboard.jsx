import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
import './admin.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const getAllUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "users"));
    const listUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(listUsers);
    setLoading(false);
  };

  const deleteUser = async (uid) => {
    await deleteDoc(doc(db, "userProfiles", uid));
    getAllUsers();
  };

  const viewProfile = (uid) => {
    navigate(`/UserData/${uid}`);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className='admin-profile text-center my-6'>
        <p></p><br/>
        <h1 className="admin_profile text-3xl font-bold mb-4">Admin Dashboard</h1>
        <img src="/image/aminpic1.jpg" alt="Admin Avatar" className="admin-avtar mx-auto w-32 rounded-full shadow-md" />
      </div>

      <div className="p-6 bg-white min-h-screen admin-container">
        <fieldset>
          {loading ? (
            <p className="text-center text-lg">Loading users...</p>
          ) : (
            <table className="admin-table w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 text-center">{user.email}</td>
                    <td className="p-2 text-center">{user.role || "user"}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => viewProfile(user.id)}
                      >
                        Show Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>
      </div>
    </>
  );
}

export default AdminDashboard;
