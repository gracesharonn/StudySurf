import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './ocr.css';

const OCRScanner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // You need to define navigate here

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8900/ocr/process-pdf/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPredictions(response.data.predictions);
    } catch (err) {
      setError("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocr-scanner">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <h1>OCR Scanner</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload and Process"}
      </button>
      {error && <p className="error-message">{error}</p>}
      <div>
        {predictions.length > 0 && (
          <>
            <h2>Predictions</h2>
            <ul>
              {predictions.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default OCRScanner;
