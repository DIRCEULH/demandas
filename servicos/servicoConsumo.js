class servicoConsumo {

   async mostrarVersoes(datepicker) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaConsumo.php",
         data: { rota: 'mostrarVersoes', datepicker}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async mostrarConsumo(datepicker,versaoConsumo,codAgc) {

      try {

      const res = await $.ajax({
         method: 'get',
         url: "../../rotaConsumo.php",
         data: { rota: 'consumo', datepicker,versaoConsumo, codAgc}
      }).then(function (data) {
   
         return JSON.parse(data)
      })

      return res
   } catch (error) {
      $('.ui.modal').appendTo('body').modal('show');

      $('#modalSalvar').modal({
        escapeClose: true,
        clickClose: true,
        showClose: true,
        closeClass: 'icon-remove',
        observeChanges: true,
        autofocus: false
      })


      $('.retornoModalSalvar').html('Verifique os parametros cadastrados!'+'<br>'+error)
   }  

   }

   async salvarConsumoLinha(arrayDadosLinha, dataVersao) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaConsumo.php",
         data: { rota: 'salvarConsumoLinha', arrayDadosLinha, dataVersao}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async salvarVersao( codigoUsuario, nomeVersao, dadosRecuperadosParametrosConsumo) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaConsumo.php",
         data: { rota: 'salvarVersao',  codigoUsuario, nomeVersao, dadosRecuperadosParametrosConsumo}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async salvarObservacao(codigoProduto,versaoAlterada,dataAlteracao,obs) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaConsumo.php",
         data: { rota: 'salvarObservacao',  codigoProduto,versaoAlterada,dataAlteracao, obs}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async excluirVersao( versaoSelecionada, dataVersao) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaConsumo.php",
         data: { rota: 'excluirVersao',  versaoSelecionada, dataVersao}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

}





