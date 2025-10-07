// Simulação de um banco de dados em memória
let clientes = [];
let agendamentos = [];
const users = require('./users.json');

const getAllClientes = async () => clientes;
const getClienteById = async (id) => clientes.find(c => c.id === id);
const insertCliente = async (cliente) => { clientes.push(cliente); return cliente; };
const updateCliente = async (id, cliente) => {
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
        clientes[index] = cliente;
    }
    return cliente;
};
const deleteCliente = async (id) => { clientes = clientes.filter(c => c.id !== id); };

const getAllAgendamentos = async () => agendamentos;
const getAgendamentoById = async (id) => agendamentos.find(a => a.id === id);
const insertAgendamento = async (agendamento) => { agendamentos.push(agendamento); return agendamento; };
const updateAgendamento = async (id, agendamento) => {
    const index = agendamentos.findIndex(a => a.id === id);
    if (index !== -1) {
        agendamentos[index] = agendamento;
    }
    return agendamento;
};
const deleteAgendamento = async (id) => { agendamentos = agendamentos.filter(a => a.id !== id); };


const getUserByApiKey = async (apiKey) => users.find(u => u.api_key === apiKey);

module.exports = {
    getAllClientes,
    getClienteById,
    insertCliente,
    updateCliente,
    deleteCliente,
    getAllAgendamentos,
    getAgendamentoById,
    insertAgendamento,
    updateAgendamento,
    deleteAgendamento,
    getUserByApiKey
};