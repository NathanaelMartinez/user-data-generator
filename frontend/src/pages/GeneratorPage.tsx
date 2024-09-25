import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Toolbar from '../components/Toolbar';
import UserTable from '../components/UserTable';
import { generateUsers } from '../utils/RandomUserGenerator';
import User from '../models/User';

const GeneratorPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [localeId, setLocaleId] = useState<string>('en_US');
    const [seed, setSeed] = useState<number>(0);
    const [errorSize, setErrorSize] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    // This function now ensures that each page gets its unique seed-based data
    const fetchUsers = (localeId: string, seed: number, errorSize: number, page: number) => {
        setLoading(true);
        
        // Fetch users for the current page
        const newUsers = generateUsers(localeId, seed, errorSize, page);
        
        setUsers((prevUsers) => [...prevUsers, ...newUsers]); // Append new users to existing list
        setLoading(false);

        // Stop fetching if fewer than 10 users are returned on subsequent pages
        if (newUsers.length < 10 && page > 1) {
            setHasMore(false); 
        }
    };

    const loadMoreUsers = () => {
        setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchUsers(localeId, seed, errorSize, nextPage); // Fetch users for the next page
            return nextPage; // Increment the page number
        });
    };

    // When localeId, seed, or errorSize changes, reset everything and fetch the first page
    useEffect(() => {
        setUsers([]); // Reset users when localeId, seed, or errorSize changes
        setPage(1); // Reset page number
        setHasMore(true); // Enable infinite scrolling
        fetchUsers(localeId, seed, errorSize, 1); // Fetch the first 20 users
    }, [localeId, seed, errorSize]);

    return (
        <div className="container-fluid px-5">
            <h1 className="mb-4 text-center">Random User Data Generator</h1>
            <Toolbar
                onFetchUsers={(locale, newSeed, newErrorSize) => {
                    setLocaleId(locale);
                    setSeed(newSeed);
                    setErrorSize(newErrorSize);
                }}
            />
            <InfiniteScroll
                dataLength={users.length}
                next={loadMoreUsers} // Load more users when scrolling
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>No more users to load.</p>}
            >
                <UserTable users={users} loading={loading} />
            </InfiniteScroll>
        </div>
    );
};

export default GeneratorPage;
