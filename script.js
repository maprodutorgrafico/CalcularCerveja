// Variáveis globais
let dados = {
    tipos_vasilhame: [],
    precos_cerveja: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
});

// Carregar dados do JSON
function carregarDados() {
    try {
        const dadosSalvos = localStorage.getItem('cerveja_dados');
        if (dadosSalvos) {
            dados = JSON.parse(dadosSalvos);
        } else {
            // Dados iniciais
            dados = {
                tipos_vasilhame: [
                    {id: 1, nome: "Latinha 269ml", volume_ml: 269, descricao: "Latinha tradicional"},
                    {id: 2, nome: "Latinha 350ml", volume_ml: 350, descricao: "Lata padrão"},
                    {id: 3, nome: "Garrafa 600ml", volume_ml: 600, descricao: "Garrafa long neck"},
                    {id: 4, nome: "Garrafa 1L", volume_ml: 1000, descricao: "Garrafa de 1 litro"}
                ],
                precos_cerveja: []
            };
            salvarDados();
        }
        
        atualizarSelectVasilhame();
        atualizarListaVasilhames();
        atualizarUltimosPrecos();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarMensagem('Erro ao carregar dados', 'error');
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('cerveja_dados', JSON.stringify(dados));
}

// Atualizar select de vasilhames
function atualizarSelectVasilhame() {
    const select = document.getElementById('tipo_vasilhame');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione...</option>';
    
    dados.tipos_vasilhame.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.id;
        option.textContent = `${tipo.nome} (${tipo.volume_ml}ml)`;
        option.setAttribute('data-volume', tipo.volume_ml);
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const volume = selectedOption.getAttribute('data-volume');
        document.getElementById('volume').value = volume || '';
    });
}

// Atualizar lista de vasilhames
function atualizarListaVasilhames() {
    const container = document.getElementById('lista-vasilhames');
    if (!container) return;
    
    if (dados.tipos_vasilhame.length === 0) {
        container.innerHTML = '<p>Nenhum vasilhame cadastrado.</p>';
        return;
    }
    
    let html = '<table class="tabela-vasilhames"><thead><tr><th>Nome</th><th>Volume</th><th>Descrição</th><th>Ações</th></tr></thead><tbody>';
    
    dados.tipos_vasilhame.forEach(tipo => {
        html += `
            <tr>
                <td>${tipo.nome}</td>
                <td>${tipo.volume_ml}ml</td>
                <td>${tipo.descricao || ''}</td>
                <td>
                    <button onclick="editarVasilhame(${tipo.id})" class="btn-small">✏️</button>
                    <button onclick="excluirVasilhame(${tipo.id})" class="btn-small">🗑️</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Atualizar últimos preços
function atualizarUltimosPrecos() {
    const container = document.getElementById('ultimos-precos');
    if (!container) return;
    
    if (dados.precos_cerveja.length === 0) {
        container.innerHTML = '<p>Nenhum preço salvo ainda.</p>';
        return;
    }
    
    let html = '<table class="tabela-vasilhames"><thead><tr><th>Marca</th><th>Tipo</th><th>Preço</th><th>R$/Litro</th></tr></thead><tbody>';
    
    // Mostrar últimos 10 preços
    dados.precos_cerveja.slice(-10).reverse().forEach(preco => {
        const tipo = dados.tipos_vasilhame.find(t => t.id === preco.tipo_id);
        const precoLitro = (preco.preco / preco.volume) * 1000;
        
        html += `
            <tr>
                <td>${preco.marca}</td>
                <td>${tipo ? tipo.nome : 'Desconhecido'}</td>
                <td>R$ ${preco.preco.toFixed(2)}</td>
                <td>R$ ${precoLitro.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Calcular preços
function calcularPrecos() {
    const preco = parseFloat(document.getElementById('preco').value);
    const volume = parseInt(document.getElementById('volume').value);
    
    if (!preco || !volume || preco <= 0 || volume <= 0) {
        alert('Por favor, selecione um vasilhame e preencha o preço corretamente');
        return;
    }
    
    // Preço por litro
    const precoPorLitro = (preco / volume) * 1000;
    
    // Caixinhas
    const caixinha12 = preco * 12;
    const caixinha15 = preco * 15;
    const caixinha18 = preco * 18;
    
    // Litros por caixinha
    const litros12 = (volume * 12) / 1000;
    const litros15 = (volume * 15) / 1000;
    const litros18 = (volume * 18) / 1000;
    
    // Atualizar interface
    document.getElementById('preco-litro').textContent = formatarMoeda(precoPorLitro);
    
    document.getElementById('caixinha12-preco').textContent = formatarMoeda(caixinha12);
    document.getElementById('caixinha12-litros').textContent = litros12.toFixed(2) + 'L';
    
    document.getElementById('caixinha15-preco').textContent = formatarMoeda(caixinha15);
    document.getElementById('caixinha15-litros').textContent = litros15.toFixed(2) + 'L';
    
    document.getElementById('caixinha18-preco').textContent = formatarMoeda(caixinha18);
    document.getElementById('caixinha18-litros').textContent = litros18.toFixed(2) + 'L';
}

// Salvar preço
function salvarPreco() {
    const marca = document.getElementById('marca').value;
    const tipoId = parseInt(document.getElementById('tipo_vasilhame').value);
    const preco = parseFloat(document.getElementById('preco').value);
    const volume = parseInt(document.getElementById('volume').value);
    
    if (!marca || !tipoId || !preco || !volume) {
        alert('Preencha todos os campos corretamente');
        return;
    }
    
    dados.precos_cerveja.push({
        marca: marca,
        tipo_id: tipoId,
        preco: preco,
        volume: volume,
        data: new Date().toISOString()
    });
    
    salvarDados();
    atualizarUltimosPrecos();
    alert('Preço salvo com sucesso!');
}

// Salvar novo vasilhame
function salvarVasilhame() {
    const nome = document.getElementById('nome').value;
    const volume = parseInt(document.getElementById('volume').value);
    const descricao = document.getElementById('descricao').value;
    
    if (!nome || !volume) {
        mostrarMensagem('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    const novoId = Math.max(...dados.tipos_vasilhame.map(t => t.id), 0) + 1;
    
    dados.tipos_vasilhame.push({
        id: novoId,
        nome: nome,
        volume_ml: volume,
        descricao: descricao
    });
    
    salvarDados();
    
    mostrarMensagem('Vasilhame cadastrado com sucesso!', 'success');
    
    // Limpar campos
    document.getElementById('nome').value = '';
    document.getElementById('volume').value = '';
    document.getElementById('descricao').value = '';
    
    // Atualizar listas
    atualizarSelectVasilhame();
    atualizarListaVasilhames();
}

// Excluir vasilhame
function excluirVasilhame(id) {
    if (confirm('Tem certeza que deseja excluir este vasilhame?')) {
        dados.tipos_vasilhame = dados.tipos_vasilhame.filter(t => t.id !== id);
        salvarDados();
        atualizarSelectVasilhame();
        atualizarListaVasilhames();
    }
}

// Editar vasilhame
function editarVasilhame(id) {
    const vasilhame = dados.tipos_vasilhame.find(t => t.id === id);
    if (!vasilhame) return;
    
    const novoNome = prompt('Novo nome:', vasilhame.nome);
    if (novoNome === null) return;
    
    const novoVolume = prompt('Novo volume (ml):', vasilhame.volume_ml);
    if (novoVolume === null) return;
    
    vasilhame.nome = novoNome;
    vasilhame.volume_ml = parseInt(novoVolume);
    
    salvarDados();
    atualizarSelectVasilhame();
    atualizarListaVasilhames();
}

// Funções utilitárias
function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    if (!msgDiv) return;
    
    msgDiv.style.display = 'block';
    msgDiv.className = `alert ${tipo}`;
    msgDiv.textContent = texto;
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 3000);
}

// Adicionar estilos extras
const style = document.createElement('style');
style.textContent = `
    .btn-small {
        padding: 5px 10px;
        margin: 0 2px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        background: none;
        font-size: 16px;
    }
    .btn-small:hover {
        background: #f0f0f0;
    }
    .alert {
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .success {
        background: #c6f6d5;
        color: #22543d;
        border: 1px solid #9ae6b4;
    }
    .error {
        background: #fed7d7;
        color: #742a2a;
        border: 1px solid #fc8181;
    }
`;
document.head.appendChild(style);