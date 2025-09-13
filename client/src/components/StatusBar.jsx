import { useEffect, useState } from "react";

export default function StatusBar() {
  const [status, setStatus] = useState({ ok: false, msg: "Checking..." });
  const [auth, setAuth] = useState("unknown");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/health", { credentials: "include" });
        if (res.ok) {
          await res.json();
          setStatus({ ok: true, msg: "API healthy" });
        } else {
          setStatus({ ok: false, msg: `API error ${res.status}` });
        }
      } catch {
        setStatus({ ok: false, msg: "API unreachable" });
      }

      try {
        const r = await fetch("/api/notes", { credentials: "include" });
        setAuth(r.status === 401 ? "no auth" : "auth cookie present");
      } catch {
        setAuth("unknown");
      }
    })();
  }, []);

  return (
    <div style={{
      padding: "6px 10px",
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 12,
      display: "flex",
      gap: 12,
      alignItems: "center",
      background: status.ok ? "rgba(0,200,0,.08)" : "rgba(200,0,0,.08)",
      border: `1px solid ${status.ok ? "rgba(0,200,0,.4)" : "rgba(200,0,0,.4)"}`
    }}>
      <strong>Status:</strong>
      <span>{status.msg}</span>
      <span style={{ opacity: .7 }}>|</span>
      <span>Auth: {auth}</span>
      <span style={{ marginLeft: "auto", opacity: .7 }}>Proxy → /api → :5000</span>
    </div>
  );
}
