# Nextcloud Setup for images.getbeseen.com

This guide will help you set up Nextcloud on your subdomain `images.getbeseen.com`.

## Prerequisites

- macOS with Apache and PHP installed
- DNS access to configure the subdomain
- SSL certificate (recommended for production)

## Installation Steps

### 1. Run the Setup Script

```bash
cd /Users/bezmorid/GIT\ HTML/realestate1
chmod +x nextcloud/setup-nextcloud.sh
./nextcloud/setup-nextcloud.sh
```

### 2. Configure Apache Virtual Host

Copy the virtual host configuration to your Apache sites:

```bash
# For macOS with Homebrew Apache
sudo cp nextcloud/apache-vhost.conf /usr/local/etc/httpd/vhosts/images.getbeseen.com.conf

# For macOS built-in Apache
sudo cp nextcloud/apache-vhost.conf /etc/apache2/vhosts/images.getbeseen.com.conf
```

### 3. Enable Required Apache Modules

```bash
# Enable required modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl  # For HTTPS
```

### 4. Restart Apache

```bash
# For Homebrew Apache
brew services restart httpd

# For macOS built-in Apache
sudo apachectl restart
```

### 5. Configure DNS

Add an A record in your DNS settings:
- **Name**: `images`
- **Type**: `A`
- **Value**: Your server's IP address

### 6. SSL Certificate (Recommended)

For production, set up SSL using Let's Encrypt:

```bash
# Install certbot
brew install certbot

# Get certificate
sudo certbot --apache -d images.getbeseen.com
```

## Configuration Files

### Apache Virtual Host
- **File**: `nextcloud/apache-vhost.conf`
- **Purpose**: Configures Apache to serve Nextcloud on the subdomain

### Nextcloud Configuration
- **Directory**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/config/`
- **File**: `config.php` (created during web setup)

## Security Considerations

1. **File Permissions**: Ensure proper ownership and permissions
2. **SSL**: Always use HTTPS in production
3. **Firewall**: Configure firewall rules appropriately
4. **Backups**: Set up regular backups of Nextcloud data

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check file permissions and Apache configuration
2. **500 Internal Server Error**: Check PHP error logs
3. **Connection Refused**: Verify Apache is running and port 80/443 is open

### Log Files

- **Apache Error Log**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/logs/error.log`
- **Apache Access Log**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/logs/access.log`
- **Nextcloud Log**: `/Users/bezmorid/GIT HTML/realestate1/nextcloud/data/nextcloud.log`

## Integration with Main Site

The Nextcloud installation is separate from your main site but can be integrated:

1. **Cross-domain authentication**: Configure SSO if needed
2. **Shared assets**: Link to Nextcloud files from main site
3. **API integration**: Use Nextcloud's WebDAV API for file management

## Maintenance

### Updates
```bash
cd /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
sudo -u www-data php occ upgrade
```

### Backups
```bash
# Backup Nextcloud data
tar -czf nextcloud-backup-$(date +%Y%m%d).tar.gz data/ config/
```

## Support

- **Nextcloud Documentation**: https://docs.nextcloud.com/
- **Apache Documentation**: https://httpd.apache.org/docs/
- **PHP Documentation**: https://www.php.net/docs.php 