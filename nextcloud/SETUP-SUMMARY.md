# Nextcloud Setup Summary for images.getbeseen.com

## Overview

This setup creates a Nextcloud installation on the subdomain `images.getbeseen.com` that is separate from your main website but integrated within your project structure.

## File Structure

```
nextcloud/
├── apache-vhost.conf      # Apache virtual host configuration
├── setup-nextcloud.sh     # Nextcloud installation script
├── quick-start.sh         # Automated setup script
├── README.md              # Detailed documentation
├── test.html              # Test page to verify setup
├── SETUP-SUMMARY.md       # This file
└── logs/                  # Apache log directory
```

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
cd /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
./quick-start.sh
```

### Option 2: Manual Setup
```bash
cd /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
./setup-nextcloud.sh
```

## Configuration Details

### Apache Virtual Host
- **Domain**: images.getbeseen.com
- **Document Root**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud`
- **Port**: 80 (HTTP), 443 (HTTPS)
- **PHP Support**: Enabled
- **Security Headers**: Configured

### DNS Configuration
Add this A record to your DNS settings:
```
Name: images
Type: A
Value: [Your Server IP Address]
TTL: 3600
```

### SSL Certificate (Production)
For production use, set up SSL using Let's Encrypt:
```bash
brew install certbot
sudo certbot --apache -d images.getbeseen.com
```

## Integration with Main Site

### Current Setup
- **Main Site**: getbeseen.com (Node.js/Express on port 8001)
- **Nextcloud**: images.getbeseen.com (Apache/PHP)
- **Separation**: Completely separate installations

### Potential Integrations
1. **Cross-domain Authentication**: Configure SSO between sites
2. **Shared Assets**: Link to Nextcloud files from main site
3. **API Integration**: Use Nextcloud's WebDAV API
4. **Unified Navigation**: Create shared navigation elements

## Security Considerations

### File Permissions
```bash
# Set proper ownership
sudo chown -R _www:_www /Users/bezmorid/GIT\ HTML/realestate1/nextcloud

# Set proper permissions
chmod -R 755 /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
chmod -R 777 /Users/bezmorid/GIT\ HTML/realestate1/nextcloud/data
chmod -R 777 /Users/bezmorid/GIT\ HTML/realestate1/nextcloud/config
```

### SSL/TLS
- Always use HTTPS in production
- Configure HSTS headers
- Use strong cipher suites

### Firewall
- Open ports 80 and 443
- Restrict access to admin interfaces
- Configure rate limiting

## Maintenance

### Updates
```bash
cd /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
sudo -u _www php occ upgrade
```

### Backups
```bash
# Backup Nextcloud data
tar -czf nextcloud-backup-$(date +%Y%m%d).tar.gz data/ config/

# Backup Apache configuration
sudo cp /usr/local/etc/httpd/vhosts/images.getbeseen.com.conf backup/
```

### Monitoring
- Monitor Apache error logs
- Check Nextcloud logs
- Monitor disk space usage
- Set up automated backups

## Troubleshooting

### Common Issues

1. **403 Forbidden**
   - Check file permissions
   - Verify Apache configuration
   - Check SELinux (if applicable)

2. **500 Internal Server Error**
   - Check PHP error logs
   - Verify PHP modules are loaded
   - Check Nextcloud requirements

3. **Connection Refused**
   - Verify Apache is running
   - Check port 80/443 is open
   - Verify firewall settings

### Log Locations
- **Apache Error**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/logs/error.log`
- **Apache Access**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/logs/access.log`
- **Nextcloud**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/data/nextcloud.log`
- **PHP Error**: `/usr/local/var/log/httpd/error_log`

## Performance Optimization

### Apache Configuration
- Enable compression (gzip)
- Configure caching headers
- Use Keep-Alive connections
- Optimize worker processes

### Nextcloud Optimization
- Enable OPcache
- Configure Redis for caching
- Optimize database queries
- Use CDN for static assets

## Support Resources

- **Nextcloud Documentation**: https://docs.nextcloud.com/
- **Apache Documentation**: https://httpd.apache.org/docs/
- **PHP Documentation**: https://www.php.net/docs.php
- **Let's Encrypt**: https://letsencrypt.org/docs/

## Next Steps

1. **Run the setup script**: `./quick-start.sh`
2. **Configure DNS**: Point subdomain to your server
3. **Set up SSL**: Install Let's Encrypt certificate
4. **Complete web setup**: Access Nextcloud and configure
5. **Test integration**: Verify everything works together
6. **Set up backups**: Configure automated backup system
7. **Monitor performance**: Set up monitoring and alerts 