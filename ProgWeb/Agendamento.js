const Joi = require('joi');

const AgendamentoSchema = Joi.object({
    id: Joi.string(),
    cliente_id: Joi.string().required(),
    data_hora: Joi.date().iso().required(),
    servico: Joi.string().required(),
});

class Agendamento {
    constructor(cliente_id, data_hora, servico) {
        this.id = undefined;
        this.cliente_id = cliente_id;
        this.data_hora = data_hora;
        this.servico = servico;
    }

    validate() {
        return AgendamentoSchema.validate(this, { abortEarly: false });
    }
}

module.exports = { Agendamento };