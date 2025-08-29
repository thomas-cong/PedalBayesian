import { useState } from "react";
import "./App.css";

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState("");

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
        try {
            const response = await fetch("/api/optimize");
            const data = await response.json();
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
            <div className="card">
                <h2>Upload CSV</h2>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div className="card">
                <h2>Run Optimization</h2>
                <button onClick={handleOptimize}>Optimize</button>
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
