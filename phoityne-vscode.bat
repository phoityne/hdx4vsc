@echo off

set where_hda=where $path:haskell-debug-adapter.exe
set hda_path=
for /f "usebackq delims=" %%a in (`%where_hda%`) do set hda_path=%%a

if "%hda_path%" neq "" (
  haskell-debug-adapter.exes
) else (
  echo Content-Length: 199
  echo.
  echo {"command":"initialize","success":false,"request_seq":1,"seq":1,"type":"response","message":"phoityne-vscode.exe is not found. Run 'stack install phoityne-vscode', and put it to PATH environment."}
  exit 1
)

