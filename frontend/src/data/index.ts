// Interface do banco de dados de consultas
export interface QueryDatabaseResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface QueryInfo {
  category: string;
  sparqlQuery: string;
  result: QueryDatabaseResult;
}

export interface CategoryInfo {
  count: number;
  queries: string[];
}

export interface QueryDatabase {
  metadata: {
    created: string;
    version: string;
  };
  categories: Record<string, CategoryInfo>;
  queries: Record<string, QueryInfo>;
}

// Banco de dados vazio para caso de falha
const emptyDatabase: QueryDatabase = {
  metadata: {
    created: new Date().toISOString(),
    version: '0.0.0'
  },
  categories: {},
  queries: {}
};

// Função para carregar o banco de dados de consultas
let queryDatabase: QueryDatabase = emptyDatabase;

export const loadQueryDatabase = async (): Promise<QueryDatabase> => {
  // Se o banco de dados já foi carregado, retorna ele
  if (Object.keys(queryDatabase.queries).length > 0) {
    return queryDatabase;
  }

  try {
    // Em ambiente de desenvolvimento, tenta carregar o arquivo diretamente
    if (process.env.NODE_ENV === 'development') {
      try {
        const response = await fetch('/src/data/query-database.json');
        const data = await response.json();
        queryDatabase = data as QueryDatabase;
      } catch (err) {
        console.warn('Arquivo query-database.json não encontrado, usando banco de dados vazio');
      }
    } else {
      // Em produção, tenta importar o módulo dinâmicamente
      try {
        // Usando importação dinâmica para evitar erro de compilação
        const data = await import(/* webpackIgnore: true */ './query-database.json');
        queryDatabase = data.default as QueryDatabase;
      } catch (err) {
        console.warn('Módulo query-database.json não encontrado, usando banco de dados vazio');
      }
    }
    
    return queryDatabase;
  } catch (error) {
    console.error('Erro ao carregar banco de dados de consultas:', error);
    // Retorna um banco de dados vazio em caso de falha
    return emptyDatabase;
  }
};

// Função para obter todas as consultas de uma categoria
export const getQueriesByCategory = async (category: string): Promise<string[]> => {
  const db = await loadQueryDatabase();
  return db.categories[category]?.queries || [];
};

// Função para obter os resultados de uma consulta específica
export const getQueryResults = async (queryText: string): Promise<QueryDatabaseResult | null> => {
  const db = await loadQueryDatabase();
  return db.queries[queryText]?.result || null;
};

// Função para obter a consulta SPARQL para um texto de consulta específico
export const getSparqlQuery = async (queryText: string): Promise<string | null> => {
  const db = await loadQueryDatabase();
  return db.queries[queryText]?.sparqlQuery || null;
};

// Função para executar uma consulta SPARQL personalizada
export const executeSparqlQuery = async (sparqlQuery: string): Promise<QueryDatabaseResult> => {
  try {
    const response = await fetch('https://ellas.ufmt.br/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Erro ao executar consulta SPARQL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Função para obter todas as categorias disponíveis
export const getAvailableCategories = async (): Promise<string[]> => {
  const db = await loadQueryDatabase();
  return Object.keys(db.categories);
};

// Função para obter estatísticas do banco de dados
export const getDatabaseStats = async (): Promise<{
  totalQueries: number;
  categoryCounts: Record<string, number>;
  lastUpdated: string;
}> => {
  const db = await loadQueryDatabase();
  
  const categoryCounts: Record<string, number> = {};
  let totalQueries = 0;
  
  Object.entries(db.categories).forEach(([category, info]) => {
    categoryCounts[category] = info.count;
    totalQueries += info.count;
  });
  
  return {
    totalQueries,
    categoryCounts,
    lastUpdated: db.metadata.created
  };
}; 