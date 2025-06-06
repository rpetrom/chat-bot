import { marked } from 'marked';
import DOMPurify from 'dompurify'; // Para sanitizar

export function markdownToHtml(markdownText) {
  const rawHtml = marked.parse(markdownText);
  return DOMPurify.sanitize(rawHtml);
}
