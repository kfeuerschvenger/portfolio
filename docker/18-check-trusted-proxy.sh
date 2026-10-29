#!/bin/sh
# Runs from /docker-entrypoint.d/ before 20-envsubst-on-templates.sh renders the nginx template.
# An empty TRUSTED_PROXY_CIDR would render `set_real_ip_from ;`, which nginx rejects with an
# unhelpful syntax error, so stop here with a message that names the variable.
set -eu

if [ -z "${TRUSTED_PROXY_CIDR:-}" ]; then
  echo "error: TRUSTED_PROXY_CIDR is empty. Set it to the subnet nginx-proxy-manager connects from, for example 172.18.0.0/16." >&2
  exit 1
fi
