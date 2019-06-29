
# Requirements

 Install [haskell-dap](https://hackage.haskell.org/package/haskell-dap), [ghci-dap](https://hackage.haskell.org/package/ghci-dap), [haskell-debug-adapter](https://hackage.haskell.org/package/haskell-debug-adapter) at once.

```
> stack install haskell-dap ghci-dap haskell-debug-adapter
>
```


# Limitations
* Supported ghc-8.4, 8.6, ~~8.8~~
* The source file extension must be ".hs"
* Can not use STDIN handle while debugging. 
* Using ghc-8.0, 8.2, see the [README](https://github.com/phoityne/hdx4vsc/blob/master/README_ghc86.md).
* Using ghc7, see the [README](https://github.com/phoityne/hdx4vsc/blob/master/README_ghc7.md).

  
# Features

## Quick Setup
![07_construct_dev.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/07_construct_dev.gif)


## Quick Start Debugging
This is a new experimental feature.   
__Note!!__, This function will automatically change the .vscode / launch.json file.  
![06_quick_start.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/06_quick_start.gif)

## Continue & Steps

![01_F5_F10_F11.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/01_F5_F10_F11.gif)


## Stacktrace

The variable added to watch will be forced.

![03_stacktrace.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/03_stacktrace.gif)


## Bindings

![04_variables.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/04_variables.gif)


## Break condition

![05_break_cond.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/05_break_cond.gif)

## Console output

![02_console_out.gif](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/02_console_out.gif)


# Shortcut keys

When you start debugging for the first time, .vscode/tasks.json will be created automatically. Then you can use F6, F7, F8 shortcut keys.
  * F5 : start debug
  * F6 : show command menu (for stack watch)
  * Shift + F6 : stop stack watch
  * F7 : stack clean & build
  * F8 : stack test
  * F9 : put a breakpoint on the current line
  * Shift + F9 : put a breakpoint on the current column

While debugging, you can use F5, F9, F10, F11 shortcut keys.
  * F5 : jump to next bp
  * F9 : put bp on the line
  * Shift + F9 : put bp on the column
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
