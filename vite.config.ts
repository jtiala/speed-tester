import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePluginFonts } from "vite-plugin-fonts";

export default defineConfig({
  plugins: [
    react(),
    VitePluginFonts({
      google: {
        families: [
          { name: "Righteous" },
          { name: "Rubik", styles: "ital,wght@0,400;0,700" },
        ],
      },
    }),
  ],
  base: process.env.BASE,
});
