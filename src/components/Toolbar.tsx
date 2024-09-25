import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ToolbarProps {
    onFetchUsers: (region: string, seed: number, errorSize: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFetchUsers }) => {
    const [region, setRegion] = useState('en_US');
    const [errorSize, setErrorSize] = useState(0);
    const [seed, setSeed] = useState(0);

    const handleFetch = () => {
        onFetchUsers(region, seed, errorSize);
    };

    const generateRandomSeed = () => {
        // Generate random 7-digit seed
        const randomSeed = Math.floor(1000000 + Math.random() * 9000000);
        setSeed(randomSeed); // update seed state with generated seed
        handleFetch(); // trigger fetch right after generating new seed
    };

    const handleErrorSizeChange = (value: number) => {
        if (value > 1000) { // cannot exceed 1000
            setErrorSize(1000); 
        } else {
            setErrorSize(value);
        }
    };

    const handleSeedChange = (value: number) => {
        setSeed(value);
        handleFetch(); // trigger fetch when seed is manually changed
    };

    // listen for changes in region or error size to update table
    useEffect(() => {
        handleFetch(); // automatically fetch on region or errorSize changes
    }, [region, errorSize, seed]);

    return (
        <div className="mb-3 d-flex flex-row justify-content-between align-items-center">
            <div className="input-group-sm d-flex align-items-center">
                <label className="input-group-text">Region:</label>
                <select id="regionSelect" className="form-select mx-2" value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="en_US">USA</option>
                    <option value="es_MX">Mexico</option>
                    <option value="de">Germany</option>
                    <option value="el">Greece</option>
                    <option value="fr">France</option>
                    <option value="it">Italy</option>
                </select>
            </div>

            <div className="input-group-sm d-flex align-items-center flex-row">
                <span className="input-group-text">Errors:</span>
                <input
                    id="errorSizeRange"
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"  // allow increments of 0.5
                    value={Math.min(errorSize, 10)} // slider capped at 10
                    onChange={(e) => handleErrorSizeChange(Number(e.target.value))}
                    className="form-control-range mx-2"
                />
                <input
                    type="number"
                    value={errorSize}
                    min="0"
                    max="1000"
                    onChange={(e) => handleErrorSizeChange(Number(e.target.value))}
                    className="form-control"
                />
            </div>

            <div className="input-group-sm d-flex align-items-center">
                <label htmlFor="seedInput" className="input-group-text mr-2">Seed:</label>
                <input
                    id="seedInput"
                    type="number"
                    value={seed}
                    placeholder="Seed"
                    onChange={(e) => handleSeedChange(Number(e.target.value))}
                    className="form-control ms-2"
                />
                <button className="btn btn-link" onClick={generateRandomSeed}>
                    <i className="bi bi-shuffle fs-2 text-dark"></i>
                </button>
            </div>

            <button className="btn border border-dark custom-shadow btn-light">Export</button>
        </div>
    );
};

export default Toolbar;
