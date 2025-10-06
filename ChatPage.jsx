import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../Firebase';
import { doc, getDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import './chat.css';

function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sentMessageCount, setSentMessageCount] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        setMessages(chatData.messages || []);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const user = auth.currentUser;
    if (!user) return;

    if (sentMessageCount >= 5 && !paymentDone) {
      alert('You have reached the free message limit. Please pay to continue chatting.');
      return;
    }

    const chatRef = doc(db, 'chats', chatId);

    const message = {
      senderId: user.uid,
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    try {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        console.error('Chat does not exist!');
        return;
      }

      const chatData = chatSnap.data();
      const existingMessages = chatData.messages || [];

      await updateDoc(chatRef, {
        messages: [...existingMessages, message],
        lastUpdated: serverTimestamp(),
      });

      setNewMessage('');
      setSentMessageCount(prev => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePayment = () => {
    alert('Payment Successful! You can continue chatting.');
    setPaymentDone(true);
    setSentMessageCount(0);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
      </div>

      <div className="messages-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.senderId === auth.currentUser?.uid ? 'own' : 'other'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="send-box">
        {sentMessageCount >= 5 && !paymentDone ? (
          <div className="payment-section">
            <p>You have reached the free limit.</p>
            <p>Scan the QR code below to make payment:</p>
            <img
              src="/image/WhatsApp Image 2025-05-06 at 09.04.01_a5ea414a.jpg"
              alt="QR Code for Payment"
              className="qr-code-image"
            />
            <button onClick={handlePayment}>Payment Done</button>
          </div>
        ) : (
          <>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
