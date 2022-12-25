#!/usr/bin/env bash

set -e
echo "Deploying PDF Lambda..."

CURRENT_DIR=$(pwd)
SCRIPT_DIR=$(dirname "$0")
TOML_NAME="pyproject.toml"

# Set working environment to folder of this command.
# We expect the script to be located in `.bin` folder inside node_modules, we need to go into package's root.
cd "$SCRIPT_DIR/.."
if [[ -f "$TOML_NAME" ]]; then
    echo "Running in directory $(pwd)"
else
    echo "Current directory, incorrect, moving to package root."
    cd "@sladg/pdf-lambda"
    echo "Running in directory $(pwd)"
fi

# Chalice needs to be installed for deployment.
poetry install

poetry export --format requirements.txt --output requirements.txt

poetry run chalice deploy --stage dev

rm requirements.txt

echo "Deployed PDF Lambda!"

echo "Returning shell context to $CURRENT_DIR"
cd $CURRENT_DIR
