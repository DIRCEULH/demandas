const estadoOrdenacao = {};

const limparEConverter = (texto) => {
  const limpo = texto
    .replace(/\./g, '')       // remove separadores de milhar (pontos)
    .replace(',', '.')        // substitui vírgula decimal por ponto
    .replace(/[^0-9.-]/g, '') // remove qualquer coisa que não seja número, ponto ou traço

  return !isNaN(parseFloat(limpo)) ? parseFloat(limpo) : texto.toLowerCase();
};

const ordenarColunaCombinada = (idTabelaA, idTabelaB, indiceColuna, tabelaOrigem = 'A') => {
  const chave = `${idTabelaA}-${idTabelaB}-${tabelaOrigem}-${indiceColuna}`;
  const direcaoAtual = estadoOrdenacao[chave] || 'asc';
  const novaDirecao = direcaoAtual === 'asc' ? 'desc' : 'asc';
  estadoOrdenacao[chave] = novaDirecao;

  const tabelaA = document.getElementById(idTabelaA).tBodies[0];
  const tabelaB = document.getElementById(idTabelaB).tBodies[0];

  const linhasA = Array.from(tabelaA.rows);
  const linhasB = Array.from(tabelaB.rows);

  const combinados = linhasA.map((linhaA, index) => ({
    linhaA,
    linhaB: linhasB[index]
  }));

  combinados.sort((a, b) => {
    const linhaOrigemA = tabelaOrigem === 'A' ? a.linhaA : a.linhaB;
    const linhaOrigemB = tabelaOrigem === 'A' ? b.linhaA : b.linhaB;

    const textoA = linhaOrigemA.cells[indiceColuna]?.textContent.trim() ?? '';
    const textoB = linhaOrigemB.cells[indiceColuna]?.textContent.trim() ?? '';

    const valorA = limparEConverter(textoA);
    const valorB = limparEConverter(textoB);

    if (valorA < valorB) return novaDirecao === 'asc' ? -1 : 1;
    if (valorA > valorB) return novaDirecao === 'asc' ? 1 : -1;
    return 0;
  });

  combinados.forEach(({ linhaA, linhaB }) => {
    tabelaA.appendChild(linhaA);
    tabelaB.appendChild(linhaB);
  });
};



const ordenarColunas = (dados, funcaoCalculo, ordem = 'asc') => {
    return dados.sort((a, b) => {
      const valorA = funcaoCalculo(a);
      const valorB = funcaoCalculo(b);
  
      // Se ambos forem números (e finitos), ordena numericamente
      if (typeof valorA === 'number' && typeof valorB === 'number' && isFinite(valorA) && isFinite(valorB)) {
        return ordem === 'asc' ? valorA - valorB : valorB - valorA;
      }
  
      // Se forem strings (ou qualquer outro tipo), compara como texto
      const strA = valorA?.toString().toLowerCase() ?? '';
      const strB = valorB?.toString().toLowerCase() ?? '';
      return ordem === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  };
  
  