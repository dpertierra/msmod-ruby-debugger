const debuggerScript = "Debugger/debugger.rb";
const marker = "Debugger/enabled";

// Inline SVG: the built-in "bug" icon name only exists in some editor builds.
const bugIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="8" y="6" width="8" height="14" rx="4"/>' +
  '<path d="M19 7l-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M20 13h-4M4 13h4M10 4l1 2M14 4l-1 2"/></svg>';

// The editor detects ES modules with a regex that does not match
// "export async function", so activate must be a plain function.
export function activate(ctx) {
  setup(ctx).catch((error) => ctx.log.error(String(error)));
}

async function setup(ctx) {
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
    icon: bugIcon,
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
