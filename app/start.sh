#!/bin/bash
# Script to start Expo with increased file limit

# Increase file limit
ulimit -n 65536

# Start Expo
npx expo start
