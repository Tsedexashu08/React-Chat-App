import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import style from '../css/pages/StartMessaging.module.css';
import SideBar from '../components/SideBar';

function StartMessaging() {
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);

    const handleChatSelect = (chat) => {
        // Clear messages when a chat is selected
        setMessages([]);
        setCurrentChat(chat);
    };

    return (
        <div className={style.StartMessaging}>
            <SideBar onChatSelect={handleChatSelect} /> {/* Pass the handler to SideBar */}
            <Outlet context={{ messages, setMessages, currentChat }} /> {/* Pass context to Outlet */}
        </div>
    );
}

export function StartMessage() {
    return (
        <div className={style.start}>
            <span>Select a chat to start messaging...</span>
        </div>
    );
}

export default StartMessaging;