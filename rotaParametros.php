<?php
require 'servicos/servicoParametro.php';

if ($_REQUEST['rota'] == 'ParametroDemanda') {

   servicoParametro::mostrarParametroDemanda();
}

if ($_REQUEST['rota'] == 'ParametroSalvarDemanda') {

   $usu_mesfat = $_REQUEST['usu_mesfat'];
   $usu_mescon = $_REQUEST['usu_mescon'];
   $usu_depcon = $_REQUEST['usu_depcon'];
   $usu_perrup = $_REQUEST['usu_perrup'];
   $codigoUsuario = $_REQUEST['codigoUsuario'];

   servicoParametro::salvarParametroDemanda($usu_mesfat,$usu_mescon,$usu_depcon,$usu_perrup, $codigoUsuario);
}

if ($_REQUEST['rota'] == 'ParametroConsumo') {

   servicoParametro::mostrarParametroConsumo();


}


if ($_REQUEST['rota'] == 'ParametroSalvarConsumo') {

   $usu_marku0 = $_REQUEST['usu_marku0'];
   $usu_marku1 = $_REQUEST['usu_marku1'];
   $usu_marku2 = $_REQUEST['usu_marku2'];
   $usu_marku3 = $_REQUEST['usu_marku3'];
   $usu_marku4 = $_REQUEST['usu_marku4'];
   $usu_marku5 = $_REQUEST['usu_marku5'];
   $usu_marku_A = $_REQUEST['usu_marku_A'];
   $usu_marku_O = $_REQUEST['usu_marku_O'];
   $usu_perrupC = $_REQUEST['usu_perrupC'];
   $codigoUsuario = $_REQUEST['codigoUsuario'];

   servicoParametro::salvarParametroConsumo($usu_marku0,$usu_marku1,$usu_marku2,$usu_marku3,$usu_marku4,$usu_marku5,$usu_marku_A,$usu_marku_O, $usu_perrupC, $codigoUsuario);
}




