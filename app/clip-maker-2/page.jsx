'use client'
import React, { useState } from 'react';

export default function ClipMaker2() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
      setDownloadUrl(null); // reset previous download
    }
  };

  const handleMergeAndDownload = async () => {
    if (!videoFile) return;
    setIsMerging(true);
    setDownloadUrl(null);

    try {
      // Read file as base64
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

      const base64Video = await toBase64(videoFile);

      // Send as JSON to /generate2 endpoint
      const response = await fetch('https://strand-utils-backend-zgdz.onrender.com/generate2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video: base64Video }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      setDownloadUrl(data.url);
    } catch (error) {
      alert(`Failed to process video: ${error.message}`);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
        padding: '2rem 0',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .card {
          box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04);
          transition: box-shadow 0.2s;
        }
        .card:hover {
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12), 0 2px 8px 0 rgba(0,0,0,0.06);
        }
        .primary-btn {
          background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(99,102,241,0.08);
          transition: background 0.2s, transform 0.1s;
        }
        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .primary-btn:not(:disabled):hover {
          background: linear-gradient(90deg, #4f46e5 0%, #0ea5e9 100%);
          transform: translateY(-2px) scale(1.03);
        }
        .download-link {
          margin-top: 1rem;
          display: inline-block;
          background: #fff;
          color: #6366f1;
          border: 1.5px solid #6366f1;
          border-radius: 6px;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 1px 4px rgba(99,102,241,0.07);
          transition: background 0.2s, color 0.2s;
        }
        .download-link:hover {
          background: #6366f1;
          color: #fff;
        }
        @media (max-width: 900px) {
          .main-flex {
            flex-direction: column;
            gap: 2.5rem;
          }
        }
      `}</style>
      <div
        className="main-flex"
        style={{
          display: 'flex',
          minHeight: '80vh',
          gap: '2.5rem',
          alignItems: 'flex-start',
          justifyContent: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Left: Video Upload */}
        <div
          className="card"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            background: '#f8fafc',
            minWidth: 0,
            minHeight: '420px',
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: '1.6rem', color: '#3730a3', marginBottom: '1.5rem' }}>
            Upload a Video
          </h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            style={{
              marginBottom: '1.2rem',
              fontSize: '1rem',
              border: '1.5px solid #d1d5db',
              borderRadius: '6px',
              padding: '0.5rem',
              background: '#fff',
              width: '100%',
              maxWidth: '320px',
              cursor: 'pointer',
            }}
          />
          {videoURL && (
            <video
              src={videoURL}
              controls
              style={{
                marginTop: '1rem',
                maxWidth: '100%',
                maxHeight: '180px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                background: '#000',
              }}
            />
          )}
          {videoFile && (
            <button
              className="primary-btn"
              style={{ marginTop: '1.7rem', width: '100%', maxWidth: '260px' }}
              onClick={handleMergeAndDownload}
              disabled={isMerging}
            >
              {isMerging ? 'Processing...' : 'Download Sequence'}
            </button>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="merged_video.mp4"
              className="download-link"
            >
              Download Merged Video
            </a>
          )}
        </div>
        {/* Right: Mockup */}
        <div
          className="card"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            background: '#f1f5f9',
            minWidth: 0,
            minHeight: '420px',
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: '1.6rem', color: '#0e7490', marginBottom: '1.5rem' }}>
            Mockup Preview
          </h2>
          <div
            style={{
              width: '100%',
              height: '300px',
              background: 'linear-gradient(120deg, #e0e7ff 60%, #f0fdfa 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '1.5rem',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
            }}
          >
            {isMerging ? (
              // Simple loading spinner
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  border: '6px solid #f3f3f3',
                  borderTop: '6px solid #06b6d4',
                  borderRadius: '50%',
                  width: '54px',
                  height: '54px',
                  animation: 'spin 1s linear infinite'
                }} />
                <div style={{ marginTop: '1.2rem', color: '#06b6d4', fontWeight: 600, fontSize: '1.1rem' }}>Processing...</div>
              </div>
            ) : downloadUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <video
                  src={downloadUrl}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    borderRadius: '8px',
                    background: '#000',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                />
                <a
                  href={downloadUrl}
                  download="merged_video.mp4"
                  className="download-link"
                  style={{ marginTop: '1.2rem' }}
                >
                  Download Merged Video
                </a>
              </div>
            ) : (
              <div style={{ width: '100%', textAlign: 'center', color: '#64748b', fontWeight: 500 }}>
                <span style={{ fontSize: '2.2rem', opacity: 0.18 }}>🎬</span>
                <div style={{ marginTop: '1.2rem', fontSize: '1.1rem' }}>
                  Your processed video preview will appear here.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer style={{
        marginTop: '3rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '1rem',
        opacity: 0.85,
        letterSpacing: '0.01em'
      }}>
        Made with <span style={{ color: '#6366f1', fontWeight: 600 }}>Strand Util Tools</span> &middot; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
