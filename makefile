SHELL := /bin/bash
EXECUTABLES = sed rm mkdir date zip m4 cp cat
K := $(foreach exec,$(EXECUTABLES),\
	$(if $(shell which $(exec)),some string,$(error "Could not find the dependency '$(exec)'. If you are unable to install it, there are complete builds of mal-clean-js at https://github.com/KanashiiDev/MAL-Clean-JS/releases or https://greasyfork.org/en/scripts/480965-mal-clean-js")))

all: pre-build build build/malclean.user.js build/firefox_addon.zip post-build

pre-build:
	rm -f build/userModules.js
build/malclean.user.js: malclean.m4 settings.js alias.js css/global.css conditionalStyles.js utilities.js purify.js graphql.js controller.js build/userModules.js HOWTO.js
	m4 --prefix-builtins malclean.m4 > build/malclean.user.js
	date +"%s" | sed 's_^_//malclean built at _' >> build/malclean.user.js

build/userModules.js: find modules -type f -name "*.js" | while read module; do
    echo "//begin $module"
    cat "$module"
    echo "//end $module"
done > build/userModules.js

build:
	mkdir build

post-build:
	$(info )
	$(info mal-clean-js build completed)
	$(info The compiled script is in /src/build/)
