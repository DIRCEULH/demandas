usuarioLogado = localStorage.getItem('usuario');
statusLogado = localStorage.getItem('logado');
codigoUsuario = localStorage.getItem('codigoUsuario');
ambiente = localStorage.getItem('ambiente')

if (statusLogado != 0) {

    window.location.href = "../login/login.html"
}

setTimeout(() => { $("#logado").val(codigoUsuario + ' - ' + usuarioLogado + ' - '  + ambiente), atualizarParametrosConsumo(), atualizarParametrosDemanda() }, 300)





const dadosParametrosDemanda = async () => {

    const parametrosDemanda = new servicoParametro();

    const dados = await parametrosDemanda.mostrarParametroDemanda()


    return dados
}

const dadosParametrosConsumo = async () => {

    const parametrosDemanda = new servicoParametro();

    const dados = await parametrosDemanda.mostrarParametroConsumo()


    return dados
}


const atualizarParametrosDemanda = () => {


    dadosParametrosDemanda().then((parametros) => {


        let retornoParametrosDemanda = JSON.parse(parametros)


        const HtmlTableDemanda = retornoParametrosDemanda.map((parametroDemandas, indice) => {


            const hoje = new Date();
            const dia = String(hoje.getDate()).padStart(2, '0');
            const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const ano = hoje.getFullYear();

            const dataAtualFormatada = `${mes}/${ano}`;

            const ParametroBloqueado = parametroDemandas.USU_ANDFEC == 'F' && parametroDemandas.USU_DATGER == dataAtualFormatada

            const DesabilitarBotaoCopiar = ParametroBloqueado ? `<i  class="copy icon grey disabled" style="pointer-events: none; float: left; opacity: 0.5;"></i>` : `<i onClick="copiarParametro('demanda')" class="copy icon blue" style="cursor: pointer; float:left;"></i>`

            if (ParametroBloqueado) {

                $('#usu_mesfat').attr('disabled', true)
                $('#usu_mescon').attr('disabled', true)
                $('#usu_depcon').attr('disabled', true)
                $('#usu_perrup').attr('disabled', true)
                $('#salvaParametrosDemanda').addClass('disabled')



            }


            return `   <tr>
                <td  style="cursor: pointer; text-align: center;" id="">  ${DesabilitarBotaoCopiar + parametroDemandas.USU_DATGER}</td>
                </tr>
                <tr id="dataParametrosDemanda">
                  <td style="width:25%;  text-align: center;" id="mesfat">${parametroDemandas.USU_MESFAT}</td>
                  <td style="width:25%;  text-align: center;" class="single line" id="mescon">${parametroDemandas.USU_MESCON}</td>
                  <td style="width:25%;  text-align: center;" class="single line" id="depcon">${parametroDemandas.USU_DEPCON}</td>
                  <td style="width:25%;  text-align: center;" class="single line" id="perrup">${parametroDemandas.USU_PERRUP}</td>
                </tr>`

        })

        $('.dadosParametrosDemanda').html(HtmlTableDemanda)


    })

}



const atualizarParametrosConsumo = () => {

    dadosParametrosConsumo().then((parametros) => {


        let retornoParametrosConsumo = JSON.parse(parametros)


        const HtmlTableConsumo = retornoParametrosConsumo.map((parametroConsumos, indice) => {


            const hoje = new Date();
            const dia = String(hoje.getDate()).padStart(2, '0');
            const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
            const ano = hoje.getFullYear();

            const dataAtualFormatada = `${mes}/${ano}`;

            const ParametroBloqueado = parametroConsumos.USU_ANDFEC == 'F' && parametroConsumos.USU_DATGER == dataAtualFormatada

            const DesabilitarBotaoCopiar = ParametroBloqueado ? `<i  class="copy icon grey disabled" style="pointer-events: none; float: left; opacity: 0.5;"></i>` : `<i onClick="copiarParametro('consumo')" class="copy icon blue" style="cursor: pointer; float:left;"></i> `


            if (ParametroBloqueado) {

                $('#usu_marku0').attr('disabled', true)
                $('#usu_marku1').attr('disabled', true)
                $('#usu_marku2').attr('disabled', true)
                $('#usu_marku3').attr('disabled', true)
                $('#usu_marku4').attr('disabled', true)
                $('#usu_marku5').attr('disabled', true)
                $('#usu_marku_A').attr('disabled', true)
                $('#usu_marku_O').attr('disabled', true)
                $('#usu_perrupC').attr('disabled', true)
                $('#salvaParametrosConsumo').addClass('disabled')




            }


            return `   <tr>
                <td  style=" cursor: pointer; text-align: center;" id=""> ${DesabilitarBotaoCopiar + parametroConsumos.USU_DATGER}</td>
                </tr>
                <tr id="dataParametrosConsumo">
                  <td style="width:11.1%;  text-align: center;" id="marku0">${parseFloat(parametroConsumos.USU_MARKU0).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku1">${parseFloat(parametroConsumos.USU_MARKU1).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku2">${parseFloat(parametroConsumos.USU_MARKU2).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku3">${parseFloat(parametroConsumos.USU_MARKU3).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku4">${parseFloat(parametroConsumos.USU_MARKU4).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku5">${parseFloat(parametroConsumos.USU_MARKU5).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku_A">${parseFloat(parametroConsumos.USU_MARKU_A).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="marku_O">${parseFloat(parametroConsumos.USU_MARKU_O).toFixed(2)}</td>
                  <td style="width:11.1%;  text-align: center;" class="single line" id="perrupC">${parseFloat(parametroConsumos.USU_PERRUP).toFixed(2)}</td>
                </tr>`

        })

        $('.dadosParametrosConsumo').html(HtmlTableConsumo)


    })
}

const copiarParametro = (valor) => {

    if (valor == 'demanda') {

        $('#usu_mesfat').val($('#mesfat').text())
        $('#usu_mescon').val($('#mescon').text())
        $('#usu_depcon').val($('#depcon').text())
        $('#usu_perrup').val($('#perrup').text())

    } else if (valor == 'consumo') {

        $('#usu_marku0').val($('#marku0').text())
        $('#usu_marku1').val($('#marku1').text())
        $('#usu_marku2').val($('#marku2').text())
        $('#usu_marku3').val($('#marku3').text())
        $('#usu_marku4').val($('#marku4').text())
        $('#usu_marku5').val($('#marku5').text())
        $('#usu_marku_A').val($('#marku_A').text())
        $('#usu_marku_O').val($('#marku_O').text())
        $('#usu_perrupC').val($('#perrupC').text())

    }




}

const salvarParametroDemandas = async () => {

    const param = new servicoParametro()
    let retorno = []
    const usu_mesfat = $('#usu_mesfat').val()
    const usu_mescon = $('#usu_mescon').val()
    const usu_depcon = $('#usu_depcon').val()
    const usu_perrup = $('#usu_perrup').val()


    if (usu_mesfat != '' & usu_mescon != '' & usu_depcon != '' & usu_perrup != '') {

        retorno = await param.salvarParametroDemanda(usu_mesfat, usu_mescon, usu_depcon, usu_perrup, codigoUsuario)

        if (retorno.status == 0) {

            const button = $('.salvarParametro')

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
                position: {
                    left: button.offset().left + button.outerWidth() + 40,
                    top: button.offset().top - 3
                }
            })


            setTimeout(() => {

                atualizarParametrosDemanda()
                $('#usu_mesfat').val('');
                $('#usu_mescon').val('');
                $('#usu_depcon').val('');
                $('#usu_perrup').val('');

            }, 1000)


        } else {

            const button = $('.salvarParametro')

            $.toast({
                text: 'Verifique valores digitados!',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false,
                background: 'red !important',
                color: '#fff !important',
                loaderBg: '#fff !important',
                textAlign: 'left',
                hideAfter: 1000,
                position: {
                    left: button.offset().left + button.outerWidth() + 40,
                    top: button.offset().top - 3
                }
            })

        }






    }


}


const salvarParametroConsumos = async () => {

    const param = new servicoParametro()
    let retorno = []
    const usu_marku0 = $('#usu_marku0').val()
    const usu_marku1 = $('#usu_marku1').val()
    const usu_marku2 = $('#usu_marku2').val()
    const usu_marku3 = $('#usu_marku3').val()
    const usu_marku4 = $('#usu_marku4').val()
    const usu_marku5 = $('#usu_marku5').val()
    const usu_marku_A = $('#usu_marku_A').val()
    const usu_marku_O = $('#usu_marku_O').val()
    const usu_perrupC = $('#usu_perrupC').val()


    if (usu_marku0 != '' & usu_marku1 != '' & usu_marku2 != '' & usu_marku3 != '' & usu_marku4 != '' & usu_marku5 != '' & usu_perrupC != '') {

        retorno = await param.salvarParametroConsumo(usu_marku0, usu_marku1, usu_marku2, usu_marku3, usu_marku4, usu_marku5,usu_marku_A, usu_marku_O, usu_perrupC, codigoUsuario)

        if (retorno.status == 0) {

            const button = $('.salvarParametroConsumo')

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
                position: {
                    left: button.offset().left + button.outerWidth() + 40,
                    top: button.offset().top - 3
                }
            })


            setTimeout(() => {

                atualizarParametrosConsumo()
                $('#usu_marku0').val('');
                $('#usu_marku1').val('');
                $('#usu_marku2').val('');
                $('#usu_marku3').val('');
                $('#usu_marku4').val('');
                $('#usu_marku5').val('');
                $('#usu_marku_A').val('');
                $('#usu_marku_O').val('');                
                $('#usu_perrupC').val('');

            }, 1000)


        } else {

            const button = $('.salvarParametroConsumo')

            $.toast({
                text: 'Verifique valores digitados, use para percentual abaixo 100% (00.00)!',
                showHideTransition: 'plain',
                icon: 'error',
                stack: false,
                background: 'red !important',
                color: '#fff !important',
                loaderBg: '#fff !important',
                textAlign: 'left',
                hideAfter: 1000,
                position: {
                    left: button.offset().left + button.outerWidth() + 40,
                    top: button.offset().top - 3
                }
            })


        }



    }


}