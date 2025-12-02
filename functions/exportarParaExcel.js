const exportarParaExcel = (id1, id2, nomeArquivo) => {

  $('.obsMostrar').css('display', 'block')

  const wb = XLSX.utils.book_new()

  const tabelaParaAOA = (tabela) => {
    const aoa = [];
    const linhas = tabela.querySelectorAll("tr");

    linhas.forEach((linha) => {
      const linhaAOA = [];
      const celulas = linha.querySelectorAll("th, td");

      celulas.forEach((celula) => {
        const estilo = window.getComputedStyle(celula);
        const visivel = estilo.display !== "none" && estilo.visibility !== "hidden";
        const isHiddenAttr = celula.hidden;

        if (visivel && !isHiddenAttr) {
          linhaAOA.push(celula.innerText.trim());
        }
      });

      // Adiciona apenas se houver conteúdo visível na linha
      if (linhaAOA.length > 0) {
        aoa.push(linhaAOA);
      }
    });

    return aoa;
  };

  let dadosCombinados = [];

  if (id1) {
    const tabela1 = document.getElementById(id1);
    const dados1 = tabelaParaAOA(tabela1);
    dadosCombinados = [...dados1];
  }

  if (id2) {
    const tabela2 = document.getElementById(id2);
    const dados2 = tabelaParaAOA(tabela2);

    // Garante que ambas as tabelas tenham o mesmo número de linhas
    const maxLinhas = Math.max(dadosCombinados.length, dados2.length);
    for (let i = 0; i < maxLinhas; i++) {
      const linha1 = dadosCombinados[i] || [];
      const linha2 = dados2[i] || [];
      dadosCombinados[i] = [...linha1, ...linha2];
    }
  }

  const wsCombinada = XLSX.utils.aoa_to_sheet(dadosCombinados);
  XLSX.utils.book_append_sheet(wb, wsCombinada, nomeArquivo);

  XLSX.writeFile(wb, nomeArquivo);

  setTimeout(()=>{$('.obsMostrar').css('display', 'none')},100)
};



// const  exportToExcel = async () => {
//   var wb = XLSX.utils.table_to_book(document.getElementById('tabelaDadosConsumo'), {sheet:"Dados"});
//   XLSX.writeFile(wb, 'dados.xlsx');
// }


