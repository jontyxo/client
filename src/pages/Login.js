import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validEmails } from '../validaEmails';



function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  const user = validEmails.find((u) => u.email === email);

  if (user) {
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userUUID', user.uuid);

    toast.success('✅ Login successful!', {
      position: 'top-center',
      autoClose: 1500,
      onClose: () => navigate('/')
    });
  } else {
    toast.error('❌ Unauthorized email. Please try again.', {
      position: 'top-center',
      autoClose: 2000
    });
  }
};


  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to right, #ff6a00, #ee0979)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <ToastContainer />
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '350px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginBottom: '25px', color: '#333' }}>Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            width: '100%',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '20px',
            fontSize: '16px'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#ff005c',
            color: '#fff',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
