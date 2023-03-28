// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Register the command
  let disposable = vscode.commands.registerCommand(
    "Logger.addConsoleLog",
    () => {
      // Get the active text editor
      let editor = vscode.window.activeTextEditor;

      if (editor) {
        // Get the current cursor position
        let position = editor.selection.active;

        let line = editor.document.lineAt(position.line);
        let lineText = line.text.trim();

        // Check if the current line is a variable declaration
        let isVariableDeclaration =
          lineText.startsWith("const ") ||
          lineText.startsWith("let ") ||
          lineText.startsWith("var ");
        let variableName = "";

        const variableNameMatch = lineText.match(
          /^(?:const\s+([\w$]+))|^(?:let\s+([\w$]+))|^(?:var\s+([\w$]+))|/
        );
        const functionNameMatch = lineText.match(
          /^(?:const)\s+([\w$]+)\s+(?:=)\s+((?:[^()\n]*\([^()\n]*\)))|(?:function)\s+([\w$]+)\s+(?:=)\s+((?:[^()\n]*\([^()\n]*\)))/
        );

        console.log("variableNameMatch", variableNameMatch);
        console.log("functionNameMatch", functionNameMatch);

        if (isVariableDeclaration) {
          if (functionNameMatch) {
            const functionName = functionNameMatch[4];
            console.log("functionName", functionName);
            const argsMatch = lineText.match(/(?<=\()\s*([^{}]+)\s*(?=\))/);
            console.log("argsMatch", argsMatch);
            if (argsMatch) {
              const args = argsMatch[1].split(",").map((arg) => arg.trim());
              variableName = `${functionName} called with arguments: ${args.join(
                ", "
              )}`;
            }
          }

          variableName = variableNameMatch ? variableNameMatch[1] : "";
        }

        if (functionNameMatch) {
          const functionName = functionNameMatch[1];
          const argsMatch = lineText.match(/\((.*)\)/);
          if (argsMatch) {
            const args = argsMatch[1].split(",").map((arg) => arg.trim());
            variableName = `${functionName} called with arguments: ${args.join(
              ", "
            )}`;
          }
        }

        // Create a new text edit to insert the console.log() line
        let edit = new vscode.TextEdit(
          new vscode.Range(position, position),
          `\nconsole.log('${variableName}');`
        );

        // Apply the edit to the document
        let workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(editor.document.uri, [edit]);
        vscode.workspace.applyEdit(workspaceEdit);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
