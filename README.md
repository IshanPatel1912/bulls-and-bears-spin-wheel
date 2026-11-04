# Bulls and Bears — Spin the Wheel

A responsive React + Vite wheel for the Bulls and Bears finance club.

## Run locally

1. Install Node.js (LTS) if it is not already installed.
2. Extract this ZIP.
3. Open a terminal in the extracted folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL Vite prints, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The production-ready site is generated in `dist/`.

## Customize

- Wheel categories, icons, and segment colors: `src/main.jsx`
- Layout and visual design: `src/styles.css`
- Club logo: `public/logo.png`

The wheel is designed to take 30 seconds to spin and uses a long ease-out transition so it slows gradually. Sound effects are off by default and can be enabled with the sound icon.
