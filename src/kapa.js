// Docusaurus client module: inject the kapa.ai AI assistant widget.
// Ported from the former Sphinx _static/kapa.js. Runs only in the browser.
if (typeof document !== 'undefined') {
  const SCRIPT_ID = 'kapa-widget-script';
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
    script.setAttribute('data-website-id', '96f18081-6bb0-4654-8734-d5b4c774d5c5');
    script.setAttribute('data-project-name', 'NethSecurity');
    script.setAttribute('data-project-color', '#0e7490');
    script.setAttribute('data-project-logo', '/img/favicon.png');
    script.setAttribute('data-button-position-bottom', '120px');
    script.setAttribute('data-source-group-ids-include', '5ea2f7fd-9fe2-405b-baa2-5682c38d654a');
    script.setAttribute(
      'data-modal-disclaimer',
      'This is an AI bot that will give you answers only about **NethSecurity 8**. Older NethServer or NethSecurity versions are not supported.',
    );
    script.async = true;
    document.head.appendChild(script);
  }
}
