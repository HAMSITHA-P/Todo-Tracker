import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !email || !password) {
            setError('All fields are required.');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                username,
                email,
                password,
            });

            if (response.status === 201) {
               
                localStorage.setItem('user', JSON.stringify({
                    username,
                    email
                }));

                setMessage('Signup successful! You can now log in.');
                setError(''); 
                setUsername('');
                setEmail('');
                setPassword('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
            setMessage(''); 
        }
    };

    return (
        <div className="auth-form">
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className='auth-btn'>Signup</button>
            </form>

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
        </div>
    );
};

export default Signup;
