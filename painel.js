// Simulando os dados que vieram do Radar (Array de Objetos)
const listaDeVoos = [
    { codigo: "G3-100", destino: "São Paulo", status: "Embarque", portao: "01" },
    { codigo: "LA-200", destino: "Rio de Janeiro", status: "Atrasado", portao: "04" },
    { codigo: "AD-300", destino: "Campinas", status: "Confirmado", portao: "02" }
];

// Capturamos a div vazia do HTML onde os voos devem aparecer
const tela = document.getElementById("telaDoAeroporto");

// DESAFIO 1: A Função de Renderização Dinâmica
function atualizarPainel() {
    // Passo 1: Limpar a tela antes de desenhar, para não duplicar os voos (Pesquise: "JavaScript innerHTML clear")
    function clear() {
        document.getElementById("telaDoAeroporto").innerHTML = "";
    }
    clear();

    // Passo 2: Percorrer o Array (Pesquise: "JavaScript forEach MDN")
    listaDeVoos.forEach(voo => {
        // 1. Crie um elemento <div> (Pesquise: "document.createElement MDN")
        const div = document.createElement("div");
        // 2. Coloque a classe CSS "card-voo" nessa div (Pesquise: "classList.add W3Schools")
        div.classList.add("card-voo");

        // 3. Coloque o texto do voo dentro da div (Pesquise: "innerHTML")
        div.innerHTML = `${voo.codigo} - ${voo.destino} - ${voo.status} - Portão: ${voo.portao} <button class='botao-decolar'>Decolar</button>`;
        
        // Pega o botão que foi criado
        const botao = div.querySelector("button");
        
        // Adiciona o evento de clique
        botao.addEventListener("click", () => {
            alert(`O voo ${voo.codigo} decolou!`);
        });
        
        // 4. Prenda essa nova div dentro da "tela" (Pesquise: "appendChild MDN")
        tela.appendChild(div);
    });
}

// Executando a função para desenhar a tela inicial
atualizarPainel();