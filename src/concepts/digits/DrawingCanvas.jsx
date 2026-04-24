import { useRef, useEffect, useState, useCallback } from "react";

export default function DrawingCanvas({ onResult, onClear }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 220, 220);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, []);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 220, 220);
    onClear();
    setError(null);
  };

  const classify = async () => {
    setLoading(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL("image/png");
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataURL }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError("Could not reach the classifier. Make sure the Flask server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="digit-canvas-wrap">
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        className="digit-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className="digit-canvas-hint">Draw a digit 0–9</div>
      {error && <div className="digit-error">{error}</div>}
      <div className="digit-canvas-actions">
        <button className="btn btn--ghost btn--sm" onClick={clearCanvas}>Clear</button>
        <button className="btn btn--primary" onClick={classify} disabled={loading}>
          {loading ? "Classifying…" : "Classify →"}
        </button>
      </div>
    </div>
  );
}
