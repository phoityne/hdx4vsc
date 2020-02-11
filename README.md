
# Requirements

 Install [haskell-dap](https://hackage.haskell.org/package/haskell-dap), [ghci-dap](https://hackage.haskell.org/package/ghci-dap), [haskell-debug-adapter](https://hackage.haskell.org/package/haskell-debug-adapter) at once.

```
> stack install haskell-dap ghci-dap haskell-debug-adapter
>
> ghci-dap --version
[DAP][INFO] start ghci-dap-0.0.XX.0.
The Glorious Glasgow Haskell Compilation System, version 8.X.X
>
> haskell-debug-adapter --version
VERSION: haskell-debug-adapter-0.0.XX.0
>
```


# Limitations
* Supported ghc-8.8, ghc-8.6
* The source file extension must be ".hs"
* Can not use STDIN handle while debugging. 
* Using ghc-8.0, 8.2, see the [README](https://github.com/phoityne/hdx4vsc/blob/master/README_ghc86.md).
* Using ghc7, see the [README](https://github.com/phoityne/hdx4vsc/blob/master/README_ghc7.md).

  
# Features

## Quickstart
![08_quickstart.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/08_quickstart.gif)


# Shortcut keys

  * F5 : start / continue debugging
  * F6 : show command menu (for stack watch)
  * Shift + F6 : stop stack watch
  * F7 : stack clean & build
  * F8 : stack test
  * F9 : put a breakpoint on the current line
  * Shift + F9 : put a breakpoint on the current column
  * F10 : step next
  * F11 : step into
  

# Configuration

see [sample files](https://github.com/phoityne/hdx4vsc/tree/master/configs).

## __.vscode/launch.json__

|NAME|REQUIRED OR OPTIONAL|DEFAULT SETTING|DESCRIPTION|
|:--|:--:|:--|:--|
|startup|required|${workspaceRoot}/test/Spec.hs|debug startup file, will be loaded automatically.|
|startupFunc|optional|"" (empty string)|debug startup function, will be run instead of main function.|
|startupArgs|optional|"" (empty string)|arguments for startup function. set as string type.|
|stopOnEntry|required|false|stop or not after debugger launched.
|mainArgs|optional|"" (empty string)|main arguments.|
|ghciPrompt|required|H>>=|ghci command prompt string.|
|ghciInitialPrompt|optional|"Prelude> "|initial pormpt of ghci. set it when using custom prompt. e.g. set in .ghci|
|ghciCmd|required|stack ghci --test --no-load --no-build --main-is TARGET --ghci-options -fprint-evld-with-show|launch ghci command, must be Prelude module loaded. For example, "ghci -i${workspaceRoot}/src", "cabal exec -- ghci -i${workspaceRoot}/src"|
|ghciEnv|required|[]|Environment variables for ghci exectution.|
|logFile|required|${workspaceRoot}/.vscode/phoityne.log|internal log file.|
|logLevel|required|WARNING|internal log level.|
|forceInspect|required|false|Inspect scope variables force.|

## __.vscode/tasks.json__

|TASK NAME|REQUIRED OR OPTIONAL|DEFAULT SETTING|DESCRIPTION|
|:--|:--:|:--|:--|
|stack build|required|stack build|task definition for F6 shortcut key.|
|stack clean & build|required|stack clean && stack build|task definition for F7 shortcut key.|
|stack test|required|stack test|task definition for F8 shortcut key.|
|stack watch|required|stack build --test --no-run-tests --file-watch|task definition for F6 shortcut key.|
