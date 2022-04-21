//const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"
const API_DE_TESTE = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes" //SÓ PARA TESTE DE LAYOUT E FUNÇÕES, DEPOIS SERÁ REMOVIDA

const shuffle = () => 0.5 - Math.random();

let listaQuizzes = [];
let paginaInicialCriacao = [];
let idQuizzExibicao;

let quizzSelecionado = [];


buscarQuizzesServidor()


//BUSCA NO SERVIDOR TODOS OS QUIZZES
function buscarQuizzesServidor(){

    const promessa = axios.get(`${API_DE_TESTE}`);
    console.log(promessa);
    promessa.then(carregarQuizzesServidor);
    promessa.catch(erroAoCarregarQuizzServidor);

}

//COPIA TODOS OS QUIZZES PARA UM ARRAY
function carregarQuizzesServidor(response){

    console.log(response.data);
    listaQuizzes = response.data;
    renderizarQuizzes()
}


function erroAoCarregarQuizzServidor(erro){

    const statusCode = erro.status;
    console.log("Não foi possível carregar quizzes, erro: " + statusCode);

}

//EXIBE LISTA DE QUIZZES
function renderizarQuizzes(){

    const quizz = document.querySelector(".quizz-container");

    for(let i = 0; i < listaQuizzes.length; i++){
        quizz.innerHTML += `<div id="${listaQuizzes[i].id}" class="capa-Quizz" onclick="buscaQuizz(this.id)"><div class="image-Quizz"><img src="${listaQuizzes[i].image}"></div><div class="titulo-Quizz">${listaQuizzes[i].title}</div></div>`
    }
}

//BUSCA NO SERVIDOR O QUIZZ SELECIONADO PELO USUÁRIO
function buscaQuizz(identificador){

    const promessa = axios.get(`${API_DE_TESTE}/${identificador}`);
    console.log(promessa);
    promessa.then(carregarQuizzSelecionado);
    promessa.catch(erroAoBuscarQuizzSelecionado);

}

//COPIA O QUIZZ SELECIONADO PARA UM ARRAY
function carregarQuizzSelecionado(response){

    console.log(response.data);
    quizzSelecionado = response.data;
    exibeQuizzSelecionado();
    
}

function erroAoBuscarQuizzSelecionado(erro){
    const statusCode = erro.status;
    console.log("Erro ao carregar quizz selecionado: " + statusCode);
}


//EXIBE QUIZZ SELECIONADO
function exibeQuizzSelecionado(){

    document.querySelector(".main-screen1").classList.add("escondido");
    document.querySelector(".pagina-quizz").classList.remove("escondido");

    
    const perguntasQuizz = document.querySelector(".container-perguntas");

    perguntasQuizz.innerHTML = `<div class="banner"><div class="imagem-banner"><img src="${quizzSelecionado.image}"></div><div class="tituloQuizz-selecionado">${quizzSelecionado.title}</div></div>
        <div class="todasAsPerguntas"></div>
    `

    const inserePerguntas = document.querySelector(".todasAsPerguntas");

    let quizzSelecionadoEmbaralhado =  embaralharAlternativas(quizzSelecionado);


    for(let i = 0; i < quizzSelecionadoEmbaralhado.length; i++){
        inserePerguntas.innerHTML += `<div class="arcabouco"><div class="perguntas"><span>${quizzSelecionadoEmbaralhado[i].title}</span></div><div id="${i}" class="alternativas"></div></div>
        `

        for(let j = 0; j < quizzSelecionadoEmbaralhado[i].answers.length; j++) {
            const insereAlternativas = document.getElementById(`${i}`);

            insereAlternativas.innerHTML += `<div><div class="imgAlternativa"><img src="${quizzSelecionadoEmbaralhado[i].answers[j].image}"></div><div class="txtAlternativa">${quizzSelecionadoEmbaralhado[i].answers[j].text}</div></div>` 

        }
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
            <div class="card-forms aberto" onclick="estaMinimizado1(this)">
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
                <div class="card-forms minimizado" onclick="estaMinimizado1(this)">
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

// REFATORAR
function estaMinimizado1(elemento){
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

// REFATORAR
function estaMinimizado2(elemento){
    if(elemento.classList.contains("minimizado")){
        const aberto = document.querySelector(".main-screen3-3").querySelector(".aberto");
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

    document.querySelector(".main-screen3-2").classList.add("escondido");
    document.querySelector(".main-screen3-3").classList.remove("escondido");

    criarQuizzTela3(paginaInicialCriacao);
    
}

function criarQuizzTela3 (paginaInicialCriacao){
    const numPerguntas = paginaInicialCriacao[3];
    const inserirPergunta = document.querySelector(".main-screen3-3").querySelector("form");
    inserirPergunta.innerHTML = `
            <div class="card-forms aberto" onclick="estaMinimizado2(this)">
                <div class="titulo-card">
                    <div class="numero-pergunta">Nível 1</div>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <input type="text" name="titulo-nivel" placeholder="Título do nível" required>
                <input type="text" name="porcentagem" placeholder="% de acerto mínima" required>
                <input type="url" name="nivel-img" placeholder="URL da imagem" required>
                <input type="text" name="descricao-nivel" placeholder="Descrição do nível" required>
                
            </div>
    `;
    console.log(numPerguntas);

    for (let i = 1; i < numPerguntas; i++){
        inserirPergunta.innerHTML += `
        <div class="card-forms minimizado" onclick="estaMinimizado2(this)">
            <div class="titulo-card">
                <div class="numero-pergunta">Nível ${i+1}</div>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <input type="text" name="titulo-nivel" placeholder="Título do nível" required>
            <input type="text" name="porcentagem" placeholder="% de acerto mínima" required>
            <input type="url" name="nivel-img" placeholder="URL da imagem" required>
            <input type="text" name="descricao-nivel" placeholder="Descrição do nível" required>      
        </div>`;
    }

    inserirPergunta.innerHTML += `<button class="criar-perguntas-btn" onclick="criarQuizzPt3(this)"><span>Finalizar Quizz</span></button>`;

}

function criarQuizzPt3(elemento) {
    const titulo = document.getElementsByName("titulo-nivel");
    const porcentagens = document.getElementsByName("porcentagem");
    const descricao = document.getElementsByName("descricao-nivel");
    let contagemDeZeros = 0;

    for(let i = 0; i < titulo.length; i++){
        if(titulo[i].value == "" || titulo[i].value.length < 10 || porcentagens[i].value < 0 || porcentagens[i].value > 100 || porcentagens[i].value == ""){
            
            alert("Preencha todos os campos corretamente!");
            return;
        }
        if(descricao[i].value == "" || descricao[i].value.length < 30){
            alert("Preencha todos os campos corretamente!");
            return;
        }
        if(porcentagens[i].value == 0){
            contagemDeZeros++;
        }
    }

    if(contagemDeZeros === 0 || contagemDeZeros > 1){
        alert("Coloque apenas um nível com 0% de acerto!");
        return;
    }
    
    console.log("Quizz Pt3 sucesso!");
}


//EMBARALHA AS ALTERNATIVAS
function embaralharAlternativas(objeto){

    const alternativasAleatorias = objeto.questions.map(q => ({...q, answers: q.answers.sort(shuffle)}))

    console.log(alternativasAleatorias);

    return alternativasAleatorias;
}

