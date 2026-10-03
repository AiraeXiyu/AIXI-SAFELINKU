"use client";

import { FormEvent, useEffect, useState } from "react";

type BypassResponse = {
  status?: boolean;
  creator?: string;
  error?: string;
  runtime?: string;
  result?: {
    originalUrl?: string;
    destinationUrl?: string;
    message?: string;
  };
};

const loadingSteps = [
  "Memvalidasi tautan",
  "Menghubungkan ke server",
  "Memproses safelink",
  "Menyiapkan hasil",
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<BypassResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading) return;

    setLoadingStep(0);

    const timer1 = setTimeout(() => {
      setLoadingStep(1);
    }, 850);

    const timer2 = setTimeout(() => {
      setLoadingStep(2);
    }, 1800);

    const timer3 = setTimeout(() => {
      setLoadingStep(3);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [loading]);

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
        status: false,
        error: "Gagal menghubungi server. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    const destination = result?.result?.destinationUrl;

    if (!destination) return;

    try {
      await navigator.clipboard.writeText(destination);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function clearInput() {
    if (loading) return;

    setUrl("");
    setResult(null);
    setCopied(false);
  }

  const destinationUrl = result?.result?.destinationUrl;

  return (
    <main className="site-shell">
      {/* Background */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* HERO */}
      <section className="hero">
        <div className="hero-image-wrap">
          <img
            src="/hero.jpg"
            alt="AIXI Safelinku"
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
            Masukkan link safelink yang didukung untuk mendapatkan
            destination URL dengan proses yang cepat dan simpel.
          </p>
        </div>
      </section>

      {/* INPUT CARD */}
      <section className="tool-card">
        <div className="card-header">
          <div>
            <p className="card-label">DESTINATION URL</p>

            <h2>Masukkan link kamu</h2>
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
                aria-label="Clear URL"
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
                <span>MEMPROSES LINK</span>
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
          <span>Safelink detection aktif</span>
        </div>
      </section>

      {/* PROCESSING */}
      {loading && (
        <section className="processing-card">
          <div className="processing-header">
            <div className="processing-spinner">
              <span />
            </div>

            <div>
              <p className="processing-label">PLEASE WAIT</p>

              <h3>Memproses tautan</h3>
            </div>
          </div>

          <div className="processing-line" />

          <div className="processing-steps">
            {loadingSteps.map((step, index) => {
              const completed = index < loadingStep;
              const active = index === loadingStep;

              return (
                <div
                  key={step}
                  className={`processing-step ${
                    completed ? "completed" : ""
                  } ${active ? "active" : ""}`}
                >
                  <div className="step-icon">
                    {completed ? (
                      "✓"
                    ) : active ? (
                      <span className="mini-spinner" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="step-text">
                    <span>{step}</span>

                    {active && (
                      <small>
                        Sedang berlangsung
                        <span className="dots">...</span>
                      </small>
                    )}

                    {completed && <small>Selesai</small>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="processing-note">
            Jangan tutup halaman selama proses berlangsung.
          </div>
        </section>
      )}

      {/* RESULT */}
      {!loading && result && (
        <section
          className={`result-card ${
            result.status ? "success" : "error"
          }`}
        >
          {/* SUCCESS */}
          {result.status && destinationUrl ? (
            <>
              <div className="result-top">
                <div className="result-icon success-icon">
                  ✓
                </div>

                <div>
                  <p className="result-label">
                    BYPASS BERHASIL
                  </p>

                  <h3>Destination URL ditemukan</h3>
                </div>
              </div>

              <div className="result-url">
                {destinationUrl}
              </div>

              <div className="result-actions">
                {/* COPY */}
                <button
                  type="button"
                  onClick={copyResult}
                  className="copy-button"
                >
                  {copied ? "✓ Copied" : "Copy URL"}
                </button>

                {/* OPEN */}
                <a
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-button"
                >
                  Buka →
                </a>
              </div>

              {result.runtime && (
                <div className="result-meta">
                  <span>
                    Runtime {result.runtime}
                  </span>

                  <span>
                    ✓ Success
                  </span>
                </div>
              )}
            </>
          ) : (
            /* ERROR */
            <>
              <div className="result-top">
                <div className="result-icon error-icon">
                  !
                </div>

                <div>
                  <p className="result-label">
                    PROSES GAGAL
                  </p>

                  <h3>
                    Tautan tidak dapat diproses
                  </h3>
                </div>
              </div>

              <p className="error-message">
                {result.error ||
                  "Terjadi kesalahan saat memproses tautan."}
              </p>
            </>
          )}
        </section>
      )}

      {/* FOOTER */}
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
