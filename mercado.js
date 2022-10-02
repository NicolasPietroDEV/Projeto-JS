let prods = []
let totalLoss = [{
    quantidade: 0,
    valor: 0
}]
let quantTypes = Math.floor(Math.random()*5+1)
for(let i = 0; i < quantTypes; i++){
    let numProd = i+1
    let quantProds = Math.floor(Math.random()*10+1)
    let priceUnit = (Math.random()*98.99+1).toFixed(2)
    for(let i = 0; i < quantProds; i++){
        let date = new Date()
        let year = date.getUTCFullYear()
        let mounth = Math.floor(Math.random()*9)
        let factory = new Date(year, mounth, Math.floor(Math.random()*32))
        let validDays = Math.floor(Math.random()*365+1)
        let validDate = new Date(year, mounth, validDays)
        let quantProd = Math.floor(Math.random()*300+1)
        let qualit
        if (validDate > date){
            qualit = "Consumível"
        }else {
            qualit = "Vencido"
            totalLoss[0].quantidade = (totalLoss[0].quantidade+quantProd)
            totalLoss[0].valor = (totalLoss[0].valor+(priceUnit*quantProd))
        }
        
        prods.push({
            Tipo: numProd,
            Hoje: `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`,
            Fabricação: `${factory.getUTCDate()}/${factory.getUTCMonth()+1}/${factory.getUTCFullYear()}`,
            ValidadeDias: validDays,
            Validade: `${validDate.getUTCDate()}/${validDate.getUTCMonth()+1}/${validDate.getUTCFullYear()}`,
            Qualidade: qualit,
            PrecoUnitario: priceUnit,
            QuantidadeLote: quantProd
        })
    }
}
console.table(prods)
console.table(totalLoss)