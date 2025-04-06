import { useState, useEffect } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load any previously saved result
  useEffect(() => {
    const savedResult = localStorage.getItem('billAnalysis');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

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
      
      // Store the result in localStorage with a specific key that the main website can read
      const resultToStore = {
        dailyUsage: data.result.dailyUsage,
        dailyExport: data.result.dailyExport,
        timestamp: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('billAnalysis', JSON.stringify(resultToStore));
      console.log('Stored results in localStorage:', resultToStore);
      
      // Also store in sessionStorage as a backup
      sessionStorage.setItem('billAnalysis', JSON.stringify(resultToStore));
      console.log('Stored results in sessionStorage:', resultToStore);
      
      setResult(resultToStore);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      padding: '2rem', 
      fontFamily: 'sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#000000',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <h1 style={{ 
        color: '#ffffff',
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: 'bold'
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
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="pdf" style={{ 
            fontWeight: 'bold',
            color: '#ffffff',
            fontSize: '1.1rem'
          }}>
            Upload Your Electricity Bill (PDF)
          </label>
          <input 
            type="file" 
            name="pdf" 
            id="pdf"
            accept=".pdf" 
            required 
            style={{
              padding: '0.75rem',
              border: '2px solid #333',
              borderRadius: '4px',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              fontSize: '1rem'
            }}
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#CBF7DA',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Processing...' : 'Analyze Bill'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#ff4444',
          color: '#ffffff',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ 
            color: '#ffffff',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Bill Analysis Results
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#333333',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                color: '#CBF7DA', 
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Average Daily Usage
              </h3>
              <p style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {result.dailyUsage ? `${result.dailyUsage} kWh` : 'Not found'}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#333333',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                color: '#CBF7DA', 
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Average Daily Export
              </h3>
              <p style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {result.dailyExport ? `${result.dailyExport} kWh` : 'Not found'}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
