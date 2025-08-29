import { useState } from "react";
import "./App.css";
import CSVVisualizer from "./CSVVisualizer";

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState("");
    const [loading, setLoading] = useState(false);

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
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/optimize");
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                setResults(JSON.stringify(JSON.parse(data), null, 2));
                setMessage("Optimization successful!");
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="App">
            <h1>Bayesian Optimization</h1>
            <div className="main-container">
                <div className="controls-container">
                    <div className="card">
                        <h2>Upload CSV</h2>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                    <div className="card">
                        <h2>Run Optimization</h2>
                        <button onClick={handleOptimize} disabled={loading}>
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
                </div>
                {file && (
                    <div className="visualizer-container card">
                        <h2>Data</h2>
                        <CSVVisualizer file={file} />
                    </div>
                )}
            </div>
            {message && <p className="message">{message}</p>}
            {results && (
                <div className="results">
                    <h2>Results</h2>
                    <pre>{results}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
