#!/bin/bash
# bbcertify.sh - License certification removed, no longer needed

if [[ -n "$BBX_DEBUG" ]]; then
  set -x
fi

# License certification is no longer required
echo "License certification is no longer required." >&2
exit 0
