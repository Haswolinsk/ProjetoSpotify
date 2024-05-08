const clientId = '';
const clientSecret = '';

topPlaylist();
var count = 1;
var listaFavoritos = [];
if(localStorage.getItem("musicasFavoritas") != null){
    listaFavoritos.push(localStorage.getItem("musicasFavoritas").split(','));
    listaFavoritos = listaFavoritos[0];
}

function paginaPrincipal(){
    const gradient = document.getElementsByTagName('main');
    gradient[0].style.backgroundImage = 'linear-gradient(#191414 1%, black)'

    topPlaylist();
}

function paginaFavorita(){
    count = 1;
    const headerInfo = document.getElementById('headerInfo');
    headerInfo.innerHTML = ''; 
    const divPrincipal = document.getElementById('divPrincipal');
    divPrincipal.innerHTML = ''; 
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = ''; 

    const gradient = document.getElementsByTagName('main');
    gradient[0].style.backgroundImage = 'linear-gradient(#402e7d 1%, black)';

    headerInfo.innerHTML += `
        <img src="./img/musicasCurtidas.jpg" class="m-5 rounded" width="250">
        <h1 class="mx-5 text-white opacity-75" style="font-size: 60px;">Músicas Curtidas</h1>
    `;

    divPrincipal.innerHTML += `
        <table class="table table-dark table-borderless table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Titulo</th>
                    <th scope="col">Autor</th>
                    <th scope="col">Adicionar</th>
                </tr>
            </thead>
            <tbody id="tableMusicas">
                
            </tbody>
        </table>
    `;
    
    if (listaFavoritos.length == 0 || listaFavoritos[0] == ''){
        const tableMusicas = document.getElementById('tableMusicas');
        tableMusicas.innerHTML += `
            <tr>
                <td colspan="100%" align="center">Nenhuma Música Adicionada!</td>
            </tr>
        `;
    }

    listaFavoritos.forEach(musicaId => {
        if (musicaId != '') {
            musicasFavoritas(musicaId);
        }
    });
}

function requestToken() {
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId +':'+ clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    })
    .then(response => {return response.json();})
    .then((data) => {
        const token = data.access_token;
        return token
    });
}

function buscaPlaylist() {
    requestToken()
        .then(function(accessToken){
            const playlistName = document.getElementById('inputPlaylist').value;
            const playlistSearchUrl = `https://api.spotify.com/v1/search?q=${playlistName}&type=playlist&limit=10`;

            fetch(playlistSearchUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar playlist');
                }
                return response.json();
            })
            .then(data => {
                const headerInfo = document.getElementById('headerInfo');
                headerInfo.innerHTML = ''; 
                const divPrincipal = document.getElementById('divPrincipal');
                divPrincipal.innerHTML = ''; 
                const paginacao = document.getElementById('paginacao');
                paginacao.innerHTML = ''; 
                const gradient = document.getElementsByTagName('main');
                gradient[0].style.backgroundImage = 'linear-gradient(#191414 1%, black)';

                const card = document.createElement('div');
                card.classList.add('d-flex', 'grid', 'flex-wrap'); 
                data.playlists.items.forEach(playlist => {
                    if(playlist.name.length > 49){
                        playlist.name = playlist.name.substring(0,46) + '...'
                    }
                    if(playlist.description.length > 118){
                        playlist.description = playlist.description.substring(0,118) + '...'
                    }
                    card.innerHTML += `
                        <div class="card mx-4 my-3 bg-transparent border-0 hover-cursor" style="width: 250px;height: 350px;" onclick='buscaInfoPlaylist("${playlist.id}", 0)'>
                            <img src="${playlist.images[0].url}" alt="${playlist.name}" class="card-img-top rounded">
                            <div class="card-body px-0 py-2">
                                <h6 class="card-title text-white">${playlist.name}</h6>
                                <p class="card-text text-white-50" style="font-size: 12px;">${playlist.description}</p>
                            </div>
                        </div>
                    `;
                    divPrincipal.appendChild(card);
                });
            })
            .catch(error => console.error('Erro ao buscar playlist:', error));
        })
        .catch(error => console.error('Erro ao obter token:', error));
}

function topPlaylist() {
    requestToken()
        .then(function(accessToken){
            const topListsUrl = `https://api.spotify.com/v1/browse/categories/toplists/playlists?country=BR`;

            fetch(topListsUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar playlists');
                }
                return response.json();
            })
            .then(data => {
                const headerInfo = document.getElementById('headerInfo');
                headerInfo.innerHTML = ''; 
                const divPrincipal = document.getElementById('divPrincipal');
                divPrincipal.innerHTML = ''; 
                const paginacao = document.getElementById('paginacao');
                paginacao.innerHTML = ''; 
                const gradient = document.getElementsByTagName('main');
                gradient[0].style.backgroundImage = 'linear-gradient(#191414 1%, black)';
                
                const card = document.createElement('div');
                card.classList.add('d-flex', 'grid', 'flex-wrap'); 
                data.playlists.items.forEach(playlist => {
                    if(playlist.name.length > 49){
                        playlist.name = playlist.name.substring(0,46) + '...'
                    }
                    if(playlist.description.length > 121){
                        playlist.description = playlist.description.substring(0,118) + '...'
                    }
                    card.innerHTML += `
                        <div class="card m-4 bg-transparent border-0 hover-cursor" style="width: 250px;height: 350px;" onclick='buscaInfoPlaylist("${playlist.id}", 0)'>
                            <img src="${playlist.images[0].url}" alt="${playlist.name}" class="card-img-top rounded">
                            <div class="card-body px-0 py-2">
                                <h6 class="card-title text-white">${playlist.name}</h6>
                                <p class="card-text text-white-50" style="font-size: 12px;">${playlist.description}</p>
                            </div>
                        </div>
                    `;
                    divPrincipal.appendChild(card);
                });
            })
            .catch(error => console.error('Erro ao buscar playlists:', error));
        })
        .catch(error => console.error('Erro ao obter token:', error));
}

function musicasPlaylist(playlistId, offset, cont) {
    requestToken()
        .then(function(accessToken){
            const playlistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10&offset=${offset}`;

            fetch(playlistTracksUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar músicas da playlist');
                }
                return response.json();
            })
            .then(data => {
                const limparMusicas = document.getElementById('tableMusicas');
                limparMusicas.innerHTML = '';

                data.items.forEach(track => {
                    const musica = track.track;
                    var statusMusica = buscaMusicaFavoritos(musica.id);
                    
                    if (statusMusica == true) {
                        var favoritos = '<i class="text-success fa-solid fa-circle-check"></i> Remover Musica dos Favoritos';
                        var btnFav = `removerFavoritos('${musica.id}')`;
                    }else{
                        var favoritos = '<i class="fa-solid fa-circle-plus"></i> Adicionar Musica aos Favoritos';
                        var btnFav = `adicionarFavoritos('${musica.id}')`;
                    }
                    
                    const tableMusicas = document.getElementById('tableMusicas');
                    tableMusicas.innerHTML += `
                        <tr>
                            <td>${cont++}</td>
                            <td>${musica.name}</td>
                            <td>${musica.artists.map(artist => artist.name).join(', ')}</td>
                            <td id="btnFav-${musica.id}"><a class="btn p-0 text-white-50 hover-cursor" onclick="${btnFav}">${favoritos}</a></td>
                        </tr>
                    `;
                });

                paginacao(playlistId, data.total, offset, cont);
            })
            .catch(error => console.error('Erro ao buscar músicas da playlist:', error));
        })
        .catch(error => console.error('Erro ao obter token:', error));
}

function buscaInfoPlaylist(playlistId, offset) {
    requestToken()
        .then(function(accessToken){
            const buscaInfoPlaylist = `https://api.spotify.com/v1/playlists/${playlistId}`;

            fetch(buscaInfoPlaylist, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar playlist');
                }
                return response.json();
            })
            .then(data => {
                var cont = 1;
                const divPrincipal = document.getElementById('divPrincipal');
                divPrincipal.innerHTML = ''; 
                const headerInfo = document.getElementById('headerInfo');
                headerInfo.innerHTML = '';
                const gradient = document.getElementsByTagName('main');
                gradient[0].style.backgroundImage = 'linear-gradient(#1db95466 1%, black)';

                divPrincipal.innerHTML += `
                    <table class="table table-dark table-borderless table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Titulo</th>
                                <th scope="col">Autor</th>
                                <th scope="col">Adicionar</th>
                            </tr>
                        </thead>
                        <tbody id="tableMusicas">
                            
                        </tbody>
                    </table>
                `;

                headerInfo.innerHTML += `
                    <img src="${data.images[0].url}" class="m-5 rounded" width="250">
                    <div class="d-flex flex-column mx-5 text-white opacity-75">
                        <h1 style="font-size: 60px;">${data.name}</h1>
                        <p>${data.description}</p>
                    </div>
                `;

                musicasPlaylist(playlistId, offset, cont);
            })
            .catch(error => console.error('Erro ao buscar playlist:', error));
        })
        .catch(error => console.error('Erro ao obter token:', error));
}

function paginacao(playlistId, total, offset, cont) {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = '';

    const buttonAnterior = document.createElement('button');
    buttonAnterior.classList.add('btn', 'btn-outline-light', 'mx-2', 'rounded-5', 'bg-transparent', 'text-white-50', 'border-dark-subtle');
    buttonAnterior.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    buttonAnterior.onclick = () => {
        const novoOffset = Math.max(0, offset - 10);
        cont = Math.max(1, cont - 20)
        musicasPlaylist(playlistId, novoOffset, cont);
    };
    paginacao.appendChild(buttonAnterior);

    const buttonProximo = document.createElement('button');
    buttonProximo.classList.add('btn', 'btn-outline-light', 'mx-2', 'rounded-5', 'bg-transparent', 'text-white-50', 'border-dark-subtle');
    buttonProximo.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    buttonProximo.onclick = () => {
        const novoOffset = Math.min(total - 10, offset + 10);
        musicasPlaylist(playlistId, novoOffset, cont);
    };
    paginacao.appendChild(buttonProximo);
}

function buscaMusicaFavoritos(musicaId) {
    var verificar = listaFavoritos.indexOf(musicaId);
    
    return verificar >= 0 ? true : false
}

function musicasFavoritas(musicaId) {
    requestToken()
        .then(function(accessToken){
            const playlistTracksUrl = `https://api.spotify.com/v1/tracks/${musicaId}`;

            fetch(playlistTracksUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar músicas da playlist');
                }
                return response.json();
            })
            .then(data => {
                const tableMusicas = document.getElementById('tableMusicas');
                tableMusicas.innerHTML += `
                    <tr>
                        <td>${count++}</td>
                        <td>${data.name}</td>
                        <td>${data.artists.map(artist => artist.name).join(', ')}</td>
                        <td id="btnFav-${data.id}"><a class="btn p-0 text-white-50 hover-cursor" onclick="removerFavoritos('${data.id}')"><i class="text-success fa-solid fa-circle-check"></i> Remover Musica dos Favoritos</a></td>
                    </tr>
                `;
            })
            .catch(error => console.error('Erro ao buscar músicas da playlist:', error));
        })
        .catch(error => console.error('Erro ao obter token:', error));
}

function adicionarFavoritos(musicaId){
    var btnId = 'btnFav-' + musicaId;
    var btnRemover = document.getElementById(btnId);
    btnRemover.innerHTML = `<a class="btn p-0 text-white-50 hover-cursor" onclick="removerFavoritos('${musicaId}')"><i class="text-success fa-solid fa-circle-check"></i> Remover Musica dos Favoritos</a>`;

    listaFavoritos.push(musicaId);
    localStorage.setItem("musicasFavoritas", listaFavoritos);
}

function removerFavoritos(musicaId) {
    var btnId = 'btnFav-' + musicaId;
    var btnAdicionar = document.getElementById(btnId);
    btnAdicionar.innerHTML = `<a class="btn p-0 text-white-50 hover-cursor" onclick="adicionarFavoritos('${musicaId}')"><i class="fa-solid fa-circle-plus"></i> Adicionar Musica aos Favoritos</a>`;

    listaFavoritos.splice(listaFavoritos.indexOf(musicaId), 1);
    localStorage.setItem("musicasFavoritas", listaFavoritos);
}
