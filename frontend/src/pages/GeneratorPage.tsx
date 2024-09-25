import React, { useEffect, useState } from 'react';
import Toolbar from '../components/Toolbar';
import UserTable from '../components/UserTable';
import { generateUsers } from '../utils/RandomUserGenerator';

interface User {
    id: string;
    name: string;
    address: string;
    phone: string;
}

const GeneratorPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUsers = (localeId: string, seed: number, errorSize: number) => {
        setLoading(true);
        const data = generateUsers(localeId, seed, errorSize);
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

export default GeneratorPage;
