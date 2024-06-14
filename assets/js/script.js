// Conexão API
async function conectaAPI() {
    try {
        const response = await fetch("http://localhost:3000/produtos");
        if (!response.ok) {
            throw new Error('Ocorreu um Erro ao buscar os produtos. Status: ' + response.status);
        }
        const produtos = await response.json();
        exibirCards(produtos);
        return produtos;
    } catch (error) {
        secaoCards.innerHTML = `<h3>Não foi possível exibir os produtos</h3>`;
        console.error('Erro ao conectar com a API:', error);
    }
}

conectaAPI()


// Criar Cards 
let secaoCards = document.getElementsByClassName("cards-content")[0];

function exibirCards(listaDeProdutos) {
    try {
        listaDeProdutos.forEach(produto => {
            secaoCards.innerHTML += `
                <div class="card">
                        <img class="img-item" src="${produto.imagem}" alt="Produto">
                        <div class="card-container--info">
                            <p>${produto.titulo}</p>
                            <div class="card-container--value">
                                <p>$ ${produto.preco}</p>
                                <img class="card-container--delete" src="./assets/img/icon _trash.svg" title="Excluir Produto" alt="Ícone de excluir item" data-id="${produto.id}">
                            </div>
                        </div>
                    </div>
            `;
        });
        deletarCards();
    } catch (error) {
        secaoCards.innerHTML = `<h3>Não foi possível exibir os produtos</h3>`;
        console.error('Erro ao criar os cards:', error);
    }
}



// Publicar Cards via Formulário
const formulario = document.querySelector("[data-formulario]");

async function criarCards(evento) {
    evento.preventDefault();

    const imagem = document.querySelector("[data-imagem]").value;
    const titulo = document.querySelector("[data-titulo]").value;
    const preco = document.querySelector("[data-preco]").value;
    
    try {
        const novoCard = await criaCard(imagem, titulo, preco);
        exibirCards([novoCard]);
    } catch (error) {
        console.error('Erro ao criar novo card:', error);
    }
 
}

formulario.addEventListener("submit", evento => criarCards(evento))


async function criaCard(imagem, titulo, preco) {
    try {
        const conexaoAPI = await fetch("http://localhost:3000/produtos", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                imagem: imagem,
                titulo: titulo,
                preco: preco,
            })
        });

        if (!conexaoAPI.ok) {
            throw new Error('Falha ao criar o produto. Status: ' + conexaoAPI.status);
        }

        const conexaoConvertida = await conexaoAPI.json();
        return conexaoConvertida;
    } catch (error) {
        secaoCards.innerHTML = `<h3>Não foi possível exibir os produtos</h3>`;
        console.error('Erro ao criar produto:', error);
        throw error;
    }
}


// Deletar Cards
function deletarCards(){
    const botoesDeletar = document.querySelectorAll('.card-container--delete');
    botoesDeletar.forEach(botao => {
        botao.addEventListener('click', evento => {
            const cardId = evento.target.getAttribute('data-id');
            deletarCard(cardId, evento.target.closest('.card'));
        });
    });

}

async function deletarCard(id, cardElement) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            cardElement.remove();
        } else {
            console.error('Falha ao deletar o produto.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

