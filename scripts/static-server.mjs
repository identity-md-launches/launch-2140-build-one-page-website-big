import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

export async function serveExport() {
  const root = resolve("dist");
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
    ".txt": "text/plain",
  };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      if (!pathname.startsWith("/preview/")) {
        response.writeHead(404).end();
        return;
      }
      const file = resolve(
        root,
        "." + pathname.slice("/preview".length),
        pathname.endsWith("/") ? "index.html" : "",
      );
      if (!file.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      const data = await readFile(file);
      response
        .writeHead(200, {
          "Content-Type": types[extname(file)] || "application/octet-stream",
        })
        .end(data);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((done) => server.listen(0, "0.0.0.0", done));
  return { server, url: `http://127.0.0.1:${server.address().port}/preview/` };
}

if (resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const { server, url } = await serveExport();
  console.log(url);
  const close = () => server.close(() => process.exit(0));
  process.on("SIGTERM", close);
  process.on("SIGINT", close);
}
