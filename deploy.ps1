# ═══════════════════════════════════════════════════════════
# Axiom Smart Wardrobe — Google Cloud Run Deployment Script
# ═══════════════════════════════════════════════════════════
#
# Prerequisites:
#   1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
#   2. Run: gcloud init
#   3. Run: gcloud auth login
#
# Usage:
#   .\deploy.ps1 -ProjectId "your-gcp-project-id"
#   .\deploy.ps1 -ProjectId "your-gcp-project-id" -Region "asia-south1"
# ═══════════════════════════════════════════════════════════

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [string]$Region = "us-central1",
    [string]$ServiceName = "axiom-wardrobe"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor DarkYellow
Write-Host "║   AXIOM SMART WARDROBE — DEPLOYMENT      ║" -ForegroundColor DarkYellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor DarkYellow
Write-Host ""

# ── Step 1: Verify gcloud ──
Write-Host "[1/4] Verifying Google Cloud SDK..." -ForegroundColor Cyan
try {
    $gcloudVersion = gcloud --version 2>&1 | Select-Object -First 1
    Write-Host "  ✓ $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# ── Step 2: Set project ──
Write-Host "[2/4] Setting project to $ProjectId..." -ForegroundColor Cyan
gcloud config set project $ProjectId
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
Write-Host "  ✓ Project configured, APIs enabled" -ForegroundColor Green

# ── Step 3: Deploy from source (no Docker needed locally) ──
Write-Host "[3/4] Deploying to Cloud Run ($Region)..." -ForegroundColor Cyan
Write-Host "  This uses Cloud Build to build the container remotely." -ForegroundColor Gray
Write-Host "  No local Docker installation required." -ForegroundColor Gray
Write-Host ""

gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 512Mi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars "NODE_ENV=production,PORT=8080,HOSTNAME=0.0.0.0" `
    --quiet

# ── Step 4: Get the URL ──
Write-Host ""
Write-Host "[4/4] Fetching deployment URL..." -ForegroundColor Cyan
$url = gcloud run services describe $ServiceName --region $Region --format "value(status.url)"

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   DEPLOYMENT COMPLETE                     ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Live URL: $url" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Service:   $ServiceName" -ForegroundColor Gray
Write-Host "  Region:    $Region" -ForegroundColor Gray
Write-Host "  Project:   $ProjectId" -ForegroundColor Gray
Write-Host ""
