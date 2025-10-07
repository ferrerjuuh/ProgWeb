const Joi = require('joi');

const ClienteSchema = Joi.object({
    id: Joi.string(),
    nome: Joi.string().required(),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    idade: Joi.number().integer().min(0).required(),
    telefone: Joi.string().required(),
    endereco: Joi.string().required(),
});

class Cliente {
    constructor(nome, cpf, idade, telefone, endereco) {
        this.id = undefined;
        this.nome = nome;
        this.cpf = cpf;
        this.idade = idade;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    validate() {
        return ClienteSchema.validate(this, { abortEarly: false });
    }
}

module.exports = { Cliente };