//==========================
// API DE PILOTOS DE FÓRMULA 1
//==========================
//
// Adicione as imagens manualmente em data/pilotos/<nome-do-piloto>/
//==========================

// ROTAS:
// GET /api/pilotos/aleatorio
// GET /api/pilotos/:nome

// Importar o framework Express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições de outros dominios (ex: frontend)
const cors = require("cors");
// Importa o módulo de arquivos do NODE
const fs = require("fs");
// Importa utilidades para trabalhar com caminhos de arquivos
const path = require("path");
// cria a aplicação Express
const app = express();
// definir a porta onde o servidor irá rodar
const PORT = 3000;
const pastaPilotos = path.join(__dirname, "data", "pilotos");
const extensoesImagem = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
fs.mkdirSync(pastaPilotos, { recursive: true });
// Habilitar o uso do CORS na aplicacao
app.use(cors());

//=================================================
// SERVIR ARQUIVOS ESTÁTICOS
//=================================================

// Imagens dentro de data/pilotos podem ser acessadas pela URL /imagens

app.use(
  "/imagens",
  express.static(pastaPilotos),
);

function listarFotos(piloto) {
  const pasta = path.join(pastaPilotos, piloto);

  if (!fs.existsSync(pasta) || !fs.statSync(pasta).isDirectory()) {
    return [];
  }

  return fs.readdirSync(pasta)
    .filter((arquivo) => extensoesImagem.includes(path.extname(arquivo).toLowerCase()))
    .map((arquivo) => path.posix.join(piloto, arquivo));
}

function sortear(fotos) {
  return fotos[Math.floor(Math.random() * fotos.length)];
}

app.get("/api/pilotos/aleatorio", (req, res) => {
  const pilotos = fs.readdirSync(pastaPilotos, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory())
    .flatMap((entrada) => listarFotos(entrada.name));

  if (pilotos.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "Nenhuma imagem encontrada. Adicione fotos em backend/data/pilotos/<nome-do-piloto>/",
    });
  }

  const imagem = sortear(pilotos);
  const piloto = imagem.split("/")[0];

  res.json({
    status: "success",
    name: piloto,
    message: `http://localhost:${PORT}/imagens/${imagem.split("/").map(encodeURIComponent).join("/")}`,
  });
});

app.get("/api/pilotos/:nome", (req, res) => {
  const piloto = req.params.nome.toLowerCase();

  if (!/^[a-z0-9-]+$/.test(piloto)) {
    return res.status(400).json({
      status: "error",
      message: "Use o nome da pasta do piloto, sem espaços ou caracteres especiais.",
    });
  }

  const fotos = listarFotos(piloto);

  if (fotos.length === 0) {
    return res.status(404).json({
      status: "error",
      message: `Não encontrei fotos para "${piloto}". Confira a pasta backend/data/pilotos/${piloto}/`,
    });
  }

  const imagem = sortear(fotos);

  res.json({
    status: "success",
    name: piloto,
    message: `http://localhost:${PORT}/imagens/${imagem.split("/").map(encodeURIComponent).join("/")}`,
  });
});

//======================================
// INICIA O SERVIDOR
//=====================================

//inicia o servidor express
app.listen(PORT, () => {
  console.log(`Servidor de pilotos de F1 rodando em http://localhost:${PORT}`);
  console.log(`Adicione imagens em: ${pastaPilotos}`);
});