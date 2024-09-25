import React, { useEffect, useState } from 'react';
import Toolbar from '../components/Toolbar';
import UserTable from '../components/UserTable';

const HomePage: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchUsers = async (localeId: string, seed: number, errorSize: number) => {
        setLoading(true);
        const response = await fetch(`/api/users/${localeId}/${seed}/${errorSize}`);
        const data = await response.json();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        const localeId = 'en_US';
        const seed = 0;
        const errorSize = 0;

        fetchUsers(localeId, seed, errorSize);
    }, []);

    return (
        <div className="container-fluid px-5">
            <h1 className="mb-4 text-center">Random User Data Generator</h1>
            <Toolbar onFetchUsers={fetchUsers} />
            <UserTable users={users} loading={loading} />
        </div>
    );
};

export default HomePage;