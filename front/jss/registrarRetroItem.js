document.addEventListener('DOMContentLoaded', function() {
    const form = document.forms['retroItemForm'];
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const sprint_id = form['sprint_id'].value;
        const categoria = form['categoria'].value;
        const descripcion = form['descripcion'].value;
        const cumplida = categoria === 'accion' ? form['cumplida'].checked : null;
        const fecha_revision = form['fecha_revision'].value || null;

        try {
            let response, result;
            if (retroEditId) {
                // Actualizar
                response = await fetch(`http://127.0.0.1:8000/api/retro_item/${retroEditId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sprint_id, categoria, descripcion, cumplida, fecha_revision })
                });
                result = await response.json();
                if (response.ok) {
                    alert(result.data || 'Retro item actualizado correctamente.');
                    retroEditId = null;
                    form.reset();
                    location.reload();
                } else {
                    alert(result.data || 'Error al actualizar el retro item');
                }
            } else {
                // Registrar nuevo solo si NO estamos editando
                response = await fetch('http://127.0.0.1:8000/api/retro_item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sprint_id, categoria, descripcion, cumplida, fecha_revision })
                });
                result = await response.json();
                if (response.ok) {
                    alert(result.data || 'Retro item guardado correctamente.');
                    form.reset();
                    location.reload(); // Recarga la página para mostrar la nueva retrospectiva
                } else {
                    alert(result.data || 'Error al guardar el retro item');
                }
            }
        } catch (error) {
            alert('Error inesperado');
            console.error(error);
        }
    });
});

// Llenar el select de sprints solo con los de la base de datos, sin duplicados
fetch('http://127.0.0.1:8000/api/sprints')
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById('sprintSelect');
        select.innerHTML = '<option value="">Seleccione un sprint</option>';
        const idsMostrados = new Set();
        (data.data || []).forEach(sprint => {
            if (!idsMostrados.has(sprint.id)) {
                const option = document.createElement('option');
                option.value = sprint.id;
                option.textContent = `${sprint.id} - ${sprint.nombre}`;
                select.appendChild(option);
                idsMostrados.add(sprint.id);
            }
        });
    });

document.getElementById('cancelarBtn').onclick = function(e) {
    e.preventDefault();
    window.location.href = '../index.html';
};

// Lógica para habilitar/deshabilitar campos según la categoría seleccionada
const categoriaSelect = document.querySelector('select[name="categoria"]');
const descripcionInput = document.querySelector('textarea[name="descripcion"]');
const cumplidaInput = document.querySelector('input[name="cumplida"]');
const fechaRevisionInput = document.querySelector('input[name="fecha_revision"]');

function actualizarCamposPorCategoria() {
    if (categoriaSelect.value === 'accion') {
        descripcionInput.disabled = false;
        descripcionInput.value = '';
        cumplidaInput.disabled = false;
        fechaRevisionInput.disabled = false;
    } else {
        descripcionInput.disabled = false;
        cumplidaInput.disabled = true;
        cumplidaInput.checked = false;
        fechaRevisionInput.disabled = true;
        fechaRevisionInput.value = '';
    }
}
categoriaSelect.addEventListener('change', actualizarCamposPorCategoria);
actualizarCamposPorCategoria();

// Mostrar todas las retrospectivas guardadas antes del formulario
Promise.all([
    fetch('http://127.0.0.1:8000/api/retro_items').then(res => res.json()),
    fetch('http://127.0.0.1:8000/api/sprints').then(res => res.json())
]).then(([retroData, sprintsData]) => {
    const div = document.getElementById('retroList');
    const sprintMap = {};
    (sprintsData.data || []).forEach(s => { sprintMap[s.id] = s.nombre; });
    if (retroData.data && retroData.data.length) {
        // Ordenar por id de sprint y luego por categoría
        const sorted = [...retroData.data].sort((a, b) => {
            if (a.sprint_id !== b.sprint_id) return a.sprint_id - b.sprint_id;
            return a.categoria.localeCompare(b.categoria);
        });
        let html = '<table border="1" ;"><thead><tr>' +
            '<th>Sprint</th><th>Categoría</th><th>Descripción</th><th>Cumplida</th><th>Fecha revisión</th><th ">Opciones</th></tr></thead><tbody>';
        sorted.forEach(retro => {
            html += `<tr>
                <td>${sprintMap[retro.sprint_id] || retro.sprint_id}</td><td>${retro.categoria}</td><td>${retro.descripcion || ''}</td><td>${retro.cumplida ? 'Sí' : 'No'}</td><td>${retro.fecha_revision || ''}</td>
                <td>
                    <button onclick="modificarRetro(${retro.id})">Modificar</button>
                    <button onclick="eliminarRetro(${retro.id})">Eliminar</button>
                </td>
            </tr>`;
        });
        html += '</tbody></table>';
        div.innerHTML = html;
    } else {
        div.innerHTML = '<em>No hay retrospectivas guardadas.</em>';
    }
});

// Función para eliminar retrospectiva
window.eliminarRetro = function(id) {
    if(confirm('¿Seguro que deseas eliminar esta retrospectiva?')) {
        fetch(`http://127.0.0.1:8000/api/retro_item/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => location.reload());
    }
}
// Variable global para saber si estamos editando
let retroEditId = null;

window.modificarRetro = function(id) {
    // Buscar los datos de la retrospectiva seleccionada
    fetch(`http://127.0.0.1:8000/api/retro_item/${id}`)
        .then(res => res.json())
        .then(data => {
            const retro = data.data || data;
            // Precargar datos en el formulario
            document.getElementById('sprintSelect').value = retro.sprint_id;
            document.querySelector('select[name="categoria"]').value = retro.categoria;
            document.querySelector('textarea[name="descripcion"]').value = retro.descripcion || '';
            document.querySelector('input[name="cumplida"]').checked = !!retro.cumplida;
            document.querySelector('input[name="fecha_revision"]').value = retro.fecha_revision || '';
            retroEditId = id;
            actualizarCamposPorCategoria();
            // Redirigir automáticamente al formulario
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.getElementById('sprintSelect').focus();
        });
}