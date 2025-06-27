/**
 * CORREÇÃO CRÍTICA: Sistema de Controle de Requisições SPARQL
 * 
 * PROBLEMA: Sistema fazendo múltiplas requisições SPARQL simultâneas causando ERR_INSUFFICIENT_RESOURCES
 * SOLUÇÃO: Implementar debounce, cache e controle de requisições
 */

export class RequestManager {
  private activeRequests: Map<string, Promise<any>> = new Map();
  private cache: Map<string, any> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Executa uma requisição com controle de duplicação e cache
   */
  async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    cacheTimeout: number = 5000 // 5 segundos
  ): Promise<T> {
    // Verificar cache primeiro
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      console.log(`🎯 Cache hit para: ${key}`);
      return cached.data;
    }

    // Se já existe uma requisição ativa para esta chave, aguardar ela
    if (this.activeRequests.has(key)) {
      console.log(`⏳ Aguardando requisição ativa para: ${key}`);
      return this.activeRequests.get(key)!;
    }

    // Criar nova requisição
    console.log(`🚀 Nova requisição para: ${key}`);
    const promise = this.executeWithRetry(requestFn, 3, 1000);
    
    this.activeRequests.set(key, promise);

    try {
      const result = await promise;
      
      // Salvar no cache
      this.cache.set(key, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`❌ Erro na requisição ${key}:`, error);
      throw error;
    } finally {
      // Remover da lista de requisições ativas
      this.activeRequests.delete(key);
    }
  }

  /**
   * Executa requisição com retry e backoff exponencial
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    maxRetries: number,
    baseDelay: number
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`🔄 Tentativa ${attempt} falhou, aguardando ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  /**
   * Debounce para evitar múltiplas chamadas rápidas
   */
  debounce<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number = 300
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      // Limpar timer anterior
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Criar novo timer
      const timer = setTimeout(() => {
        fn(...args);
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    };
  }

  /**
   * Limpar cache e requisições ativas
   */
  clear(): void {
    this.cache.clear();
    this.activeRequests.clear();
    
    // Limpar timers de debounce
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }

  /**
   * Limpar cache específico
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Instância singleton
export const requestManager = new RequestManager();
