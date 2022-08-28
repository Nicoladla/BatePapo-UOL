//Essa é a parte responsável por exibir as mensagens no chat.
function buscarMsg(){
    const promessa= axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promessa.then(analizarDados);
}
buscarMsg();//É necessário atualizar as msg a cada 3 segundos.

    //Aqui os dados são analizados e enviados para outra função.
function analizarDados(dados){

    for(let i=0; i<dados.data.length; i++){
        if(dados.data[i].type === "status"){
            renderizarMsg(dados.data, i, "");

        }else if(dados.data[i].type === "message"){
            renderizarMsg(dados.data, i, `para <strong>${dados.data[i].to}</strong>:`);

        }else if(dados.data[i].type === "private_message"){
            renderizarMsg(dados.data, i, `reservadamente para <strong>${dados.data[i].to}</strong>:`);
            //pendencias
        }
    }
        //Nessa parte o foco da tela sempre será na ultima mensagem.
    const ultimaMsg= document.querySelectorAll('.mensagem');
    ultimaMsg[ultimaMsg.length-1].scrollIntoView();
}
    
    //Aqui os dados são recebidos, e de acordo o seu tipo, são formatados no chat.
function renderizarMsg(res, j, formataçao){
    const campoDasMsg= document.querySelector(".campo-das-msg");

    campoDasMsg.innerHTML+=`
            <li class="mensagem ${res[j].type}">
                <p>
                    <span>(${res[j].time})</span>
                    <strong>${res[j].from}</strong> ${formataçao}
                    ${res[j].text}
                </p>
            </li>
        `;
}