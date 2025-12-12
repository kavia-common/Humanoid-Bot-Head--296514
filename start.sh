#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci || npm install

echo "Starting server..."
npm start
