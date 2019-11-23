---
title: acme.sh Commands
tags:
  - shell-logs
  - bash
categories:
  - shell-logs
date: 2019-10-28 14:49:56
---

## .profile

```bash
function quick-acme {
    domain=$1
    action=issue
    if [ -d "$HOME/.acme.sh/$domain/" ]; then
        action=renew
    fi
    acme.sh --issue --dns dns_ali -d "$domain" -d "*.$domain"
}
```
<!--more-->
## Usage

```bash
quick-acme example.geektr.co
```
