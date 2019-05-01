#!/bin/sh

export HDA_PATH=`which haskell-debug-adapter`
export PHOITYNE_PATH=`which phoityne-vscode`

if [ "X" != "X$HDA_PATH" ]; then
  haskell-debug-adapter --hackage-version=0.0.28.0
elif [ "X" != "X$PHOITYNE_PATH" ]; then
  phoityne-vscode --hackage-version=0.0.28.0
else
  echo -e "Content-Length: 194\r\n\r\n"
  echo '{"command":"initialize","success":false,"request_seq":1,"seq":1,"type":"response","message":"phoityne-vscode is not found. Run `stack install phoityne-vscode`, and put it to PATH environment."}'

  exit 1
fi

