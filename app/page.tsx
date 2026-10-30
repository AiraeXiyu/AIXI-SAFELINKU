"use client";

import { FormEvent, useEffect, useState } from "react";

type BypassResponse = {
  success?: boolean;
  slug?: string;
  url?: string;
  error?: string;
};

const loadingSteps = [
  "Memvalidasi tautan",
  "Menghubungkan ke XIYU API",
  "Memproses safelink",
  "Menyiapkan destination URL",
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

    const inputUrl = url.trim();

    if (!inputUrl || loading) return;

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
          url: inputUrl,
        }),
      });

      const text = await response.text();

      let data: BypassResponse;

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          success: false,
          error: "Server mengembalikan response yang tidak valid.",
        };
      }

      setResult(data);
    } catch {
      setResult({
        success: false,
        error: "Gagal menghubungi server. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    const destination = result?.url;

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

  const destinationUrl = result?.url;

  return (
    <main className="site-shell">
      {/* BACKGROUND */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* HERO */}
      <section className="hero">
        <div className="hero-image-wrap">
          <img
            src="/hero.jpg"
            alt="XIYU Safelinku"
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
            <span>XIYU LINK TOOL</span>
          </div>

          <h1>
            XIYU API
            <br />
            <span>SAFELINKU (SFL/SFILE).</span>
          </h1>

          <p className="hero-description">
            Masukkan link SFL / Safelinku yang didukung untuk
            mendapatkan destination URL dengan proses yang cepat
            dan simpel.
          </p>
        </div>
      </section>

      {/* INPUT CARD */}
      <section className="tool-card">
        <div className="card-header">
          <div>
            <p className="card-label">
              RESOLVE LINK SFL / SAFELINKU
            </p>

            <h2>Masukkan link kamu</h2>
          </div>

          <div className="sparkle">✦</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`input-wrap ${
              loading ? "is-loading" : ""
            }`}
          >
            <span className="input-icon">⌁</span>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://sfl.gl/example"
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
                <span>RESOLVE LINK</span>
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="supported">
          <span className="check">✓</span>
          <span>SFL / Safelinku detection aktif</span>
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
              <p className="processing-label">
                PLEASE WAIT
              </p>

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
                        <span className="dots">
                          ...
                        </span>
                      </small>
                    )}

                    {completed && (
                      <small>Selesai</small>
                    )}
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
            result.success ? "success" : "error"
          }`}
        >
          {result.success && destinationUrl ? (
            <>
              <div className="result-top">
                <div className="result-icon success-icon">
                  ✓
                </div>

                <div>
                  <p className="result-label">
                    RESOLVE BERHASIL
                  </p>

                  <h3>
                    Destination URL ditemukan
                  </h3>
                </div>
              </div>

              {result.slug && (
                <div className="result-meta">
                  <span>
                    Slug: {result.slug}
                  </span>

                  <span>✓ Success</span>
                </div>
              )}

              <div className="result-url">
                {destinationUrl}
              </div>

              <div className="result-actions">
                <button
                  type="button"
                  onClick={copyResult}
                  className="copy-button"
                >
                  {copied
                    ? "✓ Copied"
                    : "Copy URL"}
                </button>

                <a
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-button"
                >
                  Buka →
                </a>
              </div>
            </>
          ) : (
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

      {/* API INFORMATION */}
      <section className="tool-card">
        <div className="card-header">
          <div>
            <p className="card-label">
              XIYU API
            </p>

            <h2>API Information</h2>
          </div>

          <div className="sparkle">✦</div>
        </div>

        <div className="result-url">
          https://xiyu-safelinku-api.vercel.app
        </div>

        <div className="supported">
          <span className="check">✓</span>

          <span>
            GET /bypass?url=https://sfl.gl/example
          </span>
        </div>

        <div className="supported">
          <span className="check">✓</span>

          <span>
            GET /bypass?slug=example
          </span>
        </div>

        <div className="supported">
          <span className="check">✓</span>

          <span>
            GET /api/health
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-line" />

        <div className="footer-content">
          <span>XIYU API</span>
          <span>•</span>
          <span>SFL / SAFELINKU</span>
        </div>
      </footer>
    </main>
  );
}
