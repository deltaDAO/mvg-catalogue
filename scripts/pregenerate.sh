#!/usr/bin/env bash

# Run post install script
npm run postinstall

# Generate Apollo typings
npm run apollo:codegen

# Fetch EVM networks metadata
node ./scripts/write-networks-metadata > content/networks-metadata.json