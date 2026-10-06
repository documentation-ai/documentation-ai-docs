export const description = "Docs homepage Explore row: the website header's Product menu, four groups of links"

// The homepage's "Explore the docs" row, styled by styles/docs-home.css. It
// lists what the website header's Product menu lists, in the same four groups
// and order, with the same labels, descriptions, links and Lucide icons. The
// source is PRODUCT_GROUPS in src/lib/nav.ts in the website repository; when
// that menu changes, change this list to match.
export const DocsHomeExplore = () => {
  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/docs") ? "/docs" : ""

  // Lucide's shapes, as [element, attributes] pairs, so circles and rects draw too.
  const Icon = ({ shapes }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes.map(([Tag, attrs], i) => <Tag key={i} {...attrs} />)}
    </svg>
  )
  const p = (d) => ["path", { d }]
  const icons = {
    squarePen: [p("M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"), p("M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z")],
    gitBranch: [p("M15 6a9 9 0 0 0-9 9V3"), ["circle", { cx: 18, cy: 6, r: 3 }], ["circle", { cx: 6, cy: 18, r: 3 }]],
    users: [p("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"), p("M16 3.128a4 4 0 0 1 0 7.744"), p("M22 21v-2a4 4 0 0 0-3-3.87"), ["circle", { cx: 9, cy: 7, r: 4 }]],
    layers: [p("M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"), p("M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"), p("M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17")],
    component: [p("M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"), p("M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"), p("M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"), p("M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z")],
    bot: [p("M12 8V4H8"), ["rect", { width: 16, height: 12, x: 4, y: 8, rx: 2 }], p("M2 14h2"), p("M20 14h2"), p("M15 13v2"), p("M9 13v2")],
    workflow: [["rect", { width: 8, height: 8, x: 3, y: 3, rx: 2 }], p("M7 11v4a2 2 0 0 0 2 2h4"), ["rect", { width: 8, height: 8, x: 13, y: 13, rx: 2 }]],
    plug: [p("M12 22v-5"), p("M15 8V2"), p("M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"), p("M9 8V2")],
    chartColumn: [p("M3 3v16a2 2 0 0 0 2 2h16"), p("M18 17V9"), p("M13 17V5"), p("M8 17v-3")],
    braces: [p("M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"), p("M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1")],
    shieldCheck: [p("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"), p("m9 12 2 2 4-4")],
    languages: [p("m5 8 6 6"), p("m4 14 6-6 2-3"), p("M2 5h12"), p("M7 2h1"), p("m22 22-5-10-5 10"), p("M14 18h6")],
    globe: [["circle", { cx: 12, cy: 12, r: 10 }], p("M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"), p("M2 12h20")],
    sparkles: [p("M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"), p("M20 2v4"), p("M22 4h-4"), ["circle", { cx: 4, cy: 20, r: 2 }]],
    bookOpen: [p("M12 5v16"), p("M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z")],
    filePen: [p("M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34"), p("M14 2v5a1 1 0 0 0 1 1h5"), p("M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z")],
    appWindow: [["rect", { x: 2, y: 4, width: 20, height: 16, rx: 2 }], p("M10 4v4"), p("M2 8h20"), p("M6 4v4")],
    fileText: [p("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"), p("M14 2v5a1 1 0 0 0 1 1h5"), p("M10 9H8"), p("M16 13H8"), p("M16 17H8")],
  }

  const groups = [
    {
      title: "Write",
      links: [
        ["Web Editor", "/write-and-publish/web-editor", "Visual editing, no Git required", "squarePen"],
        ["Docs as Code & Git", "/write-and-publish/code-editor", "Branches, PRs, preview builds", "gitBranch"],
        ["Collaboration & Comments", "/write-and-publish/collaboration", "Live editing, inline comments, mentions", "users"],
        ["Reusable Snippets", "/write-and-publish/snippets", "Write once (text or React), update everywhere", "layers"],
        ["Components", "/components/components", "Beautiful components designed for documentation", "component"],
      ],
    },
    {
      title: "Self-Updating Docs",
      links: [
        ["AI Documentation Agent", "/ai/ai-documentation-agent", "Runs the workflows in the background and drafts the changes", "bot"],
        ["AI Workflows", "/ai/workflows", "Update from code, changelogs, and user feedback, on merge or a schedule", "workflow"],
        ["Connectors", "/integrations/overview", "GitHub, GitLab, Jira, Confluence, user feedback", "plug"],
        ["Analytics & AI Insights", "/analytics/overview", "Traffic, ratings, and the questions Ask AI answered with low confidence", "chartColumn"],
      ],
    },
    {
      title: "Publish",
      links: [
        ["API Docs & Playground", "/api-documentation-and-playground/openapi-import", "OpenAPI in, live try-it console out", "braces"],
        ["Access Control", "/customize/access-control/overview", "SSO, JWT, OAuth 2.0, role-based access", "shieldCheck"],
        ["Versions & Localization", "/organize/localization", "Ship docs in every language and version", "languages"],
        ["Custom Domains", "/customize/custom-domain", "Your docs on your domain or subpath", "globe"],
        ["Embedded Docs", "/embedded-docs/overview", "Docs and the AI Assistant inside your product", "appWindow"],
      ],
    },
    {
      title: "AI Access",
      links: [
        ["AI Assistant", "/ai/ai-assistant", "Cited answers inside your docs, scored by confidence", "sparkles"],
        ["Reader MCP Server", "/ai/reader-mcp-server", "Your customers' AI tools read your docs", "bookOpen"],
        ["Authoring MCP Server", "/ai/authoring-mcp-server", "Your team writes docs from Cursor or Claude Code", "filePen"],
        ["llms.txt & GEO", "/seo-and-geo/robots-txt-and-llm-txt", "Discoverable to every model", "fileText"],
      ],
    },
  ]

  return (
    <div className="dh-groups">
      {groups.map(({ title, links }) => (
        <div className="dh-group" key={title}>
          <div className="dh-group-title">{title}</div>
          <ul className="dh-group-links">
            {links.map(([label, path, desc, icon]) => (
              <li key={path}>
                <a className="dh-group-link" href={base + path}>
                  <Icon shapes={icons[icon]} />
                  <span>
                    <span className="dh-group-label">{label}</span>
                    <span className="dh-group-desc">{desc}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
