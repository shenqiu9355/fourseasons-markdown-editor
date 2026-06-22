param(
  [string]$Workspace = "",
  [int]$Port = 7865,
  [string]$HostName = "127.0.0.1"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Editor = Join-Path $Root "editor"
$Server = Join-Path $Editor "server.py"
$Config = Join-Path $Editor "config.json"

if (-not (Test-Path $Config)) {
  Copy-Item -LiteralPath (Join-Path $Editor "config.example.json") -Destination $Config
}

$Args = @($Server, "--host", $HostName, "--port", "$Port", "--config", $Config)
if ($Workspace -ne "") {
  $Args += @("--workspace", $Workspace)
}

Write-Host "Starting Four Seasons Markdown Editor..."
Write-Host "URL: http://$HostName`:$Port"
python @Args
