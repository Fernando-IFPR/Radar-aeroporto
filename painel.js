// ========================================================
// 1. O MOLDE (CLASSE VOO)
// ========================================================
class Voo {
    constructor(codigo, destino) {
        this.codigo = codigo;
        this.destino = destino;
        this.status = "Embarque";
        this.portao = "Não Definido"; // Propriedade exigida pelo Update
    }
}

// ========================================================
// CARREGAMENTO INICIAL DO SISTEMA (Boot / Desserialização)
// ========================================================
let listaDeVoos = []; 

let voosSalvos = localStorage.getItem("diario_de_voos");

if (voosSalvos !== null) {
    // Se achar dados no disco, converte o texto JSON de volta para o Array
    listaDeVoos = JSON.parse(voosSalvos);
} else {
    // Caso o LocalStorage esteja vazio, inicia com o array limpo
    listaDeVoos = [];
}

// ========================================================
// DESAFIO 1: A FUNÇÃO DE EXCLUIR (Delete)
// ========================================================
function cancelarVoo(codigoAlvo) {
    // O filter() gera um novo array contendo apenas os voos com código DIFERENTE do alvo
    listaDeVoos = listaDeVoos.filter(voo => voo.codigo !== codigoAlvo);

    // Sincroniza a mudança com o disco e com a tela
    salvarNoDiscoERenderizar();
}

// ========================================================
// DESAFIO 2: A FUNÇÃO DE ATUALIZAR (Update)
// ========================================================
function alterarPortao(codigoAlvo, novoPortao) {
    // O findIndex() busca a posição indexada (a gaveta) do voo no Array
    let index = listaDeVoos.findIndex(voo => voo.codigo === codigoAlvo);

    // Se o index for diferente de -1, significa que o voo foi localizado com sucesso
    if (index !== -1) {
        listaDeVoos[index].portao = novoPortao; // Atualiza o dado na memória RAM
        
        // Sincroniza a mudança com o disco e com a tela
        salvarNoDiscoERenderizar();
    }
}

// ========================================================
// FUNÇÃO AUXILIAR: Evita a repetição de código (Princípio DRY)
// ========================================================
function salvarNoDiscoERenderizar() {
    // Serialização: Converte o Array para String JSON e salva no LocalStorage
    localStorage.setItem("diario_de_voos", JSON.stringify(listaDeVoos));
    // Redesenha a interface visual
    atualizarPainel();
}

// ========================================================
// DESAFIO 3: ADICIONAR OS BOTÕES NA RENDERIZAÇÃO (DOM)
// ========================================================
function atualizarPainel() {
    let tela = document.getElementById("telaDoAeroporto");
    if (!tela) return;
    
    tela.innerHTML = ""; // Limpa o container para evitar cards duplicados

    listaDeVoos.forEach(voo => {
        let novoCard = document.createElement("div");
        novoCard.classList.add("card-voo");
        novoCard.innerHTML = `
            <h3>Voo ${voo.codigo} - Destino: ${voo.destino}</h3>
            <p>Portão: ${voo.portao || "Não Definido"}</p>
        `;

        // CRIANDO O BOTÃO DE ALTERAR PORTÃO DINAMICAMENTE (UPDATE)
        let btnPortao = document.createElement("button");
        btnPortao.innerText = "Mudar Portão 🔄";
        btnPortao.style.marginRight = "5px";
        btnPortao.addEventListener("click", function() {
            let novo = prompt(`Digite o novo número do portão para o voo ${voo.codigo}:`);
            if (novo) {
                alterarPortao(voo.codigo, novo);
            }
        });

        // CRIANDO O BOTÃO DE CANCELAR DINAMICAMENTE (DELETE)
        let btnCancelar = document.createElement("button");
        btnCancelar.innerText = "Cancelar Voo ❌";
        btnCancelar.style.background = "red";
        btnCancelar.style.color = "white";
        btnCancelar.style.border = "none";
        btnCancelar.style.padding = "5px 10px";
        btnCancelar.style.cursor = "pointer";
        
        btnCancelar.addEventListener("click", function() {
            // Confirmação nativa para mitigar cliques acidentais
            if (confirm(`Tem certeza que deseja cancelar o voo ${voo.codigo}?`)) {
                cancelarVoo(voo.codigo);
            }
        });

        // Acopla os botões criados na estrutura interna do card
        novoCard.appendChild(btnPortao);
        novoCard.appendChild(btnCancelar);
        
        // Insere o card estruturado dentro do container do HTML
        tela.appendChild(novoCard);
    });
}

// ========================================================
// CAPTURA E INSERÇÃO DO FORMULÁRIO (Create)
// ========================================================
const formulario = document.getElementById("formDespacho");

if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); // Evita o reload (F5) nativo do formulário

        let codigoDigitado = document.getElementById("inputCodigo").value;
        let destinoDigitado = document.getElementById("inputDestino").value;

        // Cria a estrutura padrão do novo voo
        let novoVoo = new Voo(codigoDigitado, destinoDigitado);

        // Insere o objeto no array alocado na memória RAM
        listaDeVoos.push(novoVoo);

        // Aplica o Triângulo de Reatividade (Salva no disco e atualiza o DOM)
        salvarNoDiscoERenderizar();

        // Limpa os campos do formulário
        document.getElementById("inputCodigo").value = "";
        document.getElementById("inputDestino").value = "";
    });
}

// Executa a leitura inicial do banco e desenha os cards no boot da aplicação
atualizarPainel();