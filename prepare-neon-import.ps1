# Neon Data Import - Alternative Method
# This creates smaller SQL files that Neon SQL Editor can handle

Write-Host "🔪 Splitting data file into manageable chunks..." -ForegroundColor Cyan

# Read the data file
$content = Get-Content "neon_data.sql" -Raw

# Split by table
$tables = @('modules', 'surveys', 'categories', 'indicators', 'trend_data', 'state_data', 'zonal_data')

foreach ($table in $tables) {
    $pattern = "COPY public\.$table.*?FROM stdin;(.*?)\\\."
    if ($content -match $pattern) {
        $tableData = $Matches[1]
        $outputFile = "import_$table.sql"
        
        # Create INSERT statements
        $lines = $tableData -split "`n" | Where-Object { $_.Trim() -ne "" }
        
        if ($lines.Count -gt 0) {
            Write-Host "  → Creating $outputFile ($($lines.Count) rows)" -ForegroundColor Yellow
            
            # You'll need to manually run these in Neon SQL Editor
            Set-Content $outputFile $tableData
        }
    }
}

Write-Host ""
Write-Host "✅ Files created! Now:" -ForegroundColor Green
Write-Host ""
Write-Host "Manual Steps (Neon SQL Editor):" -ForegroundColor Cyan
Write-Host "1. Open each import_*.sql file" -ForegroundColor White
Write-Host "2. Convert COPY format to INSERT format" -ForegroundColor White
Write-Host "3. Run in Neon SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "OR use the web-based import tool below..." -ForegroundColor Yellow
