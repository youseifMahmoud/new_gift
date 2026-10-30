import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" يجعل الموقع يعمل من أي مجلد أو استضافة بعد البناء
export default defineConfig({
  plugins: [react()],
  base: "./",
});
