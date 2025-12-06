#!/bin/bash
# License revalidation removed - no longer needed

if [[ -n "$BBX_DEBUG" ]]; then
  set -x
fi

echo "License revalidation is no longer required." >&2
exit 0
