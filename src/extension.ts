'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
function startHaskellDebuggingFromEditor() {
        
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not edditor object.');
        return;
    }

    let wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get workspace folders object.');
        return;
    }

    let cwd = wsFolders[0].uri.fsPath;
    let launcFile = cwd  + '\\.vscode\\launch.json';
    console.log("[HASKELL][DEBUG]:launch json file is " + launcFile);

    let startFile = editor.document.fileName;
    let selection = editor.selection;
    let text = editor.document.lineAt(selection.start.line).text;

    let funcName = "";
    let m = text.match(/^(\S+)/);
    if (m !== null) {
        funcName = m[0];
    } else {
        vscode.window.showErrorMessage('[HASKELL][ERROR] can not get function name. select the function definition line.');
        return; 
    }      

    console.log("[HASKELL][DEBUG]:file     : " +  startFile);
    console.log("[HASKELL][DEBUG]:line     : " +  selection.start.line);
    console.log("[HASKELL][DEBUG]:function : " +  funcName);

    let is_no_arg = false;
    let m1 = text.match(/^(\S+)\s+=/);
    if (m1 !== null) {
        console.log("[HASKELL][DEBUG]:target is a no argument function : " +  m1[0]);
        is_no_arg = true;
    }

    let m2 = text.match(/^(\S+)\s+::\s+IO\s+\(.*\)$/);
    if (m2 !== null) {
        console.log("[HASKELL][DEBUG]:target is a no argument function : " +  m2[0]);
        is_no_arg = true;
    }

    let launchObj  = readLaunchJSON(launcFile);
    if (!launchObj) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get launch json contents. ' + launcFile);
        return;
    }

    if (true === is_no_arg) {
        vscode.window.showInformationMessage("Start Haskell Debugging on " + funcName + " with no arguments.");

        saveLaunchJSON(launcFile, launchObj, startFile, funcName, "");

        vscode.commands.executeCommand("workbench.action.debug.start");

    } else {
        let options: vscode.InputBoxOptions = { prompt: "put arguments of function \"" + funcName + "\"."};
   
        vscode.window.showInputBox(options).then(value => {
            let args = !value ? "" : value;

            saveLaunchJSON(launcFile, launchObj, startFile, funcName, args);

            vscode.commands.executeCommand("workbench.action.debug.start");
        });

    }
}

//
//
function startHaskellDebuggingFromExplore(fileUri:any) {
    let wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get workspace folders object.');
        return;
    }

    let cwd = wsFolders[0].uri.fsPath;
    let launcFile = cwd  + '\\.vscode\\launch.json';
    console.log("[HASKELL][DEBUG]:launch json file is " + launcFile);

    let launchObj  = readLaunchJSON(launcFile);
    if (!launchObj) {
        vscode.window.showErrorMessage('[HASKELL][CRITICAL] can not get launch json contents. ' + launcFile);
        return;
    }

    let startFile = fileUri.fsPath;
    let funcName = "main";
    let args = "";
    saveLaunchJSON(launcFile, launchObj, startFile, funcName, args);

    vscode.commands.executeCommand("workbench.action.debug.start");
}

//
//
function saveLaunchJSON(path:string, obj:any, startFile:string, funcName:string, args:string) {
            
  let fs = require('fs');
  obj.configurations[0].startup = startFile;
  obj.configurations[0].startupFunc = funcName;
  obj.configurations[0].startupArgs = args;
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));

}

//
//
function readLaunchJSON(path:string) {
    let fs = require('fs');
    let text = fs.readFileSync(path, 'utf8');
    let obj  = parseJSON(text);

    return obj;
}

//
//
function parseJSON(text:string) {

    var obj = null;

    try {
        obj = JSON.parse( text );

        return obj;

    } catch (ex) {
        // nop
    }

    try {
        obj = eval("(" + text + ")");

        return obj;

    } catch (ex) {

        // nop
    }

    return null;
}

