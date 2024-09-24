import React, { useEffect, useState } from 'react';
import Toolbar from './components/Toolbar';

const App = () => {
    const [users, setUsers] = useState([]);


    
    const fetchUsers = async (localeId: String, seed: number, errorSize: number) => {
        const response = await fetch(`/api/users/${localeId}/${seed}/${errorSize}`);
        const data = await response.json();
        setUsers(data);
    };

    useEffect(() => {
        // const localeId = 'en_US';
        // const seed = 123234234;
        // const errorSize = 0;

        // fetchUsers(localeId, seed, errorSize);
    }, []);

    return (
        <div>
            <h1>Random User Data Generator</h1>
            <Toolbar onFetchUsers={fetchUsers} />
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    );
};

export default App;
