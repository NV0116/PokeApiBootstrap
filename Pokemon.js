let pokemones = [];
let equipos = [];
let equipoActual = 1;

async function obtenerPokemon(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error("El Pokémon no existe");
        }
        
        const data = await response.json();
        
        return {
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipo: data.types.map(type => type.type.name).join(", "),
            stats: data.stats
        };
        
    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
        return null;
    }
}

async function obtenerPokemonStats(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error("El Pokémon no existe");
        }
        
        const data = await response.json();

        const stats = data.stats.map(stat => stat.base_stat);
        
        return {
            nombre: data.name,
            stats: stats
        };
        
    } catch (error) {
        console.error("Error al obtener las estadísticas del Pokémon:", error);
        return null;
    }
}

async function calcularStatsEquipo(equipo) {
    let sumaStats = [0, 0, 0, 0, 0, 0]; 

    for (const pokemon of equipo) {
        const pokemonStats = await obtenerPokemonStats(pokemon.nombre);
        if (pokemonStats) {
            for (let i = 0; i < sumaStats.length; i++) {
                sumaStats[i] += pokemonStats.stats[i]; 
            }
        }
    }

    return sumaStats;
}

async function compararEquipos() {
    const statsEquipo1 = await calcularStatsEquipo(equipos[0]);
    const statsEquipo2 = await calcularStatsEquipo(equipos[1]);

    const sumaStatsEquipo1 = statsEquipo1.reduce((total, stat) => total + stat, 0);
    const sumaStatsEquipo2 = statsEquipo2.reduce((total, stat) => total + stat, 0);

    if (sumaStatsEquipo1 > sumaStatsEquipo2) {
        alert("¡El Equipo 1 ha ganado!");
    } else if (sumaStatsEquipo1 < sumaStatsEquipo2) {
        alert("¡El Equipo 2 ha ganado!");
    } else {
        alert("¡Empate!");
    }
}

function agregarPokemon() {
    const input = document.getElementById("pokemonInput");
    const nombrePokemon = input.value.trim();
    
    if (nombrePokemon !== "") {
        obtenerPokemon(nombrePokemon)
            .then(pokemon => {
                if (pokemon) {
                    pokemones.push(pokemon);
                    input.value = "";

                    if (pokemones.length % 3 === 0) {
                        guardarEquipo();
                    }
                    mostrarPokemones();
                } else {
                    alert("El Pokémon ingresado no existe.");
                }
            })
            .catch(error => console.error("Error al agregar el Pokémon:", error));
    } else {
        alert("Por favor, ingresa un nombre de Pokémon.");
    }
}

function guardarEquipo() {
    equipos.push(pokemones.slice(-3));
}

function resetearEquipo() {
    pokemones = [];
    equipos = [];
    equipoActual = 1;
    alert("Equipo reseteado correctamente.");
    mostrarPokemones();
}

function mostrarHistorial() {
    let historial = "Historial de Equipos Pokémon:\n\n";
    equipos.forEach((equipo, index) => {
        historial += `Equipo ${index + 1}:\n`;
        equipo.forEach(pokemon => {
            historial += `- ${pokemon.nombre}\n`;
        });
        historial += "\n";
    });
    alert(historial);
}

function mostrarPokemones() {
    const listaEquipos = document.getElementById("equipos");
    listaEquipos.innerHTML = "";

    equipos.forEach((equipo, index) => {
        const divEquipo = document.createElement("div");
        divEquipo.className = "equipo";

        const tituloEquipo = document.createElement("h2");
        tituloEquipo.textContent = `Equipo ${index + 1}`;
        divEquipo.appendChild(tituloEquipo);

        const cardGroup = document.createElement("div");
        cardGroup.className = "card-group";

        equipo.forEach(pokemon => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.width = "200px";
            card.style.height = "auto";

            const imagenPokemon = document.createElement("img");
            imagenPokemon.src = pokemon.imagen;
            imagenPokemon.className = "card-img-top";
            imagenPokemon.alt = pokemon.nombre;

            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const nombrePokemon = document.createElement("h5");
            nombrePokemon.className = "card-title";
            nombrePokemon.textContent = pokemon.nombre;

            const idPokemon = document.createElement("p");
            idPokemon.className = "card-text";
            idPokemon.textContent = `ID: ${pokemon.id}`;

            const tipoPokemon = document.createElement("p");
            tipoPokemon.className = "card-text";
            tipoPokemon.textContent = `Tipo: ${pokemon.tipo}`;

            const statsPokemon = document.createElement("ul");
            statsPokemon.className = "list-group";
            pokemon.stats.forEach(stat => {
                const statItem = document.createElement("li");
                statItem.className = "list-group-item";
                statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
                statsPokemon.appendChild(statItem);
            });

            cardBody.appendChild(nombrePokemon);
            cardBody.appendChild(idPokemon);
            cardBody.appendChild(tipoPokemon);
            cardBody.appendChild(statsPokemon);

            card.appendChild(imagenPokemon);
            card.appendChild(cardBody);
            cardGroup.appendChild(card);
        });

        divEquipo.appendChild(cardGroup);
        listaEquipos.appendChild(divEquipo);
    });
}
