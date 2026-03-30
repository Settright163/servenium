/* Funcion que recibe un ID y una Ruta para buscar un componente 
reutilizable y pegarlo en el div con el ID indicado */
async function incluirComponente(selector, pathRelativo) {
    try {
        /* fetch() no siempre resuelve rutas relativas con <base href>; new URL + baseURI sí (GitHub Pages). */
        const url = new URL(pathRelativo, document.baseURI).href;
        const respuesta = await fetch(url, { cache: "no-cache" });
        if (!respuesta.ok) throw new Error(String(respuesta.status));
        const html = await respuesta.text();

        const elemento = document.querySelector(selector);
        if (elemento) elemento.innerHTML = html;
    } catch (err) {
        console.error("Error cargando componente:", pathRelativo, err);
    }
}

(async function cargarComponentes() {
    await incluirComponente("#top-banner", "assets/components/top-banner.html");
    await incluirComponente("#navbar", "assets/components/navbar.html");
    await incluirComponente("#site-footer", "assets/components/footer.html");
})();
