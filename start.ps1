# ============================================================
#  start.ps1 — Inicialização completa do sistema
#  Uso: npm run start:all   (ou: powershell -File start.ps1)
# ============================================================

Write-Host ""
Write-Host "=== Sistema de Gestao - Loja de Bebidas ===" -ForegroundColor Cyan
Write-Host ""

# 1. Banco de dados: init
Write-Host "[1/3] Inicializando banco de dados..." -ForegroundColor Yellow
npm run db:init
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao inicializar o banco. Abortando." -ForegroundColor Red
    exit 1
}

# 2. Banco de dados: seed
Write-Host ""
Write-Host "[2/3] Populando banco com dados de exemplo..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao popular o banco. Abortando." -ForegroundColor Red
    exit 1
}

# 3. Iniciar servidor em nova janela
Write-Host ""
Write-Host "[3/3] Iniciando servidor da API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'npm run dev'

# Aguarda o servidor subir
Write-Host "      Aguardando servidor iniciar..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# 4. Abrir navegador
Write-Host ""
Write-Host "Abrindo o sistema no navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/login.html"

Write-Host ""
Write-Host "Pronto! Sistema disponivel em http://localhost:3000/login.html" -ForegroundColor Green
Write-Host ""