usuarioLogado = localStorage.getItem('usuario')
statusLogado = localStorage.getItem('logado')
codigoUsuario = localStorage.getItem('codigoUsuario')
ambiente = localStorage.getItem('ambiente')
let tagObservacao = ''
let deixaSairCampo = false
let toastAberto = false
// $(document).ready(function() {
//   // Inicializando o tooltip com o Semantic UI
//   $('.tooltip').popup({
//     position: 'top center', // Ajuste a posição se necessário
//     hoverable: true,        // Torna o tooltip visível enquanto o mouse passa por cima
//     on: 'hover'             // O tooltip aparece quando o mouse passa sobre o botão
//   });
// });

$(function () {
  $('.ui.dropdown').dropdown()
  $('.ui.accordion').accordion()
  $('#botaoExcel').addClass('disabled')
  $('#salvarConsumo').addClass('disabled')
  $.datetimepicker.setLocale('pt')


  document.querySelector('#tabelaDadosConsumo2').addEventListener('keydown', function (e) {
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

      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Tab') {
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
  $("#datepicker, #data_entrada, #data_saida").datetimepicker({
    format: 'd/m/Y',
    lang: 'pt-BR',
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    nextText: 'Próximo',
    prevText: 'Anterior',
    mask: '99/99/9999',
    onClose: function () {
      try {
        $(this).valid();
      }
      catch (e) {
      }
    }
  })

})

if (statusLogado != 0) {

  window.location.href = "../login/login.html"
}

setTimeout(() => { $("#logado").val(codigoUsuario + ' - ' + usuarioLogado + ' - ' + ambiente) }, 300)


/*
* Data atual
*/
const hoje = new Date();
const dia = String(hoje.getDate()).padStart(2, '0')
const mes = String(hoje.getMonth() + 1).padStart(2, '0') // Mês começa em 0
const ano = hoje.getFullYear()
const dataAtualFormatada = `${mes}/${ano}`

/*
* Função que pega a data atual e adicina mais um mes
*/

const adicionarMeses = (dataMMYYYY, quantidadeMeses) => {
  const [mesStr, anoStr] = dataMMYYYY.split('/')
  const mesAtual = parseInt(mesStr) - 1 // JavaScript começa o mês em 0
  const anoAtual = parseInt(anoStr)

  const novaData = new Date(anoAtual, mesAtual + quantidadeMeses, 1)

  const novoMes = String(novaData.getMonth() + 1).padStart(2, '0')
  const novoAno = novaData.getFullYear()

  return `${novoMes}/${novoAno}`
}


/*
* Validações de parametros antes de liberar tela
*/

const parametros = async () => {

  const parametrosConsumo = new servicoParametro()
  const dados = await parametrosConsumo.mostrarParametroConsumo()

  return dados

}

parametros().then((param) => {

  let dadosParametrosConsumo = JSON.parse(param)

  // Grava no localStorage
  localStorage.setItem('dadosParametrosConsumolocalStorage', JSON.stringify(dadosParametrosConsumo));


  if (dataAtualFormatada !== dadosParametrosConsumo[0].USU_DATGER) {

    $('.printButton').addClass('disabled')

    $.toast({
      heading: '',
      text: ` Antes de acessar a tela de planejamento das demandas, é necessário informar os parâmetros que serão utilizados para o planejamento do Consumo!
              <br><br>
              <a href="../../vew/parametros/index.html" style="
                padding: 6px 14px;
                background: #fff;
                color: red;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
              "><i class="thumbs up icon"></i> OK</a>`,
      showHideTransition: 'plain',
      icon: 'error',
      stack: false,
      background: 'red !important',
      color: '#fff !important',
      loaderBg: '#fff !important',
      textAlign: 'left',
      hideAfter: false,
      position: 'top-center'
    })

  }

})

/*
* Rolar as tables juntar no scroll
*/

document.addEventListener('DOMContentLoaded', function () {
  const leftScroll = document.querySelector('.left-scroll');
  const rightScroll = document.querySelector('.right-scroll');

  let isSyncingLeftScroll = false;
  let isSyncingRightScroll = false;

  leftScroll.addEventListener('scroll', () => {
    if (!isSyncingLeftScroll) {
      isSyncingRightScroll = true;
      rightScroll.scrollTop = leftScroll.scrollTop;
    }
    isSyncingLeftScroll = false;
  });

  rightScroll.addEventListener('scroll', () => {
    if (!isSyncingRightScroll) {
      isSyncingLeftScroll = true;
      leftScroll.scrollTop = rightScroll.scrollTop;
    }
    isSyncingRightScroll = false;
  })
})


const mostrarVersoes = async (datepicker) => {

  const consumo = new servicoConsumo()

  const dados = await consumo.mostrarVersoes(datepicker)

  return dados
}



const dadosConsumo = async (datepicker, versaoConsumo, codAgc) => {

  const consumo = new servicoConsumo()

  const dados = await consumo.mostrarConsumo(datepicker, versaoConsumo, codAgc)

  return dados
}

const filtrarVersoes = async () => {

  const datepicker = $('#datepicker').val()

  await mostrarVersoes(datepicker).then((versao) => {

    const retornoVersoes = JSON.parse(versao)

    const qtdDados = retornoVersoes.length

    let htmlOptionVersoes = `<option value="0" >Nenhum encontrado</option>`

    if (qtdDados > 0) {

      htmlOptionVersoes = retornoVersoes.map((v) => { return `<option value="${v.USU_SEQCONS}" >${'<font color="#2185D0"><b>' + v.USU_SEQCONS.trim() + '</b></font>' + ' <i class="arrows alternate horizontal icon"></i>' + v.USU_DESCON.trim() + ' <i class="arrows alternate horizontal icon"></i>' + (v.USU_ANDFEC == 'A' ? '<i class="lock open icon blue"></i>' : '<i class="lock icon blue"></i>')}</option>` })

    }

    $('#selectFiltroVersoes').html(htmlOptionVersoes)


  })



}

const filtrarConsumo = async (coluna) => {

  const datepicker = $('#datepicker').val()

  const versaoConsumo = $('#selectFiltroVersoes').val()

  localStorage.setItem('versaoConsumo', versaoConsumo);

  const codAgc = $('#search-codagc').val()

  if (datepicker == '__/__/____') {
    $('.datepicker').show()
    return

  } else {
    $('.datepicker').hide()
  }

  /*
  *  Ocultar html em Geral
  */
  $('.iconBlu').hide()
  $('.novo').hide()
  $('#botaoExcluir').addClass('disabled')
  $('.botaoNovo').addClass('disabled')

  if (versaoConsumo == '0' || datepicker == '') {
    $('.tbodyDadosConsumo1').html('')
    $('.tbodyDadosConsumo2').html('')
    $('.tbodyDadosCabecalho1').html('')
    $('.tbodyDadosCabecalho2').html('')
    $('.iconBlu').show()
    $('#botaoExcel').addClass('disabled')
    $('#salvarConsumo').addClass('disabled')
    $('#totalRegistros').text('0')
    $('.botaoNovo').removeClass('disabled')
   


    return

  }

  setTimeout(() => {
    $('.tbodyDadosConsumo1').html(`<div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
    <i class="sync alternate icon huge sync-icon"></i></div>`)
    $('.tbodyDadosConsumo2').html(`<div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
      <i class="sync alternate icon huge sync-icon"></i></div>`)
  }, 50)


  dadosConsumo(datepicker, versaoConsumo, codAgc).then((itens) => {


    let retornoConsumo = JSON.parse(itens)

    const itemCabecalho = retornoConsumo[0]


    /*--------------------Ordenar Colunas------------*/

    coluna == 'CODIGO' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.CODIGO }, 'desc') : ''
    coluna == 'COMERCIAL' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.COMERCIAL }, 'desc') : ''
    coluna == 'DEMANDA' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.DEMANDA }, 'desc') : ''
    coluna == 'DESCRICAO' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.DESCRICAO }, 'desc') : ''
    coluna == 'PROJETADO' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.PROJETADO == null ? 0 : parseInt(dado.PROJETADO)  }, 'desc') : ''
    coluna == 'QTDCO0' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.QTDCO0 ? parseInt(parseOrZero(dado.QTDCO0)) : 0 }, 'desc') : ''
    coluna == 'QTDOC0' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.QTDOC0G ? parseInt(parseOrZero(dado.QTDOC0G)) : parseInt(parseOrZero(dado.QTDOC0))}, 'desc') : ''
    coluna == 'QTDCO1' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.QTDCO1G !== '' ? parseInt(parseOrZero(dado.QTDCO1G)) : (parseInt(parseOrZero(dado.QTDCO0)) + parseInt(parseOrZero(dado.QTDOC0))) - (parseInt(parseOrZero(dado.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP0))}, 'desc') : ''
    coluna == 'QTDOC1' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.QTDOC1G ? parseInt(dado.QTDOC1G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(dado.QTDOC1))}, 'desc') : ''
    coluna == 'QTDCO2' ?  ordenarColunas(retornoConsumo, (dado) => { return dado.QTDCO2G !== '' ? parseInt(parseOrZero(dado.QTDCO2G)) : (parseInt(parseOrZero(dado.QTDCO1G !== '' ? parseInt(parseOrZero(dado.QTDCO1G)) : (parseInt(parseOrZero(dado.QTDCO0)) + parseInt(parseOrZero(dado.QTDOC0))) - (parseInt(parseOrZero(dado.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP0)))) + parseInt(parseOrZero(dado.QTDOC1))) - (parseInt(parseOrZero(dado.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP1)) }, 'desc') : ''
    coluna == 'QTDOC2' ?  ordenarColunas(retornoConsumo, (dado) => { return  dado.QTDOC2G ? parseInt(dado.QTDOC2G) : parseInt(parseOrZero(dado.QTDOC2)) }, 'desc') : ''

    
     
     
     
    


    const markupCalculado = (itemCabecalho.MARKUP0 * (1 - (itemCabecalho.GRAVADO == 'FINALIZADO' ? parseFloat(itemCabecalho.REALIZADO).toFixed(2) : (((itemCabecalho.REALIZADO ? parseFloat(itemCabecalho.REALIZADO) : 0) / parseFloat(itemCabecalho.ORCADO_0)) * 100)) / 100) * 100)

    const dadosRecuperadosParametrosConsumo = JSON.parse(localStorage.getItem('dadosParametrosConsumolocalStorage'))


    const HtmlTableCabecalho1 = itemCabecalho
      ? `<tr>
            <td style="font-weight: bold;" colspan="3"><p>Valor orçado do mês (R$)</p></td>
            <td  style="text-align: center;" title="" ></td>
          </tr>
          <tr>
            <td style="font-weight: bold;" colspan="3" >Realizado do mês (%)</td>
            <td style="text-align: center;" ></td>
          </tr>
          <tr>
            <td style="font-weight: bold;" colspan="3" >Markap informado na tela de parâmetros (%)</td>
            <td style="text-align: center;" ></td>

          </tr>
          <tr>
            <td style="font-weight: bold;" colspan="3" >Markap calculado (%)</td>
            <td style="text-align: center;" ></td>
          </tr>`
      : '';


    const HtmlTableCabecalho2 = itemCabecalho ?

      `<tr>
            <td style="text-align: center; width:5.26%;" >${itemCabecalho.ORCADO_0 ? parseInt(itemCabecalho.ORCADO_0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;">${itemCabecalho.ORCADO_1 ? parseInt(itemCabecalho.ORCADO_1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" >${itemCabecalho.ORCADO_2 ? parseInt(itemCabecalho.ORCADO_2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" >${itemCabecalho.ORCADO_3 ? parseInt(itemCabecalho.ORCADO_3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;">${itemCabecalho.ORCADO_4 ? parseInt(itemCabecalho.ORCADO_4).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;">${itemCabecalho.ORCADO_5 ? parseInt(itemCabecalho.ORCADO_5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>


          </tr>
          <tr>
            <td id="realizadoMes" style="text-align: center; width:5.26%;" > % ${itemCabecalho.GRAVADO == 'FINALIZADO' ? parseFloat(itemCabecalho.REALIZADO).toFixed(2) : (((itemCabecalho.REALIZADO ? parseInt(itemCabecalho.REALIZADO) : 0) / parseInt(itemCabecalho.ORCADO_0)) * 100).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" ></td> 
            <td style="text-align: center; width:5.26%;"></td>         
          </tr>
          <tr>
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(itemCabecalho.MARKUP0).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;"></td> 
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(itemCabecalho.MARKUP1).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" > % ${parseFloat(itemCabecalho.MARKUP2).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(itemCabecalho.MARKUP3).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(itemCabecalho.MARKUP4).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
             <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(itemCabecalho.MARKUP5).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
           
   
        
          </tr>
          <tr>
            <td style="text-align: center; width:5.26%;"> % ${parseFloat(markupCalculado).toFixed(2)}</td>
            <td style="text-align: center; width:5.26%;"></td>           
           <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;" > </td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;"> </td>
            <td style="text-align: center; width:5.26%;" ></td>
            <td style="text-align: center; width:5.26%;"> </td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"> </td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>
            <td style="text-align: center; width:5.26%;"></td>

      
          </tr>` : ''


    const HtmlTableConsumo1 = retornoConsumo.map((itensConsumo) => {


      $('.QTDCO0').html(dataAtualFormatada +`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 0,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC0').html('OC - ' + dataAtualFormatada +`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 1,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDCO1').html(adicionarMeses(dataAtualFormatada, 1)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 2,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC1').html('OC - ' + adicionarMeses(dataAtualFormatada, 1)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 3,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDCO2').html(adicionarMeses(dataAtualFormatada, 2)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 4,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC2').html('OC - ' + adicionarMeses(dataAtualFormatada, 2)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 5,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDCO3').html(adicionarMeses(dataAtualFormatada, 3)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 6,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC3').html('OC - ' + adicionarMeses(dataAtualFormatada, 3)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 7,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDCO4').html(adicionarMeses(dataAtualFormatada, 4)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 8,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC4').html('OC - ' + adicionarMeses(dataAtualFormatada, 4)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 9,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDCO5').html(adicionarMeses(dataAtualFormatada, 5)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 12,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)
      $('.QTDOC5').html('OC - ' + adicionarMeses(dataAtualFormatada, 5)+`<i onclick="ordenarColunaCombinada('tabelaDadosConsumo1','tabelaDadosConsumo2', 13,'B')"  class=" sort icon" style="cursor: pointer;"></i>`)


      if (itensConsumo.CODIGO !== null) {
        return `<tr>
                      <td style="text-align: center;">${itensConsumo.CODIGO}</td>
                      <td style="text-align: center; display: none;">${itensConsumo.DERIVACAO}</td>
                      <td style="text-align: center; display: none;">${itensConsumo.CURVA}</td>
                      <td style="text-align: center; display: none;">${itensConsumo.SITUACAO}</td>
                      <td style="text-align: center;">${itensConsumo.COMERCIAL ? itensConsumo.COMERCIAL : ''}</td>
                      <td>${itensConsumo.DEMANDA}</td>
                      <td title="${itensConsumo.DESCRICAO}" >${itensConsumo.DESCRICAO}</td>
                      <td style="text-align: center;">${itensConsumo.PROJETADO ? parseInt(itensConsumo.PROJETADO) : 0}</td>
                    </tr>`

      }

    })

    const HtmlTableConsumo2 = retornoConsumo.map((itensConsumo) => {

      const qtdco1 = itensConsumo.QTDCO1G !== '' ? parseInt(parseOrZero(itensConsumo.QTDCO1G)) : (parseInt(parseOrZero(itensConsumo.QTDCO0)) + parseInt(parseOrZero(itensConsumo.QTDOC0))) - (parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP0))
      const qtdco2 = itensConsumo.QTDCO2G !== '' ? parseInt(parseOrZero(itensConsumo.QTDCO2G)) : (parseInt(parseOrZero(qtdco1 < 0 ? 0 : qtdco1)) + parseInt(parseOrZero(itensConsumo.QTDOC1))) - (parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP1))
      const qtdco3 = itensConsumo.QTDCO3G !== '' ? parseInt(parseOrZero(itensConsumo.QTDCO3G)) : (parseInt(parseOrZero(qtdco2 < 0 ? 0 : qtdco2)) + parseInt(parseOrZero(itensConsumo.QTDOC2))) - (parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP2))
      const qtdco4 = itensConsumo.QTDCO4G !== '' ? parseInt(parseOrZero(itensConsumo.QTDCO4G)) : (qtdco3 < 0 ? 0 : qtdco3 + parseInt(parseOrZero(itensConsumo.QTDOC3))) - (parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP3))
      const qtdco5 = itensConsumo.QTDCO5G !== '' ? parseInt(parseOrZero(itensConsumo.QTDCO5G)) : (qtdco4 < 0 ? 0 : qtdco4 + parseInt(parseOrZero(itensConsumo.QTDOC4))) - (parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseOrZero(itemCabecalho.MARKUP4))
      const qtdmes = parseOrZero(itensConsumo.QTDMES !== '' ? parseFloat(parseOrZero(itensConsumo.QTDMES)) : qtdco5 < 0 ? 0 : parseFloat(parseOrZero(qtdco5)) / (parseInt(parseOrZero(itensConsumo.PROJETADO)) <= 0 ? 0 : parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseFloat(parseOrZero(itemCabecalho.MARKUP4))) == Infinity ? 0 : qtdco5 < 0 ? 0 : parseFloat(parseOrZero(qtdco5)) / (parseInt(parseOrZero(itensConsumo.PROJETADO)) <= 0 ? 0 : parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseFloat(parseOrZero(itemCabecalho.MARKUP4))))
      const qtdcob = itensConsumo.QTDCOB !== '' ? parseInt(parseOrZero(itensConsumo.QTDCOB)) : parseInt(parseOrZero(itensConsumo.PROJETADO)) <= 0 ? 0 :
        (
          (parseInt(parseOrZero(itensConsumo.QTDCO0)) + parseInt(parseOrZero(itensConsumo.QTDOC0))
            + parseInt(parseOrZero(itensConsumo.QTDOC1)) + parseInt(parseOrZero(itensConsumo.QTDOC2))
            + parseInt(parseOrZero(itensConsumo.QTDOC3)) + parseInt(parseOrZero(itensConsumo.QTDOC4))
            + parseInt(parseOrZero(itensConsumo.QTDOC5))) / (parseInt(parseOrZero(itensConsumo.PROJETADO)))
        )

      //console.log('Valores: ', parseFloat(parseOrZero(itensConsumo.QTDMES)), '-', parseFloat(parseOrZero(qtdco5)), '-', parseInt(parseOrZero(itensConsumo.PROJETADO)), '-', parseFloat(parseOrZero(itemCabecalho.MARKUP4)))

      const qtdoc0 = itensConsumo.QTDOC0G ? parseInt(parseOrZero(itensConsumo.QTDOC0G)) : parseInt(parseOrZero(itensConsumo.QTDOC0))
      const qtdoc1 = itensConsumo.QTDOC1G ? parseInt(itensConsumo.QTDOC1G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC1))
      const qtdoc2 = itensConsumo.QTDOC2G ? parseInt(itensConsumo.QTDOC2G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC2))
      const qtdoc3 = itensConsumo.QTDOC3G ? parseInt(itensConsumo.QTDOC3G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC3))
      const qtdoc4 = itensConsumo.QTDOC4G ? parseInt(itensConsumo.QTDOC4G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC4))
      const qtdoc5 = itensConsumo.QTDOC5G ? parseInt(itensConsumo.QTDOC5G).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC5))
      const qtdco0 = itensConsumo.QTDCO0 ? parseInt(parseOrZero(itensConsumo.QTDCO0)) : 0
      const compra = itensConsumo.QTDCON !== '' ? itensConsumo.QTDCON : ((parseInt(parseOrZero(itensConsumo.PROJETADO)) * parseFloat(parseOrZero(itemCabecalho.MARKUP4))) * (itensConsumo.CURVA == 'A' ? dadosRecuperadosParametrosConsumo[0].USU_MARKU_A : dadosRecuperadosParametrosConsumo[0].USU_MARKU_O)) - (qtdco4 < 0 ? 0 : qtdco4 + parseInt(parseOrZero(itensConsumo.QTDOC4)))

      const corCelula = itensConsumo.GRAVADO == 'OK' ? ` background-color: #c6efcb !important;` : ``

      const bloqueiaObservacao = String(itensConsumo.USU_ANDFEC).trim() === 'F' ? 'disabled' : ''

      /*
       * Verificar se ta fechaddo ou aberto para bloquear celula
       */
      let contentEditable = String(itensConsumo.USU_ANDFEC).trim() === 'F' ? false : true

      /*
       * Verificar se ta fechado ou aberto para bloquear botão Finalizar e excluir
       */
      if (itensConsumo.GRAVADO == 'FINALIZADO') {

        setTimeout(() => { $('#salvarConsumo').addClass('disabled'),    $('#botaoExcluir').addClass('disabled') }, 500)

      } else {
        $('#botaoExcluir').removeClass('disabled') 

      }

      if (contentEditable === false) {
        setTimeout(() => {
          $(`.campoEditado${itensConsumo.CODIGO}`).addClass("disabled")
        }, 500)
      } else {
        $(`.campoEditado${itensConsumo.CODIGO}`).removeClass("disabled")

      }


      if (itensConsumo.CODIGO !== null) {
        return `<tr>
                      <td style="text-align: center; width:5.26%;">${qtdco0.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdoc0.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdco1.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${itensConsumo.QTDOC1G ? parseInt(parseOrZero(itensConsumo.QTDOC1G)).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : parseInt(parseOrZero(itensConsumo.QTDOC1)).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdco2.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdoc2.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdco3.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdoc3.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdco4.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdoc4.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td onClick="apenasNumeros(this)" onBlur="salvarConsumoLinha('OK',
                      '.campoEditado${itensConsumo.CODIGO}',
                      1,
                       '${itensConsumo.CODIGO}',
                       '${itensConsumo.DERIVACAO}',
                       '${itensConsumo.CURVA}',
                       '${itensConsumo.SITUACAO}',
                       ${itensConsumo.PROJETADO},
                       ${qtdoc0.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdoc1.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdoc2.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdoc3.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdoc4.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdoc5.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco0.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco1.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco2.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco3.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco4.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${qtdco5.toLocaleString("pt-BR", { maximumFractionDigits: 0 })},
                       ${parseFloat(qtdmes).toFixed(1)},
                       ${parseFloat(qtdcob).toFixed(1)})"
                        class="campoEditado${itensConsumo.CODIGO}" style="text-align: center; width:5.26%; ${corCelula}" contenteditable="${contentEditable}" >${compra < 0 ? 0 : compra.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                      </td>
                      <td   style=" text-align: center; cursor:pointer;" class="single line " >${itensConsumo.QTD_FOR ? itensConsumo.QTD_FOR : 0}</td>
                      <td style="text-align: center; width:5.26%;">${qtdco5 < 0 ? 0 : qtdco5.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${qtdoc5.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                      <td style="text-align: center; width:5.26%;">${parseFloat(qtdmes).toFixed(1)}</td>
                      <td style="text-align: center; width:5.26%;">${parseFloat(qtdcob).toFixed(1)}</td>
                      <td   style=" text-align: center; cursor:pointer;" class="single line " ><span class="obsMostrar" id="usuobsalt${itensConsumo.CODIGO}" style="display:none;" >${itensConsumo.OBSALT ? itensConsumo.OBSALT : ' '}</span>
                        <div style=" margin:0; padding:0;"  id="tooltip${itensConsumo.CODIGO}" onclick="openModalObservacao('${itensConsumo.OBSALT}', 'usuobsalt${itensConsumo.CODIGO}', '${itensConsumo.DESCRICAO}','.campoEditado${itensConsumo.CODIGO}')"  data-position="left center"  data-tooltip="${itensConsumo.OBSALT ? itensConsumo.OBSALT : ''}"  class="ui mini icon button ${bloqueiaObservacao}"  >
                              <i style=" margin-top:-1px !important; margin-left:2px !important;" id="focusObs" class="edit  outline  icon" ></i>
                        </div>
                     </td>
                    </tr>`

      }

    })

    $('.tbodyDadosConsumo1').html(HtmlTableConsumo1)
    $('.tbodyDadosConsumo2').html(HtmlTableConsumo2)
    $('.tbodyDadosCabecalho1').html(HtmlTableCabecalho1)
    $('.tbodyDadosCabecalho2').html(HtmlTableCabecalho2)

    $('.iconBlu').hide()
    $('#botaoExcel').removeClass('disabled')
    if(codAgc == '') {
    $('#salvarConsumo').removeClass('disabled')
    } else {
      $('#salvarConsumo').addClass('disabled')
    }

    $('.botaoNovo').removeClass('disabled')
    $('#botaoExcluir .text').text('Excluir Versão Selecionada!');
    setTimeout(()=>{versaoConsumo > 0 ? $('.excluirVersao').css('display','block') :  $('.excluirVersao').css('display','none')},0)


    totalRegistros = $('#tabelaDadosConsumo1 tbody tr').length;

    $('#totalRegistros').text(totalRegistros)


  })

}


/*
* Salvar dados do Consumo Total Finalizar
*/

const finalizarConsumo = async () => {

  $('#modalAlertTemCerteza').modal('hide')

  setTimeout(() => { salvarConsumoLinha('T') }, 1000)

  setTimeout(() => { filtrarConsumo() }, 6000)

  // setTimeout(() => { filtrarVersoes()}, 7000)


}


/*
* Salvar dados da coluna editada
*/

const salvarConsumoLinha = async (porLinha, campoEditado, USU_CODEMP, USU_CODPRO, USU_CODDER, USU_CURABC, USU_SKUDEM, USU_QTDDEM, USU_QTDOC0,
  USU_QTDOC1, USU_QTDOC2, USU_QTDOC3, USU_QTDOC4, USU_QTDOC5, USU_QTDCO0, USU_QTDCO1, USU_QTDCO2, USU_QTDCO3, USU_QTDCO4, USU_QTDCO5,
  USU_QTDMES, USU_QTDCOB) => {

  let arrayDadosConsumo = [];

  const consumo = new servicoConsumo()

  let retorno = []

  const celula = $(campoEditado)

  const USU_SEQCONS = parseInt(localStorage.getItem('versaoConsumo'))

  const qtdcon = $(campoEditado).text().trim();
  const obsalt = $(`#usuobsalt${USU_CODPRO}`).text().trim();

  if (porLinha !== 'OK') {

    console.log('Dirceu Realizado', $('#realizadoMes').text())

    let realizadoMes = $('#realizadoMes').text()
    realizadoMes = realizadoMes.replace('%', '').trim();
    realizadoMes = realizadoMes.replace(',', '.');
    const realizadoMesFormatado = parseFloat(realizadoMes);

    const linhasTabela1 = $('#tabelaDadosConsumo1 tbody tr');
    const linhasTabela2 = $('#tabelaDadosConsumo2 tbody tr');

    linhasTabela1.each(function (index) {
      const linha1 = $(this);
      const linha2 = $(linhasTabela2[index]); // mesma posição da outra tabela
      const textObs = $(`#usuobsalt${linha1.find("td:eq(0)").text().trim()}`).text().trim();

      const consumo = {
        USU_CODEMP: 1,
        USU_SEQCONS: USU_SEQCONS,
        USU_CODPRO: linha1.find("td:eq(0)").text().trim(),
        USU_CODDER: linha1.find("td:eq(1)").text().trim(),
        USU_CURABC: linha1.find("td:eq(2)").text().trim(),
        USU_SKUDEM: linha1.find("td:eq(3)").text().trim(),
        USU_QTDDEM: linha1.find("td:eq(7)").text().trim(),

        USU_QTDOC0: linha2.find("td:eq(1)").text().trim(),
        USU_QTDOC1: linha2.find("td:eq(3)").text().trim(),
        USU_QTDOC2: linha2.find("td:eq(5)").text().trim(),
        USU_QTDOC3: linha2.find("td:eq(7)").text().trim(),
        USU_QTDOC4: linha2.find("td:eq(9)").text().trim(),
        USU_QTDOC5: linha2.find("td:eq(12)").text().trim(),
        USU_QTDCO0: linha2.find("td:eq(0)").text().trim(),
        USU_QTDCO1: linha2.find("td:eq(2)").text().trim(),
        USU_QTDCO2: linha2.find("td:eq(4)").text().trim(),
        USU_QTDCO3: linha2.find("td:eq(6)").text().trim(),
        USU_QTDCO4: linha2.find("td:eq(8)").text().trim(),
        USU_QTDCO5: linha2.find("td:eq(11)").text().trim(),
        USU_QTDCON: linha2.find("td:eq(10)").text().trim(),
        USU_QTDMES: linha2.find("td:eq(13)").text().trim(),
        USU_QTDCOB: linha2.find("td:eq(14)").text().trim(),
        USU_OBSALT: textObs,
        codigoUsuario: codigoUsuario,
        USU_ANDFEC: 'F',
        realizadoMes: realizadoMesFormatado
      };

      arrayDadosConsumo.push(consumo);
    });


  }



  const arrayDadosLinha = [{
    USU_CODEMP, USU_SEQCONS, USU_CODPRO, USU_CODDER, USU_CURABC, USU_SKUDEM, USU_QTDDEM, USU_QTDOC0, USU_QTDOC1, USU_QTDOC2,
    USU_QTDOC3, USU_QTDOC4, USU_QTDOC5, USU_QTDCO0, USU_QTDCO1, USU_QTDCO2, USU_QTDCO3, USU_QTDCO4, USU_QTDCO5, USU_QTDCON: qtdcon, USU_QTDMES,
    USU_QTDCOB, USU_OBSALT: obsalt, codigoUsuario, USU_ANDFEC: 'A', realizadoMes: 'Linha'
  }]

  const arrayDados = porLinha == 'OK' ? arrayDadosLinha : arrayDadosConsumo

  const dataVersao = $('#datepicker').val()

  retorno = await consumo.salvarConsumoLinha(arrayDados, String(dataVersao))

  if (retorno.status !== 0 && porLinha == 'OK') {

    $.toast({
      text: retorno.retorno,
      showHideTransition: 'plain',
      icon: 'error',
      stack: false,
      background: 'red !important',
      color: '#fff !important',
      loaderBg: '#fff !important',
      textAlign: 'left',
      hideAfter: 5000,
      position: {
        left: celula.offset().left + celula.outerWidth() + 10,
        top: celula.offset().top - 3
      }
    })

    celula.addClass('red')


  } else {
    celula.addClass('green')

  }

  if (retorno.status !== 0 && porLinha !== 'OK') {

    $.toast({
      text: 'Problema na inserção',
      showHideTransition: 'plain',
      icon: 'error',
      stack: false,
      background: 'red !important',
      color: '#fff !important',
      loaderBg: '#fff !important',
      textAlign: 'left',
      hideAfter: 1000,
      position: 'top-center'
    })

  } else if (porLinha !== 'OK') {

    $.toast({
      text: 'Salvo com Sucesso!',
      showHideTransition: 'plain',
      icon: 'success',
      stack: false,
      background: 'red !important',
      color: '#fff !important',
      loaderBg: '#fff !important',
      textAlign: 'left',
      hideAfter: 1000,
      position: 'top-center'
    })


  }

}


/*
* Validar valor NaN
*/
const parseOrZero = (valor) => {
  return isNaN(parseFloat(valor)) ? 0 : parseFloat(valor);
}

const novo = () => {

  $('.novo').show()
  $('#versaoConsumo').val('')

}

const salvarVersao = async () => {


  $('#datepicker').val(dataFormatada())

  const nomeVersao = $('#versaoConsumo').val()

  const dadosRecuperadosParametrosConsumo = JSON.parse(localStorage.getItem('dadosParametrosConsumolocalStorage'))


  const versao = new servicoConsumo()

  const dados = await versao.salvarVersao(codigoUsuario, nomeVersao, dadosRecuperadosParametrosConsumo)

  if (dados.status == 0) {
    setTimeout(() => { filtrarVersoes() }, 500)
    setTimeout(() => { filtrarConsumo() }, 1000)

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

  //$('.ui.modal').appendTo('body').modal('show');

  $('#modalObsevacao').modal({
    closable: true,
    autofocus: true,
    observeChanges: true
  })
    .modal('show');

  $('#modalObsevacao').draggable({ containment: "window" })


}



/*
* Salvar a observação na variavel.
*/
const salvarObservacao = async (codigo) => {

  const celulaSetada = '.campoEditado' + codigo.slice(0, 12).replace(/\D/g, '')

  const idToolTip = codigo.slice(0, 12).replace(/\D/g, '')

  const obs = $('.' + tagObservacao).val()
  const tooltipPopup = $('#tooltip' + idToolTip);
  tooltipPopup
    .attr('data-tooltip', obs)
    .popup('destroy')
    .popup();

  $('#tabelaDadosConsumo2 tbody tr #' + tagObservacao).text(obs)

  $(this).attr(".data-tooltip", obs);
  $('.' + tagObservacao).html(obs)
  $("#retorno").show()
  $("#retorno").fadeOut(1000)

  // $(".overlay").hide();
  // $(".modal").hide();
  // $(".jquery-modal.blocker").remove();

  setTimeout(() => { $('#modalObsevacao').modal('hide') }, 1000)


  const versaoAlterada = parseInt(localStorage.getItem('versaoConsumo'))

  const dataAlteracao = $('#datepicker').val()

  const bgColor = $(celulaSetada).css('background-color')

  const codigoProduto = idToolTip

  if (bgColor == 'rgb(198, 239, 203)') {

    const salvaObs = new servicoConsumo()

    const retorno = await salvaObs.salvarObservacao(String(codigoProduto), String(versaoAlterada), String(dataAlteracao), String(obs))

  }


}

/*
* Modal para validar inserção
*/

const modalTemCerteza = () => {


  $('#modalAlertTemCerteza').modal({
    closable: true,
    autofocus: true,
    observeChanges: true
  })
    .modal('show');

  $('#modalAlertTemCerteza').draggable({ containment: "window" })



}

const divisaoPorZero = (valor) => {

  if (valor == 0 || valor == '0') {
    return 1
  } else {
    return valor
  }

}

const excluirVersao = async () => {

  const versaoSelecionada= parseInt(localStorage.getItem('versaoConsumo'))

  const dataVersao = $('#datepicker').val()

  const botaoExcluir = $('#botaoExcluir')

  const excluirDados = new servicoConsumo()

  const retorno = await excluirDados.excluirVersao(versaoSelecionada,dataVersao)

  if(retorno.status == 0) {
    console.log('Dirceu Excluir Versao:',retorno)

    setTimeout(() => { filtrarVersoes() }, 500)
    setTimeout(() => { filtrarConsumo() }, 1000)

  } else {

    $('#botaoExcluir .text').text('Excluir Versão Selecionada!');
    
    $.toast({
      text: retorno.retorno,
      showHideTransition: 'plain',
      icon: 'error',
      stack: false,
      background: 'red !important',
      color: '#fff !important',
      loaderBg: '#fff !important',
      textAlign: 'left',
      hideAfter: 5000,
      position: {
        left: botaoExcluir.offset().left + botaoExcluir.outerWidth() + 10,
        top: botaoExcluir.offset().top - 3
      }
    })

 }



}
