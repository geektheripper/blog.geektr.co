---
title: Kong Commands
tags:
  - shell-logs
  - bash
categories:
  - shell-logs
date: 2019-10-28 14:13:43
---

## .profile

```bash
function init-kong {
  export KONG_API_URL=https://api.web-gateway.geektr.co
  export KONG_API_KEY=$(op-select "co.geektr.web-gateway" "apiKey" "yumemi")
}

function kong {
    curl -X POST -H "apiKey: $KONG_API_KEY" $KONG_API_URL$1 ${@:2}
}

function kong-id {
    kong $@ | jq -r ".id"
}
```
<!-- more -->
## Usage

### Consumers

```bash
init-kong

# add consumer
consumer_uuid=$(
  kong_id /consumers \
    -d "username=example-user"
)

# generate consumer key
consumer_key=$(
  kong /consumers/$consumer_uuid/key-auth | jq -r ".key"
)

# add consumer to group
kong /consumers/$consumer_uuid/acls -d "group=example-group" > /dev/null
```

### Service And Route

```bash
init-kong

domain=example.geektr.co

# add certificates
kong /certificates \
    -F "snis[1]=$domain" \
    -F "snis[2]=*.$domain" \
    -F "cert=@fullchain.cer" \
    -F "key=@$domain.key"

# add service
service_id=$(
  kong_id /services \
    -d "name=taisun" \
    -d "url=http://example-host"
)

# add route
route_id=$(
  kong_id /services/$service_id/routes \
    -d "name=example-route" \
    -d "hosts=$domain"
)

# enable acl for service
kong /plugins -d "name=acl" \
    -d "service.id=$service_id" \
    -d "config.whitelist=example-group" \
    -d "config.hide_groups_header=true" > /dev/null

```

## Complete Example

1. 获取 ssl key
2. 创建服务
3. 创建路由

```bash
init-kong

primary_domain=taisun.geektr.co
internal_domain=taisun.internal.geektr.co

# get ssl keys
quick-acme $primary_domain

cert_path=$HOME/.acme.sh/$primary_domain

# add certificates
kong /certificates \
    -F "snis[1]=$primary_domain" \
    -F "snis[2]=*.$primary_domain" \
    -F "cert=@$cert_path/fullchain.cer" \
    -F "key=@$cert_path/$primary_domain.key"

# add service
service_id=$(
  kong_id /services \
    -d "name=taisun" \
    -d "url=http://$internal_domain"
)

# add route
route_id=$(
  kong_id /services/$service_id/routes \
    -d "name=taisun-website" \
    -d "hosts=$primary_domain"
)
```
