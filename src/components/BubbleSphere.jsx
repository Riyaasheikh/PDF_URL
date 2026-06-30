import React, { useRef, useEffect } from 'react';

const BubbleSphere = ({ size = 500 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Generate sphere bubbles
    const R = size * 0.36;
    const cx = size / 2;
    const cy = size / 2;
    const bubbles = [];
    const rows = 18;

    for (let row = 0; row <= rows; row++) {
      const phi = (Math.PI * row) / rows;
      const y = -Math.cos(phi);
      const ringR = Math.sqrt(1 - y * y);
      const circumference = 2 * Math.PI * ringR;
      const count = Math.max(1, Math.round(circumference * 9.5));

      for (let i = 0; i < count; i++) {
        const theta = (2 * Math.PI * i) / count;
        const x = ringR * Math.cos(theta);
        const z = ringR * Math.sin(theta);
        bubbles.push({
          nx: x, ny: y, nz: z,
          baseR: (size * 0.022) * (0.7 + Math.random() * 0.6),
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6,
        });
      }
    }

    let rotX = -0.25;
    let rotY = 0;

    const draw = (timestamp) => {
      timeRef.current = timestamp * 0.001;
      ctx.clearRect(0, 0, size, size);
      rotY += 0.003;
      const projected = bubbles.map((b) => {
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        let x1 = b.nx * cosY - b.nz * sinY;
        let z1 = b.nx * sinY + b.nz * cosY;
        let y1 = b.ny * cosX - z1 * sinX;
        let z2 = b.ny * sinX + z1 * cosX;

        const depth = (z2 + 1) / 2; 
        const pulse = 1 + 0.08 * Math.sin(timeRef.current * b.speed + b.phase);
        const r = b.baseR * (0.4 + depth * 0.7) * pulse;
        const px = cx + x1 * R;
        const py = cy + y1 * R;

        const brightness = Math.round(30 + depth * 70);
        const alpha = 0.15 + depth * 0.75;

        return { px, py, r, depth, brightness, alpha };
      });

      projected.sort((a, b) => a.depth - b.depth);

      projected.forEach(({ px, py, r, depth, brightness, alpha }) => {
        const grad = ctx.createRadialGradient(
          px - r * 0.3, py - r * 0.3, r * 0.05,
          px, py, r
        );
        grad.addColorStop(0, `rgba(${brightness + 60}, ${brightness + 80}, ${brightness + 70}, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(0, ${brightness + 80}, ${brightness + 60}, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(0, ${brightness * 0.6}, ${brightness * 0.5}, ${alpha * 0.1})`);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        if (depth > 0.6) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 217, 181, ${(depth - 0.6) * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        if (depth > 0.5) {
          const sg = ctx.createRadialGradient(
            px - r * 0.35, py - r * 0.35, 0,
            px - r * 0.3, py - r * 0.3, r * 0.4
          );
          sg.addColorStop(0, `rgba(255, 255, 255, ${(depth - 0.5) * 0.6})`);
          sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.beginPath();
          ctx.arc(px - r * 0.3, py - r * 0.3, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = sg;
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="opacity-90"
    />
  );
};

export default BubbleSphere;