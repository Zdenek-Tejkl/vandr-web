import qrcode from "qrcode-generator";

// QR kód jako SVG (kreslí se na serveru, žádný skript v prohlížeči).
export function Qr({ value, size = 148, label }: { value: string; size?: number; label: string }) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 2;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
  const box = n + quiet * 2;
  return (
    <svg className="qr" width={size} height={size} viewBox={`0 0 ${box} ${box}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={box} height={box} fill="#fff" />
      <path d={d} fill="#1c1e1a" />
    </svg>
  );
}
