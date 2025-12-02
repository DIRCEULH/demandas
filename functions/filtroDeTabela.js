const myFunctionSearch = (id1, col1, id2, col2, id3, col3, classeTabela, idTr) => {

    const totalDadosTable = $('.dadosDemandas').find('tr').length;
  
    if (totalDadosTable > 0) {
      $('#loading').show();
    }

    const codAgc = $('#search-codagc').val()
    const produto = $('#search-id').val()
    const lancamento = $('#search-lancamento').val()
    const demanda = $('#search-demanda').val()
    if(codAgc == '' && lancamento == '' && demanda == '' && produto == '') {
      $('#salvarPrevisao').removeClass('disabled')
      } else {
        $('#salvarPrevisao').addClass('disabled')
      }

  
    setTimeout(() => {
      const inputVal1 = $(id1).val();
      const filters1 = inputVal1 ? inputVal1.toLowerCase().split(',').map(f => f.trim()).filter(f => f !== '') : [];
  
      const inputVal2 = $(id2).val();
      const filters2 = inputVal2 ? inputVal2.toLowerCase().split(',').map(f => f.trim()).filter(f => f !== '') : [];
  
      const inputVal3 = $(id3).val();
      const filters3 = inputVal3 ? inputVal3.toLowerCase().split(',').map(f => f.trim()).filter(f => f !== '') : [];
  
      let data = [];
      totalRegistros = 0;
  
      $(classeTabela).find('tr').each(function () {
        let row = [];
        
        const text1 = $(this).find(col1).text().toLowerCase()
        const text2 = $(this).find(col2).text().toLowerCase()
        const text3 = $(this).find(col3).text().toLowerCase();
  
        const passFilter1 = filters1.length === 0 || filters1.some(f => text1.includes(f))
        const passFilter2 = filters2.length === 0 || filters2.some(f => text2.includes(f))
        const passFilter3 = filters3.length === 0 || filters3.some(f => text3.includes(f))
        const showRow = passFilter1 && passFilter2 && passFilter3
  
        $(this).closest(idTr).css('display', showRow ? 'table-row' : 'none');
  
        if (showRow) {
          row.push($(this).text());
          data.push(row);
        }
      });
  
      totalRegistros = data.length;
      $('#totalRegistros').text(totalRegistros);
      $('#loading').hide();
  
    }, 200)
  }

  

// const myFunctionSearch = (id1, id2) => {

//   const totalDadosTable = $('.dadosDemandas').find('tr').length;

//   if (totalDadosTable > 0) {
//     $('#loading').show()
//   }

//   setTimeout(() => {

//     const nameFilter = $(id1).val() != undefined ? $(id1).val().toLowerCase() : ''

//     let data = []
//     totalRegistros = 0

//     $('.dadosDemandas').find('tr').each(function () {


//       let row = [];

//       const textFilter = $(this).find(id2).text()

//       const viewFilter = textFilter.toLowerCase().indexOf(nameFilter) >= 0

//       $(this).closest('#dataTr').css('display', viewFilter ? 'table-row' : 'none')



//       if ($(this).is(':visible')) {
//         row.push($(this).text());
//         data.push(row);

//       }


//       totalRegistros = data.length

//       if (totalRegistros > 0 || totalRegistros == 0) {

//         $('#loading').hide()
//       }

//       $('#totalRegistros').text(totalRegistros);
//     })

//   }, 200)

// }

