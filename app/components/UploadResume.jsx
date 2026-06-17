"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadResume() {
  const router = useRouter();
  
  // State variables upload ane analysis process mate
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); // 'Uploading...' or 'Analyzing...'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // File select kare tyare aa chale
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check kariye ke PDF ke DOCX chhe ke nahi
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.docx')) {
        setError("Only PDF and DOCX files are allowed!");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  // Upload button dabave tyare aa chale
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setLoadingStep('Uploading & Extracting text...');
    setError('');
    setSuccess('');

    // FormData banavi rahya chhiye kem ke file send karvi chhe
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: Upload and get raw text saved
      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.message);
        setLoading(false);
        return;
      }

      // Step 2: Automatically trigger AI Analysis using the new resumeId
      setLoadingStep('AI is analyzing your resume...');
      const analyzeRes = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: uploadData.resumeId })
      });

      const analyzeData = await analyzeRes.json();

      if (analyzeRes.ok) {
        setSuccess("Resume uploaded and fully analyzed by AI!");
        setFile(null); // Reset file input
        
        // Report page par mokli devu, jethi user direct analysis joi shake
        setTimeout(() => {
          router.push('/reports/' + analyzeData.reportId);
        }, 2000);
      } else {
        setError(analyzeData.message || "Failed to analyze resume.");
      }

    } catch (err) {
      setError("Network error occurred. Try again.");
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-sm text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
      <p className="text-gray-400 mb-6">Upload your PDF or Word document to get AI feedback.</p>

      {/* Error ane Success messages dekhaadva mate */}
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4">{success}</div>}

      <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 mb-6 hover:border-blue-500 transition-colors bg-gray-900/50">
        <input 
          type="file" 
          id="resume-upload" 
          className="hidden" 
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="resume-upload" 
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <span className="text-blue-400 font-medium text-lg">{file.name}</span>
          ) : (
            <span className="text-gray-300 font-medium text-lg">Click to select a file</span>
          )}
          <span className="text-gray-500 text-sm mt-1">Supported formats: PDF, DOCX (Max 5MB)</span>
        </label>
      </div>

      <button 
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
          !file || loading 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingStep}
          </span>
        ) : 'Analyze My Resume'}
      </button>
    </div>
  );
}
