import { useEffect, useState } from 'react';
import style from '../css/components/Messages.module.css';
import img from '../propic.png';
import { data } from 'react-router-dom';

// Correct way to destructure props for functional components
function IncomingMessage({ children, userId, message }) {  
    const [profile_picture, setProfilePicture] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/chat/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: userId })
                });

                const data = await response.json();
                if (data) {
                    setProfilePicture(data.profile_picture);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    return (
        <div className={style.incoming_msg}>
            <img
                className={style.avatar}
                src={profile_picture ? `http://localhost:3001/public/${profile_picture}` : img}
                alt="user avatar"
            />
            <div className={style.message}>
                {message} 
                {children}
            </div>
        </div>
    );
}

function OutgoingMessage({ children, message }) {  // Direct destructuring
    const currentUserProfilePicture = sessionStorage.getItem('auth_profilepic');

    return (
        <div className={style.outgoing_msg}>
            <div className={style.outgoing_message}>
                {message}
                {children}
            </div>
            <img
                src={`http://localhost:3001/public/${currentUserProfilePicture}`}
                alt="User Avatar"
                className={style.avatar}
            />
        </div>
    );
}

export { IncomingMessage, OutgoingMessage };
