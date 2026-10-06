export const description = "Marks the docs homepage so styles/docs-home.css can style it and nothing else"

// Renders nothing a reader sees. The platform gives pages no class of their own,
// so styles/docs-home.css scopes every rule to `.dai-article:has(.dh-home)`.
// Remove this import and the homepage falls back to the default page styles.
export const DocsHome = () => {
  return <span className="dh-home" hidden />
}
