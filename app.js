const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use("/api", require("./routes/dados"));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});