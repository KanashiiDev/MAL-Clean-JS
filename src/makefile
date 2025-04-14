SHELL := /bin/bash
EXECUTABLES = sed rm mkdir date m4 cp cat
K := $(foreach exec,$(EXECUTABLES),\
	$(if $(shell which $(exec)),some string,$(error "Could not find the dependency '$(exec)'. If you are unable to install it, there are complete builds of mal-clean-js at https://github.com/KanashiiDev/MAL-Clean-JS/releases or https://greasyfork.org/en/scripts/480965-mal-clean-js")))

all: pre-build build build/malclean.user.js 

pre-build:
	rm -f build/userModules.js
build/malclean.user.js: malclean.m4 settings.js utilities.js polyfills.js css/main.css.js localization.js controller.js settings/main.js settings/objects.js settings/build.js build/userModules.js
	m4 --prefix-builtins malclean.m4 > build/malclean.user.js
	date +"%s" | sed 's_^_//mal-clean-js built at _' >> build/malclean.user.js

build/userModules.js: modules
	find modules -type f -name "*.js" | while read module; do \
		echo "//begin $$module"; \
		cat "$$module"; \
		echo "//end $$module"; \
	done > build/userModules.js

build:
	mkdir build
	