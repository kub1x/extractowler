#!/bin/bash

FIREFOX=/cygdrive/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe

all: run

edit:
	vim bookmarklet.js
 
run: 
	 #$(FIREFOX) -no-remote -P selectowl >/dev/null 2>&1 &
	 $(FIREFOX) -no-remote >/dev/null install.html 2>&1 &

server:
	node.exe server.js >/dev/null 2>&1 &
