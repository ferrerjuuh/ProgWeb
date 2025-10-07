const express = require("express");
const { Cliente } = require("./Cliente");
const { Agendamento } = require("./Agendamento");
const DB = require('./database');
const { corsMiddleware, logMiddleware, authorizationMiddleware } = require('./middlewares');
const { generateJWTTokenForUser } = require('./jwt');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

app
    .use(corsMiddleware)
    .use(logMiddleware)
    .use('/clientes', authorizationMiddleware)
    .use('/agendamentos', authorizationMiddleware);

app.post('/authenticate', async (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');

    const { api_key } = body;
    if (!api_key) return res.status(400).send('api_key expected');

    const user = await DB.getUserByApiKey(api_key);
    if (!user) return res.status(404).send('user not found for this api_key');

    generateJWTTokenForUser(user.id)
        .then(jwt => res.json({ jwt }))
        .catch(err => {
            console.log(err);
            return res.status(500).send('error generating token');
        });
});

// Rotas para Clientes
app.get('/clientes', async (req, res) => {
    const clientes = await DB.getAllClientes();
    res.json(clientes);
});

app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await DB.getClienteById(id);
    if (!cliente) return res.status(404).send('Cliente not found');
    res.json(cliente);
});

app.post('/clientes', async (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    const { nome, cpf, idade, telefone, endereco } = body;
    const novoCliente = new Cliente(nome, cpf, idade, telefone, endereco);
    const { error } = novoCliente.validate();
    if (error) {
        const message = error.details.map(d => d.message).join('\n');
        return res.status(400).send(message);
    }
    novoCliente.id = uuidv4();
    await DB.insertCliente(novoCliente);
    res.status(201).json(novoCliente);
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await DB.getClienteById(id);
    if (!cliente) return res.status(404).send('Cliente not found');

    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    const { nome, cpf, idade, telefone, endereco } = body;
    const clienteAtualizado = new Cliente(nome, cpf, idade, telefone, endereco);
    const { error } = clienteAtualizado.validate();
    if (error) {
        const message = error.details.map(d => d.message).join('\n');
        return res.status(400).send(message);
    }
    clienteAtualizado.id = id;
    await DB.updateCliente(id, clienteAtualizado);
    res.status(200).json(clienteAtualizado);
});

app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const cliente = await DB.getClienteById(id);
    if (!cliente) return res.status(404).send('Cliente not found');
    await DB.deleteCliente(id);
    res.status(204).send();
});


// Rotas para Agendamentos
app.get('/agendamentos', async (req, res) => {
    const agendamentos = await DB.getAllAgendamentos();
    res.json(agendamentos);
});

app.get('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    const agendamento = await DB.getAgendamentoById(id);
    if (!agendamento) return res.status(404).send('Agendamento not found');
    res.json(agendamento);
});

app.post('/agendamentos', async (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    const { cliente_id, data_hora, servico } = body;
    const novoAgendamento = new Agendamento(cliente_id, data_hora, servico);
    const { error } = novoAgendamento.validate();
    if (error) {
        const message = error.details.map(d => d.message).join('\n');
        return res.status(400).send(message);
    }
    novoAgendamento.id = uuidv4();
    await DB.insertAgendamento(novoAgendamento);
    res.status(201).json(novoAgendamento);
});

app.put('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    const agendamento = await DB.getAgendamentoById(id);
    if (!agendamento) return res.status(404).send('Agendamento not found');

    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    const { cliente_id, data_hora, servico } = body;
    const agendamentoAtualizado = new Agendamento(cliente_id, data_hora, servico);
    const { error } = agendamentoAtualizado.validate();
    if (error) {
        const message = error.details.map(d => d.message).join('\n');
        return res.status(400).send(message);
    }
    agendamentoAtualizado.id = id;
    await DB.updateAgendamento(id, agendamentoAtualizado);
    res.status(200).json(agendamentoAtualizado);
});

app.delete('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    const agendamento = await DB.getAgendamentoById(id);
    if (!agendamento) return res.status(404).send('Agendamento not found');
    await DB.deleteAgendamento(id);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});