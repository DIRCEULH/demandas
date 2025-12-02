<?php
require 'servicos/servicoConsumo.php';

if ($_REQUEST['rota'] == 'mostrarVersoes') {

   $datepicker = $_REQUEST['datepicker'];

   servicoConsumo::mostrarVersoes($datepicker);
}

if ($_REQUEST['rota'] == 'consumo') {

   $datepicker = $_REQUEST['datepicker'];
   $versaoConsumo = $_REQUEST['versaoConsumo'];
   $codAgc = $_REQUEST['codAgc'];

   servicoConsumo::mostrarConsumo($datepicker, $versaoConsumo, $codAgc);
}


if ($_REQUEST['rota'] == 'salvarConsumoLinha') {

   $arrayDadosLinha = $_REQUEST['arrayDadosLinha'];
   $dataVersao  = $_REQUEST['dataVersao'];

   servicoConsumo::salvarConsumoLinha( $arrayDadosLinha, $dataVersao);
}

if ($_REQUEST['rota'] == 'salvarVersao') {

   $codigoUsuario = $_REQUEST['codigoUsuario'];
   $nomeVersao = $_REQUEST['nomeVersao'];
   $dadosRecuperadosParametrosConsumo = $_REQUEST['dadosRecuperadosParametrosConsumo'];

   servicoConsumo::salvarVersao( $codigoUsuario, $nomeVersao, $dadosRecuperadosParametrosConsumo);
}

if ($_REQUEST['rota'] == 'salvarObservacao') {

   $codigoProduto = $_REQUEST['codigoProduto'];
   $versaoAlterada = $_REQUEST['versaoAlterada'];
   $dataAlteracao = $_REQUEST['dataAlteracao'];
   $obs = $_REQUEST['obs'];

   //var_dump($obs); die();

   servicoConsumo::salvarObservacao( $codigoProduto, $versaoAlterada, $dataAlteracao, $obs);
}

if ($_REQUEST['rota'] == 'excluirVersao') {

   $versaoSelecionada = $_REQUEST['versaoSelecionada'];
   $dataVersao = $_REQUEST['dataVersao'];


   servicoConsumo::excluirVersao( $versaoSelecionada, $dataVersao);
}


