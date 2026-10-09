/**
 * Keeps the tablet's own keyboard from opening for the fields inside a
 * component. The screen has a keyboard of its own, and the system one would
 * cover it. A field marked `inputmode="none"` still takes focus, a caret and a
 * selection, so the on-screen keyboard can write into it like any other; it
 * just does not ask the system for a keyboard.
 */
const watched = new WeakSet<HTMLElement>();

function mark(node: EventTarget | undefined) {
  if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) node.inputMode = "none";
}

/** Marks every field in the component, in the shadow roots of what it is made of too. */
function sweep(root: ParentNode) {
  root.querySelectorAll("input, textarea").forEach(mark);
  root.querySelectorAll("*").forEach((element) => {
    if (element.shadowRoot) sweep(element.shadowRoot);
  });
}

export function noSystemKeyboard(host: HTMLElement | null) {
  if (!host || watched.has(host)) return;
  watched.add(host);

  // A field that is drawn later, or drawn again, is caught as it takes focus, before the system would show a keyboard.
  host.addEventListener("focusin", (event) => mark(event.composedPath()[0]), true);

  const component = host as HTMLElement & { updateComplete?: Promise<unknown> };
  const run = () => sweep(host.shadowRoot ?? host);
  void component.updateComplete?.then(run);
  // The fields inside it render a little after the component itself does.
  [100, 400, 1000].forEach((delay) => window.setTimeout(run, delay));
}
