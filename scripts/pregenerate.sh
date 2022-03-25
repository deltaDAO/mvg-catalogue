#!/usr/bin/env bash

# Run post install script
npm run postinstall

# Generate Apollo typings
npm run apollo:codegen
