import React, { useState } from "react";
import Well from "./Well";
import Table from "./Table";

const Plate = ({ wells }) => {
    const [viewMode, setViewMode] = useState('plate'); // 'plate' or 'table'
    const WELLS_PER_ROW = 12;

    // If no wells are provided, return empty plate
    if (!wells) {
        return <div className="plate-container">No well data available</div>;
    }

    // Parse the data if it's a string
    let wellsData = wells;
    if (typeof wells === "string") {
        try {
            wellsData = JSON.parse(wells);
            console.log("Parsed wells data:", wellsData);
        } catch (error) {
            console.error("Failed to parse wells data:", error);
            return (
                <div className="plate-container">Error parsing well data</div>
            );
        }
    }

    // Ensure wells is an array
    const wellsArray = Array.isArray(wellsData)
        ? wellsData
        : wellsData && typeof wellsData === "object"
        ? Object.values(wellsData)
        : [];
    console.log("Wells array:", wellsArray);

    if (wellsArray.length === 0) {
        return <div className="plate-container">No well data available</div>;
    }

    // Calculate how many rows we need
    const numRows = Math.ceil(wellsArray.length / WELLS_PER_ROW);

    // Create rows of wells
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const rowWells = wellsArray.slice(
            i * WELLS_PER_ROW,
            (i + 1) * WELLS_PER_ROW
        );
        rows.push(
            <div key={`row-${i}`} className="plate-row">
                {rowWells.map((well, index) => (
                    <Well
                        key={`well-${i}-${index}`}
                        data={well}
                        position={`${String.fromCharCode(65 + i)}${index + 1}`}
                    />
                ))}
            </div>
        );
    }

    // Toggle between plate and table view
    const toggleView = () => {
        setViewMode(viewMode === 'plate' ? 'table' : 'plate');
    };

    return (
        <div className="plate-container">
            <div className="view-toggle">
                <button 
                    onClick={toggleView}
                    className="toggle-button"
                    style={{
                        padding: '8px 16px',
                        marginBottom: '15px',
                        backgroundColor: '#0056b3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {viewMode === 'plate' ? 'Switch to Table View' : 'Switch to Plate View'}
                </button>
            </div>
            
            {viewMode === 'plate' ? (
                <div className="plate-layout">{rows}</div>
            ) : (
                <Table wells={wellsArray} />
            )}
        </div>
    );
};

export default Plate;
