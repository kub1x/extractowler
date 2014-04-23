#!/bin/bash

FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe
 
# short-name, jar and xpi files name. Must be lowercase with no spaces
JAR_NAME=selectowl
APP_NAME=selectowl@kub1x.org

# which chrome providers we have (space-separated list)
#CHROME_PROVIDERS=content

# ...and these directories       (space separated list)
#ROOT_DIRS=defaults

ROOT_DIR=$(shell pwd)
TMP_DIR=tmp

all: pack

#clean: 
#	# remove any left-over files from previous build
#	rm -f $(APP_NAME).jar $(APP_NAME).xpi
#	rm -rf $(TMP_DIR)

edit: 
	vim content/sidebar.xul
 
pack: 
	rm -rf $(TMP_DIR)
	# prepare
	mkdir -p $(TMP_DIR)/chrome/content
	# load
	cp -v -R content $(TMP_DIR)/chrome
	cp -v -R locale $(TMP_DIR)/chrome
	cp -v -R skin $(TMP_DIR)/chrome
	cp -v -R defaults $(TMP_DIR) || echo 'no defaults'
	cp -v install.rdf $(TMP_DIR)
	cp -v chrome.manifest $(TMP_DIR)
	#generate the JAR file
	cd $(TMP_DIR)/chrome ;\
	zip -r $(JAR_NAME).jar * ;\
	rm -fr content locale skin
	# generate the XPI file
	cd $(TMP_DIR) ;\
	echo "Generating $(APP_NAME).xpi... I'm in $(shell pwd)" ;\
	zip -r ../$(APP_NAME).xpi *
	# clean
	rm -rf $(TMP_DIR)

install: 
	$(FIREFOX) $(APP_NAME).xpi -P selectowl -no-remote >/dev/null 2>&1 &
	#cp $(APP_NAME).xpi /cygdrive/c/Users/kub1x/AppData/Roaming/Mozilla/Firefox/Profiles/d859hbtr.selectowl/extensions/
	#rm -f /cygdrive/c/Users/kub1x/AppData/Roaming/Mozilla/Firefox/Profiles/d859hbtr.selectowl/extensions.*

run: 
	 $(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &

#kill:
#	taskkill.exe /IM firefox.exe && taskkill.exe /IM firefox.exe || echo "no firefox running"

#server:
#	cd testserver ; make run >/dev/null 2>&1 &
