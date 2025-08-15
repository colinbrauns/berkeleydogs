#!/bin/bash
# SSH Key Setup for GitHub Actions
# Run this script as the deploy user on your Linode server

set -e

echo "🔑 Setting up SSH keys for GitHub Actions deployment..."

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Generate SSH key pair for GitHub Actions
if [ ! -f ~/.ssh/github-actions ]; then
    echo "Generating SSH key pair..."
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions -N ""
    echo "✅ SSH key pair generated"
else
    echo "⚠️  SSH key already exists"
fi

# Add public key to authorized_keys
if ! grep -q "github-actions-deploy" ~/.ssh/authorized_keys 2>/dev/null; then
    cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    echo "✅ Public key added to authorized_keys"
else
    echo "⚠️  Public key already in authorized_keys"
fi

echo ""
echo "🔐 PRIVATE KEY (Add this to GitHub Secrets as SSH_PRIVATE_KEY):"
echo "=================================================="
cat ~/.ssh/github-actions
echo "=================================================="
echo ""
echo "🔧 GitHub Repository Secrets to add:"
echo "- SSH_PRIVATE_KEY: (the private key above)"
echo "- REMOTE_HOST: $(curl -s ifconfig.me)"
echo "- REMOTE_USER: deploy"
echo "- REMOTE_PORT: 2222"
echo "- REMOTE_TARGET: /var/www/berkeleydogs.com"
echo ""
echo "✅ SSH setup complete!"