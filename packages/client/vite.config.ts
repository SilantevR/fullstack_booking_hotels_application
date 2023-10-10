import { defineConfig } from "vite";
import dns from "dns";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

//dns.setDefaultResultOrder("verbatim");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "0.0.0.0",
      port: Number(process.env.CLIENT_PORT) || 3000,
    },
    strictPort: true,
    host: true,
    port: Number(process.env.CLIENT_PORT) || 3000,
  },
  /*define: {
    __BASE_URL__: `${process.env.BASE_URL}`,
    __PUBLIC_URL__: `${process.env.PUBLIC_URL}`,
  },*/
});
