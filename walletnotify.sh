#!/bin/bash 
echo $1
curl 'http://localhost:8000/graphql' -H 'content-type: application/json' --data '{"query":"mutation {\n  uploadTransaction(txid: \"'$1'\") {\n    txid\n  }\n}\n"}'