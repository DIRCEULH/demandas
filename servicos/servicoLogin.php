<?php
require 'connDB.php';
header('Content-Type: text/html; charset=UTF-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


class servicoLogin extends db
{

    public static function loginErp($usuario, $senha, $ambiente)
    {

        //var_dump($ambiente); die();

        $_SESSION['AmbienteConexao'] = $ambiente ;

        session_write_close();

        $usuarioUpper = strtoupper($usuario);

        sleep(5);

        $sqlCheckGrupo = " SELECT R910ENT.CODENT
                            FROM R910MGP, R910ENT, R910GRP, R910USU
                            WHERE ((R910GRP.CODENT = R910MGP.CODGRP) AND
                                (R910ENT.CODENT = R910MGP.CODMBR) AND
                                (R910ENT.CODENT = R910USU.CODENT))
                            AND UPPER(R910ENT.NOMEXB) = UPPER(:usuario)
                            AND UPPER(R910GRP.DESGRP) = UPPER('GP_DEMANDA') ";
        $conexao = conn::getInstance();
        $stmtCheck = $conexao->prepare($sqlCheckGrupo);
        $stmtCheck->bindParam(':usuario', $usuarioUpper);
        $stmtCheck->execute();
        $returnData = $stmtCheck->fetchAll(PDO::FETCH_OBJ);
        
        if (!empty($returnData) && isset($returnData[0]->CODENT)) {
            $codent = $returnData[0]->CODENT;
        } else {
            // Nenhum resultado encontrado
            $codent = '';
        }

        $url = "http://srv-senior:8080/g5-senior-services/sapiens_SyncMCWFUsers?wsdl";

         $opts = array(
             'ssl' => array('ciphers'=>'RC4-SHA', 'verify_peer'=>false, 'verify_peer_name'=>false)
        );

     try{
        $params = array ('encoding' => 'UTF-8', 'verifypeer' => false, 'verifyhost' => false, 'soap_version' => SOAP_1_1 , 'trace' => 1, 'exceptions' => 1, "connection_timeout" => 180, 'stream_context' => stream_context_create($opts) );
        $client = new SoapClient($url,$params ); 
        $result = $client->AuthenticateJAAS($usuario, $senha, 0, array(
            'pmUserName' => $usuario,
            'pmUserPassword' => $senha,
            'pmEncrypted' => 0
        ));

        // var_dump(  $resultGrupo->pmPersonExists); die();

        } catch (SoapFault $e) {
            $params = array ('encoding' => 'UTF-8', 'verifypeer' => false, 'verifyhost' => false, 'soap_version' => SOAP_1_2 , 'trace' => 1, 'exceptions' => 1, "connection_timeout" => 180, 'stream_context' => stream_context_create($opts) );
            $client = new SoapClient($url,$params ); 
            $result = $client->AuthenticateJAAS($usuario, $senha, 0, array(
                'pmUserName' => $usuario,
                'pmUserPassword' => $senha,
                'pmEncrypted' => 0
            ));

        }
        $ret = $result->pmLogged;

        $resultados[] = Array('usuario' => $usuario,'logado' => $ret , 'codigoUsuario' => $codent );
   
        print_r( json_encode(json_encode($resultados)));


    }

}