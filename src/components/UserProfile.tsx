// src/UserProfile.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const UserProfile = () => {
    const auth = useContext(AuthContext);

    if (!auth || !auth.user) {
        return <div>Loading...</div>;
    }

    const { user, logout } = auth;

    return (
        <div>
            <h2>User Profile</h2>
            <p>Username: {user.username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default UserProfile;