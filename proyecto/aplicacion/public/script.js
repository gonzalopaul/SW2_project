document.addEventListener('DOMContentLoaded', () => {
    const loadEquiposBtn = document.getElementById('loadEquipos');
    const loadPartidosBtn = document.getElementById('loadPartidos');
    const loadTopScorersBtn = document.getElementById('loadTopScorers');
    const closeEquiposBtn = document.getElementById('closeEquipos');
    const closePartidosBtn = document.getElementById('closePartidos');
    const closeTopScorersBtn = document.getElementById('closeTopScorers');
    const equiposTableBody = document.querySelector('#equiposTable tbody');
    const partidosList = document.getElementById('partidosList');
    const topScorersList = document.getElementById('topScorersList');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const filterForm = document.getElementById('filterForm');
    const partidosDetails = document.getElementById('partidosDetails');

    let currentPage = 1;

    loadEquiposBtn.addEventListener('click', loadEquipos);
    loadPartidosBtn.addEventListener('click', () => loadPartidos(currentPage));
    loadTopScorersBtn.addEventListener('click', loadTopScorers);
    closeEquiposBtn.addEventListener('click', () => equiposTableBody.innerHTML = '');
    closePartidosBtn.addEventListener('click', () => {
        partidosList.innerHTML = '';
        partidosDetails.innerHTML = '';
    });
    closeTopScorersBtn.addEventListener('click', () => topScorersList.innerHTML = '');
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPartidos(currentPage);
        }
    });
    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        loadPartidos(currentPage);
    });
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadPartidos(currentPage);
    });

    async function loadEquipos() {
        try {
            const response = await fetch('/equipos');
            const equipos = await response.json();
            equiposTableBody.innerHTML = '';
            equipos.forEach(equipo => {
                const tr = document.createElement('tr');
                const tdNombre = document.createElement('td');
                const tdEstadio = document.createElement('td');
                tdNombre.textContent = equipo.nombre;
                tdEstadio.textContent = equipo.estadio;
                tr.appendChild(tdNombre);
                tr.appendChild(tdEstadio);
                equiposTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar equipos:', error);
        }
    }

    async function loadPartidos(page) {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const url = new URL('/partidos', window.location.origin);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', 10);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        try {
            const response = await fetch(url);
            const data = await response.json();
            partidosList.innerHTML = '';
            data.partidos.forEach(partido => {
                const li = document.createElement('li');
                li.textContent = `${partido.equipoLocal} vs ${partido.equipoVisitante} - ${new Date(partido.fecha).toLocaleDateString()}`;
                li.addEventListener('click', () => showPartidoDetails(partido));
                partidosList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar partidos:', error);
        }
    }

    function showPartidoDetails(partido) {
        partidosDetails.innerHTML = `
            <h3>Detalles del Partido</h3>
            <p><strong>Fecha:</strong> ${new Date(partido.fecha).toLocaleDateString()}</p>
            <p><strong>Equipo Local:</strong> ${partido.equipoLocal}</p>
            <p><strong>Equipo Visitante:</strong> ${partido.equipoVisitante}</p>
            <p><strong>Goles Local:</strong> ${partido.fullTimeHomeGoals}</p>
            <p><strong>Goles Visitante:</strong> ${partido.fullTimeAwayGoals}</p>
            <p><strong>Resultado:</strong> ${partido.fullTimeResult}</p>
            <p><strong>Goles Local al Medio Tiempo:</strong> ${partido.halfTimeHomeGoals}</p>
            <p><strong>Goles Visitante al Medio Tiempo:</strong> ${partido.halfTimeAwayGoals}</p>
            <p><strong>Resultado al Medio Tiempo:</strong> ${partido.halfTimeResult}</p>
        `;
    }

    async function loadTopScorers() {
        try {
            const response = await fetch('/topscorers');
            const topScorers = await response.json();
            topScorersList.innerHTML = '';
            topScorers.forEach(scorer => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p><strong>Nombre:</strong> ${scorer.player.name}</p>
                    <p><strong>Equipo:</strong> ${scorer.statistics[0].team.name}</p>
                    <p><strong>Goles:</strong> ${scorer.statistics[0].goals.total}</p>
                    <img src="${scorer.player.photo}" alt="${scorer.player.name}" width="50" height="50">
                `;
                topScorersList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar los máximos goleadores:', error);
        }
    }
});
