const circle = document.getElementById("statusCircle");
const texto = document.getElementById("statusTexto");

const estados = {

    boa:{
        mensagem:"Ela está boa para uso",

        circulo:"linear-gradient(135deg,#68ffb7,#00b96b)",

        brilho:"#69ffd2",

        fundo:["#dffff7","#8ff7ff","#63d5ff","#2ea2ff"],

        bolha:"rgba(255,255,255,.35)"
    },

    quase:{
        mensagem:"Ela está quase boa para uso",

        circulo:"linear-gradient(135deg,#fff68d,#ffc531)",

        brilho:"#ffe36d",

        fundo:["#fffbe5","#ffe68f","#ffd36c","#ffb347"],

        bolha:"rgba(255,245,180,.35)"
    },

    abaixo:{
        mensagem:"Ela está abaixo do esperado",

        circulo:"linear-gradient(135deg,#ffc88c,#ff7b21)",

        brilho:"#ffad55",

        fundo:["#fff1de","#ffd7a6","#ffb060","#ff7b30"],

        bolha:"rgba(255,190,120,.35)"
    },

    ruim:{
        mensagem:"Ela não está adequada para uso",

        circulo:"linear-gradient(135deg,#ff9191,#d81b1b)",

        brilho:"#ff7272",

        fundo:["#ffe8e8","#ffbcbc","#ff7070","#d81b60"],

        bolha:"rgba(255,140,140,.35)"
    }

};

async function carregarDados(){

    const resposta = await fetch("/api/dados");

    const dados = await resposta.json();

    atualizarTela(dados);

}

const eventSource = new EventSource("/api/stream");

carregarDados();

function atualizarQualidade(estado){

    const dados = estados[estado];

    if(!dados) return;

    texto.textContent = dados.mensagem;

    circle.style.background = dados.circulo;

    circle.style.boxShadow = `
        0 0 35px ${dados.brilho},
        inset 0 4px 12px rgba(255,255,255,.6)
    `;

    document.documentElement.style.setProperty("--bg1", dados.fundo[0]);
    document.documentElement.style.setProperty("--bg2", dados.fundo[1]);
    document.documentElement.style.setProperty("--bg3", dados.fundo[2]);
    document.documentElement.style.setProperty("--bg4", dados.fundo[3]);

    document.documentElement.style.setProperty("--bubble-color", dados.bolha);

}

function atualizarTela(dados){

    document.getElementById("ph").textContent =
        dados.ph;

    document.getElementById("tds").textContent =
        dados.tds + " ppm";

    document.getElementById("turbidez").textContent =
        dados.turbidez + " NTU";

    document.getElementById("temperatura").textContent =
        dados.temperatura + " °C";

    atualizarQualidade(dados.qualidade);

}

eventSource.onmessage = (evento)=>{

    const dados = JSON.parse(evento.data);

    atualizarTela(dados);

}

eventSource.onerror = () => {

    console.log("Conexão com o servidor perdida.");

};