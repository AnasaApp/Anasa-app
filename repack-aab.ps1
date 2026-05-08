Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

$src = "C:\Users\HP\Desktop\Anasa\ahlain\android\app\build\outputs\bundle\release\app-release.aab"
$tmp = "C:\Users\HP\Desktop\aab-extract"
$out = "C:\Users\HP\Desktop\Anasa\ahlain\android\app\build\outputs\bundle\release\app-release-aligned.aab"

if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
if (Test-Path $out) { Remove-Item $out -Force }

Write-Host "Extracting AAB..."
[System.IO.Compression.ZipFile]::ExtractToDirectory($src, $tmp)

Write-Host "Repacking with uncompressed .so files..."
$outStream = [System.IO.File]::Open($out, [System.IO.FileMode]::Create)
$outZip = New-Object System.IO.Compression.ZipArchive($outStream, [System.IO.Compression.ZipArchiveMode]::Create)

$allFiles = Get-ChildItem $tmp -Recurse -File
foreach ($file in $allFiles) {
    $entryName = $file.FullName.Substring($tmp.Length + 1).Replace('\', '/')
    if ($entryName -like "*.so") {
        $level = [System.IO.Compression.CompressionLevel]::NoCompression
    } else {
        $level = [System.IO.Compression.CompressionLevel]::Optimal
    }
    $entry = $outZip.CreateEntry($entryName, $level)
    $entryStream = $entry.Open()
    $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $entryStream.Write($fileBytes, 0, $fileBytes.Length)
    $entryStream.Close()
}

$outZip.Dispose()
$outStream.Close()

Write-Host "Verifying..."
$verZip = [System.IO.Compression.ZipFile]::OpenRead($out)
$soFiles = $verZip.Entries | Where-Object { $_.FullName -like "*.so" }
$compressed = $soFiles | Where-Object { $_.CompressedLength -lt ($_.Length * 0.99) }
Write-Host "Total .so: $($soFiles.Count) | Still compressed: $($compressed.Count)"
if ($compressed.Count -eq 0) {
    Write-Host "SUCCESS - All .so files are UNCOMPRESSED - 16KB alignment PASSED!"
} else {
    Write-Host "FAILED - $($compressed.Count) .so files still compressed"
}
$verZip.Dispose()
Write-Host "Output AAB: $out"
Write-Host "Size: $([Math]::Round((Get-Item $out).Length/1MB,1)) MB"

# Cleanup
Remove-Item $tmp -Recurse -Force
Write-Host "Done."

