const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: true, // Permitir qualquer origem
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Servir arquivos de survey para download
app.use("/api/survey", express.static(path.join(__dirname, "../survey")));

// Rota para listar arquivos disponíveis para download
app.get("/api/survey-files", (req, res) => {
  const fs = require("fs");
  const surveyDir = path.join(__dirname, "../survey");
  
  try {
    if (!fs.existsSync(surveyDir)) {
      return res.json({ files: [] });
    }
    
    const files = fs.readdirSync(surveyDir).map(filename => {
      const filePath = path.join(surveyDir, filename);
      const stats = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      
      return {
        name: filename,
        size: stats.size,
        type: ext === ".pdf" ? "PDF" : ext === ".csv" ? "CSV" : ext.toUpperCase().replace(".", ""),
        url: `/api/survey/${encodeURIComponent(filename)}`
      };
    });
    
    res.json({ files });
  } catch (error) {
    console.error("Error reading survey files:", error);
    res.status(500).json({ error: "Error reading files" });
  }
});

app.use("/api", routes);

module.exports = app;
