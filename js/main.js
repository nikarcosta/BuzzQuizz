const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"

const shuffle = () => 0.5 - Math.random();

let listaQuizzes = [];
let paginaInicialCriacao = [];
let idQuizzExibicao;
let quizzSelecionado = [];
let alternativas = [];
// GUARDA AS RESPOSTAS CRIADAS PELO USER
let questionsObject = [];
// GUARDA OS NIVEIS CRIADOS PELO USER
let niveis = [];
// GUARDA OS IDS DOS QUIZZES CRIADOS PELO USER
let quizzesUsuario = [];
let pontuacao = 0;
let acertos = 0;


buscarQuizzesServidor()


//BUSCA NO SERVIDOR TODOS OS QUIZZES
function buscarQuizzesServidor(){
    // CARREGA OS QUIZZES DO SERVER
    const promessa = axios.get(`${API}`);
    console.log(promessa);
    promessa.then(carregarQuizzesServidor);
    promessa.catch(erroAoCarregarQuizzServidor);

}

function buscarQuizzUser(){
    const idQuizz = localStorage.getItem("idQuizz");
    if(idQuizz !== null){
        console.log("Existem quizzes salvos");
        document.querySelector(".quizzes-usuario-vazio").classList.add("escondido");
        document.querySelector(".quizzes-usuario").classList.remove("escondido");
    }else{
        console.log("Não existem quizzes salvos");
    }
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
    const quizzesUsuario = document.querySelector(".container-usuario");
    const idQuizz = localStorage.getItem("idQuizz");
    buscarQuizzUser();
    let contadorSecundario = 0;
    for(let i = 0; i < listaQuizzes.length; i++){
        if(idQuizz !== null &&  (idQuizz.includes(listaQuizzes[i].id.toString())) === true){
            quizzesUsuario.innerHTML += `
                <div id="${listaQuizzes[i].id}" class="capa-Quizz" onclick="buscaQuizz(this.id)">
                    <div class="image-Quizz"><img src="${listaQuizzes[i].image}"></div>
                    <div class="titulo-Quizz">${listaQuizzes[i].title}</div>
                </div>`;
            contadorSecundario++;
        }else{
            quizz.innerHTML += `
                <div id="${listaQuizzes[i].id}" class="capa-Quizz" onclick="buscaQuizz(this.id)">
                    <div class="image-Quizz"><img src="${listaQuizzes[i].image}"></div>
                    <div class="titulo-Quizz">${listaQuizzes[i].title}</div>
                </div>`;
        }
    }
}

//BUSCA NO SERVIDOR O QUIZZ SELECIONADO PELO USUÁRIO
function buscaQuizz(identificador){

    // Verifica se estava na página de sucesso do quizz
    const isSucessoQuizz = document.querySelector(".main-screen3-end").classList.contains("escondido");
    console.log(isSucessoQuizz);

    if(isSucessoQuizz == false){
        document.querySelector(".main-screen3-end").classList.add("escondido");
    }
    const promessa = axios.get(`${API}/${identificador}`);
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
        inserePerguntas.innerHTML += `<div class="arcabouco"><div class="perguntas" style="background: ${quizzSelecionadoEmbaralhado[i].color};"><span>${quizzSelecionadoEmbaralhado[i].title}</span></div><div id="${i}" class="alternativas"></div></div>
        `

        for(let j = 0; j < quizzSelecionadoEmbaralhado[i].answers.length; j++) {
            const insereAlternativas = document.getElementById(`${i}`);

                insereAlternativas.innerHTML += `<div class="option" onclick="selecionaAlternativa(this.id)"><div class="imgAlternativa"><img src="${quizzSelecionadoEmbaralhado[i].answers[j].image}"></div><div class="txtAlternativa ${quizzSelecionadoEmbaralhado[i].answers[j].isCorrectAnswer}">${quizzSelecionadoEmbaralhado[i].answers[j].text}</div></div>` 

        }

        insereIndice(i);
    }

    document.querySelector(".imagem-banner").scrollIntoView();

}

function criarQuizz(){
    
        document.querySelector(".main-screen1").classList.add("escondido");
        document.querySelector(".main-screen3-1").classList.remove("escondido");
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
                <div class="container-alternativas">
                    <label for="resposta-correta">Resposta correta</label>
                    <input type="text" name="resposta-correta" placeholder="Resposta correta" required>
                    <input type="url" name="quizz-url" placeholder="URL da imagem" required>

                    <label for="">Respostas incorretas</label>
                    <input type="text" name="resposta-errada-1" placeholder="Resposta incorreta 1" required>
                    <input type="url" name="quizz-url-1" placeholder="URL da imagem" required>
                    
                    <input type="text" name="resposta-errada-2" placeholder="Resposta incorreta 2">
                    <input type="url" name="quizz-url-2" placeholder="URL da imagem">

                    <input type="text" name="resposta-errada-3" placeholder="Resposta incorreta 3">
                    <input type="url" name="quizz-url-3" placeholder="URL da imagem">
                </div>
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
                    <div class="container-alternativas">
                        <label for="resposta-correta">Resposta correta</label>
                        <input type="text" name="resposta-correta" placeholder="Resposta correta" required>
                        <input type="url" name="quizz-url" placeholder="URL da imagem" required>
        
                        <label for="">Respostas incorretas</label>
                        <input type="text" name="resposta-errada-1" placeholder="Resposta incorreta 1" required>
                        <input type="url" name="quizz-url-1" placeholder="URL da imagem" required>
                        
                        <input type="text" name="resposta-errada-2" placeholder="Resposta incorreta 2">
                        <input type="url" name="quizz-url-2" placeholder="URL da imagem">
        
                        <input type="text" name="resposta-errada-3" placeholder="Resposta incorreta 3">
                        <input type="url" name="quizz-url-3" placeholder="URL da imagem">
                    </div>        
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
    
    let listaAlternativas = document.querySelectorAll(".container-alternativas");
    listaAlternativas.item

    for(let i = 0; i < perguntas.length; i++){
        questionsObject[i] = {
            title: perguntas[i].value,
            color: color[i].value,
            answers: montaRespostas(listaAlternativas.item(i))
        };         
    }
    
    console.log("Questões: ", questionsObject);
    console.log("Quizz Pt2 sucesso!");

    document.querySelector(".main-screen3-2").classList.add("escondido");
    document.querySelector(".main-screen3-3").classList.remove("escondido");

    criarQuizzTela3(paginaInicialCriacao);
    
}

function montaRespostas(listaAlternativas){
    console.log(listaAlternativas.querySelectorAll("input"));

    let temp = listaAlternativas.querySelectorAll("input");
    let alternativas = [];
    alternativas[0] = {
        "text": temp[0].value,
        "image": temp[1].value,
        "isCorrectAnswer": true
    };
    let secondcounter = 2;
    for (let i = 1; i < 3; i++){
        console.log("Valor temp",temp[i].value);
        if(temp[secondcounter].value !== ""){
            alternativas[i] = {
                text: temp[secondcounter].value,
                image: temp[(secondcounter+1)].value,
                isCorrectAnswer: false
            };
            secondcounter += 2;       
        }
    }

    console.log(alternativas);

    return alternativas;
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
    const img = document.getElementsByName("nivel-img");
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

    for(let i = 0; i < titulo.length; i++){
        niveis[i] = {
            title: titulo[i].value,
            image: img[i].value,
            text: descricao[i].value,
            minValue: Number(porcentagens[i].value)
        };         
    }

    let objetoFinal = {
        title: paginaInicialCriacao[0],
        image: paginaInicialCriacao[1],
        questions: questionsObject,
        levels: niveis
    }

    console.log("Quizz Pt3 sucesso!");
   axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", objetoFinal)
        .then(function (response) {
            console.log("ID do Quizz", response.data.id);
            idDesteQuizz = response.data.id;
            quizzesUsuario.push(localStorage.getItem("idQuizz"));
            if(quizzesUsuario[0] == null){
                quizzesUsuario.pop();
            }
            quizzesUsuario.push(response.data.id);  
            localStorage.setItem("idQuizz", quizzesUsuario); 
            sucessoDoQuizz(response);   
        })
        .catch(function (error) {
            console.log(error);
        });
}


//EMBARALHA AS ALTERNATIVAS
function embaralharAlternativas(objeto){

    const alternativasAleatorias = objeto.questions.map(q => ({...q, answers: q.answers.sort(shuffle)}))

    console.log(alternativasAleatorias);

    return alternativasAleatorias;
}

//ADICIONA ID EM CADA ALTERNATIVA DA PERGUNTA DO QUIZZ
function insereIndice(idAlternativas){

    alternativas = document.getElementById(`${idAlternativas}`).querySelectorAll(".option");

    console.log(alternativas);
    for(let i = 0; i < alternativas.length; i++){
    (alternativas.item(i)).setAttribute("id", uniqueID());

    }
    return;
}

//CRIA ID ÚNICO
function uniqueID(){
    return Date.now().toString(36) + Math.random().toString(36);
}


//SELECIONA ALTERNATIVA
function selecionaAlternativa(alternativa){
    console.log(alternativa);

    if(verificaSelecionado(alternativa) === true){

        
        document.getElementById(`${alternativa}`).classList.add("selecionado");

        let testando = document.getElementById(`${alternativa}`).parentNode;
        let idParente = testando.id;        

        let busca = document.getElementById(`${idParente}`).querySelectorAll(".option");

        for(let i = 0; i < busca.length; i++){
            let compara = busca.item(i).id;
    
            if(compara !== alternativa ){
                document.getElementById(`${compara}`).classList.add("esbranquicado");
            }
        }

        AlteraCorAlternativas(alternativa);

        verificaResposta(alternativa);

        let coordenada = Number(idParente) + 1;
        console.log(coordenada);
        setTimeout(scrollParaProximaPergunta, 2000, coordenada);   

    }

}


//VERIFICA SE ALGUMA ALTERNATIVA DA PERGUNTA EM QUESTÃO JÁ FOI SELECIONADA
function verificaSelecionado(elementoParaVerificar){


    let testando = document.getElementById(`${elementoParaVerificar}`).parentNode;
    let idParente = testando.id;
    

    let buscaSelecionado = document.getElementById(`${idParente}`).querySelector(".selecionado");

    if(buscaSelecionado !== null){
        return false
    }

    return true;

}


//ALTERA A COR DO TEXTO DAS ALTERNATIVAS APÓS UMA DELAS SER SELECIONADA
function AlteraCorAlternativas(elemento){


    document.getElementById(`${elemento}`).classList.add("selecionado");

    let testando = document.getElementById(`${elemento}`).parentNode;
    let idParente = testando.id;
    let divs = document.getElementById(`${idParente}`).querySelectorAll(".false")

    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.add("cor-falsa");
    }

    document.getElementById(`${idParente}`).querySelector(".true").classList.add("cor-verdadeira");


    return;
}

//SCROLLA A PÁGINA PARA A PRÓXIMA PERGUNTA DO QUIZZ
function scrollParaProximaPergunta(coordenada){

    try {
        let irPara = document.getElementById(coordenada).parentElement;
        irPara.scrollIntoView();

      } catch (error) {
        console.log("Final da página");

        calculaPontuacao();

      }
}

function sucessoDoQuizz(elemento){
    let id = elemento.data.id;
    let titulo = elemento.data.title;
    let imagem = elemento.data.image;

    document.querySelector(".main-screen3-3").classList.add("escondido");
    document.querySelector(".main-screen3-end").classList.remove("escondido");

    console.log("Quizz criado com sucesso!");

    const quizz = document.querySelector(".main-screen3-end");

    quizz.innerHTML += `
        <div class="capa-Quizz capa-quizz-user" onclick="buscaQuizz(${id})">
            <div class="image-Quizz capa-quizz-user"><img src="${imagem}"></div>
            <div class="titulo-Quizz">${titulo}</div>
        </div>
        <button class="criar-perguntas-btn" onclick="buscaQuizz(${id})"><span>Acessar Quizz</span></button>
        <button class="voltar-home" onclick="voltarHome()"><span>Voltar pra home</span></button>
    `;  
}

function voltarHome(){

    window.location.reload();
}


//VERIFICA SE O USUÁRIO SELECIONOU A RESPOSTA CORRETA
function verificaResposta(alternativa){

    let resposta = document.getElementById(alternativa).querySelector(".true");
    
    if(resposta === null){
        return;
    }
    else{
        acertos++;
        return;
    }
    

}


//CALCULA PONTUACAO DO USUARIO
function calculaPontuacao(){
    let perguntasDoQuizz = document.querySelectorAll(".perguntas");
    let numeroDePerguntas = perguntasDoQuizz.length;
    console.log("Num perguntas: "+ numeroDePerguntas);

    pontuacao =  Math.round((acertos / numeroDePerguntas) * 100);
    console.log("Pontuacao: " + pontuacao);
    
    determinaNivelUsuario(pontuacao);
    
}


function determinaNivelUsuario(pontos){

    let minPontos = Number(quizzSelecionado.levels[0].minValue);
    console.log(minPontos);
    let maxPontos = Number(quizzSelecionado.levels[1].minValue);
    console.log(maxPontos);

    if(pontos >= maxPontos ){
        resultadoQuizz(1);
    }
    
    if(pontos >= minPontos && pontos < maxPontos){
        resultadoQuizz(0);
    }
}

//GERA A CAIXA DE RESULTADO DO QUIZZ
function resultadoQuizz(nivel){

    const geraTela = document.querySelector(".container-perguntas");
    geraTela.innerHTML += `<div class="resultado-quizz"><div class="arcabouco"><div class="titulo-resultado" style="background:rgba(236, 54, 45, 1);"><span>${pontuacao}% de acerto: ${quizzSelecionado.levels[`${nivel}`].title}</span></div><div class="compilado-resultado"><div class="imagem-resultado"><img src="${quizzSelecionado.levels[`${nivel}`].image}"></div><div class="texto-resultado"><span>${quizzSelecionado.levels[0].text}</span></div></div></div><div class="botoes-quizz"><button class="reiniciar-btn" onclick="reiniciarQuizz()"><span>Reiniciar Quizz</span></button><button class="voltar-home-btn" onclick="voltarHome()"><span>Voltar pra home</span></button></div></div>
    `
    setTimeout( function scrollResultado(){
        let irParaResultado = document.querySelector(".resultado-quizz");
        irParaResultado.scrollIntoView();
    }, 2000)

}

//REINICIA QUIZZ
function reiniciarQuizz(){

    let removeDivResultadosQuizz = document.querySelector(".resultado-quizz");
    removeDivResultadosQuizz.remove();

    pontuacao = 0;

    acertos = 0;

    let removeSelecionado = document.querySelectorAll(".option")    
    removeSelecionado.forEach(elemento => elemento.classList.remove("selecionado"));
    
    let removeEsbranquicado = document.querySelectorAll(".option")
    removeEsbranquicado.forEach(elemento => elemento.classList.remove("esbranquicado"));

    let removeCoresTrue = document.querySelectorAll(".txtAlternativa")
    removeCoresTrue.forEach(elemento => elemento.classList.remove("cor-verdadeira"));

    let removeCoresFalse = document.querySelectorAll(".txtAlternativa")
    removeCoresFalse.forEach(elemento => elemento.classList.remove("cor-falsa"));

    document.querySelector(".imagem-banner").scrollIntoView();

}


