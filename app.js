// Importação do módulo do Express para o Node
const express = require("express")

// Importação do módulo do body-parser para realizar o trabalho com o json que será enviado pelo cliente
const bodyParser = require("body-parser")

// Importação do Mongoose para realizar a persistência com o MongoDB
const mongoose = require("mongoose")

// Vamos estabelecer a conexão com o banco de dados MongoDB
const urldb = "mongodb+srv://<user>:<password>@clustercliente.0p3uv.mongodb.net/banco?retryWrites=true&w=majority"
mongoose.connect(urldb, {useNewUrlParser: true, useUnifiedTopology: true})

// Criação do esquema de dados da tabela. Campos da tabela
const tabela = new mongoose.Schema({
    nome:{type: String, required: true},
    email:{type: String, required: true},
    cpf:{type: String, required: true},
    telefone:String,
    idade:{type: Number, min: 16, max: 120},
    usuario:{type: String, unique: true},
    senha:String,
    datacadastro:{type: Date, default: Date.now}
})

// Construção de tabela com o comando model
const Cliente = mongoose.model('tbcliente', tabela)

// Utilizar o express na nossa aplicação
const app = express()

app.use(bodyParser.json())

// -----------------------

app.get("/", (req, res) => {
    // res.status(200).send({rs:"Você está no método GET"})

    Cliente.find((erro, dados) => {
        if (erro) {
            res.status(404).send({rs: `Erro ao tentar listar os clientes ${erro}`})
            return
        }
        res.status(200).send({rs: dados})
    })
})

app.post("/cadastro", (req, res) => {
    // res.status(201).send({rs: "Você está no método POST"})

    const dados = new Cliente(req.body)

    dados.save().then(() => {
        res.status(201).send({rs: "Dados cadastrados"})
    }).catch((erro) => res.status(400).send({rs: `Erro ao tentar cadastras ${erro}`}))
})

app.put("/atualizar/:id", (req, res) => {
    // res.status(200).send({rs: "Você está no método PUT"})

    Cliente.findByIdAndUpdate(req.params.id, req.body, {new: true}, (erro, dados) => {
        if (erro) {
            res.status(400).send({rs: `Erro ao atualizar ${erro}`})
            return
        }
        res.status(200).send({rs: dados})
    })
})

app.delete("/apagar/:id", (req, res) => {
    // res.status(204).send({rs: "Você está no método DELETE"})

    Cliente.findByIdAndDelete(req.params.id, (erro, dados) => {
        if (erro) {
            res.status(400).send({rs: `Erro ao tentar apagar o cliente ${erro}`})
            return
        }
        res.status(204).send({rs: "Cliente apagado"})
    })
})

// Vamos adicionar um tratamento ao erro de requisição inexistente, ou seja, o erro 404
app.use((req, res) => {
    res.type('application/json')
    res.status(404).send({erro: "404 - Página não encontrada"})
})

app.listen(3000)

console.log("Servidor Online... Para finalizar utilize CTRL + C")