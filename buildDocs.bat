@echo off
docma --src D3v.js\src\**\*.js -d docs && cd docs && docma serve

PAUSE