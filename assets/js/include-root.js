/* Funcion que recibe un ID y una Ruta para buscar un componente 
reutilizable y pegarlo en el div con el ID indicado */
async function includeComponent(selector, path) {
    try {
		const res = await fetch(path, { cache: 'no-cache' });
    	if (!res.ok) throw new Error(res.status);
    	const html = await res.text();
    	document.querySelectorAll(selector).forEach(el => el.innerHTML = html);
  	} catch (err) {
    	console.error('Error cargando componente:', path, err);
  	}	
}

// Llamado al DOM y a las funciones
document.addEventListener('DOMContentLoaded', () => {
	// Llamado a funcion para cargar elementos reutilizables
	includeComponent('#top-banner', './assets/components/top-banner.html');
	includeComponent('#navbar', './assets/components/navbar.html');
});
