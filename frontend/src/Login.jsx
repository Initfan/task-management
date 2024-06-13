import React, { useState } from 'react'

const Login = () => {
    const [cred, setCred] = useState({
        email: '',
        password: ''
    });

    const loginHandler = async (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/login', {
            method: 'post',
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify(cred),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(value => console.log(value))
    }

    return (
        <form onSubmit={loginHandler}>
            <input
                type="email"
                placeholder='email..'
                onChange={e => {
                    setCred(prev => {
                        return { ...prev, email: e.target.value }
                    })
                }}
            />
            <br />
            <input
                type="password"
                placeholder='password..'
                onChange={e => {
                    setCred(prev => {
                        return { ...prev, password: e.target.value }
                    })
                }}
            />
            <br />
            <button type='submit'>login</button>
        </form>
    )
}

export default Login