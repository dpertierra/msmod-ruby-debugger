const debuggerScript = "Debugger/debugger.rb";
const marker = "Debugger/enabled";

export async function activate(ctx) {
  const root = ctx.editor.gameRoot();
  if (!root) return;

  try {
    await ctx.fs.readProjectFile(debuggerScript);
  } catch {
    return;
  }
  if (ctx.editor.gameRoot() !== root) return;

  const label = "Toggle Ruby Debugger (VS Code)";
  const enabled = "Ruby debugger enabled. Run the game, then attach from VS Code.";
  const disabled = "Ruby debugger disabled.";
  const failed = "Could not toggle the debugger: {error}";
  ctx.i18n.addTranslations("es", {
    [label]: "Activar/desactivar depurador de Ruby (VS Code)",
    [enabled]: "Depurador de Ruby activado. Ejecuta el juego y conéctate desde VS Code.",
    [disabled]: "Depurador de Ruby desactivado.",
    [failed]: "No se pudo cambiar el depurador: {error}",
  });

  let busy = false;
  ctx.menu.registerMenuItem({
    menu: "File",
    label: ctx.i18n.t(label),
    isEnabled: () => ctx.editor.gameRoot() === root,
    handler: async () => {
      if (busy || ctx.editor.gameRoot() !== root) return;
      busy = true;
      try {
        await ctx.fs.readProjectFile(debuggerScript);
        if (ctx.editor.gameRoot() !== root) return;
        let wasEnabled = false;
        if (await ctx.fs.projectExists(marker)) {
          // "off" or "0" disables the debugger without deleting the file.
          const mode = (await ctx.fs.readProjectFile(marker)).trim().toLowerCase();
          wasEnabled = mode !== "off" && mode !== "0";
        }
        if (ctx.editor.gameRoot() !== root) return;

        await ctx.fs.writeProjectFile(marker, wasEnabled ? "off" : "1");
        ctx.ui.showToast({ message: ctx.i18n.t(wasEnabled ? disabled : enabled) });
      } catch (error) {
        ctx.ui.showToast({ message: ctx.i18n.t(failed, { error: String(error) }) });
      } finally {
        busy = false;
      }
    },
  });
}
