.DEFAULT_GOAL := local
PHONY: local
local:
	npm run build


PHONY: browser

ifeq (browser,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

browser:
	rm -rf dist
	rm -rf public/icons
	rm -f public/manifest.json
	cp -r build/assets/$(RUN_ARGS)/icons public/icons
	python build/build.py $(RUN_ARGS)
	npm run build
	[[ $(RUN_ARGS) == "mozilla" ]] && cp amo.metadata.json dist/amo.metadata.json
	(cd dist && zip -r ../$(RUN_ARGS).redherring.zip .)

PHONY: ext
ext:
	npm run ext -- build --source-dir dist
