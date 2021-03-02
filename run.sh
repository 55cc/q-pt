#!/bin/bash

file=$1
file=${file:-"index.js"}
# echo "file:$file"
# exit 1

# build c functions
qjs cfun.js
if [ $? -ne 0 ]; then
    exit 1
else
    echo -e "\033[42m run \033[30;47m $file \033[0m";
    qjs "$file"
fi

