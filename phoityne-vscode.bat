@echo off

set where_hda=where $path:haskell-debug-adapter.exe
set hda_path=
for /f "usebackq delims=" %%a in (`%where_hda%`) do set hda_path=%%a

set where_pohityne=where $path:phoityne-vscode.exe
set pohityne_path=
for /f "usebackq delims=" %%a in (`%where_pohityne%`) do set pohityne_path=%%a

if "%hda_path%" neq "" (
  haskell-debug-adapter.exe --hackage-version=0.0.28.0
) else if "%pohityne_path%" neq "" (
  phoityne-vscode.exe --hackage-version=0.0.28.0
) else (
  echo "Content-Length: 199"
  echo.
  echo {"command":"initialize","success":false,"request_seq":1,"seq":1,"type":"response","message":"phoityne-vscode.exe is not found. Run 'stack install phoityne-vscode', and put it to PATH environment."}
  exit 1
)

