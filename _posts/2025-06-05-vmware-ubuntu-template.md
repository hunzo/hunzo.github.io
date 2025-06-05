---
layout: single
title: "Fix DHCP for Ubuntu vmware template"
date: 2025-06-05 10:30:00 +0700
categories: [blog]
tags: [linux, vmware]
author: takraw
---

> Run script, shutdown and convert to template

```bash
sudo rm /etc/machine-id
sudo touch /etc/machine-id
sudo chmod 644 /etc/machine-id
```
