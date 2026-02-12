# Skills - @discovery-solutions/struct

Documentação de referência para desenvolvimento com o framework `@discovery-solutions/struct`. Cada arquivo contém exemplos práticos, sintaxe e melhores práticas.

## Índice de Skills

### Backend / API

#### 1. CRUDController
**Arquivo:** `skills/crud-controller.md`  
**Descrição:** Criação automática de endpoints REST (GET, POST, PATCH, DELETE) com CRUDController. Inclui paginação, filtros, soft delete, populate de relacionamentos e controle de acesso por roles (RBAC).

#### 2. withSession
**Arquivo:** `skills/with-session.md`  
**Descrição:** Proteção de rotas de API com autenticação e autorização usando withSession. Gerencia sessões de usuário, controla acesso baseado em roles e gerencia conexões de banco de dados automaticamente.

#### 3. ModelService
**Arquivo:** `skills/model-service.md`  
**Descrição:** Camada de abstração para operações CRUD com Mongoose. Útil para lógica de negócio customizada, services, background jobs e operações que não sejam expostas via API REST.

### Frontend / Client

#### 4. Fetcher
**Arquivo:** `skills/fetcher.md`  
**Descrição:** Cliente HTTP para fazer requisições à API. Integrado com TanStack Query para cache, retry automático, estados de loading/error e invalidação de queries. Alternativa moderna ao fetch/axios.

#### 5. ModelForm
**Arquivo:** `skills/model-form.md`  
**Descrição:** Componente React para criar formulários em páginas. Renderiza campos automaticamente baseado em um schema, integra validação Zod e faz requisições HTTP automaticamente (create/update).

#### 6. ModalForm
**Arquivo:** `skills/modal-form.md`  
**Descrição:** Componente React para criar formulários em modais/dialogs. Similar ao ModelForm mas exibido em modal. Ideal para CRUDs rápidos sem sair da página. Requer ModalFormProvider.

#### 7. TableView
**Arquivo:** `skills/table-view.md`  
**Descrição:** Componente React para renderizar tabelas de dados com paginação, ordenação e busca. Usa TanStack Table internamente. Ideal para listagens administrativas e CRUDs com layout tabular.

#### 8. ListView
**Arquivo:** `skills/list-view.md`  
**Descrição:** Componente React para renderizar listas customizadas (cards, grids, feeds). Diferente do TableView, permite controle total da UI de cada item. Ideal para layouts não-tabulares e mobile-first.

#### 9. Field Types
**Arquivo:** `skills/field-types.md`  
**Descrição:** Catálogo completo de tipos de campos disponíveis para formulários (text, email, select, date, file, model-select, etc). Inclui propriedades, validações, máscaras e campos condicionais.

### Estrutura / Organização

#### 10. Model Structure
**Arquivo:** `skills/model-structure.md`  
**Descrição:** Padrão recomendado para organizar modelos no projeto. Define estrutura de arquivos (index.ts, model.ts, schema.ts, constants.ts), separação de responsabilidades e convenções de nomenclatura.

## Como usar estas skills

### Para IA Assistants
Ao receber uma solicitação do desenvolvedor:
1. Identifique qual funcionalidade está sendo pedida
2. Consulte a skill correspondente para sintaxe correta e exemplos
3. Use os padrões e estruturas documentados nas skills
4. Cite exemplos práticos do arquivo da skill quando relevante

### Para desenvolvedores
Cada arquivo de skill contém:
- **Descrição:** O que é e para que serve
- **Quando usar:** Casos de uso ideais
- **Como usar:** Sintaxe, imports e props
- **Exemplos:** Código prático do básico ao avançado
- **Dicas:** Melhores práticas e recomendações

## Estrutura dos arquivos

Todos os arquivos seguem um padrão consistente:

```markdown
# Skill: [Nome] - [Descrição curta]

## Descrição
[Descrição detalhada]

## Quando usar
- Caso de uso 1
- Caso de uso 2

## Como usar
[Sintaxe, imports, exemplos básicos]

## Exemplos avançados
[Casos de uso reais]

## Dicas
[Melhores práticas]
```

## Quick Reference

| Preciso... | Consulte |
|------------|----------|
| Criar endpoints CRUD | crud-controller.md |
| Proteger rotas com autenticação | with-session.md |
| Fazer requisições HTTP no frontend | fetcher.md |
| Criar formulário em página | model-form.md |
| Criar formulário em modal | modal-form.md |
| Listar dados em tabela | table-view.md |
| Listar dados em cards/grid | list-view.md |
| Operações de banco customizadas | model-service.md |
| Saber tipos de campos disponíveis | field-types.md |
| Organizar modelos no projeto | model-structure.md |

## Pacote

Todas as skills documentam funcionalidades do pacote:
```bash
npm install @discovery-solutions/struct
```

---

**Última atualização:** 2026-02-12  
**Total de skills:** 10
