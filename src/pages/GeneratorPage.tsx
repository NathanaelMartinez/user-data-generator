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

    const fetchUsers = (localeId: string, seed: number, errorSize: number, page: number) => {
        setLoading(true);
        
        // gen users for current page
        const newUsers = generateUsers(localeId, seed, errorSize, page);
        
        setUsers((prevUsers) => [...prevUsers, ...newUsers]); // append new users to existing list
        setLoading(false);
    };

    const loadMoreUsers = () => {
        setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchUsers(localeId, seed, errorSize, nextPage); // gen users for next page
            return nextPage; // increment page number
        });
    };

    // anything in toolbar changes, reset everything and gen first page
    useEffect(() => {
        setUsers([]); // reset users when changes
        setPage(1); // reset page number
        setHasMore(true); // this enables infinite scrolling
        fetchUsers(localeId, seed, errorSize, 1); // gen first 20 users
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
                next={loadMoreUsers} // load more users when scrolling
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}            >
                <UserTable users={users} loading={loading} />
            </InfiniteScroll>
        </div>
    );
};

export default GeneratorPage;
