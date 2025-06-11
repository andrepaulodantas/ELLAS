const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy para o endpoint GraphDB
  app.use(
    "/repositories",
    createProxyMiddleware({
      target: "https://app.ellas.ufmt.br",
      changeOrigin: true,
      secure: true,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("integracao:Ellas@integration").toString("base64"),
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log("Proxy request:", req.method, req.url);
        // Adicionar headers necessários
        proxyReq.setHeader("Accept", "application/sparql-results+json");
        proxyReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log("Proxy response:", proxyRes.statusCode, req.url);
        // Adicionar CORS headers
        proxyRes.headers["Access-Control-Allow-Origin"] = "*";
        proxyRes.headers["Access-Control-Allow-Methods"] =
          "GET,POST,PUT,DELETE,OPTIONS";
        proxyRes.headers["Access-Control-Allow-Headers"] =
          "Content-Type,Authorization,Accept";
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err.message);
        res.status(500).json({
          error: "Proxy error",
          message: err.message,
          fallback: true,
        });
      },
    })
  );
};
