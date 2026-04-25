// Use the ESM source entry explicitly because the package's default UMD build
// can be prebundled in a way that loses the React import under Vite, causing
// invalid-hook-call/runtime `useRef` null errors.
export { useGSAP } from "@gsap/react/src/index.js";
