# PVE Ansible Managements version 1.0.0

# Install ansible

```bash
sudo apt-add-repository ppa:ansible/ansible
sudo apt update
sudo apt install ansible
```

# Generate encrypted passwords for ansible user module

```python
sudo apt install python3-passlib
python3 -c "from passlib.hash import sha512_crypt; import getpass; print(sha512_crypt.using(rounds=5000).hash(getpass.getpass()))"

```

```bash
ansible -i hosts linux \
    -m user \
    -a 'name=<new_user> password="$6$Wv2HAXkLKB/W...." groups=sudo,docker shell=/bin/bash ' \
    -u <user_with_sudo> \
    -k \
    -b \
    -K
```

# Generate ansible-vault password

```
ansible-vault encrypt_string '123456' --name ansible_become_password
ansible-vault encrypt_string '123456' --name ansible_password
```

# Generate ssh-key

```bash
ssh-keygen -f ~/.ssh/ansible -t ed25519
```

```bash
ssh-keygen -f ./plays/files/ssh-files/ansible -t ed25519
```

# Copy public-key to remote server

```bash
ssh-copy-id -i ~/.ssh/ansible.pub remote_user@remote_host_ip_address
```

## SSH to remote server

```bash
ssh -i ./plays/files/ssh-files/ansible ansible@remote_host_ip_address

```

## Change permission ssh-key file

```
chmod 600 plays/files/ssh-files/ansible
```

## Multiple ssh config example edit ~/.ssh/config

```bash
Host *
  HostKeyAlgorithms=+ssh-dss
  KexAlgorithms +diffie-hellman-group1-sha1

Host github.com
HostName github.com
IdentityFile ~/.ssh/github
User hunzo
IdentitiesOnly yes

Host ssh.dev.azure.com
HostName ssh.dev.azure.com
IdentityFile ~/.ssh/devazure
User surapongn
IdentitiesOnly yes
```

# Update PVE No-Subscription

```bash
sed -i 's/https:\/\/enterprise/http:\/\/download/g' /etc/apt/sources.list.d/ceph.list
sed -i 's/https:\/\/enterprise/http:\/\/download/g' /etc/apt/sources.list.d/pve-enterprise.list
sed -i 's/pve bookworm enterprise/pve bookworm pve-no-subscription/g' /etc/apt/sources.list.d/pve-enterprise.list
sed -i 's/ceph-quincy bookworm enterprise/ceph-quincy bookworm no-subscription/g' /etc/apt/sources.list.d/ceph.list
```

# Change Docker StorageDriver

- stop docker

```bash
sudo systemctl stop docker
```

- file /etc/docker/daemon.json

```json
{
  "default-address-pools": [
    {
      "base": "172.31.0.0/16",
      "size": 24
    }
  ],
  "storage-driver": "vfs"
}
```

- start docker

```bash
sudo systemctl start docker
```

# Remove Node from cluster

## turn off node you want to remove

```bash
pvecm nodes
pvecm delnode (name of the node)
reboot
```

# DELETE CLUSTER

```bash
pvecm expected 1
```

# Stop the running cluster

```bash
systemctl stop pve-cluster
```

# Force the nodes to run in local mode

```bash
pmxcfs -l
```

# Delete all the cluster configuration files

```bash
rm -f /etc/pve/cluster.conf /etc/pve/corosync.conf
rm -f /etc/cluster/cluster.conf /etc/corosync/corosync.conf
rm /var/lib/pve-cluster/.pmxcfs.lockfile
```

# Stop cluster from running

```bash
systemctl stop pve-cluster
```

# Reboot and cluster should be gone

```bash
reboot

```

- remove authkey

```bash
rm /etc/corosync/authkey
```

- Recursively change all _.foo files to _.bar

```bash
find . -type f -name '*.foo' -print0 | while IFS= read -r -d '' f; do
  mv -- "$f" "${f%.foo}.bar"
done
```

- Curl with hosts

```bash
curl -i -H 'host: nida-template.nida.ac.th' 127.0.0.1

```

# Proxmox host initial for ansible

## Host Proxmox

- install python3-promoxer

## Create User and API Token

- Create Group ex. ansible
- Create User ex. ansible
- Create API-Token for New Username ex. ansible-id
- Add User and API-Token to PVE-CLUSTER
- Add User and API-Token to local Disk (permission for acces ISO, VM Template, Container Template) ex. local
- Add User and API-Token to Storage ex. (ZFS-SSD, local-lvm, san-storage)

## .ssh/config

```
# default network
host 10.10.*.*
  HostKeyAlgorithms +ssh-rsa,ssh-dss
  PubkeyAcceptedAlgorithms +ssh-rsa,ssh-dss
  user admin
  identityfile ~/code/playground/ansible/files/ssh_keys/ansible

# default server 10.100.100.0/24
host 10.100.100.*
  user admin
  identityfile ~/code/playground/ansible/files/ssh_keys/ansible

# default dmz2 202.44.73.0/24
host 202.44.73.*
  user admin
  identityfile ~/code/playground/ansible/files/ssh_keys/ansible

# default dmz1 202.44.72.0/24
host 202.44.72.*
  user admin
  identityfile ~/code/playground/ansible/files/ssh_keys/ansible

# network devices 10.60.4.0/24
host 10.60.4.*
  HostKeyAlgorithms +ssh-dss
  PubkeyAcceptedAlgorithms +ssh-dss
  MACs hmac-sha1
  Ciphers aes256-ctr,aes128-cbc
  identityfile ~/code/playground/ansible/files/ssh_keys/ansible

# for oracle 10.100.101.0/24
host 10.100.101.*
  HostKeyAlgorithms +ssh-rsa,ssh-dss
  PubkeyAcceptedAlgorithms +ssh-rsa,ssh-dss
```
