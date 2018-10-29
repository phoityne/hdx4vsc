'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.hdx4vsc.haskellDebuggingFromEditor',  startHaskellDebuggingFromEditor));
    context.subscriptions.push(vscode.commands.registerCommand('extension.hdx4vsc.haskellDebuggingFromExplore', startHaskellDebuggingFromExplore));
}

// this method is called when your extension is deactivated
//
export function deactivate() {
}

//
//
function startHaskellDebuggingFromEditor(fileUri:vscode.Uri) {

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get edditor object.');
        return;
    }

    let startFile = editor.document.fileName;
    let selection = editor.selection;
    let text = editor.document.lineAt(selection.start.line).text;

    console.log("[HASKELL][DEBUG]:startFile: " +  startFile);
    console.log("[HASKELL][DEBUG]:selected line: " +  selection.start.line);
    console.log("[HASKELL][DEBUG]:selected text: " +  text);

    const funcName = getFuncName(text);
    if (funcName === null) {
        vscode.window.showErrorMessage('[HASKELL][ERROR] can not get function name. select the function definition line.');
        return; 
    }      
    console.log("[HASKELL][DEBUG]:function: " +  funcName);

    const wsFolder = vscode.workspace.getWorkspaceFolder(fileUri);
    if (!wsFolder) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get workspace folders object.' + fileUri);
        return;
    }

    let cwd = wsFolder.uri.fsPath;
    let launchFile = path.join(cwd, '.vscode', 'launch.json');
    console.log("[HASKELL][DEBUG]:wsFolder: " + wsFolder.uri);
    console.log("[HASKELL][DEBUG]:launch json file: " + launchFile);

    if (false === isNeedArgs(editor, funcName)) {
        vscode.window.showInformationMessage("Start Haskell Debugging on " + funcName + " with no arguments.");

        runDebugger(launchFile, startFile, funcName, "");

    } else {
        let options: vscode.InputBoxOptions = { prompt: "put arguments of function \"" + funcName + "\"."};
   
        vscode.window.showInputBox(options).then(value => {
            let args = !value ? "" : value;

            runDebugger(launchFile, startFile, funcName, args);
        });

    }
}

//
//
function startHaskellDebuggingFromExplore(fileUri:vscode.Uri) {
    const wsFolder = vscode.workspace.getWorkspaceFolder(fileUri);
    if (!wsFolder) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get workspace folders object.' + fileUri);
        return;
    }

    let cwd = wsFolder.uri.fsPath;
    let launchFile = path.join(cwd, '.vscode', 'launch.json');
    console.log("[HASKELL][DEBUG]:wsFolder: " + wsFolder.uri);
    console.log("[HASKELL][DEBUG]:launch json file: " + launchFile);

    let startFile = fileUri.fsPath;
    let funcName = "main";
    let args = "";

    console.log("[HASKELL][DEBUG]:startFile: " +  startFile);
    console.log("[HASKELL][DEBUG]:function: " +  funcName);
    console.log("[HASKELL][DEBUG]:arguments: " +  args);

    runDebugger(launchFile, startFile, funcName, args);
}

//
//
function runDebugger(launchFile:string, startFile:string, funcName:string, args:string) {

    let launch = vscode.workspace.getConfiguration('launch');
    let confs = launch.get<any[]>('configurations');
    if (!confs) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get launch configurations section. ' + confs);
        return;
    }

    if (1 !== confs.length) {
        vscode.window.showErrorMessage('[HASKELL][ERROR] not supported multiple configurations. ' + confs);
        return;
    }

    confs[0]['startup'] = startFile;
    confs[0]['startupFunc'] = funcName;
    confs[0]['startupArgs'] = args;

    launch.update('configurations', confs).then(() => {

        vscode.commands.executeCommand("workbench.action.debug.start");

    });
}


//
//
function isNeedArgs(editor:vscode.TextEditor, funcName:string) : boolean {

    let selection = editor.selection;
    let line = editor.document.lineAt(selection.start.line).text;

    if (0 <= line.indexOf('::')) {
        for(var i=selection.start.line; i<editor.document.lineCount; i++) {
            let l = editor.document.lineAt(i).text;
            if ((selection.start.line < i) && (l.startsWith(funcName))) {
                return false;
            }
            if (0 <= l.indexOf('->')) {
                return true;
            }
        }

        console.log("[HASKELL][WARNING] can not find function implementation. " + funcName);

        return true;

    } else {
        for(var i=selection.start.line; i >= 0; i--) {
            let l = editor.document.lineAt(i).text;
            if (0 <= l.indexOf('->')) {
                return true;
            }

            if ((selection.start.line > i) && (l.startsWith(funcName))) {
                return false;
            }
        }

        console.log("[HASKELL][INFO] can not find function type definition. " + funcName);
        
        return true;
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



