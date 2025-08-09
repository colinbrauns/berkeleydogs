#!/bin/bash
# Test deployment script
# Run this locally to test your Linode setup

set -e

echo "🧪 Testing Linode deployment setup..."

# Configuration (update these values)
LINODE_IP="${1:-YOUR_LINODE_IP}"
SSH_KEY_PATH="${2:-~/.ssh/github-actions}"
REMOTE_USER="deploy"
REMOTE_PORT="2222"
REMOTE_TARGET="/var/www/berkeleydogs.com"

if [ "$LINODE_IP" = "YOUR_LINODE_IP" ]; then
    echo "❌ Please provide your Linode IP address:"
    echo "Usage: $0 <LINODE_IP> [SSH_KEY_PATH]"
    exit 1
fi

echo "Testing connection to: $REMOTE_USER@$LINODE_IP:$REMOTE_PORT"

# Test SSH connection
echo "1. Testing SSH connection..."
if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$REMOTE_USER@$LINODE_IP" "echo 'SSH connection successful'"; then
    echo "✅ SSH connection works"
else
    echo "❌ SSH connection failed"
    exit 1
fi

# Test directory permissions
echo "2. Testing directory permissions..."
if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" "$REMOTE_USER@$LINODE_IP" "test -w $REMOTE_TARGET && echo 'Directory writable'"; then
    echo "✅ Directory permissions correct"
else
    echo "❌ Directory not writable"
    exit 1
fi

# Test nginx status
echo "3. Testing nginx status..."
if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" "$REMOTE_USER@$LINODE_IP" "sudo systemctl is-active nginx >/dev/null && echo 'Nginx is running'"; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
fi

# Test rsync deployment (dry run)
echo "4. Testing rsync deployment (dry run)..."
if rsync -avzr --dry-run --delete \
    --exclude='.git/' \
    --exclude='.github/' \
    --exclude='**/.DS_Store' \
    --exclude='**/Thumbs.db' \
    --exclude='README.md' \
    --exclude='deploy/' \
    -e "ssh -i $SSH_KEY_PATH -p $REMOTE_PORT -o StrictHostKeyChecking=no" \
    ./ "$REMOTE_USER@$LINODE_IP:$REMOTE_TARGET"; then
    echo "✅ Rsync test successful"
else
    echo "❌ Rsync test failed"
    exit 1
fi

# Test security features
echo "5. Testing security features..."

# Check fail2ban
if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" "$REMOTE_USER@$LINODE_IP" "sudo systemctl is-active fail2ban >/dev/null"; then
    echo "✅ fail2ban is running"
else
    echo "⚠️  fail2ban is not running"
fi

# Check UFW
if ssh -i "$SSH_KEY_PATH" -p "$REMOTE_PORT" "$REMOTE_USER@$LINODE_IP" "sudo ufw status | grep -q 'Status: active'"; then
    echo "✅ UFW firewall is active"
else
    echo "⚠️  UFW firewall is not active"
fi

# Test website accessibility
echo "6. Testing website accessibility..."
if curl -s --connect-timeout 10 "http://$LINODE_IP" | grep -q "Berkeley Dog"; then
    echo "✅ Website is accessible"
else
    echo "⚠️  Website may not be accessible (this is normal before first deployment)"
fi

echo ""
echo "🎉 Deployment test complete!"
echo ""
echo "📝 Summary:"
echo "- SSH connection: ✅"
echo "- Directory permissions: ✅"
echo "- Nginx status: Check above"
echo "- Rsync test: ✅"
echo "- Security features: Check above"
echo ""
echo "🚀 Ready to deploy via GitHub Actions!"