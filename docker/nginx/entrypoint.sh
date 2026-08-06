#!/bin/sh
set -eu

server_name="${NGINX_SERVER_NAME:-_}"
ssl_enabled="${NGINX_SSL_ENABLED:-false}"
ssl_certificate="${NGINX_SSL_CERTIFICATE:-/etc/nginx/certs/fullchain.pem}"
ssl_certificate_key="${NGINX_SSL_CERTIFICATE_KEY:-/etc/nginx/certs/privkey.pem}"
config_path="/etc/nginx/conf.d/default.conf"

write_proxy_locations() {
	cat <<'EOF'
	client_max_body_size 260m;

	proxy_http_version 1.1;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection $connection_upgrade;

	location /api/ {
		proxy_pass http://backend;
	}

	location /uploads/ {
		proxy_pass http://backend;
	}

	location /music/ {
		proxy_pass http://backend;
	}

	location /_next/static/ {
		proxy_pass http://frontend;
		add_header Cache-Control "public, max-age=31536000, immutable";
	}

	location / {
		proxy_pass http://frontend;
	}
EOF
}

cat > "$config_path" <<EOF
map \$http_upgrade \$connection_upgrade {
	default upgrade;
	'' close;
}

upstream frontend {
	server frontend:3000;
}

upstream backend {
	server backend:3000;
}
EOF

if [ "$ssl_enabled" = "true" ]; then
	if [ ! -f "$ssl_certificate" ]; then
		echo "SSL is enabled, but certificate file was not found: $ssl_certificate" >&2
		exit 1
	fi

	if [ ! -f "$ssl_certificate_key" ]; then
		echo "SSL is enabled, but certificate key file was not found: $ssl_certificate_key" >&2
		exit 1
	fi

	cat >> "$config_path" <<EOF

server {
	listen 80;
	server_name $server_name;

	location / {
		return 301 https://\$host\$request_uri;
	}
}

server {
	listen 443 ssl;
	http2 on;
	server_name $server_name;

	ssl_certificate $ssl_certificate;
	ssl_certificate_key $ssl_certificate_key;
	ssl_protocols TLSv1.2 TLSv1.3;
	ssl_session_cache shared:SSL:10m;
	ssl_session_timeout 1d;

EOF
	write_proxy_locations >> "$config_path"
	cat >> "$config_path" <<'EOF'
}
EOF
else
	cat >> "$config_path" <<EOF

server {
	listen 80;
	server_name $server_name;

EOF
	write_proxy_locations >> "$config_path"
	cat >> "$config_path" <<'EOF'
}
EOF
fi
