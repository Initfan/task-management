import React from 'react'

const Logout = () => {
    const handleLogout = e => {
        e.preventDefault()
        fetch('http://localhost:3000/logout', {
            method: 'post',
            credentials: true,
        })
            .then(res => res.json())
            .then(val => console.log(val))
    }
    return (
        <form onSubmit={handleLogout}>
            <button type='submit'>Logout</button>
        </form>
    )
}

export default Logout