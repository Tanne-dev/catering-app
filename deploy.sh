#!/usr/bin/env bash
# Chạy từ máy bạn: ./deploy.sh
# Cần: SSH key đã được thêm vào VPS, và biến môi trường VPS_HOST, VPS_USER, VPS_APP_PATH (hoặc file .env.deploy).

set -e

# Đọc .env.deploy nếu có (không commit file này)
if [ -f .env.deploy ]; then
  set -a
  source .env.deploy
  set +a
fi

VPS_HOST="${VPS_HOST:?Set VPS_HOST (IP hoặc hostname)}"
VPS_USER="${VPS_USER:-root}"
VPS_APP_PATH="${VPS_APP_PATH:?Set VPS_APP_PATH (vd: /var/www/catering-app/catering-app)}"

echo "Deploying to $VPS_USER@$VPS_HOST ($VPS_APP_PATH) ..."
ssh -o StrictHostKeyChecking=accept-new "$VPS_USER@$VPS_HOST" "cd $VPS_APP_PATH && git pull origin main && npm ci --production=false && npm run build && pm2 restart catering-tanne"
echo "Done."
