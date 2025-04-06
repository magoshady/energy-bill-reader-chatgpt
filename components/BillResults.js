import { useState, useEffect } from 'react';

export default function BillResults() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event) => {
      // Make sure the message is from your iframe domain
      if (event.data.type === 'billAnalysis') {
        setResults(event.data.result);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!results) {
    return null;
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      margin: '2rem 0'
    }}>
      <h2 style={{ 
        color: '#ffffff',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        Current Bill Analysis
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
            {results.dailyUsage ? `${results.dailyUsage} kWh` : 'Not found'}
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
            {results.dailyExport ? `${results.dailyExport} kWh` : 'Not found'}
          </p>
        </div>
      </div>
    </div>
  );
} 