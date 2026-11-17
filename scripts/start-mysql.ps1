$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot '.env.local'
if (!(Test-Path -LiteralPath $envFile)) { throw 'Configure .env.local conforme database/README.md.' }
$settings = @{}
foreach ($line in Get-Content -LiteralPath $envFile) {
    if ($line -match '^([A-Z_]+)=(.*)$') { $settings[$matches[1]] = $matches[2].Trim('"', "'") }
}
if (!$settings.MYSQL_HOME -or !$settings.MYSQL_DATA) { throw 'MYSQL_HOME e MYSQL_DATA são obrigatórios em .env.local.' }
$serverExe = Join-Path $settings.MYSQL_HOME 'bin/mysqld.exe'
$configFile = Join-Path $settings.MYSQL_DATA 'my.ini'
if (!(Test-Path -LiteralPath $serverExe) -or !(Test-Path -LiteralPath $configFile)) { throw 'Instalação local ou configuração MySQL não encontrada.' }
$port = if ($settings.MYSQL_PORT) { [int]$settings.MYSQL_PORT } else { 3307 }
$tcp = New-Object System.Net.Sockets.TcpClient
try { $tcp.Connect('127.0.0.1', $port); Write-Output "A porta local $port já está em uso. Execute npm run db:check para verificar o MySQL."; exit 0 } catch { } finally { $tcp.Dispose() }
Start-Process -FilePath $serverExe -ArgumentList ('--defaults-file="' + $configFile + '"') -WindowStyle Hidden -WorkingDirectory $settings.MYSQL_DATA
Write-Output "MySQL iniciando em 127.0.0.1:$port. Execute npm run db:check para verificar."
