# 🏥 Soluções OPME - Backend

API desenvolvida para gestão e reaproveitamento de produtos OPME (Órteses, Próteses e Materiais Especiais), com foco no controle de validade e redução de desperdícios.

## 🚀 Objetivo

Conectar empresas que possuem produtos próximos do vencimento com outras que podem utilizá-los, evitando perdas financeiras e otimizando o uso de recursos.

---

## 🧠 Funcionalidades

✔ Cadastro e login de empresas (autenticação com JWT)  
✔ Cadastro de produtos  
✔ Listagem de produtos com ordenação por validade  
✔ Regra de negócio para classificação de produtos:
- 🟢 Normal  
- 🟡 Atenção (até 60 dias)  
- 🔴 Urgente (até 30 dias)  

✔ Validação de dados no backend  
✔ Estrutura pronta para evolução com upload de planilhas  

---

## 🛠 Tecnologias utilizadas

- Node.js  
- Express  
- PostgreSQL (Supabase)  
- Prisma ORM  
- JWT (autenticação)  
- bcrypt (criptografia de senha)  

---

## 📊 Estrutura do Projeto

backend/
│
├── src/
│ ├── server.js
│ ├── prisma.js
│ └── middlewares/
│ └── auth.js
│
├── prisma/
│ └── schema.prisma
│
├── .env
├── package.json


---

## 🔗 Endpoints principais

### 🔐 Autenticação

**POST /empresas/cadastro**
- Cadastra uma nova empresa

**POST /empresas/login**
- Realiza login e retorna token JWT

---

### 📦 Produtos

**POST /produtos**
- Cria um novo produto  
- Requer autenticação  

**GET /produtos**
- Lista produtos com:
  - dias para vencer
  - status de validade

---

## 🧪 Exemplo de resposta

```json
{
  "nomeTecnico": "Parafuso Ortopédico",
  "diasParaVencer": 25,
  "statusValidade": "urgente",
  "alerta": "vermelho"
}
