import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth, db } from '../../firebase/config';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback(async (msgs = []) => {
    if (!user) return;
    const { _id, text, createdAt } = msgs[0];
    await addDoc(collection(db, 'messages'), {
      _id,
      text,
      createdAt,
      user: {
        _id: user.uid,
        name: user.email,
      },
    });
  }, [user]);

  return (
    <GiftedChat
      messages={messages}
      onSend={msgs => onSend(msgs)}
      user={{
        _id: user ? user.uid : '',
        name: user ? user.email : '',
      }}
    />
  );
}
