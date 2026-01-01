# RDS Database Import Script

# Replace these with your actual RDS details:
# ENDPOINT: Your RDS endpoint (e.g., dataio-production.xxxxx.rds.amazonaws.com)
# PASSWORD: Your RDS master password

# Step 1: Test connection
Write-Host "Testing RDS connection..." -ForegroundColor Yellow
$env:PGPASSWORD = "YOUR_RDS_PASSWORD"
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d dataio_db -c "SELECT version();"

# Step 2: Import Schema
Write-Host "`nImporting schema..." -ForegroundColor Yellow
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d dataio_db -f neon_schema.sql

# Step 3: Import Data
Write-Host "`nImporting data..." -ForegroundColor Yellow
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d dataio_db -f neon_data.sql

# Step 4: Verify
Write-Host "`nVerifying import..." -ForegroundColor Yellow
psql -h YOUR_RDS_ENDPOINT -p 5432 -U postgres -d dataio_db -c "SELECT COUNT(*) FROM indicators;"

Write-Host "`n✅ Import complete!" -ForegroundColor Green
