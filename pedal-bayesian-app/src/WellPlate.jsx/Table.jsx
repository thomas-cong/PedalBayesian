import React, { useState } from "react";
import ScatterPlot from "../ScatterPlot";
import "./Table.css";

const Table = ({ wells }) => {
    const [showScatterPlot, setShowScatterPlot] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [targetColumn, setTargetColumn] = useState(null);
    // Process wells data to ensure proper structure
    const processedWells = wells.map((well, index) => {
        // Create position identifier if not present
        const row =
            well.row || String.fromCharCode(65 + Math.floor(index / 12));
        const col = well.col || (index % 12) + 1;

        return {
            ...well,
            id: well.id || `${row}${col}`,
            row: row,
            col: col,
            // Ensure parameters is an object
            parameters: well.parameters || {},
        };
    });

    // Extract all direct properties from wells (excluding nested objects)
    const getDirectProperties = () => {
        const directProps = new Set();
        processedWells.forEach((well) => {
            Object.keys(well).forEach((key) => {
                if (
                    key !== "parameters" &&
                    key !== "id" &&
                    key !== "row" &&
                    key !== "col" &&
                    typeof well[key] !== "object"
                ) {
                    directProps.add(key);
                }
            });
        });
        return Array.from(directProps);
    };

    // Handle column header click to show scatter plot
    const handleColumnClick = (columnName) => {
        // If clicking on the currently selected target column, deselect it
        if (targetColumn === columnName) {
            setTargetColumn(null);
            return;
        }

        // If we have a target column set, show scatter plot between target and selected column
        if (targetColumn) {
            setSelectedColumn(columnName);
            setShowScatterPlot(true);
        } else {
            // If no target column set, set it as target
            setTargetColumn(columnName);
        }
    };

    // Close scatter plot modal
    const handleCloseScatterPlot = () => {
        setShowScatterPlot(false);
    };

    // Extract all parameter keys from the wells
    const getParameterKeys = () => {
        const keys = new Set();
        processedWells.forEach((well) => {
            if (well.parameters && typeof well.parameters === "object") {
                Object.keys(well.parameters).forEach((key) => keys.add(key));
            }
        });
        return Array.from(keys);
    };

    const directProperties = getDirectProperties();
    const parameterKeys = getParameterKeys();

    return (
        <div className="wells-table-container">
            {showScatterPlot && selectedColumn && targetColumn && (
                <ScatterPlot
                    wells={processedWells}
                    selectedColumn={selectedColumn}
                    targetColumn={targetColumn}
                    onClose={handleCloseScatterPlot}
                />
            )}
            {targetColumn && (
                <div className="selected-column-info">
                    <p>
                        Selected target column: <strong>{targetColumn}</strong>{" "}
                        (click again to deselect)
                    </p>
                    <p>Click another column to compare with {targetColumn}</p>
                </div>
            )}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Well ID</th>
                            <th>Row</th>
                            <th>Column</th>
                            {directProperties.map((prop) => (
                                <th
                                    key={prop}
                                    className={`column-header ${
                                        targetColumn === prop
                                            ? "selected-column"
                                            : ""
                                    }`}
                                    onClick={() => handleColumnClick(prop)}
                                    title={
                                        targetColumn === prop
                                            ? `${prop} is set as target column. Click another column to compare.`
                                            : `Click to set as target or compare with ${
                                                  targetColumn || "target"
                                              }`
                                    }
                                >
                                    {prop}
                                </th>
                            ))}
                            {parameterKeys.map((key) => (
                                <th
                                    key={key}
                                    className={`column-header ${
                                        targetColumn === key
                                            ? "selected-column"
                                            : ""
                                    }`}
                                    onClick={() => handleColumnClick(key)}
                                    title={
                                        targetColumn === key
                                            ? `${key} is set as target column. Click another column to compare.`
                                            : `Click to set as target or compare with ${
                                                  targetColumn || "target"
                                              }`
                                    }
                                >
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {processedWells.map((well, index) => (
                            <tr key={index}>
                                <td className="table-cell">{well.id}</td>
                                <td className="table-cell">{well.row}</td>
                                <td className="table-cell">{well.col}</td>
                                {directProperties.map((prop) => (
                                    <td key={prop} className="table-cell">
                                        {well[prop] !== undefined &&
                                        well[prop] !== null
                                            ? typeof well[prop] === "number"
                                                ? well[prop].toFixed(4)
                                                : String(well[prop])
                                            : "-"}
                                    </td>
                                ))}
                                {parameterKeys.map((key) => (
                                    <td key={key} className="table-cell">
                                        {well.parameters[key] !== undefined &&
                                        well.parameters[key] !== null
                                            ? typeof well.parameters[key] ===
                                              "number"
                                                ? well.parameters[key].toFixed(
                                                      4
                                                  )
                                                : String(well.parameters[key])
                                            : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Styles for table elements are now in Table.css

export default Table;
