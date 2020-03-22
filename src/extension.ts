'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
const path = require('path');

let logger : vscode.OutputChannel = vscode.window.createOutputChannel("haskell-debug-adapter");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    logger.clear();
    logger.appendLine("[INFO] Activating.");

    context.subscriptions.push(vscode.commands.registerCommand('extension.hdx4vsc.haskellDebuggingFromEditor',  startHaskellDebuggingFromEditor));
    context.subscriptions.push(vscode.commands.registerCommand('extension.hdx4vsc.haskellDebuggingFromExplore', startHaskellDebuggingFromExplore));

    if (vscode.workspace.workspaceFolders && 1 === vscode.workspace.workspaceFolders.length) {

        const wd = vscode.workspace.workspaceFolders[0].uri.fsPath;
        logger.appendLine("[INFO] preparing tasks.json file in " + wd);

        const vd = path.join(wd, ".vscode");
        if (!fs.existsSync(vd)) {
            logger.appendLine("[INFO] create .vscode folder. <" + vd + ">");
            fs.mkdirSync(vd);
        } else {
            logger.appendLine("[INFO] .vscode folder exists.");
        }

        const ep = path.join(vd, "tasks.json");
        if (!fs.existsSync(ep)) {
            logger.appendLine("[INFO] create tasks.json file. <" + ep + ">");
            fs.writeFileSync(ep, tasks_json);
        } else {
            logger.appendLine("[INFO] tasks.json file exists.");
        }
    }

    logger.appendLine("[INFO] Activated.");
}

// this method is called when your extension is deactivated
//
export function deactivate() {
}

//
//
function startHaskellDebuggingFromEditor(fileUri:vscode.Uri) {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get edditor object.');
        return;
    }

    const startFile = editor.document.fileName;
    const selection = editor.selection;
    const text = editor.document.lineAt(selection.start.line).text;

    logger.appendLine("[DEBUG] startFile: " +  startFile);
    logger.appendLine("[DEBUG] selected line: " +  selection.start.line);
    logger.appendLine("[DEBUG] selected text: " +  text);

    const funcName = getFuncName(text);
    if (funcName === null) {
        vscode.window.showErrorMessage('[HASKELL][ERROR] can not get function name. select the function definition line.');
        return;
    }
    logger.appendLine("[DEBUG] function: " +  funcName);

    if (false === isNeedArgs(editor, funcName)) {
        vscode.window.showInformationMessage("[HASKELL][INFO] Start Haskell Debugging on " + funcName + " with no arguments.");

        runDebugger(fileUri, startFile, funcName, "");

    } else {
        const val = getFuncValArgs(fileUri);
        const options: vscode.InputBoxOptions = {
            prompt: "put arguments of function \"" + funcName + "\".",
            value: val};

        vscode.window.showInputBox(options).then(value => {
            const args = !value ? val : value;

            runDebugger(fileUri, startFile, funcName, args);
        });

    }
}

//
//
function startHaskellDebuggingFromExplore(fileUri:vscode.Uri) {
    const startFile = fileUri.fsPath;
    const funcName = "main";
    const args = "";

    // https://github.com/Microsoft/vscode/issues/3553
    //{
    //    "key": "f10",
    //    "command": "extension.hdx4vsc.haskellDebuggingFromExplore",
    //    "when": "explorerViewletFocus && !inDebugMode"
    //}
    //

    logger.appendLine("[DEBUG] startFile: " +  startFile);
    logger.appendLine("[DEBUG] function: " +  funcName);
    logger.appendLine("[DEBUG] arguments: " +  args);

    runDebugger(fileUri, startFile, funcName, args);
}


//
//
function getFuncValArgs(fileUri:vscode.Uri) {

    const confName = 'haskell-debug-adapter';
    let launch = vscode.workspace.getConfiguration('launch', fileUri);
    let confs = launch.get<any[]>('configurations');

    if (!confs) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get launch configurations section. ' + confs);
        return "";
    }

    for(let i=0; i<confs.length; i++) {
        if (confs[i]['name'] !== confName) {
            continue;
        }

        return confs[i]['startupArgs'];
    }

    return "";
}


//
//
function runDebugger(fileUri:vscode.Uri, startFile:string, funcName:string, args:string) {

    const confName = 'haskell-debug-adapter';
    let launch = vscode.workspace.getConfiguration('launch', fileUri);
    let confs = launch.get<any[]>('configurations');

    if (!confs) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get launch configurations section. ' + confs);
        return;
    }

    let hasSetVal = false;
    for(let i=0; i<confs.length; i++) {
        if (confs[i]['name'] !== confName) {
            continue;
        }

        confs[i]['startup']     = startFile;
        confs[i]['startupFunc'] = funcName;
        confs[i]['startupArgs'] = args;
        hasSetVal = true;

        break;
    }

    if (false === hasSetVal) {
        vscode.window.showErrorMessage('[HASKELL][ERROR] not found "' + confName + '" configurations. ' + confs);
        return;
    }

    launch.update('configurations', confs).then(() => {

        vscode.commands.executeCommand("workbench.action.debug.start");

    });
}


//
//
function isNeedArgs(editor:vscode.TextEditor, funcName:string) : boolean {

    const selection = editor.selection;
    const line = editor.document.lineAt(selection.start.line).text;
    const maxSearchLines = 20;

    if (0 <= line.indexOf('::')) {
        let maxLines = selection.start.line + maxSearchLines;
        maxLines = (editor.document.lineCount > maxLines) ? maxLines : editor.document.lineCount;

        let isFound = false;
        let isBreak = false;
        for(let i=selection.start.line; i<maxLines; i++) {
            let l = editor.document.lineAt(i).text;
            if ((selection.start.line < i) && (l.startsWith(funcName+' '))) {
                isBreak = true;
                break;
            }
            if (0 <= l.indexOf('->')) {
                isFound = true;
            }
        }

        if (isBreak) {
            if (isFound) {
                return true;
            } else {
                return false;
            }

        } else {
            logger.appendLine("[WARNING] can not find function implementation. " + funcName);
            return true;
        }

    } else {
        let maxLines = selection.start.line - maxSearchLines;
        maxLines = (0 > maxLines) ? 0 : maxLines;

        let isFound = false;
        let isBreak = false;
        for(let i=selection.start.line; i >= maxLines; i--) {
            let l = editor.document.lineAt(i).text;
            if (0 <= l.indexOf('->')) {
                isFound = true;
            }

            if ((selection.start.line > i)){

                const regStr = '^'+funcName+'\\s+'+'::';
                if (l.match(regStr)) {
                    isBreak = true;
                    break;
                } else if (l.startsWith(funcName+' ')) {
                    isFound = false;
                    //isBreak = true;
                    //break;
                } else {
                    // nop
                }
            }
        }

        if (isBreak) {
            if (isFound) {
                return true;
            } else {
                return false;
            }

        } else {
            logger.appendLine("[INFO] can not find function type definition. " + funcName);
            return true;
        }
    }
}


//
//
function getFuncName(line:string) {

    let funcName = "";

    let m = line.match(/^(\S+)/);
    if (m !== null) {
        funcName = m[0];
    } else {
        return null;
    }

    const ignores = ['module',
                     'import',
                     'class',
                     'interface',
                     'data',
                     'type',
                     'newtype'];

    if (0 <= ignores.indexOf(funcName)) {
        return null;
    }

    if (funcName.startsWith('$')) {
        return null;
    }

    return funcName;
}


//
//
let tasks_json : string = `
{
  // Automatically created by phoityne-vscode extension.

  "version": "2.0.0",
  "presentation": {
    "reveal": "always",
    "panel": "new"
  },
  "tasks": [
    {
      // F7
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "label": "stack build",
      "type": "shell",
      "command": "stack build"
    },
    {
      // F6
      "group": "build",
      "type": "shell",
      "label": "stack clean & build",
      "command": "stack clean && stack build"
      //"command": "stack clean ; stack build"  // for powershell
    },
    {
      // F8
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "type": "shell",
      "label": "stack test",
      "command": "stack test"
    },
    {
      // F6
      "isBackground": true,
      "type": "shell",
      "label": "stack watch",
      "command": "stack build --test --no-run-tests --file-watch"
    }
  ]
}
`;

