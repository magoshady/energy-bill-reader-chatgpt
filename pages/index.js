import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process the PDF');
      }
      
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractValue = (text, label) => {
    const regex = new RegExp(`${label}[\\s:]+([\\d.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1] : 'Not found';
  };

  return (
    <main style={{ 
      padding: '2rem', 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#333',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Electricity Bill Analyzer
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pdf" style={{ fontWeight: 'bold' }}>
            Upload Your Electricity Bill (PDF)
          </label>
          <input 
            type="file" 
            name="pdf" 
            id="pdf"
            accept=".pdf" 
            required 
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Processing...' : 'Analyze Bill'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            color: '#333',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Bill Analysis Results
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                Average Daily Usage
              </h3>
              <p style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                {extractValue(result.content[0].text.value, 'average daily usage')} kWh
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                Average Daily Export
              </h3>
              <p style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                {extractValue(result.content[0].text.value, 'average daily export')} kWh
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
