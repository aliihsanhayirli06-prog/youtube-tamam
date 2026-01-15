# VPS Deploy Plan (YouTubeTamam)

## 1) DNS
- A kaydi: `youtubeai` -> `84.247.136.108`
- Domain: `youtubeai.dijitalvarlikyonetim.com`
- TTL: 600s
- Dogrulama: `nslookup youtubeai.<domain>`

## 2) VPS Hazirlik
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git ufw
```

### Docker Kurulumu
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
Not: Oturumu kapatip tekrar gir.

### Docker Compose (Plugin)
```bash
sudo apt install -y docker-compose-plugin
```

## 3) Repo Klonla
```bash
git clone https://github.com/aliihsanhayirli06-prog/youtube-tamam.git
cd youtube-tamam
```

## 4) .env Dosyalari
```bash
cp .env.example .env
cp .env.example .env.local
```
Gerekli anahtarlar:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `RUNWAY_API_KEY`
- `STRIPE_SECRET_KEY` (opsiyonel)

## 5) Build + Run
```bash
docker compose up -d --build
```

## 6) Migrate
```bash
docker compose exec web npx prisma migrate deploy
```

## 7) Sağlık Kontrol
```bash
curl http://localhost:3000/api/health
```

## 8) Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 9) Log & Debug
```bash
docker compose logs -f web
```

## 10) Nginx + SSL (Opsiyonel)
### Nginx Kurulumu
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### Nginx Konfig (Reverse Proxy)
```bash
sudo tee /etc/nginx/sites-available/youtubeai <<'EOF'
server {
  listen 80;
  server_name youtubeai.dijitalvarlikyonetim.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF
```
```bash
sudo ln -s /etc/nginx/sites-available/youtubeai /etc/nginx/sites-enabled/youtubeai
sudo nginx -t
sudo systemctl reload nginx
```

### SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d youtubeai.dijitalvarlikyonetim.com -m info@dijitalvarlikyonetim.com --agree-tos --redirect
```

### SSL Yenileme
```bash
sudo certbot renew --dry-run
```
