export const description = "Docs homepage hero: the actions and the painted Ask AI tile under the title"

// The homepage's hero, under the title and description the page's frontmatter
// renders. Its root carries `dh-home`, which styles/docs-home.css uses to
// scope every homepage rule to this page; remove the import and the page falls
// back to the theme alone.
//
// The Ask AI window is a drawing, not the assistant: it shows the idea that
// these docs answer questions, with invented reader input and real page names.
// The "Ask AI" button opens the real assistant from the navbar.
export const DocsHome = () => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/docs") ? "/docs" : ""
  const openAskAi = () => {
    const button = document.querySelector(".dai-ask-ai-button")
    if (button) button.click()
  }

  const Icon = ({ d, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((path) => <path key={path} d={path} />)}
    </svg>
  )
  const sparkles = ["M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"]
  const fileText = ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8"]
  const arrowRight = ["M5 12h14", "m12 5 7 7-7 7"]

  return (
    <div className="dh-home">
      <div className="dh-actions">
        <a className="dh-btn dh-btn-primary" href={`${base}/getting-started/quickstart`}>
          Start the quickstart
          <Icon d={arrowRight} className="dh-btn-icon" />
        </a>
        <button type="button" className="dh-btn dh-btn-soft" onClick={openAskAi}>
          <Icon d={sparkles} className="dh-btn-icon" />
          Ask AI
        </button>
      </div>

      <div className="dh-painting dh-painting-tidepools">
        <div className="dh-stage dh-stage-ask" aria-hidden="true">
          <div className="dh-glass dh-ask">
            <div className="dh-face">
              <div className="dh-window-head">
                <span className="dh-lights"><i /><i /><i /></span>
                <span className="dh-window-title">Ask AI</span>
              </div>
              <div className="dh-ask-body">
                <div className="dh-question">How do I serve our docs at acme.com/docs?</div>
                <div className="dh-answer">
                  <span className="dh-answer-mark"><Icon d={sparkles} className="dh-icon-coral" /></span>
                  <div>
                    <p>
                      Use a custom subpath. A reverse proxy on acme.com forwards <code>/docs</code> to your
                      Documentation.AI site, so readers never leave your domain.
                    </p>
                    <p>There are step-by-step guides for Vercel, Cloudflare, and AWS.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dh-glass dh-glass-sm dh-sources">
            <div className="dh-face">
              <div className="dh-label">Sources</div>
              <div className="dh-source dh-source-on">
                <Icon d={fileText} />
                <span>
                  <b>Custom Subpath Setup</b>
                  <em>customize/custom-subpath</em>
                </span>
              </div>
              <div className="dh-source">
                <Icon d={fileText} />
                <span>
                  <b>Vercel</b>
                  <em>custom-subpath/vercel</em>
                </span>
              </div>
              <svg className="dh-cursor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.04 2.88a.75.75 0 0 1 .98-.98l15.5 6.5a.75.75 0 0 1-.06 1.4l-6.03 1.9-1.9 6.03a.75.75 0 0 1-1.4.06z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
