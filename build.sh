#! /bin/bash
set -e

npm run build 

cd build 

aea ipfs add | grep -o "hash is [^[:space:]]*" | awk '{print $3}' > ../hashes.txt 

cat ../hashes.txt
