import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import FeatureHistogram from "./FeatureHistogram";

const CSVVisualizer = ({ file }) => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);

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
                setSelectedFeature(null); // Reset selected feature when file changes
            };
            reader.readAsText(file);
        } else {
            // Clear data if no file is present
            setData([]);
            setHeaders([]);
            setSelectedFeature(null);
        }
    }, [file]);

    const handleFeatureSelect = (feature) => {
        setSelectedFeature(feature === selectedFeature ? null : feature);
    };

    if (!file || data.length === 0) {
        return null;
    }

    return (
        <div className="csv-visualizer-container">
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
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    style={{
                                        border: "1px solid #0056b3",
                                        padding: "8px",
                                        textAlign: "left",
                                        backgroundColor:
                                            selectedFeature === header
                                                ? "#0056b3"
                                                : "#ffffff",
                                        color:
                                            selectedFeature === header
                                                ? "#ffffff"
                                                : "#0056b3",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleFeatureSelect(header)}
                                    title={`Click to view distribution of ${header}`}
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
                                            border: "1px solid #0056b3",
                                            padding: "8px",
                                            color: "#000000",
                                            backgroundColor:
                                                selectedFeature === header
                                                    ? "#f0f8ff"
                                                    : "transparent",
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

            {/* Feature Histogram */}
            <FeatureHistogram
                data={data}
                selectedFeature={selectedFeature}
                onFeatureSelect={handleFeatureSelect}
            />
        </div>
    );
};

export default CSVVisualizer;
