import React, { useEffect, useState } from 'react';

interface ToolbarProps {
    onFetchUsers: (region: string, seed: number, errorSize: number,) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFetchUsers }) => {
    const [region, setRegion] = useState('en_US');
    const [errorSize, setErrorSize] = useState(0);
    const [seed, setSeed] = useState(0);

    const handleFetch = () => {
        onFetchUsers(region, seed, errorSize);
    };

    const handleErrorSizeChange = (value: number) => {
        setErrorSize(value);
    };

    const handleSeedChange = (value: number) => {
        setSeed(value);
    };

    // listen for changes to update table
    useEffect(() => {
        if (errorSize !== 0 || seed !== 0) {
            handleFetch();
        }
        // onFetchUsers(region, seed, errorSize);
    }, [region, errorSize, seed]);

    return (
        <div>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="en_US">USA</option>
                <option value="es_MX">Mexico</option>
                <option value="de">Germany</option>
                <option value="el">Greece</option>
                <option value="fr">France</option>
                <option value="it">Italy</option>
            </select>
            <input
                type="range"
                min="0"
                max="10"
                value={Math.min(errorSize, 10)} // slider capped at 10
                onChange={(e) => handleErrorSizeChange(Number(e.target.value))}
            />
            <input
                type="number"
                value={errorSize}
                min="0"
                max="1000"
                onChange={(e) => handleErrorSizeChange(Number(e.target.value))}
            />
            <input
                type="number"
                value={seed}
                placeholder="Seed"
                onChange={(e) => handleSeedChange(Number(e.target.value))}
            />
            <button onClick={handleFetch}>Generate</button>
            <button>Export to CSV</button>
        </div>
    );
};

export default Toolbar;
