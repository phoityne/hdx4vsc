@echo off

set where_hda=where $path:haskell-debug-adapter.exe
set hda_path=
for /f "usebackq delims=" %%a in (`%where_hda%`) do set hda_path=%%a

if "%hda_path%" neq "" (
  haskell-debug-adapter.exe
) else (
  echo Content-Length: 199
  echo.
  echo {"command":"initialize","success":false,"request_seq":1,"seq":1,"type":"response","message":"haskell-debug-adapter is not found. Does your shell recognize haskell-debug-adapter?"}
  exit 1
)

