
let itemsPerPage = 5; // Número de itens por página
let ordenacaoDefault = "date"; // Ordenação padrão
let currentPage = 1; //paginaAtual
let items = []; // Lista de itens inicializada como vazia

// Função para buscar dados da API
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:8081/all');
        if (!response.ok) throw new Error("Erro ao carregar os dados.");

        items = await response.json(); // Assume que a resposta está no formato JSON

        switch (ordenacaoDefault) {
            case "date":
                items = ordenarPorData();
                break;
            case "name":
                items = ordenarPorNome();
                break;
            case "price":
                items = ordenarPorValor();
                break;
        }

        renderPage(currentPage, itemsPerPage); // Renderiza a primeira página

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Função para renderizar a página atual
function renderPage(page,  itemsPerPageValue, itemsToRender = items) {

    const start = (page - 1) * itemsPerPageValue;
    const end = start + itemsPerPageValue;

    const paginatedItems =  itemsToRender.slice(start, end);
    

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = ""; 

    paginatedItems.forEach(item => {
        const row = document.createElement("tr");

        formattedStr = item.nomeProduto.length > 25 ? item.nomeProduto.toLowerCase().substring(0, 25) + "..." : item.nomeProduto.toLowerCase();
        const dateStr = item.dataEmissaoNf;
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
        const dataFormatada = date.toLocaleDateString('pt-BR', options); 

        formattedStrEmit = item.nomeEmitenteNf.toLowerCase().substring(0, 25) + "..."

        const cells = [
            formattedStr[0].toUpperCase() + formattedStr.slice(1),
            (item.valorProduto - item.valorDescontos).toFixed(2),
            `${item.valorImpostos} (${((item.valorImpostos / item.valorProduto) * 100).toFixed(1)}%)`,
            dataFormatada,
            formattedStrEmit[0].toUpperCase() + formattedStrEmit.slice(1)
                ];

        cells.forEach(cellData => {
            const cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // Atualizar informações de página e controle dos botões
    document.getElementById("page-info").textContent = `Página ${page}`;
    document.getElementById("prev").disabled = page === 1;
    document.getElementById("next").disabled = end >= items.length;
}

// Funções para mudar a página
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage, itemsPerPage);
    }
}

function nextPage() {
    if ((currentPage * itemsPerPage) < items.length) {
        currentPage++;
        renderPage(currentPage, itemsPerPage);
    }
}

const itemsPerPageValueHtml = document.getElementById("items-per-page");
const sortByValueHtml = document.getElementById("sort-by");
const campoPesquisa = document.getElementById("campoPesquisa");

function searchItems(event) {
    const searchValue = event.target.value.toLowerCase();

    const filteredItems = searchValue
    ? items.filter(item => item.nomeProduto.toLowerCase().includes(searchValue) || item.nomeEmitenteNf.toLowerCase().includes(searchValue))
    : items;

    renderPage(1, itemsPerPage, filteredItems);
}


campoPesquisa.addEventListener("input", searchItems);





function changeItemsPerPage(event) {
    itemsPerPage = parseInt(event.target.value);
    renderPage(1, itemsPerPage);
}

function changeSortBy(event) {
    ordenacao = event.target.value;

    switch (ordenacao) {
        case "date":
            items = ordenarPorData();
            break;
        case "name":
            items = ordenarPorNome();
            break;
        case "price":
            items = ordenarPorValor();
            break;
    }


    console.log("ordenacao: " + ordenacao);
    console.log("items: " + items);

    renderPage(1, itemsPerPage);
}

itemsPerPageValueHtml.addEventListener("change", changeItemsPerPage);
sortByValueHtml.addEventListener("change", changeSortBy);

// Chama a função para buscar dados da API e renderizar a primeira página ao carregar
document.addEventListener("DOMContentLoaded", fetchItems);

function ordenarPorData () {
     return items.sort((a, b) => {
        // Converter as datas para objetos Date para comparação
        const dataA = new Date(a.dataEmissaoNf);
        const dataB = new Date(b.dataEmissaoNf);
    
        // Retornar um número negativo se a < b, positivo se a > b e zero se a === b
        return dataB - dataA;
    });
}

function ordenarPorNome () {
    return items.sort((a, b) => {
        // Comparar as propriedades 'nome' dos objetos
        return a.nomeProduto.localeCompare(b.nomeProduto);
      });
}

function ordenarPorValor () {
    return items.sort((a, b) => {
        // Comparar as propriedades 'nome' dos objetos
        return (a.valorProduto - a.valorDescontos).toFixed(2) - (b.valorProduto - b.valorDescontos).toFixed(2);
      });
}
