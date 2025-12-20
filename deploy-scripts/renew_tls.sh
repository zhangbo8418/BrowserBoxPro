#!/usr/bin/env bash
# Certificate renewal no longer needed - using mkcert for all certificates

if [[ -z "$1" ]]; then
  echo "no domain in first position. renew_tls failing"
  exit 1
fi

if [[ -z "$2" ]]; then
  echo "no user in second position. renew_tls failing"
  exit 1
fi

# mkcert certificates don't need renewal
echo "Certificate renewal not needed - mkcert certificates are self-signed and don't expire."
exit 0
