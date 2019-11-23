---
title: 1Password Commands
date: 2019-10-28 13:05:15
tags:
    - shell-logs
    - bash
categories:
    - shell-logs
---

## Install and Singin

```bash
version=0.7.0

wget https://cache.agilebits.com/dist/1P/op/pkg/v$version/op_linux_amd64_v$version.zip
unzip op_linux_amd64_v$version.zip
sudo mv op /usr/local/bin/

op signin my geektheripper@gmail.com
```

<!--more-->

## Usage

```bash
eval $(op signin my)

op get item "Secret / Aliyun RAM" | jq '.details.sections[] | select(.title=="yumemi-oss").fields[] | select(.t=="AccessKeyID").v'
```

## .profile

.bashrc:

```bash
function op-login {
    eval $(op signin my)
}

function op-get {
    op get item "$1" | jq ".details.fields[] | select(.designation==\"$2\").value"
}

function op-select {
    op get item "$1" | jq ".details.sections[] | select(.title==\"$2\").fields[] | select(.t==\"$3\").v"
}
```

usage:

```bash
op-get "co.geektr.kyou" "username"
op-get "co.geektr.kyou" "password"

op-select "Secret / Aliyun RAM" "yumemi-oss" "AccessKeyID"
op-select "Secret / Aliyun RAM" "yumemi-oss" "AccessKeySecret"
```