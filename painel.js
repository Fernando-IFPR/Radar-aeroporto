// ========================================================
// 1. O MOLDE (CLASSE VOO)
// ========================================================
class Voo {
    constructor(codigo, destino) {
        this.codigo = codigo;
        this.destino = destino;
        this.status = "Embarque"; // Status inicial exigido pelo enunciado
    }
}

// ========================================================
// DESAFIO 1: O BOOT DO SISTEMA (Carregando a Caixa-Preta)
// ========================================================
let listaDeVoos = []; 

// 1. Tenta buscar os dados salvos em texto (JSON) no LocalStorage
let voosSalvos = localStorage.getItem("diario_de_voos");

if (voosSalvos !== null) {
    // DESSERIALIZAÇÃO: Converte o texto JSON de volta para o Array de Objetos
    listaDeVoos = JSON.parse(voosSalvos);
} else {
    // Se for a primeira vez, o sistema inicia com a lista vazia
    listaDeVoos = [];
}

// ========================================================
// DESAFIO 2: SALVANDO UM NOVO VOO (Função Auxiliar de Gravação)
// ========================================================
function salvarNoDisco() {
    // SERIALIZAÇÃO: Transforma o Array de Objetos em uma String de texto única
    let arrayConvertidoEmTexto = JSON.stringify(listaDeVoos);
    
    // Grava permanentemente a string no LocalStorage do navegador
    localStorage.setItem("diario_de_voos", arrayConvertidoEmTexto);
}

// ========================================================
// FUNÇÃO PARA DESENHAR A TELA (Renderização Dinâmica)
// ========================================================
function atualizarPainel() {
    const container = document.getElementById("telaDoAeroporto");
    if (!container) return;

    // Limpa a tela antes de redesenhar para não duplicar os itens
    container.innerHTML = "";

    // Se a lista estiver vazia, exibe um aviso na tela
    if (listaDeVoos.length === 0) {
        container.innerHTML = "<p style='color: #888;'>Nenhum voo registrado no radar temporariamente.</p>";
        return;
    }

    // Varre o array e cria a estrutura HTML (cards) para cada voo salvo
    listaDeVoos.forEach((voo, indice) => {
        const card = document.createElement("div");
        card.className = "card-voo";
        
        card.innerHTML = `
            <p><strong>Código:</strong> ${voo.codigo}</p>
            <p><strong>Destino:</strong> ${voo.destino}</p>
            <p><strong>Status:</strong> <span style="color: #f1c40f;">${voo.status}</span></p>
            <button class="botao-decolar" onclick="mudarStatusVoo(${indice})">Mudar Status (Decolar)</button>
        `;
        
        container.appendChild(card);
    });
}

// Função auxiliar para interagir com o status do voo e atualizar o LocalStorage
window.mudarStatusVoo = function(indice) {
    if (listaDeVoos[indice].status === "Embarque") {
        listaDeVoos[indice].status = "Em Voo";
    } else {
        listaDeVoos[indice].status = "Embarque";
    }
    salvarNoDisco();   // Salva a alteração do status no disco
    atualizarPainel(); // Atualiza o visual
}

// ========================================================
// CAPTURA DO FORMULÁRIO (Novo Despacho)
// ========================================================
const formulario = document.getElementById("formDespacho");

if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); // Impede o recarregamento (F5) da página

        let codigoDigitado = document.getElementById("inputCodigo").value;
        let destinoDigitado = document.getElementById("inputDestino").value;

        // Cria o objeto do novo voo conforme as variáveis capituradas
        let novoVoo = { codigo: codigoDigitado, destino: destinoDigitado, status: "Embarque" };

        // Adiciona o voo na memória RAM (Array)
        listaDeVoos.push(novoVoo);

        // PERSISTÊNCIA: Grava a lista atualizada no armazenamento físico (Disco)
        salvarNoDisco();

        // Atualiza a tela visivelmente
        atualizarPainel();

        // Limpa os campos do formulário para o próximo input
        document.getElementById("inputCodigo").value = "";
        document.getElementById("inputDestino").value = "";
    });
}

// Executa o desenho do painel assim que a página termina de carregar
atualizarPainel();