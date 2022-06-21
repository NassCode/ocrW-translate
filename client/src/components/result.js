export default function ResultPage({ text, goback, isLoading }) {
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <button onClick={goback}>new translation</button>

          <pre>{text.msg}</pre>
          <h2>Original text:</h2>
          <pre>{text.detections}</pre>
          <h2>Translated text:</h2>
          <pre>{text.translations}</pre>
        </div>
      )}
    </div>
  );
}
