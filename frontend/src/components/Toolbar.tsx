import React, { useState } from 'react';

interface ToolbarProps {
    onFetchUsers: (region: string, seed: number, errorSize: number, ) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFetchUsers }) => {
    const [region, setRegion] = useState('en_US');
    const [errorSize, setErrorSize] = useState(0);
    const [seed, setSeed] = useState(0);

    const handleFetch = () => {
        onFetchUsers(region, seed, errorSize);
    };

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
                type="number"
                value={errorSize}
                min="0"
                max="1000"
                onChange={(e) => setErrorSize(Number(e.target.value))}
            />
            <input
                type="text"
                value={seed}
                placeholder="Seed"
                onChange={(e) => setSeed(Number(e.target.value))}
            />
            <button onClick={handleFetch}>Generate</button>
            <button>Export to CSV</button>
        </div>
    );
};

export default Toolbar;
