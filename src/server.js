const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middlewares/auth')
require('dotenv').config()
const multer = require('multer')
const XLSX = require('xlsx')
const upload = multer({ dest: 'uploads/' })

console.log('🔄 Iniciando servidor...')

const prisma = require('./prisma')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/produtos', async (req, res) => {
  try {
    console.log('📦 Requisição GET /produtos')

    const produtos = await prisma.produto.findMany({
      orderBy: {
        validade: 'asc'
      },
      include: {
        empresa: true
      }
    })

    const produtosComStatus = produtos.map((produto) => {
      const hoje = new Date()
      const validade = new Date(produto.validade)

      const diferencaMs = validade - hoje
      const diasParaVencer = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24))

      let statusValidade = 'normal'
      let alerta = 'verde'

      if (diasParaVencer <= 30) {
        statusValidade = 'urgente'
        alerta = 'vermelho'
      } else if (diasParaVencer <= 60) {
        statusValidade = 'atenção'
        alerta = 'amarelo'
      }

      return {
        ...produto,
        diasParaVencer,
        statusValidade,
        alerta
      }
    })

    res.json(produtosComStatus)
  } catch (error) {
    console.error('❌ Erro no GET /produtos:', error)
    res.status(500).json({ erro: error.message })
  }
})

// criar produto
app.post('/produtos', authMiddleware, async (req, res) => {
  console.log('📥 Bateu na rota POST /produtos')
  console.log('📨 Body recebido:', req.body)

  const {
  nomeTecnico,
  marca,
  lote,
  validade,
  quantidade,
  cidade,
  preco
} = req.body

const empresaId = req.empresa.id

  if (!nomeTecnico) {
    return res.status(400).json({ erro: 'Nome técnico é obrigatório' })
  }

  if (!marca) {
    return res.status(400).json({ erro: 'Marca é obrigatória' })
  }

  if (!lote) {
    return res.status(400).json({ erro: 'Lote é obrigatório' })
  }

  if (!validade) {
    return res.status(400).json({ erro: 'Validade é obrigatória' })
  }

  if (isNaN(new Date(validade).getTime())) {
    return res.status(400).json({ erro: 'Data de validade inválida' })
  }

  if (quantidade === undefined || quantidade === null) {
    return res.status(400).json({ erro: 'Quantidade é obrigatória' })
  }

  if (!cidade) {
    return res.status(400).json({ erro: 'Cidade é obrigatória' })
  }

  if (preco === undefined || preco === null) {
    return res.status(400).json({ erro: 'Preço é obrigatório' })
  }

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nomeTecnico,
        marca,
        lote,
        validade: new Date(validade),
        quantidade,
        cidade,
        preco,
        empresaId
      }
    })

    console.log('✅ Produto criado com sucesso')
    res.status(201).json(novoProduto)
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error)
    res.status(500).json({ erro: error.message })
  }
})

app.post('/empresas/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body

  try {
    // 1. verificar se já existe empresa
    const empresaExistente = await prisma.empresa.findUnique({
      where: {
        email: email
      }
    })

    if (empresaExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }

    // 2. gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // 3. criar empresa
    const novaEmpresa = await prisma.empresa.create({
      data: {
        nome,
        email,
        senha: senhaHash
      }
    })

    // 4. retornar sem a senha
    res.status(201).json({
      id: novaEmpresa.id,
      nome: novaEmpresa.nome,
      email: novaEmpresa.email
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
})

// login
app.post('/empresas/login', async (req, res) => {
  const { email, senha } = req.body

  try {
    const empresa = await prisma.empresa.findUnique({
      where: {
        email: email
      }
    })

    if (!empresa) {
      return res.status(400).json({ erro: 'Email ou senha inválidos' })
    }

    const senhaCorreta = await bcrypt.compare(senha, empresa.senha)

    if (!senhaCorreta) {
      return res.status(400).json({ erro: 'Email ou senha inválidos' })
    }

    const token = jwt.sign(
      {
        id: empresa.id,
        email: empresa.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        email: empresa.email
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: error.message })
  }
})

app.post('/produtos/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const file = req.file

    if (!file) {
      return res.status(400).json({ erro: 'Arquivo não enviado' })
    }

    const workbook = XLSX.readFile(file.path)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const dados = XLSX.utils.sheet_to_json(sheet)

    if (!dados.length) {
      return res.status(400).json({ erro: 'A planilha está vazia' })
    }

    const empresaId = req.empresa.id

    const produtos = dados.map((item) => ({
      nomeTecnico: item.nomeTecnico,
      marca: item.marca,
      lote: item.lote,
      validade: new Date(item.validade),
      quantidade: item.quantidade,
      cidade: item.cidade,
      preco: item.preco,
      empresaId
    }))

    await prisma.produto.createMany({
      data: produtos
    })

    return res.status(201).json({
      mensagem: 'Produtos importados com sucesso',
      total: produtos.length
    })
  } catch (error) {
    console.error('❌ Erro no upload:', error)
    return res.status(500).json({ erro: error.message })
  }
})

const PORT = process.env.PORT || 3001

console.log('🛠 Preparando servidor...')

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})