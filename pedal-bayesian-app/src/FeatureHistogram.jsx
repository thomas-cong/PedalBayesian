import React, { useState, useEffect } from "react";

const FeatureHistogram = ({ data, selectedFeature, onFeatureSelect }) => {
    const [histogramData, setHistogramData] = useState([]);
    const [bins, setBins] = useState(5);

    // Calculate histogram data when selected feature changes
    useEffect(() => {
        if (!data || !selectedFeature || data.length === 0) {
            setHistogramData([]);
            return;
        }

        // Extract values for the selected feature
        const values = data
            .map((row) => {
                const val = parseFloat(row[selectedFeature]);
                return isNaN(val) ? null : val;
            })
            .filter((val) => val !== null);

        if (values.length === 0) {
            setHistogramData([]);
            return;
        }

        // Find min and max values
        const min = Math.min(...values);
        const max = Math.max(...values);

        // Create bins
        const binWidth = (max - min) / bins;
        const histData = Array(bins).fill(0);

        // Count values in each bin
        values.forEach((val) => {
            const binIndex = Math.min(
                Math.floor((val - min) / binWidth),
                bins - 1
            );
            histData[binIndex]++;
        });

        // Create histogram data with bin ranges
        const histogramBins = histData.map((count, i) => {
            const binStart = min + i * binWidth;
            const binEnd = min + (i + 1) * binWidth;
            return {
                range: `${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`,
                count: count,
                binStart,
                binEnd,
            };
        });

        setHistogramData(histogramBins);
    }, [data, selectedFeature, bins]);

    // Find the maximum count for scaling
    const maxCount =
        histogramData.length > 0
            ? Math.max(...histogramData.map((bin) => bin.count))
            : 0;

    return (
        <div className="histogram-container">
            <h3>Feature Histogram</h3>

            {!selectedFeature ? (
                <p>
                    Click on a column header in the table to view its
                    distribution
                </p>
            ) : (
                <>
                    <div className="histogram-header">
                        <h4>Distribution of {selectedFeature}</h4>
                        <div className="histogram-controls">
                            <label>
                                Bins:
                                <input
                                    type="range"
                                    min="5"
                                    max="20"
                                    value={bins}
                                    onChange={(e) =>
                                        setBins(parseInt(e.target.value))
                                    }
                                />
                                <span>{bins}</span>
                            </label>
                        </div>
                    </div>

                    <div className="histogram-chart">
                        {histogramData.length > 0 ? (
                            <div
                                className="bars-container"
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    height: "200px",
                                }}
                            >
                                {histogramData.map((bin, index) => (
                                    <div
                                        key={index}
                                        className="histogram-bar-container"
                                        style={{
                                            flex: 1,
                                            textAlign: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <div
                                            className="histogram-bar"
                                            style={{
                                                height: `${
                                                    (bin.count / maxCount) * 100
                                                }%`,
                                                backgroundColor: "#0056b3",
                                                margin: "0 1px",
                                                minHeight:
                                                    bin.count > 0 ? "1px" : "0",
                                                width: "80%",
                                                alignSelf: "center",
                                            }}
                                            title={`Range: ${bin.range}, Count: ${bin.count}`}
                                        />
                                        <div
                                            className="count-label"
                                            style={{
                                                fontSize: "10px",
                                                marginTop: "5px",
                                                color: "#333",
                                            }}
                                        >
                                            n={bin.count}
                                        </div>
                                        <div
                                            className="bin-label"
                                            style={{
                                                fontSize: "10px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                marginTop: "4px",
                                            }}
                                        >
                                            {bin.binStart.toFixed(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No numeric data available for this feature</p>
                        )}
                    </div>

                    <div
                        className="x-axis-label"
                        style={{
                            textAlign: "center",
                            marginTop: "10px",
                            fontWeight: "bold",
                        }}
                    >
                        {selectedFeature}
                    </div>

                    <div className="histogram-stats">
                        <p>
                            Count:{" "}
                            {histogramData.reduce(
                                (sum, bin) => sum + bin.count,
                                0
                            )}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default FeatureHistogram;
