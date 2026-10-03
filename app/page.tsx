"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setResult("");
    setError("");

    try {
      const response = await fetch("/api/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.ok && data.url) {
        setResult(data.url);
      } else {
        setError(data.message || data.code || "Request gagal.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>SafeBypass Test</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Masukkan URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Bypass"}
        </button>
      </form>

      {result && (
        <div>
          <p>Result:</p>
          <a href={result} target="_blank" rel="noreferrer">
            {result}
          </a>
        </div>
      )}

      {error && (
        <div>
          <p>Error:</p>
          <pre>{error}</pre>
        </div>
      )}
    </main>
  );
}
