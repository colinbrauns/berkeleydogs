#!/bin/bash
# Linode Security Setup Script for berkeleydogs.com
# Run this script as root on your Linode server

set -e

echo "🔐 Starting Linode Security Setup..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Create deploy user if it doesn't exist
echo "👤 Setting up deploy user..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/deploy
fi

# Configure SSH security
echo "🔑 Configuring SSH security..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

cat > /etc/ssh/sshd_config << 'EOF'
# SSH Security Configuration
Port 2222
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key

# Authentication
LoginGraceTime 2m
PermitRootLogin no
StrictModes yes
MaxAuthTries 3
MaxSessions 2
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Security settings
X11Forwarding no
AllowTcpForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
Compression no
TCPKeepAlive no
AllowUsers deploy

# Logging
SyslogFacility AUTHPRIV
LogLevel INFO
EOF

# Install and configure fail2ban
echo "🛡️  Installing and configuring fail2ban..."
apt install -y fail2ban

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = 2222
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
EOF

# Configure UFW firewall
echo "🔥 Configuring UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 2222/tcp  # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable

# Install nginx if not present
echo "🌐 Installing nginx..."
apt install -y nginx

# Create nginx security configuration
cat > /etc/nginx/conf.d/security.conf << 'EOF'
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Hide nginx version
server_tokens off;

# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

# Security settings
client_max_body_size 10M;
client_body_timeout 10s;
client_header_timeout 10s;
keepalive_timeout 5s 5s;
send_timeout 10s;
server_names_hash_bucket_size 64;
EOF

# Install certbot for SSL
echo "🔒 Installing certbot..."
apt install -y certbot python3-certbot-nginx

# Create website directory
echo "📁 Setting up website directory..."
mkdir -p /var/www/berkeleydogs.com
chown deploy:deploy /var/www/berkeleydogs.com
chmod 755 /var/www/berkeleydogs.com

# Create nginx site configuration for berkeleydogs.com
cat > /etc/nginx/sites-available/berkeleydogs.com << 'EOF'
server {
    listen 80;
    server_name berkeleydogs.com www.berkeleydogs.com;
    
    # Security
    include /etc/nginx/conf.d/security.conf;
    
    root /var/www/berkeleydogs.com;
    index index.html;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Deny access to sensitive files
    location ~* \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
        deny all;
        return 404;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        return 404;
    }
}
EOF

# Enable site (only if it doesn't conflict with existing sites)
if [ ! -L /etc/nginx/sites-enabled/berkeleydogs.com ]; then
    ln -sf /etc/nginx/sites-available/berkeleydogs.com /etc/nginx/sites-enabled/
    echo "✅ Nginx site configuration enabled"
else
    echo "⚠️  Site already enabled"
fi

# Only remove default if no other sites exist
if [ "$(ls -1 /etc/nginx/sites-enabled/ | wc -l)" -eq 1 ] && [ -f /etc/nginx/sites-enabled/default ]; then
    rm -f /etc/nginx/sites-enabled/default
    echo "✅ Default site removed"
else
    echo "⚠️  Keeping existing site configurations"
fi

# Test nginx configuration
nginx -t

# Enable and start services
systemctl enable ssh
systemctl enable fail2ban
systemctl enable nginx
systemctl enable ufw

# Restart services
systemctl restart ssh
systemctl restart fail2ban
systemctl restart nginx

# Install automatic security updates
echo "🔄 Setting up automatic security updates..."
apt install -y unattended-upgrades
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESM:${distro_codename}";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

echo "✅ Security setup complete!"
echo ""
echo "🔑 IMPORTANT NEXT STEPS:"
echo "1. SSH port changed to 2222 - update your GitHub secrets!"
echo "2. Set up SSH keys for deploy user"
echo "3. Run SSL setup: sudo certbot --nginx -d berkeleydogs.com -d www.berkeleydogs.com"
echo "4. Test GitHub Actions deployment"
echo ""
echo "🔒 Security features enabled:"
echo "- SSH hardened (port 2222, no root login, key-only auth)"
echo "- UFW firewall configured"
echo "- fail2ban protection active"
echo "- Nginx security headers"
echo "- Automatic security updates"
echo ""
echo "⚠️  SAVE YOUR SSH KEYS - You cannot login without them!"