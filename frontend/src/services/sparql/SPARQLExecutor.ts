import { fetchQuery } from "../apiService";
import { ISPARQLExecutor, SPARQLResponse } from "./interfaces";
import { requestManager } from "./RequestManager";

/**
 * Serviço responsável por executar consultas SPARQL
 * Princípio da Responsabilidade Única: Apenas executa queries
 * Integrado com RequestManager para otimização de rede
 */
export class SPARQLExecutor implements ISPARQLExecutor {
  /**
   * Gera hash simples para uma consulta SPARQL
   */
  private generateQueryHash(query: string): string {
    // Remove espaços em branco e normaliza para gerar hash consistente
    const normalized = query.replace(/\s+/g, ' ').trim();
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Executa uma consulta SPARQL com otimização de rede
   */
  async executeQuery(query: string): Promise<SPARQLResponse> {
    try {
      console.log(`📝 Executando consulta SPARQL (com RequestManager):`, query);
      console.time(`SPARQL-Query`);
      
      // Gera uma chave única para a consulta (hash simples)
      const queryKey = `sparql-${this.generateQueryHash(query)}`;
      
      // Usa RequestManager para otimizar a requisição
      const result = await requestManager.executeRequest<SPARQLResponse>(
        queryKey,
        () => fetchQuery(query),
        30000 // Cache por 30 segundos
      );
      
      console.timeEnd(`SPARQL-Query`);
      
      if (result && result.results && result.results.bindings) {
        console.log(`✅ Consulta retornou ${result.results.bindings.length} resultados`);
        return result;
      } else {
        console.warn("⚠️ Consulta não retornou resultados válidos");
        return { results: { bindings: [] } };
      }
    } catch (error) {
      console.error("❌ Erro ao executar consulta SPARQL:", error);
      return { results: { bindings: [] } };
    }
  }

  /**
   * Método legacy para compatibilidade
   */
  async execute(query: string): Promise<SPARQLResponse> {
    return this.executeQuery(query);
  }

  /**
   * Executa uma consulta SPARQL simples para verificar conectividade
   */
  async testConnection(): Promise<boolean> {
    try {
      const testQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o } LIMIT 1
      `;
      
      const result = await this.executeQuery(testQuery);
      return result.results.bindings.length > 0;
    } catch (error) {
      console.error("❌ Erro ao testar conexão SPARQL:", error);
      return false;
    }
  }
}
