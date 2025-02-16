import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback, use } from 'react';
import style from '../css/components/ChatBox.module.css';
import { IncomingMessage, OutgoingMessage } from '../components/Message';
import io from 'socket.io-client';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import MessageWithFile from './MessageWithFile';


const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function ChatBox() {
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState("");
    const { messages, setMessages } = useOutletContext();
    const user1Id = parseInt(sessionStorage.getItem('auth_id'), 10);
    const { userId, username, chatId, onlineStatus } = useParams();
    const id = parseInt(userId, 10)
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
        // Add listener for file messages
        newSocket.on("receive file", (fileMessage) => {
            setMessages(prevMessages => [...prevMessages, {
                sender_id: fileMessage.sender_id,
                content: `File: ${fileMessage.fileData.name}`,
                fileData: fileMessage.fileData
            }]);
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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // File size validation (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return;
        }

        // Allowed file types
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('File type not supported');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = {
                    name: file.name,
                    type: file.type,
                    data: reader.result
                };

                // Create file message object
                const fileMessage = {
                    sender_id: user1Id,
                    chatId: chatId,
                    fileData: fileData
                };

                // Emit file through socket
                socket.emit('file share', fileMessage);

                // Add to local messages
                setMessages(prevMessages => [...prevMessages, {
                    sender_id: user1Id,
                    content: `File: ${file.name}`,
                    fileData: fileData
                }]);

                // Save file message to database if needed...ti be done if i feel like it..

            };

            reader.onerror = () => {
                setError('Error reading file');
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setError('Error processing file');
            console.error('File upload error:', error);
        }
    };




    return (
        <div className={style.ChatBox}>
            <div className={style.chat_header}>
                <div className={style.chat_header_info}>
                    <Link to={`/startMessaging/profile/${id}`} className={style.chatinfo}> <h3>{username}</h3></Link>
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
                {messages?.map((message, index) => (
                    message.sender_id === parseInt(user1Id, 10) ? (
                        <OutgoingMessage
                            key={index}
                            message={message.content}
                        >
                            <MessageWithFile message={message} />
                        </OutgoingMessage>
                    ) : (
                        <IncomingMessage
                            key={index}
                            userId={userId}
                            message={message.content}
                        >
                            <MessageWithFile message={message} />
                        </IncomingMessage>
                    )
                ))}

            </section>


            <form onSubmit={sendMessage} className={style.chat_footer}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <span role="button" style={{ cursor: 'pointer', marginRight: '10px' }}>
                        📎
                    </span>
                </label>
                <button
                    type="submit"
                    style={{ color: "white", background: "transparent" }}
                    disabled={loading || !msg.trim()}
                >
                    Send
                </button>
            </form>
        </div >
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