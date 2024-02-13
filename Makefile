ifneq (,$(wildcard ./.env))
    include .env
    export
endif

build:
	npm run build
	npx webpack

deploy:
	npm run build
	npx webpack
	cdk deploy

test:
	npm run test