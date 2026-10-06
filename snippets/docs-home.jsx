export const description = "Docs homepage Start here row: four numbered steps, each titled on a painting"

// The homepage's "Start here" row, under the h2 the page itself writes. Its
// root carries `dh-home`, which styles/docs-home.css uses to scope every
// homepage rule to this page; remove the import and the page falls back to the
// theme alone.
//
// Four steps, each on a painting in the order of a day (sunrise, full day,
// sunset, night), the last being the work the agent does on its own. They are
// set like the blog's scenery covers: the step number top-left and
// its title in the serif, white, bottom-left, with nothing drawn over the
// picture. The description and the link sit on the page below.
export const DocsHome = () => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/docs") ? "/docs" : ""

  const arrowRight = ["M5 12h14", "m12 5 7 7-7 7"]

  const steps = [
    {
      n: "01",
      title: "Set up your docs",
      desc: "Sign up, choose how you'll write, and publish your first edit in minutes.",
      href: "/getting-started/quickstart",
      painting: "sunrise",
    },
    {
      n: "02",
      title: "Learn the core concepts",
      desc: "How the AI features, the two ways to write, and components fit together.",
      href: "/getting-started/core-concepts",
      painting: "valley",
    },
    {
      n: "03",
      title: "Go live on your domain",
      desc: "Connect your own domain, or serve your docs under a path like /docs.",
      href: "/customize/custom-domain",
      painting: "sunset",
    },
    {
      n: "04",
      title: "Keep docs up to date",
      desc: "Set up a workflow, and the AI agent drafts updates from code changes, changelogs, and user feedback.",
      href: "/ai/workflows",
      painting: "night",
    },
  ]

  return (
    <div className="dh-home">
      <ol className="dh-steps">
        {steps.map(({ n, title, desc, href, painting }) => (
          <li key={n}>
            <a className="dh-step" href={base + href}>
              <div className={`dh-painting dh-painting-${painting}`}>
                <span className="dh-step-n">{n}</span>
                <span className="dh-step-title">{title}</span>
              </div>
              <div className="dh-step-copy">
                <span className="dh-step-desc">{desc}</span>
                <span className="dh-explore">
                  Explore
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {arrowRight.map((path) => <path key={path} d={path} />)}
                  </svg>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
