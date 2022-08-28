//Essa é a parte em que o usuário cadastra seu nome para entrar no site.
let NomeDoUsuario;
function cadastrarUsuario(erro){
    //Aqui é verificado se o parametro 'erro' esteja vazio.
    //Caso não esteja vazio, significa que a função foi chamada novamente por causa de um erro de cadastro de usuário.
    if(erro === undefined){
        NomeDoUsuario= prompt("Digite seu nome:");
    }else{
        NomeDoUsuario= prompt("Usuário já cadastrado, insira outro nome.");
    }

    while(NomeDoUsuario === null){
        NomeDoUsuario= prompt("Digite um nome:")
    }

    const cadastrarNome= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:`${NomeDoUsuario}`});
    cadastrarNome.then(buscarMsg);
    cadastrarNome.catch(cadastrarUsuario);
}
cadastrarUsuario();

    //Aqui é onde o servidor sabe se o usuário ainda esta online.
function usuarioOnline(){
    const online= axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name:`${NomeDoUsuario}`});
}
const statusUsuário= setInterval(usuarioOnline, 5000);

//Essa é a parte responsável por exibir e atualizar as mensagens no chat.
function buscarMsg(){
    const promessa= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promessa.then(analizarDados);
}

    //Aqui os dados são analizados e enviados para outra função.
const campoDasMsg= document.querySelector(".campo-das-msg");

function analizarDados(dados){
    campoDasMsg.innerHTML= "";

    for(let i=0; i<dados.data.length; i++){
        if(dados.data[i].type === "status"){
            renderizarMsg(dados.data, i, "");

        }else if(dados.data[i].type === "message"){
            renderizarMsg(dados.data, i, `para <strong>${dados.data[i].to}</strong>:`);

        }else if(dados.data[i].type === "private_message" && dados.data[i].to === NomeDoUsuario){
            renderizarMsg(dados.data, i, `reservadamente para <strong>${dados.data[i].to}</strong>:`);
        }
    }
        //Nessa parte o foco da tela sempre será na ultima mensagem.
    const ultimaMsg= document.querySelectorAll('.mensagem');
    ultimaMsg[ultimaMsg.length-1].scrollIntoView();
}
    
    //Aqui os dados são recebidos, e de acordo o seu tipo, são formatados no chat.
function renderizarMsg(res, j, formataçao){
    campoDasMsg.innerHTML+= `
            <li class="mensagem ${res[j].type}">
                <p>
                    <span>(${res[j].time})</span>
                    <strong>${res[j].from}</strong> ${formataçao}
                    ${res[j].text}
                </p>
            </li>
        `;
}

    //Aqui é onde o chat é atualizado.
const atualizarMsg= setInterval(buscarMsg, 3000);