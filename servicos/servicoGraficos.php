<?php
require 'connDB.php';
header('Content-Type: text/html; charset=UTF-8');
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
class servicoGraficos extends db
{


    public static function totalizadoresConsumo() {


         $oracle = new db();

         $sqlTotalizadoresConsumo = "   SELECT 
                                          SUM(TRIM(USU_QTDCON)) QTDCON
                                        , SUM(TRIM(USU_QTDCO0)) QTDCO0
                                        , SUM(TRIM(USU_QTDCO1)) QTDCO1
                                        , SUM(TRIM(USU_QTDCO2)) QTDCO2
                                        , SUM(TRIM(USU_QTDCO3)) QTDCO3
                                        , SUM(TRIM(USU_QTDCO4)) QTDCO4
                                        , SUM(TRIM(USU_QTDCO5)) QTDCO5
                                        FROM USU_TDEMCON 
                                        WHERE TO_CHAR(USU_DATGER, 'MM/YYYY') = TO_CHAR(SYSDATE, 'MM/YYYY')
                                        AND USU_ANDFEC = 'F'    
                                        AND USU_SEQCONS = (SELECT MAX(USU_SEQCONS) FROM USU_TDEMCON WHERE TO_CHAR(USU_DATGER, 'MM/YYYY') = TO_CHAR(SYSDATE, 'MM/YYYY') AND USU_ANDFEC = 'F')
         
         ";
          $conexao = conn::getInstance();
          $stmt = $conexao->prepare($sqlTotalizadoresConsumo);
        //   $stmt->bindValue(':versao', $versao);
          $stmt->execute();
          $retornaDados = $stmt->fetch(PDO::FETCH_ASSOC);

            // Converter todos os valores para UTF-8
        // if (!empty($retornaDados) && is_array($retornaDados)) {
        //     foreach ($retornaDados as $obj) {
        //         foreach ($obj as $key => $value) {
        //             if (is_string($value)) {
        //                 $obj->$key = iconv('Windows-1252', 'UTF-8//IGNORE', $value);
        //             }
        //         }
        //     }
        // }

          //var_dump($retornaDados ); die();

          if (!empty($retornaDados) && is_array($retornaDados)) {

            print_r(json_encode(json_encode($retornaDados)));
            
          }


    }

}