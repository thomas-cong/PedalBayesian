import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const CSVVisualizer = ({ file }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = Papa.parse(event.target.result, {
                    header: true,
                    skipEmptyLines: true,
                });
                setHeaders(csvData.meta.fields);
                setData(csvData.data);
            };
            reader.readAsText(file);
        } else {
            // Clear data if no file is present
            setData([]);
            setHeaders([]);
        }
    }, [file]);

    if (!file || data.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                maxHeight: "400px",
                overflow: "auto",
                border: "1px solid #ccc",
                marginTop: "1rem",
            }}
        >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "left",
                                    backgroundColor: "#f2f2f2",
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header) => (
                                <td
                                    key={header}
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                    }}
                                >
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CSVVisualizer;
