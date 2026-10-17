# test-argquote.ps1 — verify Start-Process single-string ArgumentLine passes a prompt intact
function ConvertTo-CmdArg([string]$s) {
  if ($s -eq '') { return '""' }
  if ($s -notmatch '[\s"]') { return $s }
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('"')
  $bs = 0
  foreach ($ch in $s.ToCharArray()) {
    if ($ch -eq '\') { $bs++; continue }
    if ($ch -eq '"') {
      [void]$sb.Append(('\' * ($bs * 2 + 1)))
      [void]$sb.Append('"')
      $bs = 0
      continue
    }
    [void]$sb.Append(('\' * $bs))
    $bs = 0
    [void]$sb.Append([char]$ch)
  }
  [void]$sb.Append(('\' * ($bs * 2)))
  [void]$sb.Append('"')
  return $sb.ToString()
}

$node = "node"
$testJs = Join-Path $env:TEMP "test-argv.js"
$js = 'var out = JSON.stringify(process.argv.slice(2)); process.stdout.write(out + "\n");'
Set-Content -Path $testJs -Value $js -Encoding ASCII
$expected = 'Task: The user asks: what is fd.ModelingSpace("2Dplane") - and how is "quad4" elm_type used? It has "quotes" and a \backslash\ and spaces.'
$parts = @($testJs, "--mode", "json", "-p", $expected)
$cmdline = ($parts | ForEach-Object { ConvertTo-CmdArg $_ }) -join ' '
Write-Host "CMDLINE: $cmdline"
$outFile = Join-Path $env:TEMP "test-arg.out"
$errFile = Join-Path $env:TEMP "test-arg.err"
$p = Start-Process -FilePath $node -ArgumentList $cmdline -RedirectStandardOutput $outFile -RedirectStandardError $errFile -PassThru -NoNewWindow
$p.WaitForExit(30000) | Out-Null
Write-Host "exit=$($p.ExitCode)"
$nodeSaw = [System.IO.File]::ReadAllText($outFile, [System.Text.Encoding]::UTF8).Trim()
Write-Host "NODE SAW: $nodeSaw"
$argv = $nodeSaw | ConvertFrom-Json
$last = $argv[$argv.Length - 1]
if ($last -eq $expected) { Write-Host "PASS: prompt arrived intact as a single argv" } else { Write-Host "FAIL: mismatch"; Write-Host "EXPECTED: $expected" }
if (Test-Path $errFile) { $e = Get-Content $errFile -Raw; if ($e.Trim()) { Write-Host "STDERR: $e" } }
Remove-Item $testJs,$outFile,$errFile -ErrorAction SilentlyContinue
