export default function ThemeScript() {
  const codeToRunOnClient = `
    (function() {
      try {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
      } catch (e) {
        // Fallback to dark theme if localStorage is not available
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
    />
  );
}
