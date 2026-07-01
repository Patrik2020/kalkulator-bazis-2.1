const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);
const host = "127.0.0.1";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
]);

const server = http.createServer((request, response) => {
  try {
    const parsedUrl = new URL(request.url, `http://${host}:${port}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname.endsWith("/")) pathname += "index.html";

    const filePath = path.resolve(root, pathname.replace(/^\/+/, ""));

    if (!filePath.startsWith(root)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "content-type":
          contentTypes.get(path.extname(filePath).toLowerCase()) ||
          "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(response);
    });
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error.message);
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
});
