/*
=====================================
  FRONT-END — consome nossa API local
=====================================

Este arquivo roda no navegador.
Ele faz requisições para nossa API Node.js
e mostra os dados na tela.
*/

//=======================
//ELEMENTOS DO HTML
//=======================
//foto do piloto
const pilotImage = document.getElementById("pilotImage");
//nome do piloto
const pilotName = document.getElementById("pilotName") || document.getElementById("breedName");
//piloto aleatório
const randomBtn = document.getElementById("randomBtn");
//botão que busca piloto
const searchBtn = document.getElementById("searchBtn");
//campo de texto onde o usuário digita o piloto
const pilotInput = document.getElementById("pilotInput") || document.getElementById("breedInput");
//área onde fica a imagem
const pilotArea = document.querySelector(".pilot-area");

if (!pilotImage || !pilotName || !randomBtn || !searchBtn || !pilotInput || !pilotArea) {
  console.error("Alguns elementos do HTML não foram encontrados. Verifique os ids no index.html.");
}

//==============================
// URL DA API
//==============================

const API = "http://localhost:3000/api/pilotos";

//==============================
// FUNÇÃO PRINCIPAL
//==============================

async function buscarPiloto(url){
  // adiciona a classe "loading"
  // normalmente usada para mostrar animação de carregamento
  pilotArea.classList.add("loading");

  try {
    //faz requisição HTTP para a API
    const response = await fetch(url);
    // converte a resposta para JSON
    const data = await response.json();
    //mostra no console a resposta da API
    console.log("Resposta da API:", data)

    //Vamos verificar se a API retornou erro
    if (data.status === "error"){
      //mostra a mensagem de erro na tela
      //pilotName - Elemento HTML
      //.textContent - Propriedade que define o texto do elemento
      //data - Objeto com os dados recebidos da API
      //.message - Propriedade que contém a mensagem ou URL
      pilotName.textContent = data.message;
      //remove a imagem
      pilotImage.src = "";
      //execução da função
      return;
    }

    //coloca a imagem do piloto na tela
    // o src define qual imagem será exibida
    pilotImage.src = data.message;
    pilotName.textContent = data.name
      .split("-")
      .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(" ");

  } catch (erro){
    //caso o servidor esteja desligado
    //ou aconteça algum erro na requisição

    console.error(erro);
    
    //mostra mensagem na tela
    pilotName.textContent =
      "📴 Servidor offline - rode: node server.js"
    
    //remove a imagem
    pilotImage.src = "";
  } finally {
    //remove a classe de carregamento
    //independentemente de erro ou sucesso.
    pilotArea.classList.remove("loading")
  }
}

// ==============================
// AÇÕES
// ==============================

//função que busca um piloto aleatório
function pilotoAleatorio(){
  //chamar a função principal
  //passando a rota /aleatorio da API
  buscarPiloto(`${API}/aleatorio`);
}

//função que busca piloto pelo nome da pasta
function buscarPilotoPorNome(){
  //pega o texto digitado e transforma espaços em hífens
  const piloto = pilotInput.value.trim().toLowerCase().replace(/\s+/g, "-");

  //verificar se o usuário digitou algo
  if (!piloto) {
    // se não digitou, mostra alerta
    alert ("Digite o nome de um piloto!");
    // interrompe a função
    return;
  }

  //chama a API com o nome da pasta do piloto
  //exemplo: /api/pilotos/max-verstappen
  buscarPiloto(`${API}/${encodeURIComponent(piloto)}`)
}

// ====================================
// EVENTOS
// ====================================

//quando clicar no botão "aleatório"
randomBtn.addEventListener("click", pilotoAleatorio);

// quando clicar no botão "buscar"
searchBtn.addEventListener("click", buscarPilotoPorNome);

//quando clicar na imagem, carrega outro piloto aleatório
pilotImage.addEventListener("click", pilotoAleatorio);

//quando o usuário apertar o ENTER no input
pilotInput.addEventListener("keypress", (event) =>{
  //verifica se a tecla pressionada foi enter
  if (event.key === "Enter"){
    //executa a busca por raça
    buscarPilotoPorNome();
  }
})

//carrega um piloto ao abrir a página

pilotoAleatorio();