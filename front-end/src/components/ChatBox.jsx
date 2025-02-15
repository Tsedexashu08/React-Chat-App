// Added PropTypes for type checking
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import style from '../css/components/ChatBox.module.css';
import { IncomingMessage, OutgoingMessage } from '../components/Message';
import io from 'socket.io-client';
import { useParams, useOutletContext } from 'react-router-dom';

// Added environment variable for socket URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function ChatBox() {
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState("");
    const { messages, setMessages } = useOutletContext();
    const user1Id = parseInt(sessionStorage.getItem('auth_id'), 10);
    const { userId, username, chatId, onlineStatus } = useParams();
    const [chatRoomId, setChatRoomId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoizing GetChatMessages to prevent unnecessary re-renders(dont completely understand how  yet tho...)
    const GetChatMessages = useCallback(async (chatId) => {
        try {
            const response = await fetch('/chat/fecthMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ chatId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessages(data);
            setLoading(false); // Set loading to false after messages are fetched
        } catch (error) {
            setError('Error fetching messages');
            console.error('Error fetching chat messages:', error);
            setLoading(false);
        }
    }, [setMessages]);

    useEffect(() => {
        const newSocket = io.connect(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
            setError('Connection error');
        });

        startChat(userId).then(() => {
            GetChatMessages(chatRoomId); // Call after chat room ID is set
        });

        newSocket.emit("join chat", chatId);

        newSocket.on("receive message", (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [chatId, setMessages, userId, GetChatMessages, chatRoomId, user1Id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (msg.trim() && socket) {
            socket.emit('chat message', { chatId, msg });
            setMessages(prevMessages => [...prevMessages, { sender_id: user1Id, content: msg }]);
            setMsg("");
            SaveMessage();
        }
    };

    const startChat = useCallback(async (user2Id) => {
        try {
            const response = await fetch('/chat/StartChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user1Id: user1Id,
                    user2Id: parseInt(user2Id, 10)
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setChatRoomId(data.chat_id);
        } catch (error) {
            setError('Error starting chat');
            console.error('Error starting chat:', error);
            setLoading(false); // Setting loading to false incase chat start fails...
        }
    }, [user1Id]);

    const SaveMessage = async () => {
        try {
            const response = await fetch('/chat/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1Id: user1Id, user2Id: userId, msgContent: msg })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Message sent:', data);
        } catch (error) {
            setError('Error saving message');
            console.error('Error:', error);
        }
    };
    console.log(messages)
    if (error) {
        return <div className={style.error}>{error}</div>;
    }

    return (
        <div className={style.ChatBox}>
            <div className={style.chat_header}>
                <div className={style.chat_header_info}>
                    <h3>{username}</h3>
                    <p style={{ color: onlineStatus === 'online' ? '#0088cc' : '#ccc' }}>
                        <span
                            className={style.status_indicator}
                            style={{
                                backgroundColor: onlineStatus === 'online' ? '#44b700' : '#ccc',
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                marginRight: '5px'
                            }}
                        />
                        {onlineStatus}
                    </p>
                </div>
            </div>
            <section className={style.chat}>
                {!loading ? (
                    messages?.map((message, index) => (
                        message.sender_id === parseInt(user1Id, 10) ? (
                            <OutgoingMessage key={index} message={message.content} />
                        ) : (
                            <IncomingMessage key={index} message={message.content} userId={userId} />
                        ))
                    )
                ) : (
                    <h1>Loading...</h1>
                )}
            </section>

            <form onSubmit={sendMessage} className={style.chat_footer}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    style={{ color: "white", background: "transparent" }}
                    disabled={loading || !msg.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

ChatBox.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            sender_id: PropTypes.number.isRequired,
            msg: PropTypes.string.isRequired
        })
    ),
    setMessages: PropTypes.func
};

export default ChatBox;
