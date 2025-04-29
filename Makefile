ifneq ($(ENV),)
    include .env.$(ENV)
else
    include .env.default
endif
export

build:
	npm run build
	npx webpack

deploy:
	npm run build
	npx webpack
	cdk deploy

test:
	npm run test