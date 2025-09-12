import { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [err,setErr]=useState(""); const nav=useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try { await register(email, password); nav("/"); }
    catch (e) { setErr(e?.response?.data?.error || "Registration failed"); }
  };

  return (
    <form onSubmit={submit} style={{ display:"grid", gap:8, maxWidth: 400 }}>
      <h2>Register</h2>
      {err && <div style={{ color:"red" }}>{err}</div>}
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Create account</button>
    </form>
  );
}
