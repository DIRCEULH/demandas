class servicoParametro {



   async mostrarParametroDemanda() {

      const res = await $.ajax({
         method: 'get',
         url: "../../rotaParametros.php",
         data: { rota: 'ParametroDemanda'}
      }).then(function (data) {

       
         return JSON.parse(data)
      })

      return res

   }

   async salvarParametroDemanda(usu_mesfat,usu_mescon,usu_depcon,usu_perrup,codigoUsuario) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaParametros.php",
         data: { rota: 'ParametroSalvarDemanda', usu_mesfat,usu_mescon,usu_depcon,usu_perrup,codigoUsuario}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }


   async mostrarParametroConsumo() {

      const res = await $.ajax({
         method: 'get',
         url: "../../rotaParametros.php",
         data: { rota: 'ParametroConsumo'}
      }).then(function (data) {

         return JSON.parse(data)
      })

      

      return res

   }


   async salvarParametroConsumo(usu_marku0, usu_marku1, usu_marku2, usu_marku3, usu_marku4, usu_marku5, usu_marku_A,usu_marku_O, usu_perrupC, codigoUsuario) {

      const res = await $.ajax({
         method: 'post',
         url: "../../rotaParametros.php",
         data: { rota: 'ParametroSalvarConsumo', usu_marku0, usu_marku1, usu_marku2, usu_marku3, usu_marku4, usu_marku5,usu_marku_A, usu_marku_O, usu_perrupC, codigoUsuario}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

 

}





