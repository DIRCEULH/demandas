<?php
require 'servicos/servicoDemanda.php';

if ($_REQUEST['rota'] == 'demanda') {

   $date = $_REQUEST['dateRegistration'];
   $codagc = $_REQUEST['codagc'];

   servicoDemanda::mostrarDemanda($date, $codagc);
}


if ($_REQUEST['rota'] == 'salvarDemanda') {

   $arrayDemanda = $_REQUEST['dadosDemanda'];
   $codigoUsuario = $_REQUEST['codigoUsuario'];
   $bloqParam = $_REQUEST['bloqParam'];

   servicoDemanda::salvarDemanda($arrayDemanda, $codigoUsuario, $bloqParam);
}

