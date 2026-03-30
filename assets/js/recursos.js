// script.js - muy ligero; envuelve líneas y aplica un resaltado sencillo para docker-compose (YAML).
// - Lee el texto dentro de <pre class="code-panel"><code>...</code></pre>
// - Divide en líneas, escapa HTML, aplica colores básicos (keys, valores, strings, comments, numbers, booleans, symbols)
// - Envuelve cada línea en <span class="line"> para que el CSS muestre la numeración
// Diseño objetivo: mínimo JS, fácil de mantener y reutilizable para múltiples paneles.

/* Helper: escape HTML para evitar inyección cuando insertamos innerHTML */
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Resalta una línea YAML simple (heurístico; no es un parser completo) */
function highlightYamlLine(rawLine) {

    // 1) escape
    let line = escapeHtml(rawLine);

    // 2) detectar comentarios: primera aparición de '#'
    let comment = '';
    const hashIndex = line.indexOf('#');

    if (hashIndex !== -1) {
        comment = line.slice(hashIndex);
        line = line.slice(0, hashIndex);

        // envolver comentario
        comment = `<span class="token com">${comment}</span>`;
    }

    // 3) resaltar strings (dobles o simples)
    line = line.replace(/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/g, m => `<span class="token str">${m}</span>`);

    // 4) resaltar anchors/aliases (&name, *name) y guiones de lista al inicio
    line = line.replace(/^(\s*)(-\s+)/, (m, p1, p2) => `${p1}<span class="token symbol">${escapeHtml(p2)}</span>`);
    line = line.replace(/(&[A-Za-z0-9_-]+)/g, '<span class="token.symbol">$1</span>');
    line = line.replace(/(\*[A-Za-z0-9_-]+)/g, '<span class="token.symbol">$1</span>');

    // 5) resaltar key: al inicio o tras indent
    line = line.replace(/^(\s*)([^\s:#][^:#]*?)(:)(\s|$)/, (m, indent, key, colon, rest) => {
        return `${indent}<span class="token key">${escapeHtml(key)}</span><span class="token.kv-delim">${escapeHtml(colon)}</span>${rest}`;
    });

    // 6) resaltar booleans y null
    line = line.replace(/\b(true|false|null|~)\b/gi, '<span class="token bool">$1</span>');

    // 7) resaltar números (enteros y flotantes)
    line = line.replace(/\b(-?\d+(\.\d+)?)\b/g, '<span class="token num">$1</span>');

    // 8) resaltar valores simples tras "key: value"
    line = line.replace(/(<span class="token.kv-delim">:<\/span>\s*)([^\s<][^<]*)/, (m, sep, val) => {

        // si ya contiene un span no lo envolvemos otra vez
        if (val.includes('<span')) return sep + val;

        return sep + `<span class="token str">${val}</span>`;
    });

    // reconstruir línea + comentario
    return line + (comment ? ' ' + comment : '');
}

/* Procesa todos los panels .code-panel en la página */
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.code-panel').forEach(pre => {

        // evitar procesar si ya fue procesado
        if (pre.dataset.processed === '1') return;

        // obtener el texto bruto
        const codeElem = pre.querySelector('code');
        const raw = codeElem ? codeElem.textContent : pre.textContent;
        const text = (raw || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // placeholder si está vacío
        if (!text.trim()) {
            pre.innerHTML = `<code><span class="line"><span class="token com"># Pega aquí tu docker-compose.yml</span></span></code>`;
            pre.dataset.processed = '1';
            return;
        }

        // construir HTML línea por línea
        const lines = text.split('\n').map(l => {
            return `<span class="line">${highlightYamlLine(l)}</span>`;
        }).join('\n');

        // reemplazar contenido
        pre.innerHTML = `<code>${lines}</code>`;

        // marcar como procesado
        pre.dataset.processed = '1';

    });
});