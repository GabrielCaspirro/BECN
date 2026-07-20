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

    if(ph == null || turbidez == null){

        if(tds <= Valores.tds.ideal)
            return "boa";

        if(tds <= Valores.tds.ideal + 100)
            return "quase";

        if(tds <= Valores.tds.ideal + 300)
            return "abaixo";

        return "ruim";
    }

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

exports.postDados = (req, res) => {

    if (req.body.ph !== undefined) {
        dados.ph = req.body.ph;
    }

    if (req.body.turbidez !== undefined) {
        dados.turbidez = req.body.turbidez;
    }

    if (req.body.tds !== undefined) {
        dados.tds = req.body.tds;
    }

    dados.qualidade = calcularQualidade(
        dados.ph,
        dados.turbidez,
        dados.tds
    );

    dados.ultimaAtualizacao = new Date();

    clientes.forEach(cliente => {
        cliente.write(
            `data: ${JSON.stringify(dados)}\n\n`
        );
    });

    res.json({
        sucesso: true,
        dados
    });

}

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