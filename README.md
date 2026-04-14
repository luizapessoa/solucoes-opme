# 🏥 Soluções OPME - Backend

API desenvolvida para reduzir perdas financeiras causadas por produtos OPME (Órteses, Próteses e Materiais Especiais) próximos do vencimento, permitindo o gerenciamento e reaproveitamento inteligente desses itens.

---

## 💡 Problema

Empresas frequentemente enfrentam perdas financeiras devido ao vencimento de produtos médicos, sem um sistema eficiente para controle e reaproveitamento desses itens.

---

## 🚀 Solução

Uma API que permite:
- cadastro manual de produtos
- importação em lote via planilhas
- classificação automática com base na validade

---

## 🧠 Funcionalidades

✔ Cadastro e login de empresas (autenticação com JWT)  
✔ Cadastro manual de produtos  
✔ Listagem de produtos ordenados por validade  
✔ Classificação automática de produtos:
- 🟢 Normal  
- 🟡 Atenção (até 60 dias)  
- 🔴 Urgente (até 30 dias)  

✔ Validação de dados no backend  
✔ Importação de produtos via planilha (.xlsx)

---

## 📁 Importação via Planilha

O sistema permite importar produtos em lote através de arquivos Excel (.xlsx).

### Fluxo:
1. Download do modelo padrão  
2. Preenchimento pelos usuários  
3. Upload para a API  
4. Processamento automático dos dados  

### Campos esperados:
- nomeTecnico  
- marca  
- lote  
- validade  
- quantidade  
- cidade  
- preco  

---

## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para proteger rotas sensíveis.

Apenas empresas autenticadas podem cadastrar produtos.

---

## 🛠 Tecnologias utilizadas

- Node.js  
- Express  
- PostgreSQL (Supabase)  
- Prisma ORM  
- JWT (autenticação)  
- bcrypt (criptografia de senha)  

---

## 🔗 Endpoints principais

### 🔐 Autenticação

**POST /empresas/cadastro**  
Cadastra uma nova empresa  

**POST /empresas/login**  
Realiza login e retorna token JWT  

---

### 📦 Produtos

**POST /produtos**  
Cria um novo produto  
(Requer autenticação)

**GET /produtos**  
Lista produtos com:
- dias para vencer  
- status de validade  

**POST /produtos/upload**  
Importa produtos via planilha (.xlsx)  
(Requer autenticação)

---

## 🧪 Exemplo de resposta

```json
{
  "nomeTecnico": "Parafuso Ortopédico",
  "diasParaVencer": 25,
  "statusValidade": "urgente",
  "alerta": "vermelho"
}

📌 Próximos passos
Validação avançada de planilhas
Filtros por cidade e validade
Integração com front-end
Melhorias de segurança
