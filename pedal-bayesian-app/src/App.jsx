import { useState } from "react";
import "./App.css";
import CSVVisualizer from "./CSVVisualizer";
import Plate from "./WellPlate.jsx/Plate.jsx";

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState("");
    const [loading, setLoading] = useState(false);
    const [openAccordions, setOpenAccordions] = useState([0]);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetColumn, setTargetColumn] = useState("");
    const [batchSize, setBatchSize] = useState(96);
    const [plate, setPlate] = useState(null);
    const [showPlate, setShowPlate] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setCurrentStep(1);
                setOpenAccordions([1]);
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const toggleAccordion = (index) => {
        setOpenAccordions((prevOpen) =>
            prevOpen.includes(index)
                ? prevOpen.filter((i) => i !== index)
                : [...prevOpen, index]
        );
    };

    const handleSetTarget = () => {
        if (targetColumn) {
            setCurrentStep(2);
            setOpenAccordions((prev) => [...prev.filter((i) => i !== 1), 2]);
        }
    };

    const handleSetBatchSize = () => {
        if (batchSize) {
            setCurrentStep(3);
            setOpenAccordions((prev) => [...prev.filter((i) => i !== 2), 3]);
        }
    };
    const dummyOptimize = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/fake-fill", {
                method: "POST",
            });
            const data = await response.json();
            if (response.ok) {
                setPlate(data);
                console.log(data);
                setResults(JSON.stringify(data, null, 2));
                setMessage("Optimization successful!");
                setCurrentStep(4);
                setOpenAccordions((prev) => [
                    ...prev.filter((i) => i !== 3),
                    4,
                ]);
            } else {
                setMessage(`Error: ${data.error}`);
            }
            setLoading(false);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setLoading(false);
        }
    };
    const handleWellPropagation = () => {
        setShowPlate(true);
    };
    // const handleOptimize = async () => {
    //     if (!targetColumn) {
    //         setMessage("Please specify the target column for optimization.");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await fetch("/api/optimize", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 target_column: targetColumn,
    //                 batch_size: batchSize,
    //             }),
    //         });
    //         const data = await response.json();
    //         setLoading(false);
    //         if (response.ok) {
    //             setResults(JSON.stringify(JSON.parse(data), null, 2));
    //             setMessage("Optimization successful!");
    //         } else {
    //             setMessage(`Error: ${data.error}`);
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //         setMessage(`Error: ${error.message}`);
    //     }
    // };

    return (
        <div className="App">
            <div className="main-container">
                <div className="controls-container">
                    <div className="accordion">
                        {currentStep >= 0 && (
                            <div className="accordion-item card">
                                <div
                                    className="accordion-header"
                                    onClick={() => toggleAccordion(0)}
                                >
                                    <h2>Upload CSV</h2>
                                    <span
                                        className={`accordion-arrow ${
                                            openAccordions.includes(0)
                                                ? "down"
                                                : "right"
                                        }`}
                                    ></span>
                                </div>
                                {openAccordions.includes(0) && (
                                    <div
                                        className={`accordion-panel ${
                                            openAccordions.includes(0)
                                                ? "open"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                        />
                                        <button onClick={handleUpload}>
                                            Upload
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep >= 1 && (
                            <div className="accordion-item card">
                                <div
                                    className="accordion-header"
                                    onClick={() => toggleAccordion(1)}
                                >
                                    <h2>Set Target Column</h2>
                                    <span
                                        className={`accordion-arrow ${
                                            openAccordions.includes(1)
                                                ? "down"
                                                : "right"
                                        }`}
                                    ></span>
                                </div>
                                {openAccordions.includes(1) && (
                                    <div
                                        className={`accordion-panel ${
                                            openAccordions.includes(1)
                                                ? "open"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Enter target column name"
                                            value={targetColumn}
                                            onChange={(e) =>
                                                setTargetColumn(e.target.value)
                                            }
                                        />
                                        <button onClick={handleSetTarget}>
                                            Set
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep >= 2 && (
                            <div className="accordion-item card">
                                <div
                                    className="accordion-header"
                                    onClick={() => toggleAccordion(2)}
                                >
                                    <h2>Set Number of Results</h2>
                                    <span
                                        className={`accordion-arrow ${
                                            openAccordions.includes(2)
                                                ? "down"
                                                : "right"
                                        }`}
                                    ></span>
                                </div>
                                {openAccordions.includes(2) && (
                                    <div
                                        className={`accordion-panel ${
                                            openAccordions.includes(2)
                                                ? "open"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="number"
                                            placeholder="Enter number of results"
                                            value={batchSize}
                                            onChange={(e) =>
                                                setBatchSize(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                        />
                                        <button onClick={handleSetBatchSize}>
                                            Set
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep >= 3 && (
                            <div className="accordion-item card">
                                <div
                                    className="accordion-header"
                                    onClick={() => toggleAccordion(3)}
                                >
                                    <h2>Run Optimization</h2>
                                    <span
                                        className={`accordion-arrow ${
                                            openAccordions.includes(3)
                                                ? "down"
                                                : "right"
                                        }`}
                                    ></span>
                                </div>
                                {openAccordions.includes(3) && (
                                    <div
                                        className={`accordion-panel ${
                                            openAccordions.includes(3)
                                                ? "open"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            onClick={dummyOptimize}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="spinner"></div>
                                                    <span>Optimizing...</span>
                                                </>
                                            ) : (
                                                "Optimize"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentStep >= 4 && (
                            <div className="accordion-item card">
                                <div
                                    className="accordion-header"
                                    onClick={() => toggleAccordion(4)}
                                >
                                    <h2>Well Propagation</h2>
                                    <span
                                        className={`accordion-arrow ${
                                            openAccordions.includes(4)
                                                ? "down"
                                                : "right"
                                        }`}
                                    ></span>
                                </div>
                                {openAccordions.includes(4) && (
                                    <div
                                        className={`accordion-panel ${
                                            openAccordions.includes(4)
                                                ? "open"
                                                : ""
                                        }`}
                                    >
                                        <button onClick={handleWellPropagation}>
                                            {showPlate ? "Done!" : "Fill wells"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="workspace-container card">
                    <h2>Workspace</h2>
                    {message && <p className="message">{message}</p>}
                    {file && (
                        <div className="visualizer-container">
                            <h3>Current Data</h3>
                            <CSVVisualizer file={file} />
                        </div>
                    )}
                    {plate && showPlate && (
                        <div className="results">
                            <h3>Well Plate Layout</h3>
                            <Plate wells={plate} />
                        </div>
                    )}
                    {!file && !results && (
                        <div className="workspace-placeholder">
                            <p>
                                Upload a file and run optimization to see
                                results here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
