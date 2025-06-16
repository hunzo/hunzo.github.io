var store = [{
        "title": "Install Oracle Linux 6.8",
        "excerpt":"ref . install oracle linux 6.8 @oracle base Install Software List from GUI Base System &gt; Base Base System &gt; Client management tools Base System &gt; Compatibility libraries Base System &gt; Hardware monitoring utilities Base System &gt; Large Systems Performance Base System &gt; Network file system client Base System &gt;...","categories": ["blog"],
        "tags": ["linux","oracle","database"],
        "url": "/blog/2025/06/05/install-oracle-linux.html",
        "teaser": null
      },{
        "title": "Linux LVM Management",
        "excerpt":"Step by step to add disk to LVM and resize lv Add Disk fdisk -l /dev/sdx and create new partition pvcreate /dev/sdx1 vgdisplay Create LVM Volume vgcreate volumn_name /dev/sdd Extend Volume vgextend vol_group_name /dev/sdx1 Create Logical Volume lvcreate -l 20m -n logical_vol vol_group lvcreate -l 100%FREE -n logical_vol vol_group lvdisplay...","categories": ["blog"],
        "tags": ["linux","lvm"],
        "url": "/blog/2025/06/05/lvm.html",
        "teaser": null
      },{
        "title": "Ruby Install",
        "excerpt":"install dependency sudo apt update sudo apt install -y git ruby-full build-essential zlib1g-dev install ruby echo '# Install Ruby Gems to ~/.gem' &gt;&gt; ~/.bashrc echo 'export GEM_HOME=\"$HOME/.gem\"' &gt;&gt; ~/.bashrc echo 'export PATH=\"$HOME/.gem/bin:$PATH\"' &gt;&gt; ~/.bashrc source ~/.bashrc install jekyll and bundler gem install jekyll bundler install bundler bundle install run server...","categories": ["blog"],
        "tags": ["gem","ruby"],
        "url": "/blog/2025/06/05/ruby-install.html",
        "teaser": null
      },{
        "title": "Fix DHCP for Ubuntu vmware template",
        "excerpt":"   Run script, shutdown and convert to template    sudo rm /etc/machine-id sudo touch /etc/machine-id sudo chmod 644 /etc/machine-id  ","categories": ["blog"],
        "tags": ["linux","vmware"],
        "url": "/blog/2025/06/05/vmware-ubuntu-template.html",
        "teaser": null
      },{
        "title": "Kubernetes Monitoring Install",
        "excerpt":"Add Repo helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts helm repo add grafana https://grafana.github.io/helm-charts Update Repo helm repo update Install Metrics server helm install metrics-server metrics-server/metrics-server -n kube-system \\ --set args={--kubelet-insecure-tls} Install Prometheus helm install prometheus prometheus-community/kube-prometheus-stack \\ --namespace monitoring --create-namespace \\ --set kubeStateMetrics.enabled=true \\ --set grafana.enabled=false...","categories": ["blog"],
        "tags": ["kubernetes","linux","monitor"],
        "url": "/blog/2025/06/05/k8s-monitor.html",
        "teaser": null
      },{
        "title": "ขั้นตอนการตั้งค่า Certificate Template สำหรับ 802.1X บน Windows Server",
        "excerpt":"Certificate Template for 802.1X on Windows Server เอกสารนี้สรุปขั้นตอนทั้งหมดสำหรับการสร้าง, ตั้งค่า, และแจกจ่าย Certificate สำหรับการยืนยันตัวตนผ่านเครือข่ายด้วยมาตรฐาน 802.1X โดยใช้ Active Directory Certificate Services (AD CS) บน Windows Server 📋 1. สิ่งที่ต้องมีก่อน (Prerequisites) ก่อนเริ่มต้น ต้องแน่ใจว่าระบบของคุณมีองค์ประกอบต่อไปนี้ครบถ้วน: Active Directory Domain Services (AD DS): ติดตั้งและทำงานได้อย่างสมบูรณ์ Active Directory Certificate Services (AD CS): ติดตั้ง Role นี้และตั้งค่าเป็น Enterprise CA (Certificate Authority) เรียบร้อยแล้ว...","categories": ["blog"],
        "tags": ["802.1x","radius","window","AD"],
        "url": "/blog/2025/06/05/npas-certificates.html",
        "teaser": null
      }]
