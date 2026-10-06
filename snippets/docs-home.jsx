export const description = "Docs homepage Start here row: three numbered steps, each a drawn window on a painting"

// The homepage's "Start here" row, under the h2 the page itself writes. Its
// root carries `dh-home`, which styles/docs-home.css uses to scope every
// homepage rule to this page; remove the import and the page falls back to the
// theme alone.
//
// Three steps, each on a painting in the order of a day (sunrise, full day,
// sunset), as the website homepage's AI Documentation Agent steps are. The
// copy sits on the page below each painting, never on it. The windows are
// drawings with invented names (Acme), showing what each step leaves you with.
export const DocsHome = () => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/docs") ? "/docs" : ""

  const Icon = ({ d, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((path) => <path key={path} d={path} />)}
    </svg>
  )
  const arrowRight = ["M5 12h14", "m12 5 7 7-7 7"]
  const check = ["M20 6 9 17l-5-5"]
  const lock = ["M7 11V7a5 5 0 0 1 10 0v4", "M5 11h14v10H5z"]
  const branch = ["M6 3v12", "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 9a9 9 0 0 1-9 9"]
  const fileText = ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4"]

  const Cursor = () => (
    <svg className="dh-cursor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.04 2.88a.75.75 0 0 1 .98-.98l15.5 6.5a.75.75 0 0 1-.06 1.4l-6.03 1.9-1.9 6.03a.75.75 0 0 1-1.4.06z" />
    </svg>
  )

  // A new project, named and about to be created.
  const CreateScene = () => (
    <>
      <div className="dh-window-head">
        <span className="dh-lights"><i /><i /><i /></span>
        <span className="dh-window-title">New project</span>
      </div>
      <div className="dh-scene">
        <div className="dh-field">
          <span className="dh-field-label">Name</span>
          <span className="dh-field-value">Acme Docs</span>
        </div>
        <div className="dh-field">
          <span className="dh-field-label">Start from</span>
          <span className="dh-field-value">Template</span>
        </div>
        <span className="dh-scene-btn">Create site</span>
        <Cursor />
      </div>
    </>
  )

  // The model: a branch, a navigation tab, and the pages in it.
  const ModelScene = () => (
    <>
      <div className="dh-window-head">
        <span className="dh-lights"><i /><i /><i /></span>
        <span className="dh-window-title">Acme Docs</span>
      </div>
      <div className="dh-scene">
        <div className="dh-scene-bar">
          <span className="dh-chip dh-chip-on">Guides</span>
          <span className="dh-chip">API</span>
          <span className="dh-branch">
            <Icon d={branch} />
            main
          </span>
        </div>
        <div className="dh-tree">
          <span><Icon d={fileText} />Introduction</span>
          <span className="dh-tree-on"><Icon d={fileText} />Quickstart</span>
          <span><Icon d={fileText} />Webhooks</span>
        </div>
      </div>
    </>
  )

  // The site on its own domain, with the checks that put it there.
  const DomainScene = () => (
    <>
      <div className="dh-window-head">
        <span className="dh-lights"><i /><i /><i /></span>
        <span className="dh-url">
          <Icon d={lock} />
          docs.acme.com
        </span>
      </div>
      <div className="dh-scene">
        <div className="dh-check-row">
          <span>DNS record</span>
          <Icon d={check} className="dh-check" />
        </div>
        <div className="dh-check-row">
          <span>SSL certificate</span>
          <Icon d={check} className="dh-check" />
        </div>
        <div className="dh-preview-status">
          <i className="dh-live" />
          Live
        </div>
      </div>
    </>
  )

  const steps = [
    {
      n: "01",
      title: "Create your site",
      desc: "Sign up, pick a starting point, and publish a branded site in minutes.",
      href: "/getting-started/quickstart",
      painting: "sunrise",
      Scene: CreateScene,
    },
    {
      n: "02",
      title: "Learn the model",
      desc: "How pages, navigation, branches, and the AI agent fit together.",
      href: "/getting-started/core-concepts",
      painting: "valley",
      Scene: ModelScene,
    },
    {
      n: "03",
      title: "Go live on your domain",
      desc: "Connect your own domain, or serve your docs under a path like /docs.",
      href: "/customize/custom-domain",
      painting: "sunset",
      Scene: DomainScene,
    },
  ]

  return (
    <div className="dh-home">
      <ol className="dh-steps">
        {steps.map(({ n, title, desc, href, painting, Scene }) => (
          <li key={n}>
            <a className="dh-step" href={base + href}>
              <div className={`dh-painting dh-painting-${painting}`}>
                <div className="dh-step-stage" aria-hidden="true">
                  <div className="dh-glass dh-glass-sm">
                    <div className="dh-face">
                      <Scene />
                    </div>
                  </div>
                </div>
              </div>
              <div className="dh-step-copy">
                <span className="dh-step-n">{n}</span>
                <span className="dh-step-title">{title}</span>
                <span className="dh-step-desc">{desc}</span>
                <span className="dh-explore">
                  Explore
                  <Icon d={arrowRight} />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
