import { useEffect, useState } from 'react';
import style from '../css/components/ChatCard.module.css';
import propic from '../propic.png';
import { Link } from 'react-router-dom';
function ChatCard({ chatId, userId, profile_picture, username, onSelect, onlineStatus }) {
    const user1ID = parseInt(chatId.split('-')[0], 10);
    const user2ID = parseInt(chatId.split('-')[1], 10);
    const [lastChat, setLastChat] = useState(null); 

    useEffect(() => {
        const fetchLastMessage = async () => {
            try {
                const response = await fetch('/chat/fetchLastChat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user1Id: user1ID,
                        user2Id: user2ID
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setLastChat(data.LastChat);
                } else {
                    console.error('Failed to fetch last message');
                }
            } catch (error) {
                console.error('Error fetching last message:', error);
            }
        };
        fetchLastMessage();
    }, [chatId, user1ID, user2ID]);

    return (
        <Link to={`/startMessaging/chat/${username}/${userId}/${chatId}/${onlineStatus}`} className={style.chatCardlink}>
            <div className={style.chatCard} onClick={onSelect}>
                <img
                    src={profile_picture ? `http://localhost:3001/public/${profile_picture}` : propic}
                    alt="Profile"
                />
                <div className={style.chatCard__info}>
                    <h3>
                        <span>{username}</span>
                        <span className={style.timestamp}>
                            {lastChat?.createdAt ? new Date(lastChat.createdAt).toLocaleTimeString() : ''}
                        </span>
                    </h3>
                    <p className={style.lastMessage}>
                        {lastChat?.content || "No messages yet"}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default ChatCard;
