#!/bin/sh

export HDA_PATH=`which haskell-debug-adapter`

if [ "X" != "X$HDA_PATH" ]; then
  haskell-debug-adapter
else
  echo -e "Content-Length: 181\r\n\r"
  echo '{"command":"initialize","success":false,"request_seq":1,"seq":1,"type":"response","message":"haskell-debug-adapter is not found. Does your shell recognize haskell-debug-adapter ?"}'

  exit 1
fi

