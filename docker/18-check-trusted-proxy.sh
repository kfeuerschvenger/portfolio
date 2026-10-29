#!/bin/sh
# Runs from /docker-entrypoint.d/ before 20-envsubst-on-templates.sh renders the nginx template.
# An empty or malformed TRUSTED_PROXY_CIDR would render a `set_real_ip_from` line nginx rejects with
# an unhelpful syntax error (or, worse, a value that injects extra directives), so stop here with a
# message that names the variable.
#
# What is checked, after surrounding spaces are trimmed:
#   - the raw value has no newline, tab or other control character
#   - the value is not empty
#   - IPv4: four decimal octets 0-255 (no more than 3 digits each), optional /0-/32
#   - IPv6: at least two colons, at most one `::`, groups of 1-4 hex digits, 8 groups in total
#     (`::` stands for one or more groups), an optional trailing embedded IPv4 such as
#     ::ffff:1.2.3.4 (counts as two groups), optional /0-/128
#
# The trimmed value is only checked here: this script runs as its own process, so it cannot change
# what envsubst reads. nginx ignores whitespace around the rendered value, so the untrimmed value
# renders to the same directive that was validated.
set -eu

raw="${TRUSTED_PROXY_CIDR:-}"

# Any character that is not printable ASCII (newline, tab, CR, ...) is rejected on the raw value
case "$raw" in
  *[![:print:]]*)
    echo "error: TRUSTED_PROXY_CIDR contains a newline or control character. Use a single-line value such as 172.18.0.0/16." >&2
    exit 1
    ;;
esac

# Trim leading and trailing spaces
value="${raw#"${raw%%[! ]*}"}"
value="${value%"${value##*[! ]}"}"

if [ -z "$value" ]; then
  echo "error: TRUSTED_PROXY_CIDR is empty. Set it to the subnet nginx-proxy-manager connects from, for example 172.18.0.0/16." >&2
  exit 1
fi

if ! V="$value" awk '
  function ipv4(a,   p, n, i) {
    n = split(a, p, ".")
    if (n != 4) return 0
    for (i = 1; i <= 4; i++) {
      if (p[i] !~ /^[0-9]+$/ || length(p[i]) > 3 || p[i] + 0 > 255) return 0
    }
    return 1
  }
  function ipv6(a,   g, n, i, count, compress, last) {
    if (a ~ /:::/) return 0
    compress = index(a, "::") > 0
    if (compress && index(substr(a, index(a, "::") + 2), "::") > 0) return 0
    if (a ~ /^:/ && a !~ /^::/) return 0
    if (a ~ /:$/ && a !~ /::$/) return 0
    n = split(a, g, ":")
    if (n < 3) return 0
    count = 0
    for (i = 1; i <= n; i++) {
      if (g[i] == "") continue
      if (i == n && g[i] ~ /\./) {
        if (!ipv4(g[i])) return 0
        count += 2
      } else {
        if (g[i] !~ /^[0-9A-Fa-f]+$/ || length(g[i]) > 4) return 0
        count++
      }
    }
    if (compress) return count <= 7
    return count == 8
  }
  function prefix(p, max) {
    return p ~ /^(0|[1-9][0-9]*)$/ && length(p) <= 3 && p + 0 <= max
  }
  BEGIN {
    v = ENVIRON["V"]
    n = split(v, part, "/")
    if (n > 2 || (n == 2 && part[2] == "")) exit 1
    if (index(part[1], ":") > 0) {
      ok = ipv6(part[1]) && (n == 1 || prefix(part[2], 128))
    } else {
      ok = ipv4(part[1]) && (n == 1 || prefix(part[2], 32))
    }
    exit ok ? 0 : 1
  }
'; then
  echo "error: TRUSTED_PROXY_CIDR is not a valid IPv4/IPv6 address or CIDR: '$value'. Use a value such as 172.18.0.0/16." >&2
  exit 1
fi
