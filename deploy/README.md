# Linode Deployment Setup

This directory contains scripts to securely configure your Linode server for GitHub Actions deployment.

## Quick Setup

### 1. Run Security Setup (as root)
```bash
# Upload the security setup script to your Linode server
scp linode-security-setup.sh root@YOUR_LINODE_IP:/tmp/
ssh root@YOUR_LINODE_IP "chmod +x /tmp/linode-security-setup.sh && /tmp/linode-security-setup.sh"
```

### 2. Setup SSH Keys (as deploy user)
```bash
# Upload and run the SSH key setup
scp setup-ssh-keys.sh deploy@YOUR_LINODE_IP:/tmp/
ssh -p 2222 deploy@YOUR_LINODE_IP "chmod +x /tmp/setup-ssh-keys.sh && /tmp/setup-ssh-keys.sh"
```

### 3. Configure GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets with the values from the SSH key setup script:
- `SSH_PRIVATE_KEY`: The private key content
- `REMOTE_HOST`: Your Linode IP address  
- `REMOTE_USER`: `deploy`
- `REMOTE_PORT`: `2222`
- `REMOTE_TARGET`: `/var/www/berkeleydogs.com`

### 4. Setup SSL Certificate
```bash
ssh -p 2222 deploy@YOUR_LINODE_IP
sudo certbot --nginx -d berkeleydogs.com -d www.berkeleydogs.com
```

### 5. Test Deployment
Run locally:
```bash
chmod +x test-deployment.sh
./test-deployment.sh YOUR_LINODE_IP
```

## Security Features Implemented

✅ **SSH Hardening**
- Changed port to 2222
- Disabled root login
- Key-only authentication
- Limited login attempts

✅ **Firewall Protection**
- UFW configured with minimal open ports
- fail2ban for intrusion prevention
- Rate limiting on nginx

✅ **Web Server Security**
- Security headers configured
- Hidden nginx version
- Protection against common attacks
- SSL/TLS with automatic renewal

✅ **System Hardening**
- Automatic security updates
- Minimal user privileges
- Secure file permissions

## Troubleshooting

### SSH Connection Issues
- Ensure port 2222 is open in Linode's firewall
- Verify SSH keys are correctly configured
- Check UFW status: `sudo ufw status`

### Deployment Failures
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Test SSH connection manually
- Ensure target directory permissions are correct

### Website Not Loading
- Check nginx status: `sudo systemctl status nginx`
- Verify DNS settings point to your Linode IP
- Check SSL certificate: `sudo certbot certificates`
- Review nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Maintenance

### Regular Updates
```bash
# System updates (automatic via unattended-upgrades)
sudo apt update && sudo apt upgrade

# SSL certificate renewal (automatic via certbot)
sudo certbot renew --dry-run
```

### Security Monitoring
```bash
# Check fail2ban status
sudo fail2ban-client status sshd

# Review recent login attempts
sudo tail -f /var/log/auth.log

# Check UFW logs
sudo tail -f /var/log/ufw.log
```

### Backup Important Files
- SSH keys (`~/.ssh/`)
- Nginx configurations (`/etc/nginx/`)
- SSL certificates (`/etc/letsencrypt/`)
- Website files (`/var/www/berkeleydogs.com/`)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Linode server logs
4. Verify DNS and firewall settings