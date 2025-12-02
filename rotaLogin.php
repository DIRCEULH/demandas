<?php
require 'servicos/servicoLogin.php';

if ($_REQUEST['rota'] == 'loginErp') {

   $usuario = $_REQUEST['usuario'];
   $senha = $_REQUEST['senha'];
   $ambiente = $_REQUEST['ambiente'];


   servicoLogin::loginErp($usuario, $senha, $ambiente);
}
