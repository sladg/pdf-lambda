# !/bin/sh

poetry export --format requirements.txt --output requirements.txt
poetry run chalice deploy --stage dev
rm requirements.txt
