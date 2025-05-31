// editarSprint.js
// Lógica para precargar y editar un Sprint en editarSprint.html

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del Sprint a editar (de query string o localStorage)
    let sprintId = null;
    // 1. Intentar obtener de query string
    const params = new URLSearchParams(window.location.search);
    if(params.has('id')) {
        sprintId = params.get('id');
        localStorage.setItem('sprintEditId', sprintId); // Guardar para recarga
    } else {
        // 2. Intentar obtener de localStorage
        sprintId = localStorage.getItem('sprintEditId');
    }
    if(!sprintId) {
        alert('No se encontró el Sprint a editar.');
        window.location.href = '../registrarSprint.html';
        return;
    }

    // Precargar datos del Sprint
    fetch(`http://127.0.0.1:8000/api/sprint/${sprintId}`)
        .then(res => res.json())
        .then(data => {
            const sprint = data.data || data;
            document.getElementById('nombreInput').value = sprint.nombre;
            // Formatear fecha a 'YYYY-MM-DDTHH:MM' para input type=datetime-local
            function formatDatetimeLocal(fecha) {
                if (!fecha) return '';
                // Soporta formatos con o sin segundos
                let f = fecha.replace(' ', 'T');
                if (f.length === 16) return f; // ya está bien
                if (f.length > 16) f = f.substring(0, 16); // recorta segundos si existen
                if (f.length === 10) f += 'T00:00'; // solo fecha
                return f;
            }
            document.getElementById('fechaInicioInput').value = formatDatetimeLocal(sprint.fecha_inicio);
            document.getElementById('fechaFinInput').value = formatDatetimeLocal(sprint.fecha_fin);
        })
        .catch(() => {
            alert('Error al cargar los datos del Sprint.');            window.location.href = 'registrarSprint.html'; // Redirige a la pantalla de sprints
        });

    // Guardar cambios
    document.getElementById('editarSprintForm').onsubmit = function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombreInput').value;
        const fecha_inicio = document.getElementById('fechaInicioInput').value;
        const fecha_fin = document.getElementById('fechaFinInput').value;
        // Validación: fecha de inicio < fecha de fin
        if (fecha_inicio >= fecha_fin) {
            alert('La fecha de inicio debe ser menor que la fecha de fin.');
            return;
        }
        fetch(`http://127.0.0.1:8000/api/sprint/${sprintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, fecha_inicio, fecha_fin })
        })
        .then(res => {
            if(res.ok) return res.json();
            throw new Error('Error al guardar');
        })
        .then(() => {
            localStorage.removeItem('sprintEditId');
            alert('Sprint actualizado correctamente');
            window.location.href = 'registrarSprint.html'; // Redirige a la pantalla de sprints
        })
        .catch(() => alert('Error al guardar los cambios.'));
    };

    // Cancelar
    document.getElementById('cancelarBtn').onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('sprintEditId');
        window.location.href = 'registrarSprint.html'; // Redirige a la pantalla de sprints
    };
});
