class servicoDemanda {

   async mostrarDemanda(dateRegistration, codagc) {

      try {

      const res = await $.ajax({
         method: 'get',
         url: "../../rotaDemanda.php",
         data: { rota: 'demanda', dateRegistration: dateRegistration, codagc : codagc}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res
   } catch (error) {
      $('.ui.modal').appendTo('body').modal('show');

      $('#modalSalvar').modal({
        escapeClose: false,
        clickClose: false,
        showClose: false,
        closeClass: 'icon-remove',
        observeChanges: true,
        autofocus: false
      })


      $('.retornoModalSalvar').html('Verifique os parametros cadastrados!'+'<br>'+error)
   }  

   }

   async salvarDemanda(dadosDemanda, codigoUsuario, bloqParam) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaDemanda.php",
         data: { rota: 'salvarDemanda', dadosDemanda, codigoUsuario, bloqParam}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }



}





