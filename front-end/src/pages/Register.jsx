import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import FileInput from '../components/inputs/FileInput';
import PhoneNumberInput from '../components/inputs/PhoneNumberInput';
import style from "../css/pages/Register.module.css";

function Register() {
    const [user, setUser] = useState({});
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Appendding all user data to FormData(cause we sending a file profile picture wid em...).
        Object.keys(user).forEach(key => {
            formData.append(key, user[key]);
        });

        try {
            const response = await fetch('/user/Register', {
                method: 'POST',
                body: formData, // Use FormData directly
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                navigate('/')

            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={style.regform}>
            <form className={style.form} onSubmit={handleSubmit}>
                <p className={style.title}>Register</p>
                <p className={style.message}>Signup now and start chatting in our app.</p>
                <FileInput onFileSelect={(value) => setUser({ ...user, profile_picture: value })} />
                <div className={style.flex}>
                    <label>
                        <input required placeholder="" type="text" className={style.input} onChange={(e) => setUser({
                            ...user,
                            username: e.target.value
                        })} />
                        <span>user-name</span>
                    </label>
                </div>
                <PhoneNumberInput onPhoneNumberChange={(value) => setUser({ ...user, Tel: value })} />
                <label>
                    <input required placeholder="" type="email" className={style.input} onChange={(e) =>
                        setUser({
                            ...user,
                            email: e.target.value
                        })
                    } />
                    <span>Email</span>
                </label>

                <label>
                    <input required placeholder="" type="password" className={style.input} onChange={(e) =>
                        setUser({
                            ...user,
                            password: e.target.value
                        })
                    } />
                    <span>Password</span>
                </label>
                <label>
                    <input required placeholder="" type="password" className={style.input} />
                    <span>Confirm password</span>
                </label>
                <button className={style.submit}>Submit</button>
                <p className="signin">Already have an account? <a href="/">Signin</a></p>
            </form>
        </div>
    );
}

export default Register;