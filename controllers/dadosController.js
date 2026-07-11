const Valores = require("../config/parametros");
let clientes = [];

let dados = {

    ph: 7.1,
    turbidez: 0.42,
    tds: 580,
    
    qualidade: "boa",

    ultimaAtualizacao: new Date()

};

function calcularQualidade(ph, turbidez, tds){

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

exports.postDados = (req,res)=>{

    dados = {

        ...req.body,

        qualidade: calcularQualidade(
            req.body.ph,
            req.body.turbidez,
            req.body.tds
        ),

        ultimaAtualizacao: new Date()
    };

    clientes.forEach(cliente => {

        cliente.write(
            `data: ${JSON.stringify(dados)}\n\n`
        );

    });

    res.json({
        sucesso:true,
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