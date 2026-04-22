// O frontend não conecta mais diretamente ao GraphDB.
// Todas as queries SPARQL passam pelo backend (http://localhost:8082/api/sparql).
// As credenciais do GraphDB ficam apenas no backend via variáveis de ambiente.
module.exports = function (app) {};
