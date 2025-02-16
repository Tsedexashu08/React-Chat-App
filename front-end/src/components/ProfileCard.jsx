import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import style from '../css/components/ProfileCard.module.css'
import { useNavigate } from 'react-router-dom';
function ProfileCard() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState({})

    const handleClose = () => {
        navigate(-1);
    }
    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/user/getUser/${id}`);
                const data = await response.json();
                console.log(data);
                setUser(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.4)'
        }}>
            <div className={style.card}>
                <div onClick={handleClose}><svg
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentcolor"
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    />
                </svg>
                </div>
                <div className={style.profilepic}>
                    <img src={`http://localhost:3001/public/${user.profile_picture}`} alt="" />
                </div>
                <div className={style.info}>
                    <table>
                        <th>
                            <tr>
                                <td>Username</td>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>+251-{user.Tel}</td>
                            </tr>
                            {sessionStorage.getItem("auth_id") === id ?

                                (<tr>
                                    <td>Password</td>
                                    <td>{user.password}</td>
                                </tr>) : ("")

                            }
                            <tr>
                                <td>Created at</td>
                                <td>{user.createdAt ? formatDate(user.createdAt) : ''}</td>
                            </tr>
                        </th>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default ProfileCard
