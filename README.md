# Sachin Pranami — .NET Full-Stack Software Engineer

Professional responsive portfolio built with HTML, CSS and JavaScript. The content is based on the supplied resume. Profile and summary copy have been edited for a clear first-person portfolio voice; employers, dates, education, skill lists and role responsibilities remain grounded in the resume.

## Run in VS Code

1. Extract this archive and open the folder in VS Code.
2. Use VS Code Live Server, or serve the directory with `python -m http.server 8000`.
3. Open the served URL. Use HTTP/HTTPS instead of double-clicking the HTML file so the JavaScript module can load.

There is no package installation or build step.

## Files

- `index.html`: profile, engineering focus, summary, skills, career history, education and contact.
- `assets/css/styles.css`: self-hosted Noto Sans, light/dark themes, circular avatar, responsive layouts and hover effects.
- `assets/js/main.js`: menu, active links, scroll progress, search/highlighting, skill disclosures, keyboard shortcut, copy email and photo dialog.
- `assets/js/contact.js`: phone-versus-desktop contact routing.
- `assets/fonts/`: local Noto Sans regular/bold WOFF files and SIL Open Font License.
- `assets/images/sachin-portrait-enhanced.png`: enhanced portrait created from the supplied photo.
- `assets/documents/Sachin_Pranami_Resume.pdf`: unchanged uploaded resume.

## Contact actions

Both “Let’s talk” links use device detection. Phones receive `tel:+918758242103`; computers receive `mailto:sachinpranami92@gmail.com?subject=Software%20engineering%20opportunity`. The action opens the device’s configured dialer or email application; it does not place a call or send an email automatically. Tablets use the email action unless the browser reports itself as mobile. A narrow desktop window still receives email.

The phone and email links also remain separately available in the contact section. With JavaScript unavailable, “Let’s talk” falls back to email. Browser device detection is best-effort; it does not use viewport width. Tests cover modern mobile flags, iPhone, Android phones, desktop Windows/macOS, and iPad.

## Design and interactions

- Circular photo: 120px on desktop, 96px on phones; click to open the full-photo dialog.
- Locally bundled Noto Sans typography; no remote font requests.
- Searchable skill categories, matching-tag highlights and automatic detail expansion.
- Keyboard-accessible skill disclosures and expand/collapse all.
- `/` focuses skill search outside text fields.
- Saved light/dark preference, active navigation and reading progress.
- Subtle hover feedback and pointer highlights; reduced-motion preferences respected.
- Email copy reports actual success or a manual-copy fallback.

The image enhancement used the built-in image editing tool. Brief: preserve identity, facial features, expression, hairstyle, suit, watch and pose; improve clarity, restrained denoising and natural sharpening, correct cyan cast and balance exposure, and crop excess ceiling while retaining the office. The original upload was left unchanged. The avatar is a CSS crop of the enhanced photo.

## Verification

Checked JavaScript syntax and contact routing for six device cases with the exact phone number and email recipient. Browser checks verified local font loading, correct desktop email links, 320px/390px/768px layouts without document overflow, avatar dimensions, photo preview, search and reset. Skills and career responsibilities were compared with the previous version. Unique IDs, section destinations, local assets and document structure passed validation. Native phone/email applications were not launched by automated checks. The linked resume was verified to open in the browser; the earlier automated download-event check was inconclusive.
