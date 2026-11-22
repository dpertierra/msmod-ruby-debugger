# Ruby Debugger (VS Code)

Maker Studio mod that turns the Ruby debugger of a compatible game on and off.

The menu item **File → Toggle Ruby Debugger (VS Code)** only appears when the open project contains `Debugger/debugger.rb` (for example, La Base de Sky). With any other project the mod does nothing.

## What it does

It writes `Debugger/enabled` in the game folder: `1` turns the debugger on, `off` turns it off. The file is never deleted. On the next launch the game reads it and opens a debug server on `127.0.0.1:12345`.

## Requirements

- A game base with the `Debugger/` folder and an executable built with the debugger.
- VS Code with the `KoichiSasada.vscode-rdbg` extension.

## Usage

1. Open the project in Maker Studio and choose **File → Toggle Ruby Debugger (VS Code)**.
2. Set a breakpoint in a `.rb` file in VS Code.
3. Run the game from Maker Studio.
4. In VS Code, start **LBDS: conectar al depurador** (F5). Repeat on every game launch.

Full guide (Spanish): https://github.com/dpertierra/la-base-de-sky-wiki

## Permissions

`fs.project` and `fs.write.project` to read and write `Debugger/enabled`; `ui.toasts` for the status message.

## License

MIT
