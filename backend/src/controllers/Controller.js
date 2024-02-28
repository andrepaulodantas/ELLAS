class Controller{
    constructor(entidadeService){
        this.entidadeService = entidadeService;
    }

    async pegaTodos(req, res){
        try {
            const listaDeRegistro = await this.entidadeService.pegaTodosOsRegistros();
            return res.status(200).json(listaDeRegistro);
        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    }
    async pegaUm(req, res){
        const { id } = req.params;
        try {
            const registro = await this.entidadeService.pegaUmRegistro({ id });
            return res.status(200).json(registro);
        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    }
    async cria(req, res){
        const novoRegistro = req.body;
        try {
            const novoRegistroCriado = await this.entidadeService.criaRegistro(novoRegistro);
            return res.status(201).json(novoRegistroCriado);
        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    }
    async atualiza(req, res){
        const { id } = req.params;
        const novasInfos = req.body;
        try {
            await this.entidadeService.atualizaRegistro(novasInfos, { id });
            const registroAtualizado = await this.entidadeService.pegaUmRegistro({ id });
            return res.status(200).json(registroAtualizado);
        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    }
    async apaga(req, res){
        const { id } = req.params;
        try {
            await this.entidadeService.apagaRegistro({ id });
            return res.status(200).json({ mensagem: `id ${id} deletado` });
        }
        catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = Controller;