import { useState, useEffect } from 'react';

export default function Calculator() {
  const [billData, setBillData] = useState(null);
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('billAnalysis');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setBillData(parsedData);
      
      // Example calculation: Calculate the net daily energy (usage - export)
      if (parsedData.dailyUsage && parsedData.dailyExport) {
        const netDailyEnergy = parsedData.dailyUsage - parsedData.dailyExport;
        setCalculation({
          netDailyEnergy: netDailyEnergy.toFixed(2),
          percentageExport: ((parsedData.dailyExport / parsedData.dailyUsage) * 100).toFixed(1)
        });
      }
    }
  }, []);

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
        Energy Calculator
      </h1>

      {billData ? (
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
            Your Energy Analysis
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
                Net Daily Energy
              </h3>
              <p style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {calculation?.netDailyEnergy} kWh
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
                Export Percentage
              </h3>
              <p style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {calculation?.percentageExport}%
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              color: '#ffffff', 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              Original Data
            </h3>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#333333',
              borderRadius: '8px',
              color: '#ffffff'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>Daily Usage: {billData.dailyUsage} kWh</p>
              <p style={{ marginBottom: '0.5rem' }}>Daily Export: {billData.dailyExport} kWh</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            No bill data found. Please analyze a bill first.
          </p>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#CBF7DA',
              color: '#000000',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
          >
            Go to Bill Analyzer
          </a>
        </div>
      )}
    </main>
  );
} 