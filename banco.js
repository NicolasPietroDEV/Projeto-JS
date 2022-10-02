//inicia a array de contas, que conterá todas as contas sorteadas
let contas = []

//função que cria uma versão temporária da array contas sem a coluna "historico"
function tmpContas(contas){
    let tempContas = JSON.parse(JSON.stringify(contas))
    tempContas.map((objeto)=>{let objetoTemp = objeto; delete objetoTemp.historico; return objetoTemp})
    return tempContas
}

//sorteia 5 contas
for (let x=0; x<5; x++){
        //define a conta que será lançada
        let lancamento = {
            numero: Math.floor((Math.random() * 100) + 1),
            saldo: +((Math.random() * 100000).toFixed(2)),
            limiteTransf: +(((Math.random() * (50000-1000)) + 1000).toFixed(2)),
            historico: [],
            banco: ["BB", "Original", "Bradesco"][Math.floor(Math.random()*3)],
            TransfRecebidas:0,
            TransfNegadas:0,
            TransfEfetuadas:0
            }
            //loop que impede a criação de contas com o mesmo número
            while (true){
                let alterarNumero = false;
                for (let conta of contas){
                    if(conta.numero == lancamento.numero){
                        alterarNumero = true
                    }
                }
                if (alterarNumero){
                    lancamento.numero = Math.floor((Math.random() * 100) + 1)
                } else {
                    break
                }
            }
    //inserção da conta na array de contas
    contas.push(lancamento)
}

//exibe as contas inicialmente utilizando a função que retira a coluna "historico"
console.log("Antes das transferências")
console.table(tmpContas(contas))

//sorteia aleatoriamente um numero entre 1 e 20 lançamentos de pagamentos aleatorios
for (let x = 0; x < (Math.floor(Math.random() * 20)+1); x++){
    let contaPagadoraIndex = Math.floor(Math.random()*5)
    let contaRecebedoraIndex
    //loop que impede o pagamento com destino e origem iguais
    while (true){
        contaRecebedoraIndex = Math.floor(Math.random()*5)
        if (contaPagadoraIndex != contaRecebedoraIndex){
            break
        }
    }
    //define a transacao a ser inserida 
    let transacao = {
        meio: ["PIX", "DOC", "TED"][Math.floor(Math.random()*3)],
        tipo: null,
        valor: +(((Math.random() * (50000-1000)) + 1000).toFixed(2)),
        origem: contas[contaPagadoraIndex].numero,
        destino: contas[contaRecebedoraIndex].numero,
        //OPCIONAL: sorteio da data de transferencia
        DataTransf: new Date(2022, Math.floor((Math.random()*12)+1), Math.floor((Math.random()*31)+1), Math.floor((Math.random()*23)+1), Math.floor((Math.random()*59)+1))
    }
    //OPCIONAL: definição na data de processamento levando em conta a propriedade "meio"
    if(transacao.meio == "DOC" ){
        let tempData = new Date((transacao.DataTransf).getTime())
        if((transacao.DataTransf.getHours()+3) < 22){
        tempData.setDate(((transacao.DataTransf).getDate() + 1))
        transacao.DataProcessamento = tempData
        } else {
            tempData.setDate(((transacao.DataTransf).getDate() + 2))
        transacao.DataProcessamento = tempData
        }
        
    } else if( transacao.meio == "PIX"){
        let tempData = new Date((transacao.DataTransf).getTime())
        transacao.DataProcessamento = tempData
    } else if(transacao.meio == "TED"){
        let tempData = new Date((transacao.DataTransf).getTime())
        if(((transacao.DataTransf).getHours()+3) > 6 && ((transacao.DataTransf).getHours()+3) < 17){
            transacao.DataProcessamento = tempData
        } else {
            tempData.setDate(((transacao.DataTransf).getDate() + 1))
            transacao.DataProcessamento = tempData
        }
    }

    //insere posteriormente o tipo de transação baseado na propriedade "banco" das contas
    transacao.tipo = contas[contaPagadoraIndex].banco == contas[contaRecebedoraIndex].banco ? "Intrabancária" : "Interbancária"

    //define a aprovação ou negação da transferencia baseado na propriedade "saldo" e na propriedade "limiteTransf"
    //OPCIONAL: adiciona o limite noturno de 1000 
    if(((transacao.DataTransf.getHours()+3) > 20 || (transacao.DataTransf.getHours()+3) < 6) && transacao.valor > 1000){
        transacao.descricao = "Negado (limite noturno)"
        contas[contaPagadoraIndex].TransfNegadas += 1
    } else if (transacao.valor > contas[contaPagadoraIndex].limiteTransf){
        transacao.descricao = "Negado (sem limite)"
        contas[contaPagadoraIndex].TransfNegadas += 1
    } else if (transacao.valor > contas[contaPagadoraIndex].saldo){
        transacao.descricao = "Negado (sem saldo)"
        contas[contaPagadoraIndex].TransfNegadas += 1

    } else {
        transacao.descricao = "Aprovado"
        contas[contaPagadoraIndex].saldo = +((contas[contaPagadoraIndex].saldo - transacao.valor).toFixed(2))
        contas[contaRecebedoraIndex].saldo = +((contas[contaRecebedoraIndex].saldo + transacao.valor).toFixed(2))
        contas[contaPagadoraIndex].TransfEfetuadas += 1
        contas[contaRecebedoraIndex].TransfRecebidas += 1
    }

    //insere a transacao no historico da conta pagadora
    (contas[contaPagadoraIndex].historico).push(
        transacao
    )
}

//após as transações, exibe novamente as contas utilizando o "tmpContas" e também o histórico de cada uma
console.log("Depois das transferências")
console.table(tmpContas(contas))
for(let conta of contas){
    console.log("\nHistórico da conta " + conta.numero)
    if (conta.historico.length == 0){
        console.log("Não há nenhuma transação \n")
    } else {
        console.table(conta.historico)
    }
    
}