export const description = "Docs homepage migration row: copy and links beside a painted migration drawing"

// The homepage's closing row, styled by styles/docs-home.css. The copy sits on
// the page; the drawing sits on its own painting, as the website's split rows
// do. The drawing shows a migration finishing: what the migrator moves (pages,
// sidebar, images, redirects, per migrations/overview) with invented numbers,
// and the preview a reader checks before going live.
export const DocsHomeMigrate = () => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/docs") ? "/docs" : ""

  const Icon = ({ d, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((path) => <path key={path} d={path} />)}
    </svg>
  )
  const arrowRight = ["M5 12h14", "m12 5 7 7-7 7"]
  const check = ["M20 6 9 17l-5-5"]

  const platforms = [
    ["Mintlify", "/migrations/mintlify"],
    ["GitBook", "/migrations/gitbook"],
    ["ReadMe", "/migrations/readme"],
    ["Document360", "/migrations/document360"],
    ["Docusaurus, Nextra, Fern", "/migrations/docusaurus"],
    ["Any other platform", "/migrations/markdown"],
  ]
  const moved = [
    ["Pages", "142 copied"],
    ["Sidebar", "6 groups rebuilt"],
    ["Images and files", "38 in media library"],
    ["Redirects", "4 added"],
  ]

  return (
    <div className="dh-split">
      <div className="dh-split-copy">
        <div className="dh-eyebrow">Migration</div>
        <h2>Moving from another platform?</h2>
        <p className="dh-deck">
          The migrator copies your pages word for word, rebuilds your sidebar, and moves your images into
          the media library. You check a preview before anything goes live.
        </p>
        <ul className="dh-links">
          {platforms.map(([name, path]) => (
            <li key={path}>
              <a href={base + path}>
                <Icon d={arrowRight} />
                {name}
              </a>
            </li>
          ))}
        </ul>
        <a className="dh-explore" href={`${base}/migrations/overview`}>
          Read the migration guide
          <Icon d={arrowRight} />
        </a>
      </div>

      <div className="dh-painting dh-painting-headland">
        <div className="dh-stage dh-stage-migrate" aria-hidden="true">
          <div className="dh-glass dh-migrate">
            <div className="dh-face">
              <div className="dh-window-head">
                <span className="dh-lights"><i /><i /><i /></span>
                <span className="dh-window-title">Migrating from Mintlify</span>
              </div>
              <div className="dh-rows">
                {moved.map(([part, result]) => (
                  <div className="dh-row" key={part}>
                    <span>{part}</span>
                    <span className="dh-row-result">
                      {result}
                      <Icon d={check} className="dh-check" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dh-glass dh-glass-sm dh-preview">
            <div className="dh-face">
              <div className="dh-preview-status">
                <i className="dh-live" />
                Preview ready
              </div>
              <div className="dh-preview-url">acme-migration.documentation.ai</div>
              <div className="dh-preview-actions">
                <span className="dh-chip">Changes</span>
                <span className="dh-chip dh-chip-on">Review</span>
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
