import style from '../css/components/ChatCard.module.css';
import propic from '../propic.png';
import { Link } from 'react-router-dom';

function ChatCard({ chatId, userId, profile_picture, username , onSelect,onlineStatus}) {

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
                        <span className={style.timestamp}>timestamp</span>
                    </h3>
                    <p>Chat Message</p>
                </div>
            </div>
        </Link>
    );
}

export default ChatCard;