#!/bin/bash
if [ "$1" == "all" ]
then 
    eval tsc
    eval node dist/deploy.js
else if [ "$1" == "deploy" ]
then
    eval node dist/deploy.js
fi
fi
eval node dist/index.js
