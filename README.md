# ذاكِر (Zakir): an Arabic-first AI study companion

`index.html` is the whole app, about 585 KB in one file. Open it in a modern browser (Chrome, Edge, Safari or Firefox, including on iPhone and iPad). There is no build step and no backend.

- **AI:** The app calls the Google Gemini REST API from the browser. The default model is `gemini-2.5-flash`. You can get a free key at https://aistudio.google.com/apikey. The key is stored only in localStorage on your device.
- **Demo:** To try the app without a key, use «تجربة بدون مفتاح». It loads a built-in lecture, "Anatomy of the Heart", with all of its content pre-written.
- **Files you can upload:** PDF, PPTX, DOCX, TXT/MD, and JPG/PNG/WEBP. You can upload several images as one lecture. The PDF and Office parsers (pdf.js and JSZip) load from a CDN only when they are needed.
- **Storage:** Lectures, generated content, notes and progress are saved in IndexedDB. You can export or import a lecture as a JSON study pack.
- **Image chips:** Pictures come live from Wikimedia/Wikipedia when you open a chip. They are not bundled with the app.
- **Hosting:** Serve the file gzip-compressed (about 174 KB). Most static hosts do this automatically. Without compression, a slow 3G connection takes around 15 s to load.
- **Screenshots:** The current build's screenshots are in `screenshots/final-*.png`. `screenshots/old-build/` holds screenshots of an earlier version.
