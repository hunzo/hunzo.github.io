# Kubernetes Monitoring install

## Add Repo

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
```

## Update Repo

```bash
helm repo update
```

## Install Metrics server

```bash
helm install metrics-server metrics-server/metrics-server -n kube-system \
  --set args={--kubelet-insecure-tls}
```

## Install Prometheus

```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  --set kubeStateMetrics.enabled=true \
  --set grafana.enabled=false
```

## Install Grafana

```bash
helm install grafana grafana/grafana \
  --namespace monitoring \
  --set adminPassword='admin123' \
  --set service.type=NodePort
```

## Get Grafana URL

```bash
export NODE_PORT=$(kubectl get --namespace monitoring -o jsonpath="{.spec.ports[0].nodePort}" services grafana)
export NODE_IP=$(kubectl get nodes --namespace monitoring -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT
```

## Prometheus Data Source

> http://prometheus-kube-prometheus-prometheus.monitoring.svc:9090

## Import Dashboard

```
1860 (Kubernetes cluster monitoring)
6417 (Kubernetes pod monitoring)
315 (Node Exporter)
```
