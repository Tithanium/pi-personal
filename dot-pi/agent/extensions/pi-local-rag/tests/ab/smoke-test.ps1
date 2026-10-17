# smoke-test.ps1 — run pi once with a trivial prompt through the same Start-Process mechanism
$ErrorActionPreference = "Stop"
function ConvertTo-CmdArg([string]$s) {
  if ($s -eq '') { return '""' }
  if ($s -notmatch '[\s"]') { return $s }
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('"')
  $bs = 0
  foreach ($ch in $s.ToCharArray()) {
    if ($ch -eq '\') { $bs++; continue }
    if ($ch -eq '"') { [void]$sb.Append(('\' * ($bs * 2 + 1))); [void]$sb.Append('"'); $bs = 0; continue }
    [void]$sb.Append(('\' * $bs)); $bs = 0
    [void]$sb.Append([char]$ch)
  }
  [void]$sb.Append(('\' * ($bs * 2)))
  [void]$sb.Append('"')
  return $sb.ToString()
}
$cli = "C:\Users\connessn\AppData\Roaming\npm\node_modules\@earendil-works\pi-coding-agent\dist\bundle\cli.js"
$prompt = 'Reply with exactly: OK'
$cmdline = (@($cli, "--mode", "json", "-p", "--no-session", "--tools", "read,bash,ls,find,grep", $prompt) | ForEach-Object { ConvertTo-CmdArg $_ }) -join ' '
$outFile = Join-Path $env:TEMP "pi-smoke.out"
$errFile = Join-Path $env:TEMP "pi-smoke.err"
$start = Get-Date
$p = Start-Process -FilePath "node" -ArgumentList $cmdline -RedirectStandardOutput $outFile -RedirectStandardError $errFile -PassThru -NoNewWindow
$p.WaitForExit(300000) | Out-Null
Write-Host "exit=$($p.ExitCode) wall=$([int64]((Get-Date) - $start).TotalMilliseconds)ms"
$lines = [System.IO.File]::ReadAllLines($outFile, [System.Text.Encoding]::UTF8)
Write-Host "json lines: $($lines.Count)"
$text = ""
foreach ($line in $lines) {
  if (-not $line.Trim()) { continue }
  $ev = $null
  try { $ev = $line | ConvertFrom-Json } catch { continue }
  if ($ev.type -eq "message_end" -and $ev.message -and $ev.message.role -eq "assistant") {
    $u = $ev.message.usage
    Write-Host "assistant msg: model=$($ev.message.model) in=$($u.input) out=$($u.output) stop=$($ev.message.stopReason)"
    $parts = @()
    if ($ev.message.content) { foreach ($c in $ev.message.content) { if ($c.type -eq "text") { $parts += $c.text } } }
    $text = ($parts -join "")
  }
}
Write-Host "final text: $text"
if (Test-Path $errFile) { $e = [System.IO.File]::ReadAllText($errFile, [System.Text.Encoding]::UTF8); if ($e.Trim()) { Write-Host "STDERR: $($e.Substring(0, [Math]::Min(400, $e.Length)))" } }
