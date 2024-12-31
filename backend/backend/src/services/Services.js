const dataSource = require("../models");

class Services {
    constructor(nomeDoModel) {
        this.model = nomeDoModel;
    }

    async pegaTodosOsRegistros() {
        return dataSource[this.model].findAll();
    }

    async pegaUmRegistro(where) {
        return dataSource[this.model].findOne({ where });
    }

    async criaRegistro(dados) {
        return dataSource[this.model].create(dados);
    }

    async atualizaRegistro(dadosAtualizados, where) {
        return dataSource[this.model].update(dadosAtualizados, { where });
    }

    async apagaRegistro(where) {
        return dataSource[this.model].destroy({ where });
    }

}

module.exports = Services;
