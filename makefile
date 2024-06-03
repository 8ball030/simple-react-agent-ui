install:
	poetry install && bun install
.PHONY: build
build:
	poetry run bash build.sh
