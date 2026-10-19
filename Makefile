.DEFAULT_GOAL := help

.PHONY: help install dev build preview test test-model test-ui test-install check

help:
	@echo "Project commands:"
	@echo "  make install       Install dependencies from package-lock.json"
	@echo "  make dev           Start the development server (http://localhost:5173/)"
	@echo "  make build         Check TypeScript and build the app"
	@echo "  make preview       Build and preview the app"
	@echo "  make test-install  Install the Playwright browser"
	@echo "  make test          Run all tests"
	@echo "  make test-model    Run model tests without a browser or app server"
	@echo "  make test-ui       Run browser navigation tests"
	@echo "  make check         Build the app and run tests"

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

test-install:
	npm run test:e2e:install

test: test-model test-ui

test-model:
	npm run test:model -- $(TEST_ARGS)

test-ui:
	npm run test:ui -- $(TEST_ARGS)

check: build test
