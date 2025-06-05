---
layout: single
title: "Install Oracle Linux 6.8"
date: 2025-06-05 10:30:00 +0700
categories: [blog]
tags: [linux, oracle, database]
author: takraw
---

# Install Oracle Linux 6.8

- ref . [install oracle linux 6.8 @oracle base](https://oracle-base.com/articles/11g/oracle-db-11gr2-installation-on-oracle-linux-6)

## Install Software List from GUI

```
Base System > Base
Base System > Client management tools
Base System > Compatibility libraries
Base System > Hardware monitoring utilities
Base System > Large Systems Performance
Base System > Network file system client
Base System > Performance Tools
Base System > Perl Support
Servers > Server Platform
Servers > System administration tools
Desktops > Desktop
Desktops > Desktop Platform
Desktops > Fonts
Desktops > General Purpose Desktop
Desktops > Graphical Administration Tools
Desktops > Input Methods
Desktops > X Window System
Development > Additional Development
Development > Development Tools
Applications > Internet Browser
```

## Update latest repo

> sudo su -

```bash
wget https://archives.fedoraproject.org/pub/archive/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -Uvh epel-release-6*.rpm
```

## Install Software

- tmux
- htop
- open-vm-tools (for vmware)
- qemu-guest-agent (for proxmox)

## Config .bashrc

```
export TMP=/tmp
export TMPDIR=$TMP

export ORACLE_HOSTNAME=localhost.localdomain
export ORACLE_UNQNAME=MEIS
export PS1='($ORACLE_SID) $PWD $ '
export ORACLE_BASE=/u01/app/oracle
export ORACLE_OWNER=oracle
export ORACLE_HOME=$ORACLE_BASE/product/11.2.0/dbhome_1
export PATH=$PATH:/usr/openwin/bin:$ORACLE_HOME/bin:/usr/sbin:/usr/bin
export ORACLE_SID=MEIS
export EDITOR=vi
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib:$ORACLE_HOME/owb/lib
export CLASSPATH=$ORACLE_HOME/JRE:$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib:$ORACLE_HOME/owb/lib
```

## Create Swap

> sudo su -

- create partition

```bash
fdisk /dev/sdb
```

- make swap

```bash
mkswap /dev/sdb1
```

- add /etc/fstab

```
/dev/sdb1                    swap    defaults        0 0
```

## Add disk for Oracle Software

> sudo su -

- add create partition

```bash
fdisk /dev/sdc
```

- create pv

```bash
pvcreate /dev/sdc1
```

- create vgroup

```bash
vgcreate oracle-datafiles /dev/sdc1
```

- create lv

```bash
lvcreate -l 100%FREE -n u01 oracle-datafiles
```

- make file system (ext4)

```bash
mkfs.ext4 /dev/oracle-datafiles/u01
```

- add to /etc/fstab

```bash
/dev/mapper/oracle--datafiles-u01 /u01                   ext4    defaults        0 0
```

## Config tmpfs /etc/fstab

```bash
tmpfs                   /dev/shm                tmpfs   size=16g        0 0
```

## Add group

```bash
useradd oracle
groupadd oinstall
groupadd dba
groupadd oper
usermod -aG oinstall oracle
```

## Change permission

```bash
chown -R oracle:oinstall /u01
chmod -R 775 /u01
```

## Add disk by UUID

```bash
fdisk /dev/sdd
```

> ex.

```
[root@localhost ~]# fdisk /dev/sdd
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0x68ddcc31.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.

Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)

WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
         switch off the mode (command 'c') and change display units to
         sectors (command 'u').

Command (m for help): n
Command action
   e   extended
   p   primary partition (1-4)
p
Partition number (1-4): 1
First cylinder (1-15665, default 1): 1
Last cylinder, +cylinders or +size{K,M,G} (1-15665, default 15665):
Using default value 15665

Command (m for help): w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

- create partition

```bash
pvcreate /dev/sdd1
```

- add pv to vg

```bash
vgextend oracle-datafiles /dev/sdd1
```

- create lv

```bash
lvcreate -l 100%FREE -n u02 oracle-datafiles
```

- check lv

```bash
[root@localhost ~]# lvs
  LV      VG               Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  lv_home VolGroup         -wi-ao----  41.65g
  lv_root VolGroup         -wi-ao----  50.00g
  lv_swap VolGroup         -wi-ao----   7.86g
  u01     oracle-datafiles -wi-ao---- 100.00g
  u02     oracle-datafiles -wi-a----- 120.00g
```

- make file system (ext4)

```bash
mkfs.ext4 /dev/oracle-datafiles/u02
```

- list disk UUID

```bash
lsblk -fs -d
```

```
[root@localhost ~]# lsblk -fs -d
NAME                         FSTYPE LABEL UUID                                 MOUNTPOINT
sda1                         ext4         5f536fce-9109-4882-bfea-800c8139b6f7 /boot
sdb1                         swap         1c5b8002-9ad7-4c71-8559-4f32b314cd8a [SWAP]
sr0
VolGroup-lv_root (dm-0)      ext4         eeb3fb4a-dd0f-4cd0-9179-cbd4e87833f7 /
VolGroup-lv_swap (dm-1)      swap         c8b967c2-25d8-4f07-b0b2-da31e9e6fc9b [SWAP]
oracle--datafiles-u01 (dm-2) ext4         7fa4f11d-e569-4437-829a-a916d7f5e77b /u01
VolGroup-lv_home (dm-3)      ext4         f126fe80-17f2-44b8-bf50-0507870cb020 /home
oracle--datafiles-u02 (dm-4) ext4         61f32085-28e4-43b0-9e20-47a0130a84ca
```

- create mount point

```bash
mkdir /u02
```

- add /etc/fstab

```
UUID=61f32085-28e4-43b0-9e20-47a0130a84ca /u02                   ext4    defaults        0 0
```

## Config Oracle Installation Prequisites

- edit /etc/security/limits.conf

```
oracle              soft    nproc   16384
oracle              hard    nproc   16384
oracle              soft    nofile  4096
oracle              hard    nofile  65536
oracle              soft    stack   10240
```

- edit /etc/security/limits.d/90-nproc.conf

```
# Change this
*          soft    nproc    1024

# To this
* - nproc 16384
```

- edit /etc/selinux/config

```
SELINUX=permissive
```

## Change permission /02

```bash
chown -R oracle:oinstall /u02
chmod -R 775 /u02
```

## Install the following packages from DVD

```bash
cd /media/OL6.8\ x86_64\ Disc\ 1\ 20160518/Server/Packages
rpm -Uvh binutils-2*x86_64*
rpm -Uvh glibc-2*x86_64* nss-softokn-freebl-3*x86_64*
rpm -Uvh glibc-2*i686* nss-softokn-freebl-3*i686*
rpm -Uvh compat-libstdc++-33*x86_64*
rpm -Uvh glibc-common-2*x86_64*
rpm -Uvh glibc-devel-2*x86_64*
rpm -Uvh glibc-devel-2*i686*
rpm -Uvh glibc-headers-2*x86_64*
rpm -Uvh elfutils-libelf-0*x86_64*
rpm -Uvh elfutils-libelf-devel-0*x86_64*
rpm -Uvh gcc-4*x86_64*
rpm -Uvh gcc-c++-4*x86_64*
rpm -Uvh ksh-*x86_64*
rpm -Uvh libaio-0*x86_64*
rpm -Uvh libaio-devel-0*x86_64*
rpm -Uvh libaio-0*i686*
rpm -Uvh libaio-devel-0*i686*
rpm -Uvh libgcc-4*x86_64*
rpm -Uvh libgcc-4*i686*
rpm -Uvh libstdc++-4*x86_64*
rpm -Uvh libstdc++-4*i686*
rpm -Uvh libstdc++-devel-4*x86_64*
rpm -Uvh make-3.81*x86_64*
rpm -Uvh numactl-devel-2*x86_64*
rpm -Uvh sysstat-9*x86_64*
rpm -Uvh compat-libstdc++-33*i686*
rpm -Uvh compat-libcap*
cd /
eject
```

## Automatic setup

```bash
 yum install oracle-rdbms-server-11gR2-preinstall
```
