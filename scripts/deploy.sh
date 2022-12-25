#!/usr/bin/env bash

set -e
echo "Deploying PDF Lambda..."

echo "The script you are running has basename $(basename -- "$0"), dirname $(dirname -- "$0")"
echo "The present working directory is $(pwd)"

CURRENT_DIR=$(pwd)

# Set working environment to folder of this command.
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

echo "Running in $(pwd)"

# Chalice needs to be installed for deployment.
poetry install

poetry export --format requirements.txt --output requirements.txt

poetry run chalice deploy --stage dev

rm requirements.txt

echo "Deployed PDF Lambda!"

echo "Returning shell context to $CURRENT_DIR"
cd $CURRENT_DIR
