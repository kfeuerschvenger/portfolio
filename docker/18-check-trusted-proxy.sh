#!/bin/sh
# Runs from /docker-entrypoint.d/ before 20-envsubst-on-templates.sh renders the nginx template.
# An empty TRUSTED_PROXY_CIDR would render `set_real_ip_from ;`, which nginx rejects with an
# unhelpful syntax error, so stop here with a message that names the variable. A value that is
# not an IPv4/IPv6 address or CIDR is rejected for the same reason.
set -eu

# Trim leading and trailing whitespace
value="$(printf '%s' "${TRUSTED_PROXY_CIDR:-}" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"

if [ -z "$value" ]; then
  echo "error: TRUSTED_PROXY_CIDR is empty. Set it to the subnet nginx-proxy-manager connects from, for example 172.18.0.0/16." >&2
  exit 1
fi

# IPv4 with optional /0-32, or IPv6 (hex groups and colons, optionally ::ffff:1.2.3.4 style) with optional /0-128
ipv4='([0-9]{1,3}\.){3}[0-9]{1,3}(/([0-9]|[12][0-9]|3[0-2]))?'
ipv6='[0-9A-Fa-f:]*:[0-9A-Fa-f:.]*(/([0-9]|[1-9][0-9]|1[01][0-9]|12[0-8]))?'

if ! printf '%s' "$value" | grep -Eq "^(${ipv4}|${ipv6})$"; then
  echo "error: TRUSTED_PROXY_CIDR is not a valid IPv4/IPv6 address or CIDR: '$value'. Use a value such as 172.18.0.0/16." >&2
  exit 1
fi
