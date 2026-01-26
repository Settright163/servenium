/* Funcion que recibe un ID y una Ruta para buscar un componente 
reutilizable y pegarlo en el div con el ID indicado */
async function incluirComponente(selector, path) {
    try {
		const respuesta = await fetch(path, { cache: "no-cache" });
    	if (!respuesta.ok) throw new Error(respuesta.status);
    	const html = await respuesta.text();
    	
		const elemento = document.querySelector(selector);
		if (elemento) elemento.innerHTML = html;
  	} catch (err) {
    	console.error("Error cargando componente:", path, err);
  	}	
}

// Carga de los Componentes Reutilizables
incluirComponente("#top-banner", "assets/components/top-banner.html");
incluirComponente("#navbar", "assets/components/navbar.html");