FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:stable
COPY dist/notion-like-theme/browser /usr/share/nginx/html/
