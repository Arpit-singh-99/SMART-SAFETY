import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={styles.wrap}>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={styles.input} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={styles.input} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={styles.input} />
        {error && <p style={{ color: "#ff3b30" }}>{error}</p>}
        <button type="submit" style={styles.btn}>Sign up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}

const styles = {
  wrap: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", background: "#0b0d12", gap: 12 },
  form: { display: "flex", flexDirection: "column", gap: 10, width: 260 },
  input: { padding: 12, borderRadius: 8, border: "1px solid #1e2230", background: "#151822", color: "#fff" },
  btn: { padding: 12, borderRadius: 8, border: "none", background: "#ff3b30", color: "#fff", fontWeight: 700 },
};
