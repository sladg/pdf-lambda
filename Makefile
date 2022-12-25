start:
	poetry run chalice local --port 8080 --stage local

prepare-requirements:
	poetry export --format requirements.txt --output requirements.txt

deploy:
	$(MAKE) prepare-requirements
	poetry run chalice deploy --stage dev
	rm requirements.txt

install:
	poetry install
	npm install

commit:
	npx --package cz-emoji-conventional --package commitizen -- cz

release:
	npx --package @sladg/release-utils utils shipit --gitUser @sladg --gitEmail jan@ssoukup.com --changelog