const Valores = require("../config/parametros");
let clientes = [];

let dados = {

    ph: null,
    turbidez: null,
    tds: 580,
    
    qualidade: "boa",

    ultimaAtualizacao: new Date()

};

function calcularQualidade(ph, turbidez, tds){

    //if(ph == null || turbidez == null || tds == null){
        //return "aguardando";
    //=}

    if(tds <= Valores.tds.ideal)
        return "boa";

    if(tds <= Valores.tds.ideal + 100)
        return "quase";

    if(tds <= Valores.tds.ideal + 300)
        return "abaixo";

    return "ruim";

    if(
        ph >= Valores.ph.idealMin &&
        ph <= Valores.ph.idealMax &&
        turbidez <= Valores.turbidez.ideal &&
        tds <= Valores.tds.ideal
    ){
        return "boa";
    }

    if(
        ph >= Valores.ph.idealMin - 0.5 &&
        ph <= Valores.ph.idealMax + 0.5 &&
        turbidez <= Valores.turbidez.ideal + 1
    ){
        return "quase";
    }

    if(
        ph >= Valores.ph.idealMin - 1 &&
        ph <= Valores.ph.idealMax + 1
    ){
        return "abaixo";
    }

    return "ruim";

}

exports.getDados = (req,res)=>{

    res.json(dados);

}

exports.postDados = (req, res) => {

    const body = req.body || {};

    if (body.ph !== undefined) {
        dados.ph = body.ph;
    }

    if (body.turbidez !== undefined) {
        dados.turbidez = body.turbidez;
    }

    if (body.tds !== undefined) {
        dados.tds = body.tds;
    }

    dados.qualidade = calcularQualidade(
        dados.ph,
        dados.turbidez,
        dados.tds
    );

    dados.ultimaAtualizacao = new Date();

    clientes.forEach(cliente => {
        cliente.write(`data: ${JSON.stringify(dados)}\n\n`);
    });

    res.json({
        sucesso: true,
        dados
    });

};

exports.stream = (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    clientes.push(res);

    console.log("Cliente conectado:", clientes.length);

    req.on("close", () => {

        clientes = clientes.filter(cliente => cliente !== res);

        console.log("Cliente desconectado:", clientes.length);

    });

};