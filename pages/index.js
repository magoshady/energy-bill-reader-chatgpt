export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Upload Your Electricity Bill (PDF)</h1>
      <form
        method="POST"
        action="/api/upload"
        encType="multipart/form-data"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
      >
        <input type="file" name="pdf" accept=".pdf" required />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
