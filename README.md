
# Features
* Supported ghc-8.10, ghc-8.8
* The source file extension must be ".hs"
* Can not use STDIN handle while debugging.
* Creating tasks.json.
* Shortcut keys
  * F5 : start / continue debugging
  * F6 : show command menu
  * Shift + F6 : stop watch
  * F7 : clean & build
  * F8 : start test
  * F9 : put a breakpoint on the current line
  * Shift + F9 : put a breakpoint on the current column
  * F10 : step next
  * F11 : step into



# Install

## Stack
 Install [haskell-dap](https://hackage.haskell.org/package/haskell-dap), [ghci-dap](https://hackage.haskell.org/package/ghci-dap), [haskell-debug-adapter](https://hackage.haskell.org/package/haskell-debug-adapter) at once.

```
$ stack update
$
$ stack install haskell-dap ghci-dap haskell-debug-adapter
$
$ ghci-dap --version
[DAP][INFO] start ghci-dap-0.0.XX.0.
The Glorious Glasgow Haskell Compilation System, version 8.X.X
$
$ haskell-debug-adapter --version
VERSION: haskell-debug-adapter-0.0.XX.0
$
```

## Cabal
 Install [ghci-dap](https://hackage.haskell.org/package/ghci-dap), [haskell-debug-adapter](https://hackage.haskell.org/package/haskell-debug-adapter).

```
$ cabal update
$
$ cabal install ghci-dap haskell-debug-adapter
$
$ haskell-debug-adapter --version
VERSION: haskell-debug-adapter-0.0.XX.0
$
```


# Run
## 1. Create a project
### Stack project
```
$ mkdir project_stack
$ cd project_stack
$
$ stack new sample --bare
$ stack test
$
```

### Cabal project
```
$ mkdir project_cabal
$ cd project_cabal
$
$ cabal init
$ cabal configure
$ cabal bulid
$
```

## 2. VSCode debug setting
![01_create_launch.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/01_create_launch.png)
![02_create_launch.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/02_create_launch.png)

## 3. Select a debug configuration
### Stack project

![03_select_stack.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/03_select_stack.png)

### Cabal project
![03_select_cabal.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/03_select_cabal.png)


## 4. Put a breakpoint
![04_bp.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/04_bp.png)
## 5. Start debugging
![05_run.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/05_run.png)
![06_break.png](https://raw.githubusercontent.com/phoityne/hdx4vsc/master/docs/2021_readme/06_break.png)
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
|ghciCmd|required|stack ghci --test --no-load --no-build --main-is TARGET --ghci-options -fprint-evld-with-show|launch ghci command, must be Prelude module loaded. For example, "cabal exec -- ghci-dap --interactive -i${workspaceFolder}/src"|
|ghciEnv|required|[]|Environment variables for ghci exectution.|
|logFile|required|${workspaceRoot}/.vscode/phoityne.log|internal log file.|
|logLevel|required|WARNING|internal log level.|
|forceInspect|required|false|Inspect scope variables force.|

