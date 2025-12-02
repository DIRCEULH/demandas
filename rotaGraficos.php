<?php
require 'servicos/servicoGraficos.php';

if ($_REQUEST['rota'] == 'totalizadoresConsumo') {

    //$versao = $_REQUEST['versao'];

   servicoGraficos::totalizadoresConsumo(  );
}

// if ($_REQUEST['rota'] == 'ParametroSalvarDemanda') {

//    $usu_mesfat = $_REQUEST['usu_mesfat'];
//    $usu_mescon = $_REQUEST['usu_mescon'];
//    $usu_depcon = $_REQUEST['usu_depcon'];
//    $usu_perrup = $_REQUEST['usu_perrup'];
//    $codigoUsuario = $_REQUEST['codigoUsuario'];

//    servicoParametro::salvarParametroDemanda($usu_mesfat,$usu_mescon,$usu_depcon,$usu_perrup, $codigoUsuario);
// }
