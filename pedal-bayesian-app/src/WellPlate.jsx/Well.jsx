import React from "react";

const Well = ({ data, position }) => {
    // Get the yield value if it exists, otherwise use a default
    const yieldValue = data && data.yield !== undefined ? data.yield : 0;

    // Calculate color based on yield value (0-100)
    // Blue for low values, white for middle values, darker blue for high values
    const getWellColor = () => {
        if (yieldValue < 33) {
            return "#000080";
        } else if (yieldValue < 66) {
            return "#0000CD";
        } else {
            return "#0000FF";
        }
    };

    return (
        <div className="well" style={{ backgroundColor: getWellColor() }}>
            <div className="well-position">{position}</div>
            {data && (
                <div className="well-tooltip">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="tooltip-row">
                            <span className="tooltip-key">{key}:</span>
                            <span className="tooltip-value">
                                {typeof value === "number"
                                    ? value.toFixed(2)
                                    : value}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Well;
