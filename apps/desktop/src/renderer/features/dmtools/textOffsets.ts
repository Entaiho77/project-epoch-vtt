/** Get the current window selection's start/end character offsets relative to `container`'s
 *  full text content, regardless of how many nested spans the text is broken into. Returns
 *  null if there's no selection inside the container, or it's collapsed (a plain click). */
export function getSelectionOffsets(container: HTMLElement): { start: number; end: number } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) return null;

  const measure = (node: Node, offset: number) => {
    const r = document.createRange();
    r.selectNodeContents(container);
    r.setEnd(node, offset);
    return r.toString().length;
  };
  const start = measure(range.startContainer, range.startOffset);
  const end = measure(range.endContainer, range.endOffset);
  return start <= end ? { start, end } : { start: end, end: start };
}
