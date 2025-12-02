class servicoLogin {
   async loginErp(usuario, senha, ambiente) {

      const res = await $.ajax({
         method: 'get',
         url: "../../rotaLogin.php",
         credentials: 'include',
         data: { rota: 'loginErp', usuario , senha, ambiente}
      }).then(function (data) {

        return JSON.parse(data)

      })

      return res

   }
}