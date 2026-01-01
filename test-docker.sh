#!/bin/bash

# This script should be run from the project root directory
cd "$(dirname "$0")" || exit 1
./deploy/test-local.sh
