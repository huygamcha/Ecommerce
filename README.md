sau khi kết nối với server linux/ubuntu trên google cloud
Bước 1: cài đặt git
sudo apt update
sudo apt install git
git config --global user.name "huygamcha"
git config --global user.email "lehuynhhuy2002@gmail.com"

Bước 2: Cài đặt node và npm
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v

Bước 3: cấu hình nginx, pm2, ssl

3.1 Cấu hình nginx:
sudo apt update
sudo apt install nginx
sudo systemctl status nginx
sudo nano /etc/nginx/sites-available/min.com
server {
listen 80;
server_name phpdev.cfd www.phpdev.cfd;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

}
sudo ln -s /etc/nginx/sites-available/min.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

Bước 3.2: Chạy pm2:
sudo npm install -g pm2
pm2 start app.js
pm2 startup
pm2 save

Bước 3.3: Cấu hình ssl
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d phpdev.cfd -d www.phpdev.cfd
sudo certbot renew --dry-run
