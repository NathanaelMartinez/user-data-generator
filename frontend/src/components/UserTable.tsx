import React from 'react';

interface User {
    id: string;
    name: string;
    address: string;
    phone: string;
}

interface UserTableProps {
    users: User[];
    loading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
    if (loading) return (
        <div className="text-center">
            <div className="spinner-border mt-5" style={{ width: '4rem', height: '4rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <table className="table table-bordered table-hover">
            <thead className="table-secondary">
                <tr>
                    <th>Index</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.address}</td>
                        <td>{user.phone}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
