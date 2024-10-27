# Security Policy

## Supported Versions
Currently, this is the initial release of the HEX Open Data Portal Tools subproject. We support the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Features Security Status

| Feature | Status |
| ------- | ------ |
| Firebase Authentication | :white_check_mark: |
| Firebase Storage | :white_check_mark: |
| Firebase Realtime Database | :white_check_mark: |
| CSV Data Processing | :white_check_mark: |
| AI Assistant (Uncle HEX) | :white_check_mark: |
| AI Assistant (Personal Admin Assistant) | :white_check_mark: |

## Reporting a Vulnerability

We take the security of HEX Open Data Portal Tools seriously. If you believe you have found a security vulnerability, please report it to us following these steps:

1. **Do Not** disclose the vulnerability publicly until it has been addressed by our team
2. Visit our Website Security Report page at [uhspace.org/security-report](https://uhspace.org/security-report)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Affected versions
   - Any potential mitigations you've identified

### What to Expect

- Acknowledgment of your report within 48 hours
- Regular updates on our progress addressing the vulnerability
- Credit for responsibly disclosing the issue (if desired)

### Security Measures

Our project implements several security measures:

- Environment variables for sensitive configurations
- Firebase security rules for data access
- Input validation for file uploads
- Secure file handling practices
- Regular dependency updates

## Contact

For security concerns, please contact:
- Primary Contact: Email uhspacehub@gmail.com
- Alternative: Submit issues through our [GitHub repository](https://github.com/HACC-2024/HEX)

# Website Infrastructure Security

1. **SSL/TLS Configuration:**
   - SSL/TLS configured for **uhspace.org** using Let's Encrypt certificates
   - AWS Certificate Manager handles SSL for **uhspace.org** and **www.uhspace.org**
   - Automatic certificate renewal and management

2. **Nginx as a Reverse Proxy:**
   - HTTPS traffic handling
   - HTTP to HTTPS redirection
   - Secure backend request forwarding

3. **Load Balancer:**
   - Elastic Load Balancer (ELB) with SSL certification
   - Automatic traffic distribution
   - Enhanced availability and fault tolerance

4. **API Access:**
   - Secure routing through **uhspace.org/api**
   - Clear frontend/backend separation
   - Protected API endpoints

5. **AWS Infrastructure:**
   - Hosted on AWS EC2 instance
   - Docker containerization for isolation
   - Enhanced deployment efficiency
   - Version control management

6. **Domain Security:**
   - Full support for both **uhspace.org** and **www.uhspace.org**
   - DNS configuration for both root and subdomain
   - SEO-friendly setup preventing content duplication

### Future Security Implementations

- Enhanced security headers
- Advanced input validation
- Cross-site scripting (XSS) protection
- Data injection prevention
- Regular security audits
- Automated vulnerability scanning

This document was last updated: October 2024
