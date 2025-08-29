import React from "react";
import Well from "./Well";

const Plate = ({ wells }) => {
    const WELLS_PER_ROW = 12;

    // If no wells are provided, return empty plate
    if (!wells || wells.length === 0) {
        return <div className="plate-container">No well data available</div>;
    }

    // Calculate how many rows we need
    const numRows = Math.ceil(wells.length / WELLS_PER_ROW);

    // Create rows of wells
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const rowWells = wells.slice(
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

    return <div className="plate-container">{rows}</div>;
};

export default Plate;
