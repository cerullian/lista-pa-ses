import paises from './data/allCountries.js';
import pais from './data/oneCountry.js';

const tableCountry = document.querySelector('#tableLine');
const sortCountries = document.querySelector('#sort');
const pagination = document.querySelector('#pagination');
const countryModal = document.querySelector('#countryModal');
const close = document.querySelector('#close');
const infoCountry = document.querySelector('#info');

let offset = 20;
let totalPaises = 0;

const totalPages = () => Math.ceil(totalPaises/offset);

const countriesTable = (data, numPage = 1) => {
    let countriesList = '';
    let registoInicial = (numPage - 1) * offset;
    let registoFinal = numPage * offset;
    registoFinal = registoFinal > totalPaises ? totalPaises : registoFinal;

    for (let i=registoInicial; i<registoFinal; i++) {
        countriesList += `
        <tr>
        <td>${i+1}</td>
        <td country="${data[i].name.common}">${data[i].name.common}</td>
        <td>${data[i].region}</td>
        <td>${data[i].subregion}</td>
        <td><img src="${data[i].flags.png}" width="50px"></td>
        </tr>
        `;
    }

    return countriesList;
}

const toggleLoader = () => {
    document.querySelector('.loader').classList.toggle('hide');
    document.querySelector('.container').classList.toggle('hide');
}

const buildPagination = () => {
    let numPages = "";
    for (let page=1; page<=totalPages(); page++) {
        numPages += `<span>${page} </span>`;
    }
    pagination.innerHTML = numPages;
}

close.addEventListener('click', e => {
    countryModal.classList.add('hide');
})

paises()
    .then( data => { 

        totalPaises = data.length;

        tableCountry.innerHTML=countriesTable(data);

        buildPagination();

        pagination.addEventListener('click', e => {
            if (e.target.tagName == 'SPAN')
                tableCountry.innerHTML=countriesTable(data,e.target.innerText.trim());
        });

        sortCountries.addEventListener('click', e => {
            //var texto = "Olá, está tudo bem?";
            //var semAcento = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            //console.log(semAcento); // Ola, esta tudo bem?
            data.sort( (a,b) => a.name.common.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > b.name.common.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ? 1 : -1);
            tableCountry.innerHTML=countriesTable(data);
        });

        tableCountry.addEventListener('click', e => { // adiciona-se um evento maior para apanhar todos os child
            if (e.target.hasAttribute('country')) { // se o elemento clicado tem o atributo country
                pais(e.target.getAttribute('country')) // executa-se o load da função pais que tem a informação de cada pais recebido
                    .then( dataCountry => {
                        // console.log(dataCountry);
                        const moeda = Object.keys(dataCountry[0].currencies)[0];
                        countryModal.classList.remove('hide'); // se for toggle, quando se carrega noutro país ele fecha a modal
                        let info = `
                            <p><strong>País:</strong> ${dataCountry[0].name.common}</p>
                            <p><strong>Capital:</strong> ${dataCountry[0].capital[0]}</p>
                            <p><strong>População:</strong> ${dataCountry[0].population}</p>
                            <p><strong>Google Maps:</strong> <a href="${dataCountry[0].maps.googleMaps}" target="_blank">MAPA</a></p>
                            <p><strong>Moeda:</strong> ${moeda} - ${dataCountry[0].currencies[moeda].name}`; // currencies[moeda] vai buscar o valor do nome da moeda que é o primeiro objecto em currencies. isto é útil, porque este valor é sempre diferente para cada país
                        infoCountry.innerHTML = info;
                    })
                    .catch ( err => {
                        console.log('Promise com erro',err.message);
                    });
                countryModal.addEventListener('click', e => {
                    if (e.target == countryModal) {
                        countryModal.classList.add('hide');
                    }
                });
            }
        })

        toggleLoader();
    })
    .catch ( err => {
        console.log('Promise com erro',err.message);
    })