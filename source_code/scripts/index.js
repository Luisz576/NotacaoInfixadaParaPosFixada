const processor = new Processor()

document.getElementById('btn-processar').onclick = (e) => {
    e.preventDefault()
    
    const posFixadaElement = document.getElementById('pos-fixada')
    const infixada = document.getElementById('infixada').value
    if(infixada){
        const res = processor.process(infixada)
        if(res == -1){
            posFixadaElement.innerHTML = "A expressão é inválida!"
        }else if(res == -2){
            posFixadaElement.innerHTML = "A expressão é inválida! (numero com espaço)"
        }else if(res == -3){
            posFixadaElement.innerHTML = "A expressão é inválida! (fecha mais parenteses do que tem)"
        }else if(res == -4){
            posFixadaElement.innerHTML = "A expressão é inválida! (nem todos os parenteses foram fechados)"
        }else if(res == -5){
            posFixadaElement.innerHTML = "A expressão é inválida! (operações conectadas)"
        }else if(res == -6){
            posFixadaElement.innerHTML = "A expressão é inválida! (caracteres inválidos)"
        }else{
            posFixadaElement.innerHTML = res
        }
    }else{
        posFixadaElement.innerHTML = "A expressão está vazia!"
    }
}