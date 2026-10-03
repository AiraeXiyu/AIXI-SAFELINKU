"use client";

import { FormEvent, useState } from "react";

type BypassResponse = {
  ok?: boolean;
  url?: string;
  ms?: number;
  method?: string;
  needsManual?: boolean;
  code?: string;
  message?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<BypassResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!url.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch("/api/bypass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data: BypassResponse = await response.json();

      setResult(data);
    } catch {
      setResult({
        ok: false,
        code: "NETWORK",
        message: "Gagal menghubungi server. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result?.url) return;

    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard tidak tersedia
    }
  }

  function clearInput() {
    setUrl("");
    setResult(null);
    setCopied(false);
  }

  return (
    <main className="site-shell">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="hero">
        <div className="hero-image-wrap">
          <img
            src="/hero.jpg"
            alt="Aesthetic background"
            className="hero-image"
          />

          <div className="hero-image-overlay" />

          <div className="hero-badge">
            <span className="status-dot" />
            <span>ONLINE</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="eyebrow">
            <span>✦</span>
            <span>SMART LINK TOOL</span>
          </div>

          <h1>
            AIXI BYPASS
            <br />
            <span>SAFELINKU (SFL/SFILE).</span>
          </h1>

          <p className="hero-description">
            Paste your supported link below and get the destination URL
            quickly, cleanly, and without unnecessary steps.
          </p>
        </div>
      </section>

      <section className="tool-card">
        <div className="card-header">
          <div>
            <p className="card-label">DESTINATION URL</p>
            <h2>Enter your link</h2>
          </div>

          <div className="sparkle">✦</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`input-wrap ${loading ? "is-loading" : ""}`}>
            <span className="input-icon">⌁</span>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://sfl.gl/..."
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              required
            />

            {url && !loading && (
              <button
                type="button"
                className="clear-button"
                onClick={clearInput}
                aria-label="Clear"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            className="bypass-button"
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <>
                <span className="loader" />
                <span>PROCESSING</span>
              </>
            ) : (
              <>
                <span>BYPASS LINK</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="supported">
          <span className="check">✓</span>
          <span>Supported safelink detection</span>
        </div>
      </section>

      {result && (
        <section
          className={`result-card ${result.ok ? "success" : "error"}`}
        >
          {result.ok && result.url ? (
            <>
              <div className="result-top">
                <div className="result-icon success-icon">✓</div>

                <div>
                  <p className="result-label">SUCCESS</p>
                  <h3>Destination found</h3>
                </div>
              </div>

              <div className="result-url">{result.url}</div>

              <div className="result-actions">
                <button onClick={copyResult} className="copy-button">
                  {copied ? "✓ Copied" : "Copy URL"}
                </button>

                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-button"
                >
                  Open →
                </a>
              </div>

              {(result.ms !== undefined || result.method) && (
                <div className="result-meta">
                  {result.ms !== undefined && (
                    <span>{result.ms} ms</span>
                  )}

                  {result.method && (
                    <span>{result.method}</span>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="result-top">
                <div className="result-icon error-icon">!</div>

                <div>
                  <p className="result-label">REQUEST FAILED</p>
                  <h3>{result.code || "Unable to process"}</h3>
                </div>
              </div>

              <p className="error-message">
                {result.message || "The link could not be processed."}
              </p>
            </>
          )}
        </section>
      )}

      <footer>
        <div className="footer-line" />

        <div className="footer-content">
          <span>AIXI SAFELINKU</span>
          <span>•</span>
          <span>LINK UTILITY</span>
        </div>
      </footer>
    </main>
  );
}
