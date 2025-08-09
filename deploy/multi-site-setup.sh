#!/bin/bash
# Multi-site Nginx Setup for berkeleydogs.com
# Run this script as root on your existing multi-site Linode server

set -e

echo "🌐 Setting up berkeleydogs.com on multi-site nginx server..."

# Check if nginx is already installed and configured
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx not found. Please install nginx first."
    exit 1
fi

# Create deploy user if it doesn't exist
echo "👤 Setting up deploy user..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:/usr/sbin/nginx, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /bin/chown" >> /etc/sudoers.d/deploy-nginx
    echo "✅ Deploy user created with limited sudo privileges"
else
    echo "⚠️  Deploy user already exists"
    # Ensure deploy user has nginx privileges
    if ! sudo -l -U deploy 2>/dev/null | grep -q nginx; then
        echo "deploy ALL=(ALL) NOPASSWD:/usr/sbin/nginx, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /bin/chown" >> /etc/sudoers.d/deploy-nginx
        echo "✅ Added nginx privileges for deploy user"
    fi
fi

# Create website directory with proper permissions
echo "📁 Setting up website directory..."
mkdir -p /var/www/berkeleydogs.com
chown deploy:deploy /var/www/berkeleydogs.com
chmod 755 /var/www/berkeleydogs.com

# Backup existing nginx configuration
echo "📋 Backing up nginx configuration..."
cp -r /etc/nginx /etc/nginx.backup.$(date +%Y%m%d-%H%M%S) || true

# Create shared security configuration if it doesn't exist
if [ ! -f /etc/nginx/conf.d/security.conf ]; then
    echo "🔒 Creating shared security configuration..."
    cat > /etc/nginx/conf.d/security.conf << 'EOF'
# Shared Security Configuration for Multi-site Setup
# Applied to all sites that include this file

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline'" always;

# Hide nginx version
server_tokens off;

# Rate limiting zones (shared across all sites)
limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

# Security settings
client_max_body_size 10M;
client_body_timeout 10s;
client_header_timeout 10s;
keepalive_timeout 5s 5s;
send_timeout 10s;
EOF
else
    echo "⚠️  Security configuration already exists, skipping..."
fi

# Create site-specific configuration
echo "🔧 Creating berkeleydogs.com site configuration..."
cat > /etc/nginx/sites-available/berkeleydogs.com << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name berkeleydogs.com www.berkeleydogs.com;
    
    # Include shared security settings
    include /etc/nginx/conf.d/security.conf;
    
    # Site-specific settings
    root /var/www/berkeleydogs.com;
    index index.html index.htm;
    
    # Access and error logs (site-specific)
    access_log /var/log/nginx/berkeleydogs.com.access.log;
    error_log /var/log/nginx/berkeleydogs.com.error.log;
    
    # Rate limiting for this site
    limit_req zone=general burst=20 nodelay;
    
    # Main location block
    location / {
        try_files $uri $uri/ =404;
        
        # Additional security headers specific to this site
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    }
    
    # Static asset caching and optimization
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        access_log off;
        
        # Enable gzip for static assets
        gzip on;
        gzip_vary on;
        gzip_comp_level 6;
        gzip_types text/css application/javascript image/svg+xml;
    }
    
    # Security: Deny access to sensitive files
    location ~* \.(htaccess|htpasswd|ini|log|sh|sql|conf|bak|old|tmp)$ {
        deny all;
        return 404;
    }
    
    # Security: Deny access to hidden files and directories
    location ~ /\. {
        deny all;
        return 404;
    }
    
    # Security: Deny access to backup and temporary files
    location ~* ~$ {
        deny all;
        return 404;
    }
    
    # Robots.txt handling
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
    
    # Favicon handling
    location = /favicon.ico {
        log_not_found off;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Redirect www to non-www (or vice versa, adjust as needed)
server {
    listen 80;
    listen [::]:80;
    server_name www.berkeleydogs.com;
    return 301 http://berkeleydogs.com$request_uri;
}
EOF

# Enable the site
echo "✅ Enabling berkeleydogs.com site..."
if [ ! -L /etc/nginx/sites-enabled/berkeleydogs.com ]; then
    ln -sf /etc/nginx/sites-available/berkeleydogs.com /etc/nginx/sites-enabled/
    echo "✅ Site enabled successfully"
else
    echo "⚠️  Site already enabled"
fi

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx to apply changes
    echo "🔄 Reloading nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the configuration and fix any errors."
    exit 1
fi

# Create a simple index.html if none exists
if [ ! -f /var/www/berkeleydogs.com/index.html ]; then
    echo "📄 Creating temporary index.html..."
    cat > /var/www/berkeleydogs.com/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Berkeley Dog Advocates - Coming Soon</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #002676; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Berkeley Dog Advocates</h1>
        <p>Website deployment in progress...</p>
        <p>This page will be automatically updated when the site is deployed via GitHub Actions.</p>
    </div>
</body>
</html>
EOF
    chown deploy:deploy /var/www/berkeleydogs.com/index.html
    echo "✅ Temporary index.html created"
fi

# Show site status
echo ""
echo "🎉 Multi-site setup complete!"
echo ""
echo "📊 Current nginx sites:"
ls -la /etc/nginx/sites-enabled/
echo ""
echo "🔍 Next steps:"
echo "1. Set up SSL with: sudo certbot --nginx -d berkeleydogs.com -d www.berkeleydogs.com"
echo "2. Configure GitHub Actions secrets"
echo "3. Test deployment with the test script"
echo ""
echo "📝 Site-specific logs:"
echo "- Access: /var/log/nginx/berkeleydogs.com.access.log"
echo "- Error: /var/log/nginx/berkeleydogs.com.error.log"
echo ""
echo "🌐 Test site access: http://$(curl -s ifconfig.me) (if DNS points here)"