localStorage.clear()

$(function () {
   $('.ui.dropdown').dropdown()
   $('#ambiente').val('P');
   $('#ambiente').parent('.ui.dropdown').dropdown('set selected', 'P');
   

})

const loginValidate = async () => {

    const usuario = $('#user').val()
    const senha = $('#password').val()
    $('#loading').show()
    $('#alertCampos').hide()
    $('#logo').show()

    if (usuario == '' || senha == '') {
        $('#alertCampos').show()
        $('#loading').hide()
        $('#alertCampos').fadeOut(2500)
        $('#logo').hide()

        setTimeout(()=>{
            $('#logo').show()
        },2500)

    } else {

        console.log('Ambiente de Conexao: ',  $('#ambiente').val())

        const ambiente = $('#ambiente').val()

        localStorage.setItem('ambiente', ambiente)

        const users = new servicoLogin();

        const retorno = await users.loginErp(usuario, senha, ambiente)


        const usuariovalidado = JSON.parse(retorno).map((dados) => {

            

            localStorage.setItem('usuario', dados.usuario)
            localStorage.setItem('logado', dados.logado)
            localStorage.setItem('codigoUsuario', dados.codigoUsuario)

            if (parseInt(dados.logado) == 0 && dados.codigoUsuario != '') {

                $('#loading').hide()

                window.location.href = "../../index.html"
            } else {
                $('#alert').show()
                $('#alert').fadeOut(2500)
                $('#loading').hide()
                $('#logo').hide()

                setTimeout(()=>{
                    $('#logo').show()
                },2500)
            }
        })

    }

}

const mostrarSenha = () => {
    const $senhaInput = $("#password");
    const isPassword = $senhaInput.attr("type") === "password";
    $senhaInput.attr("type", isPassword ? "text" : "password");
    $('#togglePassword').toggleClass("slash");
  }


















