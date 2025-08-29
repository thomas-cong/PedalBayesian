import React from "react";

const Table = ({ wells }) => {
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
            <div
                className="table-container"
                style={{
                    maxHeight: "400px",
                    overflow: "auto",
                    border: "1px solid #0056b3",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Well ID</th>
                            <th style={tableHeaderStyle}>Row</th>
                            <th style={tableHeaderStyle}>Column</th>
                            {directProperties.map((prop) => (
                                <th key={prop} style={tableHeaderStyle}>
                                    {prop}
                                </th>
                            ))}
                            {parameterKeys.map((key) => (
                                <th key={key} style={tableHeaderStyle}>
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {processedWells.map((well, index) => (
                            <tr key={index}>
                                <td style={tableCellStyle}>{well.id}</td>
                                <td style={tableCellStyle}>{well.row}</td>
                                <td style={tableCellStyle}>{well.col}</td>
                                {directProperties.map((prop) => (
                                    <td key={prop} style={tableCellStyle}>
                                        {well[prop] !== undefined &&
                                        well[prop] !== null
                                            ? typeof well[prop] === "number"
                                                ? well[prop].toFixed(4)
                                                : String(well[prop])
                                            : "-"}
                                    </td>
                                ))}
                                {parameterKeys.map((key) => (
                                    <td key={key} style={tableCellStyle}>
                                        {well.parameters[key] !== undefined &&
                                        well.parameters[key] !== null
                                            ? typeof well.parameters[key] ===
                                              "number"
                                                ? well.parameters[key].toFixed(4)
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

// Styles for table elements matching CSV visualizer
const tableHeaderStyle = {
    border: "1px solid #0056b3",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#ffffff",
    color: "#0056b3",
    fontWeight: "600",
};

const tableCellStyle = {
    border: "1px solid #0056b3",
    padding: "8px",
    color: "#000000",
};

export default Table;
