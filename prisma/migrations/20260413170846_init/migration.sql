-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nomeTecnico" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "lote" TEXT NOT NULL,
    "validade" TIMESTAMP(3) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "cidade" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
