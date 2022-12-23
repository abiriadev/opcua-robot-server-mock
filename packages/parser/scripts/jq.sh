#!/bin/sh
cd $(dirname "$0")
jq < ../data/tree-opcua.json "$(cat parse.jq)" $* > ../data/tree-filtered.json
