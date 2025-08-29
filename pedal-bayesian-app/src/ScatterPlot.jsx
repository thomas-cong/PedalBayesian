import React, { useEffect, useRef, useState } from "react";
import * as ss from "simple-statistics";
import "./ScatterPlot.css";

const ScatterPlot = ({ wells, selectedColumn, targetColumn, onClose }) => {
    const [spearmanCoefficient, setSpearmanCoefficient] = useState(null);
    const canvasRef = useRef(null);

    // Calculate Spearman correlation coefficient using simple-statistics
    const calculateSpearmanCorrelation = () => {
        if (!wells || !selectedColumn || !targetColumn || wells.length === 0) {
            return null;
        }

        // Extract valid pairs of values
        const validPairs = wells
            .map((well) => {
                // Check if the value is in direct properties or in parameters
                const getWellValue = (column) => {
                    if (well[column] !== undefined) {
                        return parseFloat(well[column]);
                    } else if (
                        well.parameters &&
                        well.parameters[column] !== undefined
                    ) {
                        return parseFloat(well.parameters[column]);
                    }
                    return NaN;
                };

                const x = getWellValue(selectedColumn);
                const y = getWellValue(targetColumn);
                return !isNaN(x) && !isNaN(y) ? { x, y } : null;
            })
            .filter((pair) => pair !== null);

        if (validPairs.length < 2) {
            return null;
        }

        // Extract x and y values for spearman calculation
        const xValues = validPairs.map((pair) => pair.x);
        const yValues = validPairs.map((pair) => pair.y);

        // Use simple-statistics for Spearman correlation
        try {
            // Calculate ranks for Spearman correlation
            const xRanks = calculateRanks(xValues);
            const yRanks = calculateRanks(yValues);

            // Use Pearson correlation on the ranks
            const rho = ss.sampleCorrelation(xRanks, yRanks);
            return rho;
        } catch (error) {
            console.error("Error calculating Spearman correlation:", error);
            return null;
        }
    };

    // Helper function to calculate ranks for Spearman correlation
    const calculateRanks = (values) => {
        // Create array of {value, index} pairs
        const indexed = values.map((value, index) => ({ value, index }));

        // Sort by value
        indexed.sort((a, b) => a.value - b.value);

        // Assign ranks (1-based), handling ties with average rank
        const ranks = new Array(values.length);
        let i = 0;
        while (i < indexed.length) {
            const value = indexed[i].value;
            let j = i + 1;
            while (j < indexed.length && indexed[j].value === value) {
                j++;
            }

            // If there are ties, assign average rank
            const rank = (i + j - 1) / 2 + 1; // Average rank for tied values

            // Assign this rank to all tied values
            for (let k = i; k < j; k++) {
                ranks[indexed[k].index] = rank;
            }

            i = j;
        }

        return ranks;
    };

    // Draw scatter plot
    const drawScatterPlot = () => {
        const canvas = canvasRef.current;
        if (!canvas || !wells || !selectedColumn || !targetColumn) return;

        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Extract valid pairs of values
        const validPairs = wells
            .map((well) => {
                // Check if the value is in direct properties or in parameters
                const getWellValue = (column) => {
                    if (well[column] !== undefined) {
                        return parseFloat(well[column]);
                    } else if (
                        well.parameters &&
                        well.parameters[column] !== undefined
                    ) {
                        return parseFloat(well.parameters[column]);
                    }
                    return NaN;
                };

                const x = getWellValue(selectedColumn);
                const y = getWellValue(targetColumn);
                return !isNaN(x) && !isNaN(y) ? { x, y } : null;
            })
            .filter((pair) => pair !== null);

        if (validPairs.length === 0) return;

        // Find min and max values
        const xValues = validPairs.map((pair) => pair.x);
        const yValues = validPairs.map((pair) => pair.y);
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const yMin = Math.min(...yValues);
        const yMax = Math.max(...yValues);

        // Add some padding to the ranges
        const xRange = xMax - xMin || 1;
        const yRange = yMax - yMin || 1;
        const xPadding = xRange * 0.05;
        const yPadding = yRange * 0.05;

        // Scale function to convert data coordinates to canvas coordinates
        const scaleX = (x) =>
            padding +
            ((x - (xMin - xPadding)) / (xRange + 2 * xPadding)) *
                (width - 2 * padding);
        const scaleY = (y) =>
            height -
            padding -
            ((y - (yMin - yPadding)) / (yRange + 2 * yPadding)) *
                (height - 2 * padding);

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = "#0056b3";
        ctx.lineWidth = 2;

        // X-axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);

        // Y-axis
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(padding, padding);

        ctx.stroke();

        // Draw axis labels
        ctx.fillStyle = "#0056b3";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        // X-axis label
        ctx.fillText(selectedColumn, width / 2, height - 10);

        // Y-axis label
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(targetColumn, 0, 0);
        ctx.restore();

        // Draw tick marks and values
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0056b3";
        ctx.font = "10px Arial";

        // X-axis ticks
        const xStep = xRange / 5;
        for (let i = 0; i <= 5; i++) {
            const x = xMin + i * xStep;
            const xPos = scaleX(x);
            ctx.beginPath();
            ctx.moveTo(xPos, height - padding);
            ctx.lineTo(xPos, height - padding + 5);
            ctx.stroke();
            ctx.fillText(x.toFixed(1), xPos, height - padding + 15);
        }

        // Y-axis ticks
        const yStep = yRange / 5;
        ctx.textAlign = "right";
        for (let i = 0; i <= 5; i++) {
            const y = yMin + i * yStep;
            const yPos = scaleY(y);
            ctx.beginPath();
            ctx.moveTo(padding, yPos);
            ctx.lineTo(padding - 5, yPos);
            ctx.stroke();
            ctx.fillText(y.toFixed(1), padding - 10, yPos);
        }

        // Draw data points
        validPairs.forEach((pair) => {
            const x = scaleX(pair.x);
            const y = scaleY(pair.y);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "#0056b3";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    useEffect(() => {
        const coefficient = calculateSpearmanCorrelation();
        setSpearmanCoefficient(coefficient);
        drawScatterPlot();
    }, [wells, selectedColumn, targetColumn]);

    return (
        <div className="modal-overlay">
            <div className="scatter-plot-modal">
                <div className="scatter-plot-header">
                    <h3>
                        Scatter Plot: {selectedColumn} vs {targetColumn}
                    </h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="scatter-plot-content">
                    <div className="correlation-info">
                        <p>
                            <strong>Spearman Correlation Coefficient:</strong>{" "}
                            {spearmanCoefficient !== null ? (
                                <span
                                    className={
                                        spearmanCoefficient > 0
                                            ? "positive-correlation"
                                            : "negative-correlation"
                                    }
                                >
                                    {spearmanCoefficient.toFixed(4)}
                                    {Math.abs(spearmanCoefficient) > 0.7
                                        ? " (Strong)"
                                        : Math.abs(spearmanCoefficient) > 0.3
                                        ? " (Moderate)"
                                        : " (Weak)"}
                                </span>
                            ) : (
                                "N/A"
                            )}
                        </p>
                    </div>
                    <div className="canvas-container">
                        <canvas ref={canvasRef} width={500} height={400} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScatterPlot;
