# Skill: Field Types - Tipos de campos para formulários

## Descrição
O `@discovery-solutions/struct` suporta diversos tipos de campos para uso com `ModelForm` e `ModalForm`. Cada tipo é renderizado automaticamente com componentes UI adequados, validação e formatação.

## Tipos disponíveis

### text
Campo de texto simples.

```typescript
{
  name: "nome",
  type: "text",
  label: "Nome Completo",
  placeholder: "João Silva",
  required: true
}
```

### email
Campo para email com validação automática.

```typescript
{
  name: "email",
  type: "email",
  label: "Email",
  placeholder: "joao@example.com",
  required: true
}
```

### password
Campo para senha (input mascarado).

```typescript
{
  name: "password",
  type: "password",
  label: "Senha",
  placeholder: "••••••",
  required: true
}
```

### number
Campo numérico.

```typescript
{
  name: "age",
  type: "number",
  label: "Idade",
  placeholder: "25",
  min: 18,
  max: 100
}
```

### textarea
Campo de texto multilinha.

```typescript
{
  name: "bio",
  type: "textarea",
  label: "Biografia",
  placeholder: "Conte sobre você...",
  rows: 4
}
```

### checkbox
Caixa de seleção (boolean).

```typescript
{
  name: "active",
  type: "checkbox",
  label: "Ativo"
}
```

### switch
Interruptor on/off (boolean).

```typescript
{
  name: "notifications",
  type: "switch",
  label: "Receber Notificações"
}
```

### select
Seleção de opções (dropdown).

```typescript
{
  name: "role",
  type: "select",
  label: "Cargo",
  required: true,
  options: [
    { label: "Administrador", value: "admin" },
    { label: "Usuário", value: "user" },
    { label: "Gerente", value: "manager" }
  ]
}
```

### radio
Seleção única com botões de rádio.

```typescript
{
  name: "plan",
  type: "radio",
  label: "Plano",
  required: true,
  options: [
    { label: "Básico", value: "basic" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" }
  ]
}
```

### date
Seletor de data.

```typescript
{
  name: "birthDate",
  type: "date",
  label: "Data de Nascimento"
}
```

### datetime
Seletor de data e hora.

```typescript
{
  name: "appointmentAt",
  type: "datetime",
  label: "Data e Hora do Agendamento"
}
```

### time
Seletor de hora.

```typescript
{
  name: "startTime",
  type: "time",
  label: "Horário de Início"
}
```

### file
Upload de arquivo.

```typescript
{
  name: "document",
  type: "file",
  label: "Documento",
  accept: ".pdf,.doc,.docx",
  maxSize: 5242880
}
```

### image
Upload de imagem.

```typescript
{
  name: "cover",
  type: "image",
  label: "Imagem de Capa",
  accept: "image/*"
}
```

### avatar
Upload de avatar (circular).

```typescript
{
  name: "avatar",
  type: "avatar",
  label: "Foto de Perfil"
}
```

### color
Seletor de cor.

```typescript
{
  name: "brandColor",
  type: "color",
  label: "Cor da Marca"
}
```

### url
Campo para URLs.

```typescript
{
  name: "website",
  type: "url",
  label: "Website",
  placeholder: "https://example.com"
}
```

### phone
Campo para telefone.

```typescript
{
  name: "phone",
  type: "phone",
  label: "Telefone",
  placeholder: "(11) 99999-9999",
  mask: "(99) 99999-9999"
}
```

### currency
Campo para valores monetários.

```typescript
{
  name: "price",
  type: "currency",
  label: "Preço",
  placeholder: "R$ 0,00",
  currency: "BRL"
}
```

### model-select
Seleção de registros de outro modelo (relação).

```typescript
{
  name: "enterprise",
  type: "model-select",
  label: "Empresa",
  model: "identity/enterprise",
  required: true
}
```

### multiselect
Seleção múltipla de opções.

```typescript
{
  name: "permissions",
  type: "multiselect",
  label: "Permissões",
  options: [
    { label: "Leitura", value: "read" },
    { label: "Escrita", value: "write" },
    { label: "Deletar", value: "delete" }
  ]
}
```

### tags
Campo para adicionar tags.

```typescript
{
  name: "tags",
  type: "tags",
  label: "Tags"
}
```

### rating
Campo de avaliação (estrelas).

```typescript
{
  name: "rating",
  type: "rating",
  label: "Avaliação",
  max: 5
}
```

### slider
Controle deslizante para números.

```typescript
{
  name: "volume",
  type: "slider",
  label: "Volume",
  min: 0,
  max: 100,
  step: 1
}
```

### rich-text
Editor de texto rico (WYSIWYG).

```typescript
{
  name: "content",
  type: "rich-text",
  label: "Conteúdo"
}
```

### markdown
Editor de markdown.

```typescript
{
  name: "description",
  type: "markdown",
  label: "Descrição"
}
```

### code
Editor de código.

```typescript
{
  name: "snippet",
  type: "code",
  label: "Snippet de Código",
  language: "javascript"
}
```

### json
Editor de JSON.

```typescript
{
  name: "config",
  type: "json",
  label: "Configuração"
}
```

## Propriedades comuns

Todos os campos suportam:

```typescript
interface FieldInterface {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  className?: string;
  disabled?: boolean;
  description?: string;
  colSpan?: number;
  conditional?: {
    field: string;
    value: string | string[];
  };
}
```

## Exemplos avançados

### Campo condicional
Mostra o campo apenas se outra condição for atendida:

```typescript
{
  name: "specificDetails",
  type: "textarea",
  label: "Detalhes Específicos",
  conditional: {
    field: "type",
    value: "advanced"
  }
}
```

### Campo com colSpan
Controla quantas colunas o campo ocupa em um layout grid:

```typescript
{
  name: "fullDescription",
  type: "textarea",
  label: "Descrição Completa",
  colSpan: 2
}
```

### Campo com descrição
Adiciona texto de ajuda abaixo do campo:

```typescript
{
  name: "password",
  type: "password",
  label: "Senha",
  description: "Mínimo de 8 caracteres com letras e números",
  required: true
}
```

### Campo com máscara
Formata automaticamente o valor digitado:

```typescript
{
  name: "cpf",
  type: "text",
  label: "CPF",
  mask: "999.999.999-99",
  placeholder: "000.000.000-00"
}
```

## Dicas
- Use `model-select` para relacionamentos entre entidades
- Use `colSpan` para controlar o layout
- Use `conditional` para campos dinâmicos
- Combine com validação Zod para validação robusta
- Use `description` para ajudar o usuário
- Para campos customizados, crie um renderer próprio
