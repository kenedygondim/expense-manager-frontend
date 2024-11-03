fetch("http://localhost:8081/all")
.then(response => {
    return response.json(); 
})
.then(data => {


    console.log(data);

    document.getElementsByClassName("purchases")[0].innerHTML = data.length;
    document.getElementsByClassName("totalGasto")[0].innerHTML += data.reduce((acc, item) => acc + (item.valorProduto - item.valorDescontos), 0);
    document.getElementsByClassName("totalImpostos")[0].innerHTML += data.reduce((acc, item) => acc + item.valorImpostos, 0).toFixed(2);


    data.sort((a, b) => b.valorProduto - a.valorProduto);

    for (i = 0; i < 3; i++) {
        document.getElementsByClassName("product-name")[i].innerHTML = data[i].nomeProduto.substring(0, 22) + "...";
        document.getElementsByClassName("product-value")[i].innerHTML = "R$" + (data[i].valorProduto - data[i].valorDescontos).toFixed(2);
        
        const dateStr = data[i].dataEmissaoNf;


        console.log(dateStr)

        const date = new Date(dateStr);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
        const dataFormatada = date.toLocaleDateString('pt-BR', options); 


        document.getElementsByClassName("product-date")[i].innerHTML = dataFormatada
    }


}).catch(error => {
    console.error(error);
});