// Parametros para clasificar objeto como "visible"
const parametrosObservador = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Funcion que añade clase para la activacion de animacion
function cuandoCambieVisibilidad(entries, obs) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            // Dejar de observar elemento ya registrado
            obs.unobserve(entry.target);
        }
    })
}

// Crear al observador que recibira el Call-Back
const io = new IntersectionObserver(
    cuandoCambieVisibilidad,
    parametrosObservador
)

// Comenzar a observar todos los elementos con animacion
document.querySelectorAll(".fade-in-up").forEach(el => {
        io.observe(el);
});