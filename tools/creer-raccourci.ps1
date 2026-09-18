# Crée le raccourci « FL Briefing Board » sur le bureau.
#
# L'outil s'ouvre en mode application : une fenêtre à lui, sans barre d'adresse ni
# onglets, comme un logiciel. Navigateur utilisé : Brave, à défaut Chrome, à défaut
# Edge ; si aucun n'est trouvé, le raccourci ouvre index.html dans le navigateur
# par défaut.
#
# Toujours ouvrir l'outil avec le même navigateur : les planches sont conservées
# dans le navigateur qui les a vues, pas dans le dossier du projet.
#
# Usage : clic droit > « Exécuter avec PowerShell », ou
#         powershell -ExecutionPolicy Bypass -File tools\creer-raccourci.ps1

$ErrorActionPreference = 'Stop'

$root  = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'
$icon  = Join-Path $root 'assets\fl-briefing-board.ico'
$url   = ([Uri]$index).AbsoluteUri

$browsers = @(
  "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe",
  "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$exe = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1

$lnkPath = Join-Path ([Environment]::GetFolderPath('Desktop')) 'FL Briefing Board.lnk'
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut($lnkPath)
if ($exe) {
  $lnk.TargetPath       = $exe
  $lnk.Arguments        = "--app=$url"
  $lnk.WorkingDirectory = Split-Path -Parent $exe
} else {
  $lnk.TargetPath       = $index
  $lnk.WorkingDirectory = $root
}
$lnk.IconLocation = "$icon,0"
$lnk.Description  = 'FL Briefing Board - tableau de briefing et de debriefing de vol'
$lnk.Save()

"Raccourci créé : $lnkPath"
if ($exe) { "Ouvre : $exe --app=$url" } else { "Ouvre : $index (navigateur par défaut)" }
