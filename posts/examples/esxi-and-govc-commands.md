---
title: ESXI and GOVC commands
date: 2019-10-28 11:48:56
tags:
    - shell-logs
    - bash
categories:
    - shell-logs
---

Reference: [GOVC Document](https://github.com/vmware/govmomi/blob/master/govc/USAGE.md)

## .profile

```bash
function init_govc {
    export GOVC_USERNAME=$(op-get "co.geektr.$1" "username")
    export GOVC_PASSWORD=$(op-get "co.geektr.$1" "password")
    # export GOVC_INSECURE=1
}
```
<!-- more -->
## Usage

### VM About

```bash
init_govc kyou

esxi_host=kyou.geektr.co
vm_name=my-new-debian

# Create VMs
govc vm.create -u $esxi_host \
    -ds=main-storage \
    -m=8096 \
    -c=8 \
    -g=debian9_64Guest \
    --net.adapter=vmxnet3 \
    -net=vlan-vms \
    --disk.controller=pvscsi \
    -disk=base/debian.vmdk \
    -on=false \
    my-new-debian

# Power On VM
govc vm.power -u $esxi_host -on=true $vm_name

# Get VM Mac Address
govc device.info -u $esxi_host -vm $vm_name -json ethernet-1 | jq -r ".Devices[].MacAddress"
govc device.info -u $esxi_host -vm $vm_name -json ethernet-2 | jq -r ".Devices[].MacAddress"
```

### ESXI UI About

```bash
# deploy ssl keys
server=kyou.geektr.co

quick-acme $server

ssh-add $HOME/.ssh/keys/geektr.co/root

scp $HOME/.acme.sh/$server/fullchain.cer \
    root@$server:/etc/vmware/ssl/rui.crt

scp $HOME/.acme.sh/$server/$server.key \
    root@$server:/etc/vmware/ssl/rui.key

ssh root@$server "
/etc/init.d/hostd restart
/etc/init.d/vpxa restart
"
```

## Complete Example

1. create vm
2. registry mac and ip on dhcp server
3. registry dns
4. config sshd
5. change hostname

```bash
init_govc kyou

esxi_host=kyou.geektr.co
vm_name=co.geektr.taisun
vm_ip=10.2.1.4
vm_domain=taisun.geektr.co

govc vm.create -u $esxi_host \
    -ds=main-storage \
    -m=32768 \
    -c=8 \
    -g=debian9_64Guest \
    --net.adapter=vmxnet3 \
    -net=vlan-vms \
    --disk.controller=pvscsi \
    -disk=base/debian.vmdk \
    -on=false \
    $vm_name

echo "vm created"

govc vm.power -u $esxi_host -on=true $vm_name

vm_mac=$(govc device.info -u $esxi_host -vm $vm_name -json ethernet-0 | jq -r ".Devices[].MacAddress")

ssh router.local.geektr.co "/ip dhcp-server lease add comment=$vm_domain mac-address=$vm_mac server=dhcp-vms address=$vm_ip"

ssh router.local.geektr.co "/ip dns static add name=$vm_domain address=$vm_ip"

echo "network configured"

printf "waiting sshd startup ..."
while ! nc -z $vm_ip 22; do
  printf '.'
  sleep 3
done

ssh -o "StrictHostKeyChecking=no" "$vm_ip" \
    "sudo su -c 'hostnamectl set-hostname $vm_domain'"

echo "hostname configured"
```

## More

<details><summary>1. VMWare VMGuestOsIdentifier</summary>

[Reference](https://www.vmware.com/support/orchestrator/doc/vro-vsphere65-api/html/VcVirtualMachineGuestOsIdentifier.html)

| NAME                      | DESCRIPTION                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| asianux3_64Guest          | Asianux Server 3 \(64 bit\)                                         |
| asianux3Guest             | Asianux Server 3                                                    |
| asianux4_64Guest          | Asianux Server 4 \(64 bit\)                                         |
| asianux4Guest             | Asianux Server 4                                                    |
| asianux5_64Guest          | Asianux Server 5 \(64 bit\)                                         |
| asianux7_64Guest          | Asianux Server 7 \(64 bit\)                                         |
| centos6_64Guest           | CentOS 6 \(64\-bit\)                                                |
| centos64Guest             | CentOS 4/5 \(64\-bit\)                                              |
| centos6Guest              | CentOS 6                                                            |
| centos7_64Guest           | CentOS 7 \(64\-bit\)                                                |
| centos7Guest              | CentOS 7                                                            |
| centosGuest               | CentOS 4/5                                                          |
| coreos64Guest             | CoreOS Linux \(64 bit\)                                             |
| darwin10_64Guest          | Mac OS 10\.6 \(64 bit\)                                             |
| darwin10Guest             | Mac OS 10\.6                                                        |
| darwin11_64Guest          | Mac OS 10\.7 \(64 bit\)                                             |
| darwin11Guest             | Mac OS 10\.7                                                        |
| darwin12_64Guest          | Mac OS 10\.8 \(64 bit\)                                             |
| darwin13_64Guest          | Mac OS 10\.9 \(64 bit\)                                             |
| darwin14_64Guest          | Mac OS 10\.10 \(64 bit\)                                            |
| darwin15_64Guest          | Mac OS 10\.11 \(64 bit\)                                            |
| darwin16_64Guest          | Mac OS 10\.12 \(64 bit\)                                            |
| darwin64Guest             | Mac OS 10\.5 \(64 bit\)                                             |
| darwinGuest               | Mac OS 10\.5                                                        |
| debian10_64Guest          | Debian GNU/Linux 10 \(64 bit\)                                      |
| debian10Guest             | Debian GNU/Linux 10                                                 |
| debian4_64Guest           | Debian GNU/Linux 4 \(64 bit\)                                       |
| debian4Guest              | Debian GNU/Linux 4                                                  |
| debian5_64Guest           | Debian GNU/Linux 5 \(64 bit\)                                       |
| debian5Guest              | Debian GNU/Linux 5                                                  |
| debian6_64Guest           | Debian GNU/Linux 6 \(64 bit\)                                       |
| debian6Guest              | Debian GNU/Linux 6                                                  |
| debian7_64Guest           | Debian GNU/Linux 7 \(64 bit\)                                       |
| debian7Guest              | Debian GNU/Linux 7                                                  |
| debian8_64Guest           | Debian GNU/Linux 8 \(64 bit\)                                       |
| debian8Guest              | Debian GNU/Linux 8                                                  |
| **debian9_64Guest**       | Debian GNU/Linux 9 \(64 bit\)                                       |
| debian9Guest              | Debian GNU/Linux 9                                                  |
| dosGuest                  | MS\-DOS\.                                                           |
| eComStation2Guest         | eComStation 2\.0                                                    |
| eComStationGuest          | eComStation 1\.x                                                    |
| fedora64Guest             | Fedora Linux \(64 bit\)                                             |
| fedoraGuest               | Fedora Linux                                                        |
| **freebsd64Guest**        | FreeBSD x64                                                         |
| freebsdGuest              | FreeBSD                                                             |
| genericLinuxGuest         | Other Linux                                                         |
| mandrakeGuest             | Mandrake Linux                                                      |
| mandriva64Guest           | Mandriva Linux \(64 bit\)                                           |
| mandrivaGuest             | Mandriva Linux                                                      |
| netware4Guest             | Novell NetWare 4                                                    |
| netware5Guest             | Novell NetWare 5\.1                                                 |
| netware6Guest             | Novell NetWare 6\.x                                                 |
| nld9Guest                 | Novell Linux Desktop 9                                              |
| oesGuest                  | Open Enterprise Server                                              |
| openServer5Guest          | SCO OpenServer 5                                                    |
| openServer6Guest          | SCO OpenServer 6                                                    |
| opensuse64Guest           | OpenSUSE Linux \(64 bit\)                                           |
| opensuseGuest             | OpenSUSE Linux                                                      |
| oracleLinux6_64Guest      | Oracle 6 \(64\-bit\)                                                |
| oracleLinux64Guest        | Oracle Linux 4/5 \(64\-bit\)                                        |
| oracleLinux6Guest         | Oracle 6                                                            |
| oracleLinux7_64Guest      | Oracle 7 \(64\-bit\)                                                |
| oracleLinux7Guest         | Oracle 7                                                            |
| oracleLinuxGuest          | Oracle Linux 4/5                                                    |
| os2Guest                  | OS/2                                                                |
| other24xLinux64Guest      | Linux 2\.4x Kernel \(64 bit\) \(experimental\)                      |
| other24xLinuxGuest        | Linux 2\.4x Kernel                                                  |
| other26xLinux64Guest      | Linux 2\.6x Kernel \(64 bit\) \(experimental\)                      |
| other26xLinuxGuest        | Linux 2\.6x Kernel                                                  |
| other3xLinux64Guest       | Linux 3\.x Kernel \(64 bit\)                                        |
| other3xLinuxGuest         | Linux 3\.x Kernel                                                   |
| otherGuest                | Other Operating System                                              |
| otherGuest64              | Other Operating System \(64 bit\) \(experimental\)                  |
| otherLinux64Guest         | Linux \(64 bit\) \(experimental\)                                   |
| otherLinuxGuest           | Linux 2\.2x Kernel                                                  |
| redhatGuest               | Red Hat Linux 2\.1                                                  |
| rhel2Guest                | Red Hat Enterprise Linux 2                                          |
| rhel3_64Guest             | Red Hat Enterprise Linux 3 \(64 bit\)                               |
| rhel3Guest                | Red Hat Enterprise Linux 3                                          |
| rhel4_64Guest             | Red Hat Enterprise Linux 4 \(64 bit\)                               |
| rhel4Guest                | Red Hat Enterprise Linux 4                                          |
| rhel5_64Guest             | Red Hat Enterprise Linux 5 \(64 bit\) \(experimental\)              |
| rhel5Guest                | Red Hat Enterprise Linux 5                                          |
| rhel6_64Guest             | Red Hat Enterprise Linux 6 \(64 bit\)                               |
| rhel6Guest                | Red Hat Enterprise Linux 6                                          |
| rhel7_64Guest             | Red Hat Enterprise Linux 7 \(64 bit\)                               |
| rhel7Guest                | Red Hat Enterprise Linux 7                                          |
| sjdsGuest                 | Sun Java Desktop System                                             |
| sles10_64Guest            | Suse Linux Enterprise Server 10 \(64 bit\) \(experimental\)         |
| sles10Guest               | Suse linux Enterprise Server 10                                     |
| sles11_64Guest            | Suse Linux Enterprise Server 11 \(64 bit\)                          |
| sles11Guest               | Suse linux Enterprise Server 11                                     |
| sles12_64Guest            | Suse Linux Enterprise Server 12 \(64 bit\)                          |
| sles12Guest               | Suse linux Enterprise Server 12                                     |
| sles64Guest               | Suse Linux Enterprise Server 9 \(64 bit\)                           |
| slesGuest                 | Suse Linux Enterprise Server 9                                      |
| solaris10_64Guest         | Solaris 10 \(64 bit\) \(experimental\)                              |
| solaris10Guest            | Solaris 10 \(32 bit\) \(experimental\)                              |
| solaris11_64Guest         | Solaris 11 \(64 bit\)                                               |
| solaris6Guest             | Solaris 6                                                           |
| solaris7Guest             | Solaris 7                                                           |
| solaris8Guest             | Solaris 8                                                           |
| solaris9Guest             | Solaris 9                                                           |
| suse64Guest               | Suse Linux \(64 bit\)                                               |
| suseGuest                 | Suse Linux                                                          |
| turboLinux64Guest         | Turbolinux \(64 bit\)                                               |
| turboLinuxGuest           | Turbolinux                                                          |
| ubuntu64Guest             | Ubuntu Linux \(64 bit\)                                             |
| ubuntuGuest               | Ubuntu Linux                                                        |
| unixWare7Guest            | SCO UnixWare 7                                                      |
| vmkernel5Guest            | VMware ESX 5                                                        |
| vmkernel65Guest           | VMware ESX 6\.5                                                     |
| vmkernel6Guest            | VMware ESX 6                                                        |
| vmkernelGuest             | VMware ESX 4                                                        |
| vmwarePhoton64Guest       | VMware Photon \(64 bit\)                                            |
| win2000AdvServGuest       | Windows 2000 Advanced Server                                        |
| win2000ProGuest           | Windows 2000 Professional                                           |
| win2000ServGuest          | Windows 2000 Server                                                 |
| win31Guest                | Windows 3\.1                                                        |
| win95Guest                | Windows 95                                                          |
| win98Guest                | Windows 98                                                          |
| windows7_64Guest          | Windows 7 \(64 bit\)                                                |
| windows7Guest             | Windows 7                                                           |
| windows7Server64Guest     | Windows Server 2008 R2 \(64 bit\)                                   |
| windows8_64Guest          | Windows 8 \(64 bit\)                                                |
| windows8Guest             | Windows 8                                                           |
| windows8Server64Guest     | Windows 8 Server \(64 bit\)                                         |
| **windows9_64Guest**      | Windows 10 \(64 bit\)                                               |
| windows9Guest             | Windows 10                                                          |
| **windows9Server64Guest** | Windows 10 Server \(64 bit\)                                        |
| windowsHyperVGuest        | Windows Hyper\-V                                                    |
| winLonghorn64Guest        | Windows Longhorn \(64 bit\) \(experimental\)                        |
| winLonghornGuest          | Windows Longhorn \(experimental\)                                   |
| winMeGuest                | Windows Millenium Edition                                           |
| winNetBusinessGuest       | Windows Small Business Server 2003                                  |
| winNetDatacenter64Guest   | Windows Server 2003, Datacenter Edition \(64 bit\) \(experimental\) |
| winNetDatacenterGuest     | Windows Server 2003, Datacenter Edition                             |
| winNetEnterprise64Guest   | Windows Server 2003, Enterprise Edition \(64 bit\)                  |
| winNetEnterpriseGuest     | Windows Server 2003, Enterprise Edition                             |
| winNetStandard64Guest     | Windows Server 2003, Standard Edition \(64 bit\)                    |
| winNetStandardGuest       | Windows Server 2003, Standard Edition                               |
| winNetWebGuest            | Windows Server 2003, Web Edition                                    |
| winNTGuest                | Windows NT 4                                                        |
| winVista64Guest           | Windows Vista \(64 bit\)                                            |
| winVistaGuest             | Windows Vista                                                       |
| winXPHomeGuest            | Windows XP Home Edition                                             |
| winXPPro64Guest           | Windows XP Professional Edition \(64 bit\)                          |
| winXPProGuest             | Windows XP Professional                                             |

</details>
