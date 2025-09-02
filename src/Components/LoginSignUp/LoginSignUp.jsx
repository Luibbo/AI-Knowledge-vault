import React, { useState } from 'react'
import './LoginSignUp.css'
import user_icon from '../Assets/person.png'
import password_icon from '../Assets/password.png'

const LoginSignUp = () => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
    try {
        const endpoint = action === "Sign Up" ? "/user" : "/login";

        // Формуємо правильний ключ для бекенду
        const bodyData =
        action === "Sign Up"
            ? { login: username, password }     // Sign Up чекає login
            : { username: username, password }; // Login чекає username

        const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
        alert(`${action} successful!`);
        // Можна зберегти токен і редіректнути
        // localStorage.setItem("token", data.token)
        } else {
        alert(data.detail || "Something went wrong");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
    };


    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            <div className="inputs">
                {action !== "Login" && (
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                )}

                
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
            </div>

            {action === "Login" && (
                <div className="forgot-password">
                    Lost Password? <span>Click Here!</span>
                </div>
            )}

            <div className="submit-container">
                <div className="submit" onClick={handleSubmit}>
                    {action}
                </div>

                <div
                    className={action === "Login" ? "submit gray" : "submit"}
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </div>

                <div
                    className={action === "Sign Up" ? "submit gray" : "submit"}
                    onClick={() => setAction("Login")}
                >
                    Login
                </div>
            </div>
        </div>
    );
}

export default LoginSignUp;
