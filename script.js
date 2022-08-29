//Aqui é onde o servidor sabe se o usuário ainda esta online.
function usuarioOnline(){
    const online= axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name:`${NomeDoUsuario}`});
}

//Essa é a parte em que é feito a troca de tela, e o usuário acessa o chat.
function trocarDeTela(recebidos){
    const telaInicial= document.querySelector(".cadastrar-usuario");
    const chat= document.querySelector(".chat");

    chat.classList.remove("desligado");
    telaInicial.classList.add("desligado");

    setInterval(usuarioOnline, 5000);
    buscarMsg();
    setInterval(buscarMsg, 3000);
}

//Essa é a parte em que o usuário cadastra seu nome para entrar no site.
    //Aqui o usuário pode cadastrar o nome utilizando a tecla 'enter'.
const qualSeuNome= document.querySelector(".cadastrar-usuario input");

qualSeuNome.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        cadastrarUsuario();
    }
});

let NomeDoUsuario;
function cadastrarUsuario(){
    NomeDoUsuario= qualSeuNome.value;

    const cadastrarNome= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:`${NomeDoUsuario}`});
    cadastrarNome.then(trocarDeTela);
    cadastrarNome.catch((erro) => {
        qualSeuNome.value='';
        qualSeuNome.focus();
        qualSeuNome.placeholder=`Insira outro nome`;
    });
}

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

//Essa é a parte responsável pelo envio das mensagens.
const mensagem= document.querySelector(".barra-msg input");
    //Aqui é configurado o envio da msg com a tecla 'enter'.
mensagem.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        enviarMsg();
    }
});

function enviarMsg(){
    const msgFormatada={
        from: NomeDoUsuario,
        to: "Todos",
        text: mensagem.value,
        type: "message"
    }

    const enviar= axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgFormatada);
    enviar.then(buscarMsg);

    mensagem.value= "";
    mensagem.focus();
}