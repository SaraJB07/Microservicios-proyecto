document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.querySelector('#retroTable tbody');
    const sprintFilter = document.getElementById('sprintFilter');
    const filtrarBtn = document.getElementById('filtrarBtn');
    const limpiarBtn = document.getElementById('limpiarBtn');

    // Cargar sprints en el filtro
    fetch('http://127.0.0.1:8000/api/sprints')
        .then(res => res.json())
        .then(data => {
            (data.data || []).forEach(sprint => {
                const option = document.createElement('option');
                option.value = sprint.id;
                option.textContent = `${sprint.id} - ${sprint.nombre}`;
                sprintFilter.appendChild(option);
            });
        });

    // Obtener el mapa de id->nombre de sprint (asegura que esté listo antes de cargar retros)
    let sprintMap = {};
    async function cargarSprintMap() {
        const res = await fetch('http://127.0.0.1:8000/api/sprints');
        const data = await res.json();
        (data.data || []).forEach(sprint => {
            sprintMap[sprint.id] = sprint.nombre;
        });
    }

    // Tabla para acciones del sprint anterior
    const accionesDiv = document.createElement('div');
    accionesDiv.innerHTML = '<h2>Acciones del Sprint Anterior</h2><table id="accionesTable" border="1" style="margin-top:1em;"><thead><tr><th>Sprint</th><th>Descripción</th><th>Cumplida</th><th>Fecha revisión</th></tr></thead><tbody></tbody></table>';
    tbody.parentNode.parentNode.appendChild(accionesDiv);
    const accionesTbody = accionesDiv.querySelector('#accionesTable tbody');

    // Función para obtener el id del sprint anterior
    function getSprintAnteriorId() {
        const sprintIds = Object.keys(sprintMap).map(Number).sort((a, b) => a - b);
        if (sprintIds.length < 2) return null;
        // El sprint seleccionado en el filtro, o el mayor si no hay filtro
        let actualId = sprintFilter.value ? Number(sprintFilter.value) : sprintIds[sprintIds.length - 1];
        const idx = sprintIds.indexOf(actualId);
        if (idx > 0) return sprintIds[idx - 1];
        return null;
    }

    // Función para cargar retrospectivas (todas o filtradas por sprint)
    window.cargarRetros = async function(sprintId = '') {
        // Espera a que el mapa esté listo
        if (Object.keys(sprintMap).length === 0) await cargarSprintMap();
        let url = 'http://127.0.0.1:8000/api/retro_items';
        const res = await fetch(url);
        const data = await res.json();
        tbody.innerHTML = '';
        let retros = data.data || [];
        if (sprintId) {
            retros = retros.filter(r => String(r.sprint_id) === String(sprintId));
        }
        retros.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sprintMap[item.sprint_id] || item.sprint_id}</td>
                <td>${item.categoria}</td>
                <td>${item.descripcion || ''}</td>
                <td>${item.cumplida ? 'Sí' : 'No'}</td>
                <td>${item.fecha_revision || ''}</td>
                <td>${item.created_at || ''}</td>
            `;
            tbody.appendChild(tr);
        });

        // Mostrar solo acciones del sprint anterior
        accionesTbody.innerHTML = '';
        // Si no hay filtro de sprint, no mostrar la tabla de acciones
        if (!sprintId) {
            accionesDiv.style.display = 'none';
            return;
        } else {
            accionesDiv.style.display = '';
        }
        const sprintAnteriorId = getSprintAnteriorId();
        if (!sprintAnteriorId) {
            // Si no hay sprint anterior, mostrar mensaje
            accionesTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay sprints anteriores.</td></tr>';
            return;
        }
        const acciones = (data.data || []).filter(r => r.sprint_id == sprintAnteriorId && r.categoria === 'accion');
        acciones.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sprintMap[item.sprint_id] || item.sprint_id}</td>
                <td>${item.descripcion || ''}</td>
                <td>${item.cumplida ? 'Sí' : 'No'}</td>
                <td>${item.fecha_revision || ''}</td>
            `;
            accionesTbody.appendChild(tr);
        });
    };

    filtrarBtn.onclick = () => cargarRetros(sprintFilter.value);
    limpiarBtn.onclick = () => { sprintFilter.value = ''; cargarRetros(); };
    cargarRetros(); // Mostrar todas al cargar
});



  document.getElementById('volverBtn').onclick = function() {
    window.location.href = '../index.html';
    };
