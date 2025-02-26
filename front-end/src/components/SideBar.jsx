import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import style from '../css/components/SideBar.module.css';
import ChatCard from './ChatCard';
import SearchBar from './SearchBar';

function SideBar({ onChatSelect }) {
    const [chats, setChats] = useState([]);
    const currentUserId = parseInt(sessionStorage.getItem('auth_id'), 10);
    const [chatIds, setChatIds] = useState({});
    const [user_status, setUserStatuses] = useState({});

    const getChatId = (user1Id, user2Id) => {
        return user1Id < user2Id ? `${user1Id}-${user2Id}` : `${user2Id}-${user1Id}`;
    };

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.emit("user_connected", currentUserId);

        socket.on("user_status", (data) => {
            const { userId, status } = data;
            setUserStatuses(prev => ({
                ...prev,
                [userId]: status
            }));
        });

    
        socket.emit('user_status_change', {
            userId: currentUserId,
            status: 'online'
        });

        const handleBeforeUnload = () => {
            // Emit offline status before disconnecting
            socket.emit('user_status_change', {
                userId: currentUserId,
                status: 'offline'
            });
            socket.disconnect();
        };

        // Handle component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            socket.emit('user_status_change', {
                userId: currentUserId,
                status: 'offline'
            });
            socket.disconnect();
        };
    }, [currentUserId]);

    useEffect(() => {
        fetch('/chat/show')
            .then(response => response.json())
            .then(data => {
                setChats(data);
                console.log('Fetched chats:', data);

                const newChatIds = {};
                data.forEach(chat => {
                    const chatId = getChatId(currentUserId, chat.user_id);
                    newChatIds[chat.user_id] = chatId;
                });
                setChatIds(prevChatIds => ({ ...prevChatIds, ...newChatIds }));
            })
            .catch(error => console.error('Error fetching chats:', error));
    }, [currentUserId]);

    return (
        <div className={style.sidebar}>
            <SearchBar />
            {chats.map(chat => (
                <ChatCard
                    key={chat.user_id}
                    userId={chat.user_id}
                    profile_picture={chat.user_id === currentUserId ? 'profile_pics/saved.png' : chat.profile_picture}
                    username={chat.user_id === currentUserId ? "saved messages" : chat.username}
                    chatId={chatIds[chat.user_id]}
                    onSelect={() => { onChatSelect() }}
                    onlineStatus={user_status[chat.user_id] || "offline"}
                />
            ))}
        </div>
    );
}

export default SideBar;