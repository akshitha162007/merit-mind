import { useState, useEffect } from 'react';
import { submitResumeText, submitResumePdf, submitResumeImage, getCandidateResumeStatus } from '../api/resumeApi';

export default function ResumeSubmission({ candidate_id }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingResume, setExistingResume] = useState(false);

  useEffect(() => {
    checkExistingResume();
  }, [candidate_id]);

  const checkExistingResume = async () => {
    try {
      const data = await getCandidateResumeStatus(candidate_id);
      if (data.has_resume) {
        setExistingResume(true);
      }
    } catch (err) {
      console.error('Error checking resume:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setSelectedFile(file);
    setError('');

    if (activeTab === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      setSelectedFile(file);
      setError('');

      if (activeTab === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmitText = async () => {
    if (!textInput.trim()) {
      setError('Please enter resume text');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitResumeText(candidate_id, textInput);
      setSuccess(true);
      setTextInput('');
      checkExistingResume();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Upload failed. Please check your file and try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPdf = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitResumePdf(candidate_id, selectedFile);
      setSuccess(true);
      setSelectedFile(null);
      checkExistingResume();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Upload failed. Please check your file and try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitResumeImage(candidate_id, selectedFile);
      setSuccess(true);
      setSelectedFile(null);
      setImagePreview(null);
      checkExistingResume();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Upload failed. Please check your file and try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px', marginTop: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Submit Your Resume
        </h3>
        <p className="text-secondary" style={{ marginBottom: '16px' }}>
          Choose how you would like to submit your resume
        </p>
        {existingResume && (
          <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#86efac', fontSize: '0.875rem' }}>
            You have already submitted a resume. Submitting again will replace your existing resume.
          </div>
        )}
      </div>

      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {['text', 'pdf', 'image'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedFile(null);
              setImagePreview(null);
              setError('');
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: activeTab === tab ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              background: activeTab === tab ? 'linear-gradient(135deg, #7B2FFF, #E91E8C)' : 'transparent',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab === 'text' ? 'Text' : tab === 'pdf' ? 'PDF Document' : 'Image / Scan'}
          </button>
        ))}
      </div>

      {/* Input Panel */}
      {activeTab === 'text' && (
        <div style={{ marginBottom: '24px' }}>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your resume content here..."
            style={{
              width: '100%',
              minHeight: '240px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#B8A9D9' }}>
            {textInput.length} characters
          </div>
        </div>
      )}

      {(activeTab === 'pdf' || activeTab === 'image') && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-input-${activeTab}`).click()}
          style={{
            padding: '48px 24px',
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.3s ease',
            marginBottom: '24px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <input
            id={`file-input-${activeTab}`}
            type="file"
            accept={activeTab === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png'}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <p style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>
            {activeTab === 'pdf'
              ? 'Drag and drop your PDF here, or click to browse'
              : 'Upload a scanned image of your resume'}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {activeTab === 'pdf' ? 'PDF files only' : 'JPG or PNG files only'}
          </p>
          {selectedFile && (
            <p style={{ marginTop: '12px', color: '#86efac', fontSize: '0.875rem' }}>
              Selected: {selectedFile.name}
            </p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ marginTop: '16px', maxHeight: '200px', borderRadius: '8px' }}
            />
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', marginBottom: '24px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={
          activeTab === 'text'
            ? handleSubmitText
            : activeTab === 'pdf'
            ? handleSubmitPdf
            : handleSubmitImage
        }
        disabled={loading}
        style={{
          padding: '12px 32px',
          borderRadius: '8px',
          border: 'none',
          background: loading ? 'rgba(123, 47, 255, 0.5)' : 'linear-gradient(135deg, #7B2FFF, #E91E8C)',
          color: 'white',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {loading && (
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }}
          />
        )}
        {activeTab === 'text'
          ? 'Extract and Save Resume'
          : activeTab === 'pdf'
          ? 'Upload and Extract'
          : 'Scan and Extract'}
      </button>

      {/* Success Banner - Simple message only */}
      {success && (
        <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#86efac', fontSize: '0.875rem' }}>
          Resume submitted successfully. Your recruiter will review your application.
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
