/*import React, { useEffect, useState } from 'react';
import { db, auth } from '../../Firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './notification.css';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // FIRST: Listen to authentication changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // user is ready
      } else {
        setUser(null); // not logged in
        setNotifications([]); // clear notifications
      }
    });

    return () => unsubscribeAuth(); // clean up
  }, []);

  useEffect(() => {
    if (!user) return; // only run if user is available

    // THEN: Now set up Firestore listener
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('toUserId', '==', user.uid),
      where('read', '==', false),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setNotifications(notifList);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribeSnapshot(); // clean up
  }, [user]);

  if (!user) {
    return <div>Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return <div>No new notifications</div>;
  }

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className="notification">
          📩 New message from chat {notif.chatId}
        </div>
      ))}
    </div>
  );
}

export default Notification;*/
