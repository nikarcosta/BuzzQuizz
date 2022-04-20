const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"
const API_DE_TESTE = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes" //SÓ PARA TESTE DE LAYOUT E FUNÇÕES, DEPOIS SERÁ REMOVIDA

let listaQuizzes = [];

buscarQuizzesServidor()

function buscarQuizzesServidor(){

    const promessa = axios.get(`${API_DE_TESTE}`);
    console.log(promessa);
    promessa.then(carregarQuizzesServidor);
    promessa.catch(erroAoCarregarQuizzServidor);

}

function carregarQuizzesServidor(response){

    console.log(response.data);
    listaQuizzes = response.data;
    renderizarQuizzes()
}


function erroAoCarregarQuizzServidor(erro){

    const statusCode = erro.status;
    console.log("Não foi possível carregar quizzes, erro: " + statusCode);

}

function renderizarQuizzes(){

    const quizz = document.querySelector(".quizz-container");

    for(let i = 0; i < listaQuizzes.length; i++){
        quizz.innerHTML += `<div class="capa-Quizz"><div class="image-Quizz"><img src="${listaQuizzes[i].image}"></div><div class="titulo-Quizz">${listaQuizzes[i].title}</div></div>`
    }
}