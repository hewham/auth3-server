version_num := $(shell node -p "require('./package.json').version")

help: ## Display help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

tag: ## tag current version and push to repo
	@git tag ${version_num} && git push origin ${version_num}

version: ## View current version
	@echo "hewham/anonacy-api:$(version_num)"

v: ## View current version
	@make version

set-version: ## Set new version "$ make set_version VERSION=X.X.X"
	@npm --new-version=$$VERSION run-script set_version
	
set: ## Set new version "$ make set v=X.X.X"
	@npm --new-version=$$v run-script set_version

check: ## check sequelize config
	@node -e "console.log(JSON.stringify(JSON.parse(require('fs') \
      .readFileSync(process.argv[1])), null, 2));"  src/db/config.json

deploy: ## git push && make tag && git push heroku master
	@git push && make tag && git push heroku master

push: ## make deploy
	@make deploy

logs: ## heroku logs
	@heroku logs -t


