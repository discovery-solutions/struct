# Skill: ListView - Listas customizadas

## Descrição
`ListView` é um componente React do `@discovery-solutions/struct` para renderizar listas de dados de forma customizada com suporte a paginação, loading states e integração automática com endpoints. Diferente do TableView, permite controle total sobre a UI de cada item.

## Quando usar
- Listas com layout customizado (cards, grid, etc)
- Galerias de imagens/produtos
- Feeds de conteúdo
- Layouts não-tabulares
- Mobile-first designs

## Como usar

### Import
```typescript
import { ListView } from "@discovery-solutions/struct/client";
```

### Props disponíveis
```typescript
interface ListViewProps<T> {
  endpoint: string;
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  enablePagination?: boolean;
  pageSize?: number;
  LoadingComponent?: React.ComponentType;
  EmptyComponent?: React.ComponentType;
  ErrorComponent?: React.ComponentType<{ error: Error }>;
}
```

## Exemplo básico

```typescript
import { ListView } from "@discovery-solutions/struct/client";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  return (
    <ListView<Product>
      endpoint="products"
      renderItem={(product) => (
        <div className="card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>R$ {product.price}</p>
        </div>
      )}
      keyExtractor={(product) => product._id}
    />
  );
}
```

## Exemplos de uso

### Lista de cards

```typescript
export default function UsersPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ListView<UserInterface>
        endpoint="identity/users"
        renderItem={(user) => (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || "/default-avatar.png"} 
                className="w-12 h-12 rounded-full" 
              />
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
            </div>
          </div>
        )}
        keyExtractor={(user) => user._id}
      />
    </div>
  );
}
```

### Feed de posts

```typescript
interface Post {
  _id: string;
  title: string;
  content: string;
  author: { name: string; avatar: string };
  createdAt: Date;
  likes: number;
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <ListView<Post>
        endpoint="posts"
        enablePagination={true}
        pageSize={10}
        renderItem={(post) => (
          <article className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={post.author.avatar} 
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1">
                <Heart className="w-5 h-5" />
                {post.likes}
              </button>
            </div>
          </article>
        )}
        keyExtractor={(post) => post._id}
      />
    </div>
  );
}
```

### Galeria de produtos

```typescript
export default function ProductGallery() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <ListView<Product>
        endpoint="products"
        renderItem={(product) => (
          <div className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={product.image}
                className="w-full h-64 object-cover group-hover:scale-110 transition"
              />
              {product.discount && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-lg font-bold">R$ {product.price}</p>
          </div>
        )}
        keyExtractor={(product) => product._id}
      />
    </div>
  );
}
```

### Com paginação

```typescript
<ListView<Product>
  endpoint="products"
  enablePagination={true}
  pageSize={12}
  renderItem={(product) => <ProductCard product={product} />}
  keyExtractor={(product) => product._id}
/>
```

### Com componente customizado de loading

```typescript
function CustomLoader() {
  return (
    <div className="flex justify-center items-center py-20">
      <Spinner size="lg" />
      <p className="ml-3">Carregando produtos...</p>
    </div>
  );
}

<ListView<Product>
  endpoint="products"
  LoadingComponent={CustomLoader}
  renderItem={(product) => <ProductCard product={product} />}
  keyExtractor={(product) => product._id}
/>
```

### Com componente de lista vazia

```typescript
function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
      <button className="mt-4 btn-primary">
        Adicionar Produto
      </button>
    </div>
  );
}

<ListView<Product>
  endpoint="products"
  EmptyComponent={EmptyState}
  renderItem={(product) => <ProductCard product={product} />}
  keyExtractor={(product) => product._id}
/>
```

### Com tratamento de erro

```typescript
function ErrorState({ error }: { error: Error }) {
  return (
    <div className="text-center py-20">
      <p className="text-red-500">Erro ao carregar produtos</p>
      <p className="text-gray-600">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 btn-secondary"
      >
        Tentar Novamente
      </button>
    </div>
  );
}

<ListView<Product>
  endpoint="products"
  ErrorComponent={ErrorState}
  renderItem={(product) => <ProductCard product={product} />}
  keyExtractor={(product) => product._id}
/>
```

### Lista com ações (edit/delete)

```typescript
function UsersList() {
  const { openModal } = useModalForm();
  
  return (
    <ListView<UserInterface>
      endpoint="identity/users"
      renderItem={(user) => (
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openModal({ 
                id: user._id, 
                modalId: "user-edit" 
              })}
              className="btn-sm btn-primary"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              className="btn-sm btn-danger"
            >
              Deletar
            </button>
          </div>
        </div>
      )}
      keyExtractor={(user) => user._id}
    />
  );
}
```

## Comportamento automático

### Loading states
- Mostra LoadingComponent durante fetch
- Tratamento de erro com ErrorComponent
- Mostra EmptyComponent quando não há dados

### Paginação
- Controles de paginação automáticos
- Requisições com `?page=X&limit=Y`
- Navegação entre páginas

### Integração com TanStack Query
- Cache automático de dados
- Refetch em atualizações
- Invalidação de queries

## Diferenças entre ListView e TableView

### ListView
- Layout completamente customizado
- Melhor para cards, grids, galerias
- Mobile-friendly
- Controle total da UI

### TableView
- Layout tabular fixo
- Melhor para dados tabulares
- Ordenação por coluna
- Desktop-first

## Dicas
- Use `keyExtractor` para performance otimizada
- Configure `pageSize` conforme layout
- Customize LoadingComponent para melhor UX
- Combine com ModalForm para edição inline
- Use grid CSS para layouts responsivos
- Ideal para mobile e designs criativos
