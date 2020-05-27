---
title: Aliyun Commands
date: 2019-10-28 12:20:45
tags:
    - shell-logs
    - bash
categories:
    - shell-logs
---

## Install Routeros

```bash
wget https://download.mikrotik.com/routeros/6.45.6/chr-6.45.6.img.zip -O chr.img.zip && \
gunzip -c chr.img.zip > chr.img && \
mount -o loop,offset=512 chr.img /mnt && \
ADDRESS0=`ip addr show eth0 | grep global | cut -d' ' -f 6 | head -n 1` && \
GATEWAY0=`ip route list | grep default | cut -d' ' -f 3` && \
echo "/ip address add address=$ADDRESS0 interface=[/interface ethernet find where name=ether1]
/ip route add gateway=$GATEWAY0
" > /mnt/rw/autorun.scr && \
umount /mnt && \
echo u > /proc/sysrq-trigger && \
dd if=chr.img bs=1024 of=/dev/vda && \
reboot
```

<!-- more -->