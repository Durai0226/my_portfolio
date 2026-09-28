/** Runs before first paint: applies the visitor's saved theme (dark-first; the cover is lime in dark, paper in light). */
export default function ThemeScript() {
	const code = `(function(){try{var r=document.documentElement,t=localStorage.getItem('ds-theme');if(!t){var o=localStorage.getItem('theme');if(o==='light'||o==='dark')t=o}if(t==='light'||t==='dark')r.dataset.theme=t}catch(e){}})();`
	return <script dangerouslySetInnerHTML={{ __html: code }} />
}
