# ELLAS Platform

## Dados Abertos para Equidade de Gênero em Ciências e Tecnologia na América Latina
### Open Data for Gender Equity in Science and Technology in Latin America

---

## Descrição do Projeto

ELLAS é uma plataforma web desenvolvida para promover a equidade de gênero em ciências e tecnologia na América Latina através de dados abertos e visualizações interativas. O sistema integra informações sobre políticas públicas, iniciativas, fatores contextuais e impactos relacionados à participação feminina em STEM (Science, Technology, Engineering and Mathematics).

### Principais Funcionalidades

- Consultas SPARQL integradas sobre políticas de gênero em STEM
- Visualizações interativas de dados geográficos
- Exportação de relatórios em PDF e CSV
- Sistema de busca avançada multi-idioma (Português, Inglês, Espanhol)
- Mapas interativos da América Latina
- Gráficos e dashboards analíticos
- Sistema de autenticação e autorização

---

## Arquitetura do Sistema

### Frontend
- **Framework:** React 18.3.1 com TypeScript
- **UI/UX:** Tailwind CSS, Chakra UI, Material-UI
- **Mapas:** Google Maps API, React-Simple-Maps
- **Gráficos:** Recharts, D3.js
- **Internacionalização:** i18next
- **Roteamento:** React Router v6
- **Exportação:** jsPDF, jsPDF-AutoTable

### Backend
- **Runtime:** Node.js com Express.js
- **Banco de Dados:** 
  - Neo4j (Grafos - Dados principais)
  - SQLite (Dados relacionais auxiliares)
- **Consultas:** SPARQL via sparql-http-client
- **Autenticação:** JWT (JSON Web Tokens)
- **ORM:** Sequelize

---

## Requisitos do Sistema

### Pré-requisitos
- Node.js (v18.20.8 ou superior)
- Neo4j (v4.0 ou superior)
- NPM ou Yarn

---

## Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <repository-url>
cd ELLAS
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Configurar variáveis de ambiente (copiar `.env.example` e preencher com suas credenciais):
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=sua_senha_aqui
JWT_SECRET=seu_jwt_secret_aqui
PORT=3002
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

### 4. Iniciar Neo4j

```bash
# Verificar versão
neo4j --version

# Verificar status
sudo systemctl status neo4j

# Recarregar daemon
sudo systemctl daemon-reload

# Reiniciar serviço
sudo systemctl restart neo4j

# Verificar logs
sudo journalctl -u neo4j.service

# Acessar shell
cypher-shell -u neo4j -p ellas2024
```

---

## Execução do Sistema

### Iniciar Backend
```bash
cd backend
npm start
```
O backend estará disponível em `http://localhost:3002`

### Iniciar Frontend
```bash
cd frontend
npm start
```
O frontend estará disponível em `http://localhost:3000`

---

## Estrutura de Diretórios

```
ELLAS/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controladores da API
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Lógica de negócio
│   │   ├── models/           # Modelos de dados
│   │   ├── config/           # Configurações
│   │   ├── migrations/       # Migrações do banco
│   │   ├── seeders/          # Seeds de dados
│   │   ├── neo4j.js          # Conexão Neo4j
│   │   └── sparqlQueries.js  # Queries SPARQL
│   ├── server.js             # Entrada da aplicação
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Serviços de API
│   │   ├── contexts/         # Contextos React
│   │   ├── hooks/            # Hooks customizados
│   │   ├── utils/            # Utilitários
│   │   ├── locales/          # Traduções (pt, en, es)
│   │   ├── routes/           # Configuração de rotas
│   │   └── styles/           # Estilos globais
│   ├── public/               # Arquivos estáticos
│   └── package.json
│
├── scripts/                  # Scripts utilitários
└── README.md
```

---

## Funcionalidades Principais

### 1. Consultas de Dados
- Políticas públicas de gênero em STEM por país
- Iniciativas e programas de inclusão
- Fatores contextuais que impactam a participação feminina
- Análise de impactos de políticas implementadas

### 2. Visualizações
- Mapas interativos da América Latina
- Gráficos de barras, linhas e pizza
- Dashboards analíticos
- Tabelas de dados com ordenação e filtragem

### 3. Exportação
- Relatórios em PDF formatados
- Exportação de dados em CSV
- Exportação de visualizações como imagens

### 4. Multilíngue
- Suporte para Português, Inglês e Espanhol
- Tradução dinâmica de interface
- Localização de nomes de países e entidades

---

## API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário
- `GET /auth/verify` - Verificar token

### Consultas SPARQL
- `POST /queries/execute` - Executar query SPARQL customizada
- `GET /queries/policies` - Listar políticas
- `GET /queries/initiatives` - Listar iniciativas
- `GET /queries/factors` - Listar fatores contextuais

### Neo4j
- `GET /neo4j/test` - Testar conexão
- `POST /neo4j/query` - Executar query Cypher

---

## Tecnologias Utilizadas

### Frontend
- React, TypeScript, Tailwind CSS
- Chakra UI, Material-UI, Emotion
- React Router, i18next, Axios
- Recharts, D3.js, React-Simple-Maps
- jsPDF, file-saver, html2canvas

### Backend
- Node.js, Express.js
- Neo4j Driver, SPARQL Client
- Sequelize, SQLite
- JWT, bcrypt, cors

---

## Desenvolvimento

### Scripts Disponíveis

#### Frontend
```bash
npm start          # Iniciar servidor de desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
npm run eject      # Ejetar configuração
```

#### Backend
```bash
npm start          # Iniciar servidor com nodemon
npm test           # Executar testes
```

---

## Comandos Neo4j Úteis

```bash
# Verificar versão
neo4j --version

# Status do serviço
sudo systemctl status neo4j

# Recarregar configurações
sudo systemctl daemon-reload

# Reiniciar serviço
sudo systemctl restart neo4j

# Parar serviço
sudo systemctl stop neo4j

# Iniciar serviço
sudo systemctl start neo4j

# Ver logs
sudo journalctl -u neo4j.service

# Acessar shell Cypher
cypher-shell -u neo4j -p ellas2024
```

---

## Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Neo4j**
   - Verificar se o serviço está rodando: `sudo systemctl status neo4j`
   - Verificar credenciais no arquivo de configuração
   - Verificar logs: `sudo journalctl -u neo4j.service`

2. **Porta já em uso**
   - Frontend (3000): `lsof -ti:3000 | xargs kill -9`
   - Backend (3002): `lsof -ti:3002 | xargs kill -9`

3. **Problemas de CORS**
   - Verificar configuração de CORS no backend (`server.js`)
   - Verificar proxy no frontend (`setupProxy.js`)

4. **Erros de compilação do Frontend**
   - Limpar cache: `rm -rf node_modules package-lock.json && npm install`
   - Verificar versão do Node.js

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

---

## Autor

André Araújo

---

## Contato

Para mais informações sobre o projeto ELLAS, entre em contato através da plataforma.

---

## Observações

- Este é um projeto em desenvolvimento ativo
- Consulte a documentação técnica em `/frontend/docs` para mais detalhes
- Reporte bugs e sugestões através das issues do repositório
