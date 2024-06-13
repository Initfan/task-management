import React, { useState } from "react";
import Login from './Login'
import Logout from "./Logout";

const App = () => {
  const [projects, setProjects] = useState([]);
  const handleProject = () => {
    fetch('http://localhost:3000/projects', {
      method: 'get',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(val => val.status === 200 && setProjects(val.data))
  }

  return (
    <div>
      <h1>Welcome to my web app</h1>
      <button onClick={handleProject}>Show Projects</button>
      {
        projects.map(val =>
          <div key={val._id}>
            <h2>{val.project.name}</h2>
            <p>{val.project.description}</p>
            <small>{val.project.created_at}</small>
          </div>
        )
      }
      <Login />
      <Logout />
    </div>
  );
};

export default App;
