// Mostrar los sprints ya registrados antes del formulario con opciones de modificar y eliminar
        fetch('http://127.0.0.1:8000/api/sprints')
            .then(res => res.json())
            .then(data => {
                const div = document.getElementById('sprintsList');
                if (data.data && data.data.length) {
                    let html = '<h3>Sprints registrados:</h3><table class="tabla-sprints" style="margin: 2rem auto; min-width: 500px;">';
                    html += '<thead><tr><th>Nombre</th><th>Inicio</th><th>Fin</th><th>Acciones</th></tr></thead><tbody>';
                    data.data.forEach(sprint => {
                        html += `<tr>
                            <td><b>${sprint.nombre}</b></td>
                            <td>${sprint.fecha_inicio}</td>
                            <td>${sprint.fecha_fin}</td>
                            <td>
                                <button class="btn-modificar" onclick="modificarSprint(${sprint.id})">Modificar</button>
                                <button class="btn-eliminar" onclick="eliminarSprint(${sprint.id})">Eliminar</button>
                            </td>
                        </tr>`;
                    });
                    html += '</tbody></table>';
                    div.innerHTML = html;
                } else {
                    div.innerHTML = '<em>No hay sprints registrados.</em>';
                }
            });

             

        // Función para eliminar sprint
        function eliminarSprint(id) {
            // Validar si el sprint está siendo usado en retro_items antes de eliminar
            fetch('http://127.0.0.1:8000/api/retro_items')
                .then(res => res.json())
                .then(data => {
                    const usados = (data.data || []).some(retro => retro.sprint_id == id);
                    if (usados) {
                        alert('No se puede eliminar este sprint porque está siendo usado en una retrospectiva.');
                        return;
                    }
                    if(confirm('¿Seguro que deseas eliminar este sprint?')) {
                        fetch(`http://127.0.0.1:8000/api/sprint/${id}`, { method: 'DELETE' })
                            .then(res => res.json())
                            .then(() => location.reload());
                    }
                });
        }
        // Función para modificar sprint (redirige a la página de edición)
        function modificarSprint(id) {
            // Guardar el id en localStorage para respaldo
            localStorage.setItem('sprintEditId', id);
            // Redirigir a la página de edición con el id en la query string (ruta relativa correcta)
            window.location.href = `editarSprint.html?id=${id}`;
        }
        document.getElementById('cancelarBtn').onclick = function(e) {
            e.preventDefault();
            window.location.href = '../index.html';
        };
