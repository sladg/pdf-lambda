# AWS keys must be set in order to pack application.
WKHTMLTOPDF_LAYER_ARN = arn:aws:lambda:eu-central-1:347599033421:layer:wkhtmltopdf-0_12_6:1
WKHTMLTOPDF_LAYER_URL = $(shell aws lambda get-layer-version-by-arn --arn $(WKHTMLTOPDF_LAYER_ARN) --query Content.Location --output text)

BUILD_FOLDER = ./dist
LAMBDA_FOLDER = ./pdf_lambda

commit:
	npx --package cz-emoji-conventional --package commitizen -- cz

release:
	npx --package @sladg/release-utils utils shipit --gitUser @sladg --gitEmail jan@ssoukup.com --changelog

install:
# Install dependencies for both poetry and npm
	poetry install && npm ci

package-wkhtmltopdf:
# Use existing layer instead of packaging new one
	curl "$(WKHTMLTOPDF_LAYER_URL)" -o $(BUILD_FOLDER)/wkhtmltopdf-layer.zip

package-dependencies:
	poetry build
	poetry run \
		pip install \
		--only-binary=:all: \
		--python=3.8 \
		--upgrade \
		--implementation cp \
		--platform manylinux2014_x86_64 \
		--target=./python \
		dist/*.whl

# Clean after poetry build
	rm dist/*.whl dist/*.tar.gz
# Package in lambda-compatible folder structure
	zip -q -r $(BUILD_FOLDER)/vendor-layer.zip ./python

package-code:
	zip -q -r $(BUILD_FOLDER)/code.zip $(LAMBDA_FOLDER)/*

start:
	poetry run python $(LAMBDA_FOLDER)/handler.py

test:
	poetry run pytest

# Pack the dependencies into a zip file and include code as separate zip file.
package:
	rm -rf $(BUILD_FOLDER)
	mkdir $(BUILD_FOLDER)
	$(MAKE) package-wkhtmltopdf
	$(MAKE) package-dependencies
	$(MAKE) package-code
	npm run build