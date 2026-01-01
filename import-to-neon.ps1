# Complete Neon Database Import Script
# This imports both schema and data to your Neon database

$NEON_CONNECTION = "postgresql://neondb_owner:npg_ThE6zGt2RxSI@ep-small-feather-abzcsms0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

Write-Host "🔄 Starting Neon Database Import..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Import Schema
Write-Host "📋 Step 1: Importing schema..." -ForegroundColor Yellow
$env:PGPASSWORD = "npg_ThE6zGt2RxSI"
psql $NEON_CONNECTION -f neon_schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema imported successfully!" -ForegroundColor Green
}
else {
    Write-Host "❌ Schema import failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Verify Tables Created
Write-Host "🔍 Step 2: Verifying tables..." -ForegroundColor Yellow
psql $NEON_CONNECTION -c "\dt"

Write-Host ""

# Step 3: Import Data
Write-Host "📊 Step 3: Importing data..." -ForegroundColor Yellow
Write-Host "   This may take 2-5 minutes for large datasets..." -ForegroundColor Gray

psql $NEON_CONNECTION -f neon_data.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Data imported successfully!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Data import had errors (some data may still be imported)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Verify Data
Write-Host "📈 Step 4: Verifying data counts..." -ForegroundColor Yellow

$query = @"
SELECT 
    'modules' as table_name, COUNT(*) as row_count FROM modules
UNION ALL
SELECT 'surveys', COUNT(*) FROM surveys
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'indicators', COUNT(*) FROM indicators
UNION ALL
SELECT 'trend_data', COUNT(*) FROM trend_data
UNION ALL
SELECT 'state_data', COUNT(*) FROM state_data
UNION ALL
SELECT 'zonal_data', COUNT(*) FROM zonal_data
ORDER BY table_name;
"@

psql $NEON_CONNECTION -c $query

Write-Host ""
Write-Host "✨ Import complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  →  Check row counts above" -ForegroundColor White
Write-Host "  →  Update Vercel environment variables if not done" -ForegroundColor White
Write-Host "  →  Redeploy on Vercel" -ForegroundColor White
