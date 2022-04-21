//const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"
//const API_DE_TESTE = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes" //SÓ PARA TESTE DE LAYOUT E FUNÇÕES, DEPOIS SERÁ REMOVIDA

let listaQuizzes = [];
let paginaInicialCriacao = [];

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
    renderizarQuizzesSecondScreen()
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

function renderizarQuizzesSecondScreen(){

    const quizzSecondScreen = document.querySelector(".quizzes-servidor-2").querySelector(".quizz-container");

    for(let i = 0; i < listaQuizzes.length; i++){
        quizzSecondScreen.innerHTML += `<div class="capa-Quizz"><div class="image-Quizz"><img src="${listaQuizzes[i].image}"></div><div class="titulo-Quizz">${listaQuizzes[i].title}</div></div>`
    }
}

function criarQuizzPt1(){
    let campos = document.querySelector(".main-screen3-1").querySelectorAll("input");
    for(let i = 0; i < campos.length; i++){
        if(campos[i].value == ""){
            alert("Preencha todos os campos!");
            return;
        }
    }

    if(campos[0].value.length < 20 || campos[0].value.length > 65 || campos[2].value < 3 || campos[3].value < 2){
        alert("Preencha o formulário corretamente!");
        return;
    }
    
    paginaInicialCriacao = [campos[0].value, campos[1].value, campos[2].value, campos[3].value];

    document.querySelector(".main-screen3-1").classList.add("escondido");
    document.querySelector(".main-screen3-2").classList.remove("escondido");

    criarQuizzTela2(paginaInicialCriacao);
}

function criarQuizzTela2(paginaAnterior){

    const numPerguntas = paginaAnterior[2];
    const inserirPergunta = document.querySelector(".main-screen3-2").querySelector("form");
    inserirPergunta.innerHTML = `
            <div class="card-forms aberto" onclick="estaMinimizado(this)">
                <div class="titulo-card">
                    <div class="numero-pergunta">Pergunta 1</div>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <input type="text" name="pergunta" placeholder="Texto da pergunta" required>
                <input type="text" name="color" placeholder="Cor de fundo da pergunta" required>

                <label for="resposta-correta">Resposta correta</label>
                <input type="text" name="resposta-correta" placeholder="Resposta correta" required>
                <input type="url" name="quizz-url" placeholder="URL da imagem" required>

                <label for="">Respostas incorretas</label>
                <input type="text" name="resposta-errada-1" placeholder="Resposta incorreta 1" required>
                <input type="url" name="quizz-url" placeholder="URL da imagem" required>
                
                <input type="text" name="resposta-errada-2" placeholder="Resposta incorreta 2">
                <input type="url" name="quizz-url" placeholder="URL da imagem">

                <input type="text" name="resposta-errada-3" placeholder="Resposta incorreta 3">
                <input type="url" name="quizz-url" placeholder="URL da imagem">
            </div>
    `;
    console.log(numPerguntas);

    for (let i = 1; i < numPerguntas; i++){
        inserirPergunta.innerHTML += `
                <div class="card-forms minimizado" onclick="estaMinimizado(this)">
                    <div class="titulo-card">
                        <div class="numero-pergunta">Pergunta ${i+1}</div>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>
                    <input type="text" name="pergunta" placeholder="Texto da pergunta" required>
                    <input type="text" name="color" placeholder="Cor de fundo da pergunta" required>
    
                    <label for="resposta-correta">Resposta correta</label>
                    <input type="text" name="resposta-correta" placeholder="Resposta correta" required>
                    <input type="url" name="quizz-url" placeholder="URL da imagem" required>
    
                    <label for="">Respostas incorretas</label>
                    <input type="text" name="resposta-errada-1" placeholder="Resposta incorreta 1" required>
                    <input type="url" name="quizz-url" placeholder="URL da imagem" required>
                    
                    <input type="text" name="resposta-errada-2" placeholder="Resposta incorreta 2">
                    <input type="url" name="quizz-url" placeholder="URL da imagem">
    
                    <input type="text" name="resposta-errada-3" placeholder="Resposta incorreta 3">
                    <input type="url" name="quizz-url" placeholder="URL da imagem">        
                </div>
        `;
    }

    inserirPergunta.innerHTML += `<button class="criar-perguntas-btn" onclick="criarQuizzPt2(this)"><span>Prosseguir pra criar níveis</span></button>`;
}

function estaMinimizado(elemento){
    if(elemento.classList.contains("minimizado")){
        const aberto = document.querySelector(".main-screen3-2").querySelector(".aberto");
        aberto.classList.remove("aberto");
        aberto.classList.add("minimizado");
        elemento.classList.remove("minimizado");
        elemento.classList.add("aberto");
    }else{
        console.log("Está aberto!");
    }
}

function criarQuizzPt2(elemento) {
    const perguntas = document.getElementsByName("pergunta");
    let regExp = new RegExp("#[a-fA-F0-9]{6}");
    const color = document.getElementsByName("color");

    for(let i = 0; i < perguntas.length; i++){
        if(perguntas[i].value == "" || perguntas[i].value.length < 20){
            
            alert("Preencha todos os campos!");
            return;
        }
    }

    for(let i = 0; i < color.length; i++){
        if(color[i].value.length !== 7 || !regExp.test(color[i].value)){
            alert("Preencha todos os campos corretamente!");
            return;
        }
    }

    console.log("Quizz Pt2 sucesso!");
    
}