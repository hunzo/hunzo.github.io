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
      }]
