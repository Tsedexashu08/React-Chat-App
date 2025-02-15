import { useEffect, useState } from 'react';
import style from '../css/components/Messages.module.css';
import img from '../propic.png';
import { data } from 'react-router-dom';


function IncomingMessage(props) {
    const [profile_picture, setProfilePicture] = useState('')
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/chat/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: props.userId })
                });

                const data = await response.json();
                if (data) {
                    setProfilePicture(data.profile_picture);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (props.userId) {
            fetchUserData();
        }
    }, [props.userId]);

    return (
        <div className={style.incoming_msg}>
            <img
                className={style.avatar}
                src={profile_picture ? `http://localhost:3001/public/${profile_picture}` : img}
                alt="user avatar"
            />
            <div className={style.message}>{props.message}</div>
        </div>
    );
}

function OutgoingMessage(props) {
    const currentUserProfilePicture = (sessionStorage.getItem('auth_profilepic'));//cause outgoing msgs are obviously from the current user.
    return (
        <div className={style.outgoing_msg}>
            <div className={style.outgoing_message}>{props.message}</div>
            <img src={`http://localhost:3001/public/${currentUserProfilePicture}`} alt="User Avatar" className={style.avatar} />
        </div>
    );
}

export { IncomingMessage, OutgoingMessage };
