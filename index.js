let butonBuscar = document.getElementById('buscarPokemon');
butonBuscar.addEventListener('click', buscarPokemon);

let btn_siguiente = document.getElementById('btnc_sig');
let btn_anterior = document.getElementById('btnc_ant');
let btn_todo = document.getElementById('btn_todo');
let cargando = document.getElementById('cargando');

let miModal = new bootstrap.Modal(document.getElementById('miModal'))

let id = 1;

btn_siguiente.addEventListener('click', () => {

    listarPokemones(urlSiguiente)
})

btn_anterior.addEventListener('click', () => {

    listarPokemones(urlAnterior)
})

let urlInicio = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=2`;
let urlSiguiente = '';
let urlAnterior = '';

btn_todo.addEventListener('click', () => {
    btn_siguiente.classList.remove('d-none');
    btn_todo.classList.add('d-none');
    cargarPokemon(urlInicio)
})

let error_mensaje = document.getElementById('error_buscar');

function buscarPokemon() {
    let nombre_pokemon = document.getElementById('nombrePokemon').value;
    btn_todo.classList.remove('d-none');
    btn_siguiente.classList.add('d-none');
    btn_anterior.classList.add('d-none');

    if (nombre_pokemon !== '') {
        error_mensaje.classList.add('d-none');
        console.log(nombre_pokemon);

        let url = `https://pokeapi.co/api/v2/pokemon/${nombre_pokemon}`;

        let html = '';


        fetch(url)
            .then(respuesta => respuesta.json())
            .then(data => {
                console.log(data)

                let tipos = '';
                for (let i = 0; i < data.types.length; i++) {
                    tipos += `<li>${data.types[i].type.name}</li>`;
                }
                html += `
                <div class="carousel-item active" id="${data.id}">
                    <div class="row justify-content-center align-items-center">
                        <div class="card border-dark" style="width: 18rem;">
                            <br>
                            <img src="${data.sprites.front_default}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text"><ul>Tipo</ul>${tipos}</p>
                                <button class="btn btn-primary" onclick="abrirModal('${url}')">Detalle</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                document.getElementById('andentroCarrusel').innerHTML = html;
                

            })
            .catch(err => {
                console.log(err)
                console.error("tuve un error")

                html += `
                    <div class="alert alert-danger mt-1 text-center" role="alert">
                        El nombre del Pokemon ingresado no es valido
                    </div>
                `;
                
                document.getElementById('andentroCarrusel').innerHTML = html;
            })
    } else {
        error_mensaje.classList.remove('d-none');
        console.error('Favor ingresar un texto');
    }


}

async function cargarPokemon(url) {
    cargando.classList.remove('d-none');
    await fetch(url)
        .then(resultado => resultado.json())
        .then(async (data) => {
            if (data.next !== null) {
                urlSiguiente = data.next;
                btn_siguiente.classList.remove('d-none')
            } else {
                btn_siguiente.classList.add('d-none')
            }

            if (data.previous !== null) {

                btn_anterior.classList.remove('d-none')
            } else {
                btn_anterior.classList.add('d-none');
            }


            let cuerpo = ``;

            for (let i = 0; i < data.results.length; i++) {
                let detalle = await obtenerDetallePokemon(data.results[i].url);
                // console.log(detalle)
                let tipos = '';
                for (let i = 0; i < detalle.types.length; i++) {
                    tipos += `<li>${detalle.types[i].type.name}</li>`;
                }
                cuerpo += `
                <div class="carousel-item" id="${detalle.id}">
                    <div class="row justify-content-center align-items-center">
                        <div class="card border-dark" style="width: 18rem;">
                            <br>
                            <img src="${detalle.sprites.front_default}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.results[i].name}</h5>
                                <p class="card-text"><ul>Tipo</ul>${tipos}</p>
                                <button class="btn btn-primary" onclick="abrirModal('${data.results[i].url}')">Detalle</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }

            document.getElementById('andentroCarrusel').innerHTML = cuerpo;
            document.getElementById('1').classList.add('active')
           
        })
    cargando.classList.add('d-none')

}



async function listarPokemones(url) {
    cargando.classList.remove('d-none');
    document.getElementById('cuerpoDetalle').innerHTML = ''
    await fetch(url)
        .then(resultado => resultado.json())
        .then(async (data) => {
            if (data.next !== null) {
                urlSiguiente = data.next;
                btn_siguiente.classList.remove('d-none')
            } else {
                btn_siguiente.classList.add('d-none')
            }

            if (data.previous !== null) {
                
                btn_anterior.classList.remove('d-none')
            } else {
                btn_anterior.classList.add('d-none');
            }   
            console.log(data)

            let cuerpo = ``;

            for (let i = 0; i < data.results.length; i++) {
                let detalle = await obtenerDetallePokemon(data.results[i].url);
                // console.log(detalle)
                let tipos = '';
                for (let i = 0; i < detalle.types.length; i++) {
                    tipos += `<li>${detalle.types[i].type.name}</li>`;
                }
                cuerpo += `
                <div class="carousel-item" id="${detalle.id}">
                    <div class="row justify-content-center align-items-center">
                        <div class="card border-dark" style="width: 18rem;">
                            <br>
                            <img src="${detalle.sprites.front_default}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${data.results[i].name}</h5>
                                <p class="card-text"><ul>Tipo</ul>${tipos}</p>
                                <button class="btn btn-primary" onclick="abrirModal('${data.results[i].url}')">Detalle</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }

            document.getElementById('andentroCarrusel').innerHTML += cuerpo;
           
        })
    cargando.classList.add('d-none')

}

async function obtenerDetallePokemon(url) {

    return await fetch(url)
        .then(resultado => resultado.json())
        .then(data => {
            // console.log(data)
            return data;
        })
}

async function abrirModal(url) {

    let detalle = await obtenerDetallePokemon(url);
    console.log(detalle)
    let habilidades = '';
    for (let i = 0; i < detalle.abilities.length; i++) {

        habilidades += `<li>${detalle.abilities[i].ability.name} <br> Hab. Oculta = ${detalle.abilities[i].is_hidden}</li>`;
    }

    let movimientos = '';
    for (let i = 0; i < detalle.stats.length; i++) {
        movimientos += `<li>${detalle.stats[i].stat.name} = ${detalle.stats[i].base_stat}</li>`;
    }

    let contenido = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">#${detalle.id} - ${detalle.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h3>Habilidades</h3>
                    <ul>
                        ${habilidades}
                    </ul>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h3>Estadisticas</h3>
                    <ul>
                        ${movimientos}
                    </ul>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
        </div>
    `;

    document.getElementById('cuerpoModal').innerHTML = contenido;

    miModal.show();
}

cargarPokemon(urlInicio);
