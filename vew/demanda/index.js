

usuarioLogado = localStorage.getItem('usuario');
statusLogado = localStorage.getItem('logado');
codigoUsuario = localStorage.getItem('codigoUsuario');
ambiente = localStorage.getItem('ambiente')

let dateRegistration = "____-__-__ __:__"
let totalRegistros = 0
let tagObservacao = ''
let deixaSairCampo = false
let toastAberto = false

if (statusLogado != 0) {

  window.location.href = "../login/login.html"
}

setTimeout(() => { $("#logado").val(codigoUsuario + ' - ' + usuarioLogado + ' - ' + ambiente) }, 300)

$(function () {
  $('.floating.dropdown')
    .dropdown();

  $("#salvarPrevisao").addClass("disabled")
  $("#baixaExcel").addClass("disabled")
  $.datetimepicker.setLocale('pt')

  document.querySelector('#tabelaDemandas').addEventListener('keydown', function (e) {
    const target = e.target;
    if (target.tagName === 'TD') {
      const currentCell = target;
      const currentRow = currentCell.parentElement;
      const colIndex = Array.from(currentRow.children).indexOf(currentCell);

      if (e.key === 'ArrowUp') {
        const prevRow = currentRow.previousElementSibling;
        if (prevRow) {
          const targetCell = prevRow.children[colIndex];
          setTimeout(() => {
            targetCell.focus();
            positionCursor(targetCell);
          }, 10);
          e.preventDefault();
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        const nextRow = currentRow.nextElementSibling;
        if (nextRow) {
          const targetCell = nextRow.children[colIndex];
          setTimeout(() => {
            targetCell.focus();
            positionCursor(targetCell);
          }, 10);
          e.preventDefault();
        }
      }
    }
  });


})

function positionCursor(cell) {
  // Se for um input ou textarea
  if (cell.querySelector('input, textarea')) {
    const input = cell.querySelector('input, textarea');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  // Se for contenteditable
  if (cell.isContentEditable) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(cell);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}


/**
 * Formato de calendario com horas (2023-09-09 00:00:00).
 */
$(function () {

  $("#datepicker, #data_entrada, #data_saida").datetimepicker({
    format: 'Y-m-d H:i',
    lang: 'pt-BR',
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    nextText: 'Próximo',
    prevText: 'Anterior',
    mask: '9999-99-99 99:99',
    onClose: function () {
      try {
        $(this).valid();
      }
      catch (e) {
      }
    }
  })

})



const dadosDemanda = async () => {


  if ($('#datepicker').val() == "____-__-__ __:__" || $('#datepicker').val() == undefined) {

    const data = new Date();
    const dia = ("0" + data.getDate()).slice(-2);  // Adiciona 0 à esquerda, se necessário
    const mes = ("0" + (data.getMonth() + 1)).slice(-2);  // Meses começam de 0, então adiciona 1
    const ano = data.getFullYear();
    const dataFormatada = `${ano}-${mes}-${dia}`;

    dateRegistration = dataFormatada

    //sessionStorage.setItem("dateRegistration", dataFormatada)
  } else {

    dateRegistration = $('#datepicker').val()
    //.setItem("dateRegistration", $('#datepicker').val())

  }


  const codAgc = $('#search-codagc').val()

  const demanda = new servicoDemanda();

  const dados = await demanda.mostrarDemanda(dateRegistration, codAgc)

  return dados
}


const FiltrarDemandas = async (colunaOrdenada) => {
  $('.iconBlu').hide()
  setTimeout(() => {
    $('.dadosDemandas').html(`<div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
    <i class="sync alternate icon huge sync-icon"></i></div>`)
  }, 50)




  dadosDemanda().then((demandas) => {
    totalRegistros = 0
    let retornoDemandas = JSON.parse(demandas)

    colunaOrdenada == 'CODIGO' ? retornoDemandas.sort((a, b) => a.CODIGO - b.CODIGO) : ''
    // colunaOrdenada == 'CURVAABC' ? retornoDemandas.sort((a, b) => a.CURVA - b.CURVA) : ''
    colunaOrdenada == 'CURVAABC' ? retornoDemandas.sort((a, b) => {
      const codA = (a.CURVA || '').toString()
      const codB = (b.CURVA || '').toString()
      return codA.localeCompare(codB)
    }) : ''
    colunaOrdenada == 'COMERCIAL' ? retornoDemandas.sort((a, b) => {
      const codA = (a.COMERCIAL || '').toString()
      const codB = (b.COMERCIAL || '').toString()
      return codA.localeCompare(codB)
    }) : ''

    if (colunaOrdenada === 'DIF4MESES') {
      retornoDemandas.sort((a, b) => {
        // Cálculo de dif4Meses para 'a'
        const qtdMesesA = parseOrZero(a.USU_MESCON);
        const somaMesesA = [a.MES1, a.MES2, a.MES3, a.MES4, a.MES5, a.MES6]
          .slice(-qtdMesesA)
          .reduce((acc, mes) => acc + parseOrZero(mes), 0);
        const qtdMediaA = qtdMesesA > 0 ? somaMesesA / qtdMesesA : 0;
        const fatProjetadoA = parseInt(a.USU_QTDDEM) || (qtdMesesA > 0 ? somaMesesA / qtdMesesA : 0);
        const dif4MesesA = qtdMediaA ? (fatProjetadoA / qtdMediaA) * 100 : 0;

        // Cálculo de dif4Meses para 'b'
        const qtdMesesB = parseOrZero(b.USU_MESCON);
        const somaMesesB = [b.MES1, b.MES2, b.MES3, b.MES4, b.MES5, b.MES6]
          .slice(-qtdMesesB)
          .reduce((acc, mes) => acc + parseOrZero(mes), 0);
        const qtdMediaB = qtdMesesB > 0 ? somaMesesB / qtdMesesB : 0;
        const fatProjetadoB = parseInt(b.USU_QTDDEM) || (qtdMesesB > 0 ? somaMesesB / qtdMesesB : 0);
        const dif4MesesB = qtdMediaB ? (fatProjetadoB / qtdMediaB) * 100 : 0;

        return dif4MesesA - dif4MesesB;
      });
    }


    if (colunaOrdenada === 'DIF2MESES') {
      retornoDemandas.sort((a, b) => {
        // Cálculo de dif2Meses para 'a'
        const somaMesesA = parseOrZero(a.MES5) + parseOrZero(a.MES6);
        const media2MA = somaMesesA / 2;
        const fatProjetadoA = parseInt(a.USU_QTDDEM) || (media2MA > 0 ? media2MA : 0);
        const dif2MesesA = media2MA ? (fatProjetadoA / media2MA) * 100 : 0;

        // Cálculo de dif2Meses para 'b'
        const somaMesesB = parseOrZero(b.MES5) + parseOrZero(b.MES6);
        const media2MB = somaMesesB / 2;
        const fatProjetadoB = parseInt(b.USU_QTDDEM) || (media2MB > 0 ? media2MB : 0);
        const dif2MesesB = media2MB ? (fatProjetadoB / media2MB) * 100 : 0;

        return dif2MesesA - dif2MesesB;
      });
    }



    const HtmlTable = retornoDemandas.map((demandas, indice) => {

      /*
       * leitura dos meses retroativos
       */

      let mesesAnteriores = [];

      for (let i = 7; i >= 0; i--) {
        let dataTemp = new Date(dateRegistration);
        dataTemp.setMonth(dataTemp.getMonth() - i, 1); // Ajusta para o primeiro dia do mês
        let ano = dataTemp.getFullYear();
        let mes = String(dataTemp.getMonth() + 1).padStart(2, '0'); // Garante 2 dígitos
        mesesAnteriores.push(`${ano}/${mes}`);
      }


      $('.anoMes1').text(mesesAnteriores[1]);
      $('.anoMes2').text(mesesAnteriores[2]);
      $('.anoMes3').text(mesesAnteriores[3]);
      $('.anoMes4').text(mesesAnteriores[4]);
      $('.anoMes5').text(mesesAnteriores[5]);
      $('.anoMes6').text(mesesAnteriores[6]);
      $('.anoMes7').text(mesesAnteriores[7]);

      const qtdMesesFat = parseOrZero(demandas.USU_MESFAT);
      const mesesFat = [demandas.MES1_FAT, demandas.MES2_FAT, demandas.MES3_FAT, demandas.MES4_FAT, demandas.MES5_FAT, demandas.MES6_FAT]
      const somaMeseFat = mesesFat.slice(-qtdMesesFat).reduce((acc, mes) => acc + parseOrZero(mes), 0)

      const fatMedioMes = qtdMesesFat > 0 ? somaMeseFat / qtdMesesFat : 0


      const qtdMeses = parseOrZero(demandas.USU_MESCON);
      const meses = [demandas.MES1, demandas.MES2, demandas.MES3, demandas.MES4, demandas.MES5, demandas.MES6]
      const somaMeses = meses.slice(-qtdMeses).reduce((acc, mes) => acc + parseOrZero(mes), 0)


      //(FEV_2025 + JAN_2025 + DEZ_2024 + NOV_2024) / USU_MESCON
      const fatProjetado = parseInt(demandas.USU_QTDDEM) ? parseInt(demandas.USU_QTDDEM) : parseInt(qtdMeses) > 0 ? parseInt(somaMeses) / parseInt(qtdMeses) : 0

      //(FEV_2025 + JAN_2025 + DEZ_2024 + NOV_2024) / USU_MESCON
      const qtdMedia = qtdMeses > 0 ? somaMeses / qtdMeses : 0

      const media2M = (
        parseOrZero(demandas.MES5) +
        parseOrZero(demandas.MES6)
      ) / 2

      // Projetando um mes anterior
      const umMesProj = [demandas.MES5, demandas.MES4, demandas.MES3, demandas.MES2, demandas.MES1];
      const somaumMesProj = umMesProj.slice(0, qtdMeses).reduce((acc, mes) => acc + parseOrZero(mes), 0);
      const qtdMesAntProj = demandas.QTDDEMPROJ ? demandas.QTDDEMPROJ : qtdMeses > 0 ? somaumMesProj / qtdMeses : 0;

      // Projetando Dois mes anterior
      const doisMesProj = [demandas.MES4, demandas.MES3, demandas.MES2, demandas.MES1];
      const somauDoisMesProj = doisMesProj.slice(0, qtdMeses).reduce((acc, mes) => acc + parseOrZero(mes), 0);
      const qtdDoisMesAntProj = demandas.QTDDEMPROJANT ? demandas.QTDDEMPROJANT : qtdMeses > 0 ? somauDoisMesProj / qtdMeses : 0;

      const dif4Meses = qtdMedia ? (parseInt(fatProjetado) / parseInt(qtdMedia)) * 100 : 0


      const dif2Meses = media2M ? (parseInt(fatProjetado) / parseInt(media2M)) * 100 : 0


      /*
      * deixar em vermelho a quantidade de estoque e a celula alterada
      */

      const corCelula = parseInt(demandas.USU_QTDDEM) >= 0 ? ` background-color: #c6efcb !important;` : ``

      const corTextoEstoqueMes1 = parseOrZero(((parseInt(demandas.POSMES1) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``
      const corTextoEstoqueMes2 = parseOrZero(((parseInt(demandas.POSMES2) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``
      const corTextoEstoqueMes3 = parseOrZero(((parseInt(demandas.POSMES3) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``
      const corTextoEstoqueMes4 = parseOrZero(((parseInt(demandas.POSMES4) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``
      const corTextoEstoqueMes5 = parseOrZero(((parseInt(demandas.POSMES5) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``
      const corTextoEstoqueMes6 = parseOrZero(((parseInt(demandas.POSMES6) / parseInt(fatProjetado) || 1) * 100)) < parseInt(demandas.USU_PERRUP) ? ` color: red; ` : ``

      /*
      * Calculo da coluna Meses de estoque
      */
      const mesesDeEstoque = (parseInt(demandas.ESTOQUE) + parseInt(parseOrZero(demandas.ORDENS))) / parseInt(fatProjetado)

      /*
       * Verificar se ta fechaddo ou aberto para bloquear celula
       */
      let contenteditable = String(demandas.USU_ANDFEC).trim() === 'F' ? false : true

      if (contenteditable === false) {
        setTimeout(() => {
          $("#salvarPrevisao").addClass("disabled")
          $(`#tooltip${demandas.CODIGO}`).addClass("disabled")
        }, 500)
      } else {
        $("#salvarPrevisao").removeClass("disabled")
        $(`#tooltip${demandas.CODIGO}`).removeClass("disabled")

      }

      console.log('Dirceu',demandas.DERIVACAO)

      if (demandas.CODIGO != null) {


        return `<tr  id="dataTr">
                   <td style="text-align: center;" id="selectedId" title="${demandas.CODIGO}" >${demandas.CODIGO}</td>
                   <td   style=" text-align: center;" class="single line" id="selectedComercial" >${demandas.COMERCIAL}</td>
                   <td   style=" text-align: center;"  class="single line" id="selectedLancamento" title="${demandas.LANCAMENTO}" >${demandas.LANCAMENTO ? demandas.LANCAMENTO : ''}</td>
                   <td    class="single line" id="selectedDemanda">${demandas.DEMANDA ? demandas.DEMANDA : '0'}</td>
                   <td   id="ellipsed" style="max-width: 300px; "  class="single line ellipsed" title="${demandas.DESCRICAO}">${demandas.DESCRICAO} </td>
                   <td   style="width:0px; text-align: center; "  class="single line" title="${demandas.CURVA}">${demandas.CURVA ? demandas.CURVA : ''} </td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes1}"  class="single line">${demandas.MES1 ? parseInt(demandas.MES1).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes2}"  class="single line">${demandas.MES2 ? parseInt(demandas.MES2).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes3}"  class="single line">${demandas.MES3 ? parseInt(demandas.MES3).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes4}"  class="single line">${demandas.MES4 ? parseInt(demandas.MES4).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes5}"  class="single line">${demandas.MES5 ? parseInt(demandas.MES5).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center; ${corTextoEstoqueMes6}"  class="single line">${demandas.MES6 ? parseInt(demandas.MES6).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line ">${fatMedioMes.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                   <td   onBlur="salvarDemandas(1,'.campoEditado${demandas.CODIGO}', '.campoSetadodif4Meses${demandas.CODIGO}','.campoSetadodif2Meses${demandas.CODIGO}','${demandas.CODIGO}','${demandas.DERIVACAO}', this, '${demandas.USU_OBSALT}', ${demandas.ESTOQUE ? demandas.ESTOQUE : 0}, '#usuobsalt${demandas.CODIGO}', ${parseInt(fatProjetado) ? parseInt(fatProjetado) : 0}, ${qtdMedia || 0}, ${media2M ? media2M : 0}, ${parseInt(fatProjetado) || 0}, ${demandas.ORDENS},  '.campoMesesEstoque${demandas.CODIGO}') "  style=" color: #000; text-align: center; ${corCelula}"  contenteditable="${contenteditable}" class="single line editable campoEditado${demandas.CODIGO}">${parseInt(fatProjetado)}</td>
                   <td   style=" text-align: center;  class="single line " ><span id="usuobsalt${demandas.CODIGO}" style="display:none;" >${demandas.USU_OBSALT ? demandas.USU_OBSALT : ' '}</span>
                    <div id="tooltip${demandas.CODIGO}" onclick="openModalObservacao('${demandas.USU_OBSALT}', 'usuobsalt${demandas.CODIGO}', '${demandas.DESCRICAO}','.campoEditado${demandas.CODIGO}')" data-tooltip="${demandas.USU_OBSALT ? demandas.USU_OBSALT : ''}" data-position="right center" style=" margin-top:0px; " class="ui icon button tooltip " >
                          <i id="focusObs" class="edit mini icon" ></i>
                    </div>
                   </td>
                   <td   style=" text-align: center;"  class="single line">${demandas.MES7 ? parseInt(demandas.MES7).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line">${parseInt(qtdMedia).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                   <td   style=" text-align: center;"  class="single line">${parseInt(media2M).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                   <td   style=" text-align: center;"  class="single line">${demandas.ESTOQUE ? parseInt(demandas.ESTOQUE).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line">${qtdMesAntProj ? parseInt(qtdMesAntProj).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line">${qtdDoisMesAntProj ? qtdDoisMesAntProj.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line campoSetadodif4Meses${demandas.CODIGO}">${dif4Meses ? dif4Meses.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line campoSetadodif2Meses${demandas.CODIGO}">${dif2Meses ? dif2Meses.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : '0'}</td>
                   <td   style=" text-align: center;"  class="single line campoMesesEstoque${demandas.CODIGO}">${mesesDeEstoque ? mesesDeEstoque.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '0'}</td>
                   <td   style=" text-align: center; display: none;"  class="single line">${parseInt(fatProjetado)}</td>
                   <td   style=" text-align: center; display: none;"  class="single line">${demandas.DERIVACAO}</td>
                </tr>`


      }


    })


    $('.dadosDemandas').html(HtmlTable)

    $('.iconBlu').hide()
    $("#baixaExcel").removeClass("disabled")
    const codAgc = $('#search-codagc').val()
    const produto = $('#search-id').val()
    const lancamento = $('#search-lancamento').val()
    const demanda = $('#search-demanda').val()

    console.log('Dirceu',codAgc,lancamento,demanda,produto)
    if(codAgc == '' && lancamento == '' && demanda == '' && produto == '') {
      $('#salvarPrevisao').removeClass('disabled')
      } else {
        $('#salvarPrevisao').addClass('disabled')
      }

    totalRegistros = $('#tabelaDemandas tbody tr').length;

    $('#totalRegistros').text(totalRegistros);

    setTimeout(() => {
      myFunctionSearch('#search-id', '#selectedId', '#search-lancamento', '#selectedLancamento', '#search-demanda', '#selectedDemanda', '.dadosDemandas', '#dataTr')

    }, 200)


  })
}


/*
* Enviar para o Oracle
*/
const salvarDemandas = (porLinha, celula, celulaDif4Meses, celulaDif2Meses, codigo, derivacao, projetado, observacao, estoque, valorObs, quantidadeDemanda, qtdmedia4Meses, qtdmedia2Meses, projetadoAnterior, ordens, celulaMesesEstoque) => {


  let dadosDemandaProjetado = []; // Inicializa um array vazio para armazenar os dados

  if (porLinha !== 1) {

    let linha = {}

    $('#tabelaDemandas tbody tr').each(function () {
      linha = {
        CODIGO: $(this).find("td:visible:eq(0)").text(),
        COMERCIAL: $(this).find("td:visible:eq(1)").text(),
        LANCAMENTO: $(this).find("td:visible:eq(2)").text(),
        DEMANDA: $(this).find("td:visible:eq(3)").text(),
        DESCRICAO: $(this).find("td:visible:eq(4)").text(),
        CURVA: $(this).find("td:visible:eq(5)").text(),
        MES1: $(this).find("td:visible:eq(6)").text(),
        MES2: $(this).find("td:visible:eq(7)").text(),
        MES3: $(this).find("td:visible:eq(8)").text(),
        MES4: $(this).find("td:visible:eq(9)").text(),
        MES5: $(this).find("td:visible:eq(10)").text(),
        MES6: $(this).find("td:visible:eq(11)").text(),
        FAT_MED: $(this).find("td:visible:eq(12)").text(),
        PROJETADO: $(this).find("td:visible:eq(13)").text(),
        OBSERVACAO: $(this).find("td:visible:eq(14)").text(),
        MES7: $(this).find("td:visible:eq(16)").text(),
        QTDMEDIA: $(this).find("td:visible:eq(17)").text(),
        MEDIA2M: $(this).find("td:visible:eq(18)").text(),
        ESTOQUE: $(this).find("td:visible:eq(19)").text(),
        QTDDEM: $(this).find("td:eq(24)").text(),
        USU_ANDFEC: 'F',
        DERIVACAO: $(this).find("td:eq(25)").text()

      };
      dadosDemandaProjetado.push(linha);
    });


  }

  const tamanhoObservacao = $(valorObs).text().length


  let dadosDemandaProjetadoPorLinha = []


  if (porLinha == 1) {

    deixaSairCampo == false

    const projetadoAlterado = projetado.innerText.trim().replace(/\D/g, "");
    const projetadoAnteriorF = projetadoAnterior.toString().trim().replace(/\D/g, "");

    if (tamanhoObservacao < 3 && (parseInt(projetadoAnteriorF).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) !== parseInt(projetadoAlterado).toLocaleString("pt-BR", { maximumFractionDigits: 0 }))) {

      let cell = $(celula); // Captura a célula ativa
      let text = cell.text().trim(); // Obtém o texto da célula
      if (!deixaSairCampo) {
        $(celula).focus()

      }


      if (!toastAberto && text !== '') {
        toastAberto = true; // evita que o toast apareça de novo

        $.toast({
          heading: 'Alerta',
          text: 'O campo observação é obrigatório!',
          showHideTransition: 'plain',
          icon: 'error',
          stack: false,
          background: 'red !important',
          color: '#fff !important',
          loaderBg: '#fff !important',
          textAlign: 'left',
          hideAfter: 1000,
          position: {
            left: cell.offset().left + cell.outerWidth() + 40,
            top: cell.offset().top - 3
          }
        })
      }


      setTimeout(() => {
        let cell = document.querySelector(celula)
        cell.setAttribute("tabindex", "0");;
        $(cell).removeClass('green')
        $(cell).addClass('red')
        $('.tooltip').removeClass('disabled');
        //$(celula).focus()
      }, 500);



      return

    } else {


      $(celula).removeClass('red')
      $(celula).addClass('green')

      observacao = $(valorObs).text()

      const qtdDem = quantidadeDemanda !== undefined ? quantidadeDemanda : 0

      const projetadoAlterado = projetado.innerText.trim();

      dadosDemandaProjetadoPorLinha = [{ CODIGO: codigo, DERIVACAO: derivacao, PROJETADO: projetadoAlterado, OBSERVACAO: observacao, ESTOQUE: estoque, QTDDEM: qtdDem, USU_ANDFEC: 'A' }]

      const dif4Meses = parseInt(qtdmedia4Meses) ? ((parseInt(projetadoAlterado) / parseInt(qtdmedia4Meses)) * 100) : 0

      const dif2Meses = parseInt(qtdmedia2Meses) ? ((parseInt(projetadoAlterado) / parseInt(qtdmedia2Meses)) * 100) : 0

      const mesesEstoque = (parseInt(parseOrZero(estoque)) + parseInt(parseOrZero(ordens))) / (parseInt(projetadoAlterado) ? parseInt(parseOrZero(projetadoAlterado)) : 1)

      $(celulaDif4Meses).html(dif4Meses.toLocaleString("pt-BR", { maximumFractionDigits: 0 }))
      $(celulaDif2Meses).html(dif2Meses.toLocaleString("pt-BR", { maximumFractionDigits: 0 }))
      $(celulaMesesEstoque).html(mesesEstoque.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))


      //return

    }

  }

  const bloqParam = porLinha == 0 ? 'bloquear' : 'OK'

  const dadosDemandaPorLinha = porLinha == 1 ? dadosDemandaProjetadoPorLinha : dadosDemandaProjetado

  const demandas = new servicoDemanda()


  const resultado = demandas.salvarDemanda(dadosDemandaPorLinha, codigoUsuario, bloqParam)

  const ObjectDemandas = async () => {

    return resultado
  }

  if (porLinha != 1) {

    ObjectDemandas().then((retorno) => {

      const retornoDados = [retorno]

      $('.ui.modal').appendTo('body').modal('show');

      $('#modalSalvar').modal({
        escapeClose: false,
        clickClose: false,
        showClose: false,
        closeClass: 'icon-remove',
        observeChanges: true,
        autofocus: false
      })

      $('.cliqueAqui').hide()
      $('.retornoModalSalvar').html(retornoDados[0].retorno)


      if (retornoDados[0].status === 0) {

        setTimeout(() => { FiltrarDemandas('') }, 0)

        setTimeout(() => {
          $(".overlay").hide()
          $(".modal").hide()
          $(".jquery-modal.blocker").remove()
        }, 2000)


      } else {

        setTimeout(() => {
          $(".overlay").hide()
          $(".modal").hide()
          $(".jquery-modal.blocker").remove()
        }, 2000)
        return

      }

      $('#modalSalvar').draggable({ containment: "window" })

    })
  }


}

const openModalObservacao = (valor, tag, descricao, campoEditado) => {

  deixaSairCampo = true

  tagObservacao = tag

  $("#observacao").addClass(tag);

  $('#codigoObs').html(tag.slice(9) + ' - ' + descricao)

  const valorObs = $('#' + tag).text()

  $("#retorno").hide();

  $(".ui.icon.button").popup();

  if (valorObs == '') {

    $('.' + tag).val(valor)

  } else {
    $('.' + tag).val(valorObs)

  }

  $('.ui.modal').appendTo('body').modal('show');

  $('#modalObsevacao').modal({
    escapeClose: true,
    clickClose: true,
    showClose: true,
    closeClass: 'icon-remove',
    observeChanges: true,
    autofocus: true
  })

  $('#modalObsevacao').draggable({ containment: "window" })


}


/*
* Salvar a observação na variavel.
*/
const salvarObservacao = (codigo) => {

  const celulaSetada = '.campoEditado' + codigo.slice(0, 12).replace(/\D/g, '')

  const idToolTip = codigo.slice(0, 12).replace(/\D/g, '')

  const obs = $('.' + tagObservacao).val()

  const tooltipPopup = $('#tooltip' + idToolTip);

  tooltipPopup
    .attr('data-tooltip', obs)
    .popup('destroy')
    .popup()


  $('#tabelaDemandas tbody tr #' + tagObservacao).text(obs)


  $(this).attr(".data-tooltip", obs);
  $('.' + tagObservacao).html(obs)
  $("#retorno").show()
  $("#retorno").fadeOut(1000)

  setTimeout(() => {
    $(".overlay").hide();
    $(".modal").hide();
    $(".jquery-modal.blocker").remove();
  }, 500)



  setTimeout(() => {
    let cell = document.querySelector(celulaSetada);
    if (cell) {
      cell.focus()
      cell.setAttribute("tabindex", "0")
      cell.click()
    }
    deixaSairCampo = false
    toastAberto = false
  }, 300)




}



/*
* Validar valor NaN
*/
const parseOrZero = (valor) => {
  return isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);
}


/*
* Modal de conformação da ação antes de confirmar
*/

const modalTemCerteza = () => {

  $('.ui.modal').appendTo('body').modal('show');

  $('#modalAlertTemCerteza').modal({
    escapeClose: true,
    clickClose: true,
    showClose: true,
    closeClass: 'icon-remove',
    observeChanges: true,
    autofocus: true
  })


  $('#modalAlertTemCerteza').draggable({ containment: "window" })

  // Abrir o modal quando o botão for clicado
  $('#openModalBtnFinalizar').click(function () {
    salvarDemandas(0)
  });

  $('#btnFechar').click(function () {
    $(".overlay").hide();
    $(".modal").hide();
    $(".jquery-modal.blocker").remove();

    // Remover explicitamente o overlay
    $('.ui.modal').removeClass('visible active'); // Garante que o modal e o fundo escuro desapareçam
    $('.ui.dimmer').removeClass('active');  // Remove a classe do fundo escuro
  });

}

