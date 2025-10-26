# Activa el entorno y arranca uvicorn sin reload
$venv = Join-Path $PSScriptRoot 'venv\Scripts\Activate.ps1'
if (Test-Path $venv) {
    . $venv
} else {
    Write-Host "No se encontró el virtualenv. Asegúrate de crear uno o modificar este script." -ForegroundColor Yellow
}

Set-Location -Path $PSScriptRoot

Write-Host "Arrancando uvicorn..."
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --log-level debug
