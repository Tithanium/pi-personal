# run-pi-tests.ps1 — end-to-end pi -p tests for the background-index extension
$ErrorActionPreference = "Continue"
$ROOT = "C:\Users\connessn\rag_bg_test"
$RAG  = "C:\Users\connessn\rag_bg_test\rag_pi"
$PASS = 0; $FAIL = 0
function Ok($name, $cond, $extra = "") {
  if ($cond) { $script:PASS++; Write-Output "PASS [$name] $extra" }
  else       { $script:FAIL++; Write-Output "FAIL [$name] $extra" }
}
function Orphans($dir) {
  if (-not (Test-Path $dir)) { @() } else {
    Get-ChildItem $dir -File | Where-Object { $_.Name -like "rag.db.build-*" -or $_.Name -like "rag.db.old-*" } | ForEach-Object { $_.Name }
  }
}
function LastBuild($ragDir) {
  return node "$PSScriptRoot\read-lastbuild.cjs" $ragDir
}

function Run-Pi($envExtra, $prompt) {
  # clear + set env (child inherits the session environment)
  Remove-Item env:PI_RAG_BG_WAIT -ErrorAction SilentlyContinue
  if ($envExtra) { $envExtra.GetEnumerator() | ForEach-Object { Set-Item "env:$($_.Key)" $_.Value } }
  Set-Item env:PI_RAG_DIR $RAG
  $outFile = Join-Path $ROOT "pi-out.txt"
  $errFile = Join-Path $ROOT "pi-err.txt"
  Remove-Item $outFile, $errFile -ErrorAction SilentlyContinue
  $ms = (Measure-Command {
    $p = Start-Process -FilePath (Get-Command pi.cmd).Source -ArgumentList @('-p', ('"' + $prompt + '"')) -WorkingDirectory $ROOT -NoNewWindow -Wait -PassThru -RedirectStandardOutput $outFile -RedirectStandardError $errFile
  }).TotalMilliseconds
  $out = if (Test-Path $outFile) { Get-Content $outFile -Raw } else { "" }
  $err = if (Test-Path $errFile) { Get-Content $errFile -Raw } else { "" }
  return @{ Out = $out; Err = $err; Exit = $p.ExitCode; Ms = [int]$ms }
}

Write-Output "=== P2: stale store, print mode -> skip background refresh, fast turn ==="
node "$PSScriptRoot\setup-pi-store.mjs" stale | Out-Null
$r = Run-Pi $null "Reply with the single word P2"
Write-Output ("    ms=$($r.Ms) exit=$($r.Exit)")
Write-Output ("    stderr: " + (($r.Err -split "`n") | Where-Object { $_ -match "rag" } | Select-Object -First 4 | ForEach-Object { $_.Trim() }) -join " | ")
Ok "P2 response" ($r.Out -match "P2") ($r.Out.Trim().Substring(0, [Math]::Min(60, $r.Out.Trim().Length)))
Ok "P2 skip message" ($r.Err -match "background refresh skipped")
Ok "P2 fast" ($r.Ms -lt 120000)
Ok "P2 no orphans" ((Orphans $RAG).Count -eq 0) ((Orphans $RAG) -join ",")
$lb = LastBuild $RAG
Ok "P2 last_build still stale (no rebuild happened)" ($lb -lt (Get-Date).AddHours(-40).ToString("o")) $lb

Write-Output ""
Write-Output "=== P3: stale store + PI_RAG_BG_WAIT=1 -> awaited background refresh, last_build updated ==="
node "$PSScriptRoot\setup-pi-store.mjs" stale | Out-Null
$r = Run-Pi @{ PI_RAG_BG_WAIT = "1" } "Reply with the single word P3"
Write-Output ("    ms=$($r.Ms) exit=$($r.Exit)")
Write-Output ("    stderr: " + (($r.Err -split "`n") | Where-Object { $_ -match "rag" } | Select-Object -First 6 | ForEach-Object { $_.Trim() }) -join " | ")
Ok "P3 response" ($r.Out -match "P3") ($r.Out.Trim().Substring(0, [Math]::Min(60, $r.Out.Trim().Length)))
Ok "P3 started message" ($r.Err -match "background refresh started")
Ok "P3 done message" ($r.Err -match "background refresh done")
$lb = LastBuild $RAG
$lbDate = [DateTime]::Parse($lb)
$ok_dt = $lbDate -gt [DateTime]::UtcNow.AddMinutes(-5)
Ok "P3 last_build updated" $ok_dt $lb
Ok "P3 no orphans" ((Orphans $RAG).Count -eq 0) ((Orphans $RAG) -join ",")

Write-Output ""
Write-Output "=== P4: orphaned secondary cleaned at extension startup ==="
node "$PSScriptRoot\setup-pi-store.mjs" fresh | Out-Null
Set-Content -Path (Join-Path $RAG "rag.db.build-999-00000000") -Value "fake orphan"
Set-Content -Path (Join-Path $RAG "rag.db.build-999-00000000-wal") -Value "fake orphan wal"
$r = Run-Pi $null "Reply with the single word P4"
Ok "P4 response" ($r.Out -match "P4") ($r.Out.Trim().Substring(0, [Math]::Min(60, $r.Out.Trim().Length)))
Ok "P4 orphan removed" (-not (Test-Path (Join-Path $RAG "rag.db.build-999-00000000")))
Ok "P4 no orphans" ((Orphans $RAG).Count -eq 0) ((Orphans $RAG) -join ",")

Write-Output ""
Write-Output "RESULT: $PASS passed, $FAIL failed"
if ($FAIL -gt 0) { exit 1 } else { exit 0 }
