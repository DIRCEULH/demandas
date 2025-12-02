class servicoGraficos {

   async totalizadoresConsumo() {

      const urls = ["rotaGraficos.php", "../../rotaGraficos.php"];

      let urlUsada = null;
      let data = null;

      for (const url of urls) {
         try {
            const res = await $.ajax({
               method: 'post',
               url: url,
               data: { rota: 'totalizadoresConsumo' },
               timeout: 3000 // tempo limite para evitar travas
            });

            data = JSON.parse(res);
            urlUsada = url;
            break; // se funcionar, para aqui

         } catch (e) {
            // tenta a próxima
            console.warn(`Erro ao tentar ${url}`, e);
         }
      }

      if (!urlUsada) {
         throw new Error("Nenhuma URL válida encontrada para totalizadoresConsumo.");
      }

      return data;
   }

}
