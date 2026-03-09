# Ejecutar el SQL que agrega theme y color a la tabla products.
# Uso: .\scripts\run-add-theme-color.ps1
# (Te pedirá la contraseña de MySQL root)

$sqlPath = Join-Path $PSScriptRoot "..\src\database\queries\add_product_theme_and_color.sql"
Get-Content $sqlPath -Raw | mysql -u root -p one_step
