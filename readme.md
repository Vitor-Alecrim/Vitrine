## ⚙️ Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/Vitor-Alecrim/Vitrine.git
```

```bash
cd vitrine
```

### 2. Instalar dependências

```bash
npm install
```

---

## 🔥 Configuração do Firebase

### 1. Criar um projeto

Acesse o Firebase Console e crie um novo projeto.

### 2. Habilitar Authentication

No painel do Firebase:

Authentication → Sign-in Method → Email/Password → Ativar

### 3. Criar banco Firestore

Firestore Database → Criar banco de dados

Utilize o modo de teste durante o desenvolvimento ou configure regras de segurança adequadas para produção.

### 4. Obter as credenciais do Firebase

No painel:

Configurações do Projeto → Seus Apps → Aplicativo Web

Copie as credenciais e preencha o arquivo:

```txt
src/services/firebaseConfig.js
```

Exemplo:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

---

## 👤 Estrutura de Usuários

Após o cadastro, o sistema cria automaticamente um documento na coleção:

```txt
users
```

Exemplo:

```javascript
{
  email: "usuario@email.com",
  role: "user",
  createdAt: new Date()
}
```

Para conceder acesso administrativo, altere manualmente o campo:

```javascript
role: "admin"
```

---

## 🌐 Configuração da API de Upload

O sistema utiliza um servidor local para armazenamento das imagens dos produtos.

No arquivo:

```txt
src/services/api.js
```

Configure o IP da máquina que executará o servidor:

```javascript
export const BASE_URL = "http://SEU_IP:3000";
```

Exemplo:

```javascript
export const BASE_URL = "http://192.168.1.10:3000";
```

⚠️ O dispositivo móvel e o servidor devem estar conectados à mesma rede.

---

## 📱 Configuração do WhatsApp

O sistema envia pedidos diretamente para o WhatsApp através de um número configurado no código.

É necessário substituir o telefone nas seguintes telas:

### Home

Localizar:

```javascript
const numero = "SEU_NUMERO";
```

Exemplo:

```javascript
const numero = "5562999999999";
```

### Detail

Localizar:

```javascript
const phone = "SEU_NUMERO";
```

Exemplo:

```javascript
const phone = "5562999999999";
```

Utilize o número no formato internacional:

```txt
55 + DDD + Número
```

Exemplo:

```txt
5562999999999
```

---

## ▶️ Executando o Projeto

Iniciar o aplicativo:

```bash
npx expo start
```

Iniciar o servidor de upload:

```bash
node server.js
```

---

## 📂 Estrutura do Firestore

### Coleção: users

```javascript
{
  email: "usuario@email.com",
  role: "user",
  createdAt: Timestamp
}
```

### Coleção: pants

```javascript
{
  name: "Calça Jeans",
  price: 129.90,
  colors: ["Azul", "Preto"],
  sizes: ["P", "M", "G"],
  description: "Descrição do produto",
  images: ["imagem1.jpg", "imagem2.jpg"],
  createdAt: Timestamp
}
```