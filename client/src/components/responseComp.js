

export default function responseComp(text) {
  return (
    <div>
      <pre>{text.text.detections}</pre>

      <pre>{text.text.translations}</pre>
    </div>
  );
}
