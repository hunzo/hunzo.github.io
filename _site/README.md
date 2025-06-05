# install dependency

```bash
sudo apt update
sudo apt install -y git ruby-full build-essential zlib1g-dev
```

# install ruby

```bash
echo '# Install Ruby Gems to ~/.gem' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/.gem"' >> ~/.bashrc
echo 'export PATH="$HOME/.gem/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

# install jekyll and bundler

```bash
gem install jekyll bundler
```

# install bundler

```
bundle install
```

# run server

```bash
bundle exec jekyll serve
```
