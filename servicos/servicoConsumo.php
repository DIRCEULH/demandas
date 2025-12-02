

<?php
require 'connDB.php';
header('Content-Type: text/html; charset=UTF-8');
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
class servicoConsumo extends db
{

  public static function excluirVersao($versaoSelecionada,$dataVersao ) {

          $oracle = new db();

          $dataFormatada = DateTime::createFromFormat('d/m/Y', $dataVersao);

          $mesAno = $dataFormatada->format('m/Y');

          $sucesso = false;
          $erro = '';

          $sqlVerificaStatusVersao = "SELECT distinct USU_ANDFEC FROM USU_TDEMCON WHERE TO_CHAR(USU_DATGER, 'MM/YYYY') = :mesAno AND usu_seqcons = :versaoSelecionada";
          $conexao = conn::getInstance();
          $stmtSV = $conexao->prepare($sqlVerificaStatusVersao);
          $stmtSV->bindValue(':mesAno', $mesAno);
          $stmtSV->bindValue(':versaoSelecionada', $versaoSelecionada);
          $stmtSV->execute();
          $resultado = $stmtSV->fetch(PDO::FETCH_ASSOC);

          if($resultado && $resultado['USU_ANDFEC'] == 'F') {

            print_r(json_encode(["retorno"=> 'Versão já Finalizada! Não pode ser excluída. ' , "status"=> 1]));
            return ;
          } 

      try{


            $sqlExcluirVersao = "DELETE USU_TDEMCON WHERE TO_CHAR(USU_DATGER, 'MM/YYYY') = :mesAno AND usu_seqcons = :versaoSelecionada ";
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlExcluirVersao);
            $stmt->bindValue(':mesAno', $mesAno);
            $stmt->bindValue(':versaoSelecionada', $versaoSelecionada);
            $stmt->execute();

            $sqlExcluirParamVersao = " DELETE FROM USU_TDEMPAR3  WHERE TO_CHAR(USU_DATGER, 'MM/YYYY') = :mesAno AND usu_seqcons = :versaoSelecionada ";
            $conexao = conn::getInstance();
            $stmtP = $conexao->prepare($sqlExcluirParamVersao);
            $stmtP->bindValue(':mesAno', $mesAno);
            $stmtP->bindValue(':versaoSelecionada', $versaoSelecionada);
            $stmtP->execute();


        if ( $stmt->rowCount() > 0 ) {
          $sucesso = true;

        } 
        if ( $stmtP->rowCount() > 0 ) {
          $sucesso = true;

        } 
      } catch (PDOException $e) {
        $sucesso = false;
        $erro = "Erro ao excluir dados: " . $e->getMessage() . "\n";

      }   
      
      if ($sucesso) {
        print_r(json_encode(["retorno"=>"Excluido com sucesso!","status"=> 0]));
      } else {
        print_r(json_encode(["retorno"=> 'Erro ao excluir Dados : '.$erro , "status"=> 1]));
      }


  }




    public static function mostrarVersoes($datepicker ) {

      $oracle = new db();

      $dataFormatada = DateTime::createFromFormat('d/m/Y', $datepicker);

      $mesAno = $dataFormatada->format('m/Y');


      $sqlVersao = "SELECT DISTINCT USU_SEQCONS, USU_DESCON, USU_ANDFEC
              FROM USU_TDEMPAR3
              WHERE TO_CHAR(USU_DATGER , 'MM/YYYY') = '$mesAno'
              ORDER BY USU_SEQCONS DESC
              ";
      $resultados1 = $oracle->selected($sqlVersao);
      print_r(json_encode(json_encode($resultados1)));


    }


    public static function mostrarConsumo($datepicker, $versaoConsumo, $codAgc) {

        $oracle = new db();
        $whereAgc = '';
        $dataFormatada = DateTime::createFromFormat('d/m/Y', $datepicker);
        $temA = true;

        $mesAno = $dataFormatada->format('m/Y');

        $mes1 = clone $dataFormatada;
        $mes1 = $mes1->modify('+0 months')->format('m/Y');
        
        $mes2 = clone $dataFormatada;
        $mes2 = $mes2->modify('+1 months')->format('m/Y');
        
        $mes3 = clone $dataFormatada;
        $mes3 = $mes3->modify('+2 months')->format('m/Y');
        
        $mes4 = clone $dataFormatada;
        $mes4 = $mes4->modify('+3 months')->format('m/Y');
        
        $mes5 = clone $dataFormatada;
        $mes5 = $mes5->modify('+4 months')->format('m/Y');
        
        $mes6 = clone $dataFormatada;
        $mes6 = $mes6->modify('+5 months')->format('m/Y');
        
        $mes7 = clone $dataFormatada;
        $mes7 = $mes7->modify('+6 months')->format('m/Y');

    

       $sqlvalidaStatusConsumo = "  select distinct usu_andfec from  USU_TDEMCON where usu_seqcons = :versaoConsumo and TO_CHAR(USU_DATGER , 'MM/YYYY') = :mesAno " ;
       $conexao = conn::getInstance();
       $stmt = $conexao->prepare($sqlvalidaStatusConsumo);
       $stmt->bindParam(':versaoConsumo', $versaoConsumo);
       $stmt->bindParam(':mesAno', $mesAno);
       $stmt->execute();
       $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

       foreach ($returnData as $row) {
        if (stripos($row->USU_ANDFEC, 'A') !== false) {
            $temA = true;
        } else {
            $temA = false;
        }
    }

       if (!empty($codAgc)) {

        $codagcFormatado = implode(", ", array_map(function($item) {
          return "'" . trim($item) . "'";
      }, explode(",", $codAgc)));

        $whereAgc = " AND E075PRO.CODAGC IN ( $codagcFormatado ) ";

       }
    

        if ( $temA == false) {

                    $sqlUpdateVersaoFinalizada = " UPDATE USU_TDEMPAR3 SET USU_ANDFEC = 'F'
                      WHERE usu_seqcons = :USU_SEQCONS AND  TO_CHAR(USU_DATGER, 'MM/YYYY') = :MESANO 
                      ";

                    $conexao = conn::getInstance();
                    $stmt = $conexao->prepare($sqlUpdateVersaoFinalizada);
                    $stmt->bindParam(':USU_SEQCONS', $versaoConsumo);
                    $stmt->bindParam(':MESANO', $mesAno);
                    $stmt->execute();


                    $sqlConsumoGravado = "

                    SELECT  'FINALIZADO' as GRAVADO, USU_TDEMPAR3.USU_MARKU0 AS MARKUP0,
                    USU_TDEMPAR3.USU_MARKU1 AS MARKUP1,
                    USU_TDEMPAR3.USU_MARKU2 AS MARKUP2,
                    USU_TDEMPAR3.USU_MARKU3 AS MARKUP3,
                    USU_TDEMPAR3.USU_MARKU4 AS MARKUP4,
                    USU_TDEMPAR3.USU_MARKU5 AS MARKUP5,
                    USU_TDEMPAR3.USU_PERRUP AS PERRUP,
                    USU_TDEMCON.USU_ANDFEC,
                    USU_TDEMPAR3.USU_MARKU_A AS MARKU_A,
                    USU_TDEMPAR3.USU_MARKU_O AS MARKU_O,
                    USU_TDEMPAR3.USU_SEQCONS,
                    USU_TDEMPAR3.USU_PERREA AS REALIZADO,
                    USU_TDEMPAR3.USU_VLROR0 AS ORCADO_0,
                    USU_TDEMPAR3.USU_VLROR1 AS ORCADO_1,
                    USU_TDEMPAR3.USU_VLROR2 AS ORCADO_2,
                    USU_TDEMPAR3.USU_VLROR3 AS ORCADO_3,
                    USU_TDEMPAR3.USU_VLROR4 AS ORCADO_4,
                    USU_TDEMPAR3.USU_VLROR5 AS ORCADO_5,
                    USU_TDEMPAR3.USU_DESCON,
                    USU_TDEMCON.USU_CODPRO AS CODIGO,
                    USU_TDEMCON.USU_CODDER AS DERIVACAO,
                    USU_TDEMCON.USU_CURABC AS CURVA,
                    CASE 
                      WHEN USU_TDEMCON.USU_SKUDEM = '1' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - COMPRA ATIVA') 
                      WHEN USU_TDEMCON.USU_SKUDEM = '2' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - LANCAMENTO') 
                      WHEN USU_TDEMCON.USU_SKUDEM = '3' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - EM DESCONTINUACAO') 
                      WHEN USU_TDEMCON.USU_SKUDEM = '4' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - DESCONTINUADO') 
                  ELSE ' '  
                  END AS DEMANDA,
                    USU_TDEMCON.USU_QTDDEM AS PROJETADO,
                    E075PRO.DESPRO AS DESCRICAO,
                    E075PRO.CODAGC AS COMERCIAL,
                    (SELECT UNIMED
                        FROM E403FPR
                      WHERE USU_TDEMCON.USU_CODEMP = E403FPR.CODEMP
                        AND USU_TDEMCON.USU_CODDER = E403FPR.CODDER
                        AND USU_TDEMCON.USU_CODPRO = E403FPR.CODPRO
                        AND E403FPR.CODEMP = 1
                        AND E403FPR.CODFOR = 18449) AS UNIFOR,
                    (SELECT QTDMIN
                        FROM E403FPR
                      WHERE USU_TDEMCON.USU_CODEMP = E403FPR.CODEMP
                        AND USU_TDEMCON.USU_CODDER = E403FPR.CODDER
                        AND USU_TDEMCON.USU_CODPRO = E403FPR.CODPRO
                        AND E403FPR.CODEMP = 1
                        AND E403FPR.CODFOR = 18449) AS QTD_FOR,
                    USU_TDEMCON.USU_QTDOC0 AS QTDOC0,
                    USU_TDEMCON.USU_QTDOC1 AS QTDOC1,
                    USU_TDEMCON.USU_QTDOC2 AS QTDOC2,
                    USU_TDEMCON.USU_QTDOC3 AS QTDOC3,
                    USU_TDEMCON.USU_QTDOC4 AS QTDOC4,
                    USU_TDEMCON.USU_QTDOC5 AS QTDOC5,
                    USU_TDEMCON.USU_QTDCO0 AS QTDCO0,
                    USU_TDEMCON.USU_QTDCO1 AS QTDCO1,
                    USU_TDEMCON.USU_QTDCO2 AS QTDCO2,
                    USU_TDEMCON.USU_QTDCO3 AS QTDCO3,
                    USU_TDEMCON.USU_QTDCO4 AS QTDCO4,
                    USU_TDEMCON.USU_QTDCO5 AS QTDCO5,
                    USU_TDEMCON.USU_QTDCON AS QTDCON,
                    USU_TDEMCON.USU_QTDMES AS QTDMES,
                    USU_TDEMCON.USU_QTDCOB AS QTDCOB,
                    USU_TDEMCON.USU_OBSALT AS OBSALT    
              FROM USU_TDEMPAR3, USU_TDEMCON, E075PRO
            WHERE TO_CHAR(USU_TDEMPAR3.USU_DATGER , 'MM/YYYY') = '$mesAno'
              AND TO_CHAR(USU_TDEMPAR3.USU_DATGER, 'MM') = TO_CHAR(USU_TDEMCON.USU_DATGER, 'MM')
              AND USU_TDEMPAR3.USU_SEQCONS = USU_TDEMCON.USU_SEQCONS
              AND USU_TDEMCON.USU_CODPRO = E075PRO.CODPRO
              AND USU_TDEMCON.USU_CODEMP = E075PRO.CODEMP
              AND USU_TDEMPAR3. USU_SEQCONS = '$versaoConsumo'
              $whereAgc  ";

          $retornoVersaoGravada= $oracle->selected($sqlConsumoGravado);

          print_r(json_encode(json_encode($retornoVersaoGravada)));



        }  else {        
        
try {

         $sqlConsumoNovo = "

                       SELECT *
                      FROM (
                      SELECT 'A' AS USU_ANDFEC, E075PRO.CODPRO AS CODIGO,
                       E075DER.CODDER AS DERIVACAO,
                       E075DER.USU_SKUDEM AS SITUACAO,
                      CASE 
                    WHEN  E075DER.USU_SKUDEM  = '1' THEN CONCAT( E075DER.USU_SKUDEM , ' - COMPRA ATIVA') 
                    WHEN  E075DER.USU_SKUDEM = '2' THEN CONCAT( E075DER.USU_SKUDEM , ' - LANCAMENTO') 
                    WHEN  E075DER.USU_SKUDEM = '3' THEN CONCAT( E075DER.USU_SKUDEM , ' - EM DESCONTINUACAO') 
                    WHEN  E075DER.USU_SKUDEM  = '4' THEN CONCAT( E075DER.USU_SKUDEM , ' - DESCONTINUADO') 
                 ELSE ' '  
                END AS DEMANDA,
                                  E012FAM.DESFAM AS FAMILIA, E013AGP.CODAGP AS COMERCIAL, E075PRO.DESPRO AS DESCRICAO,
                                  E075DER.CURABC AS CURVA, TO_CHAR(E420IPO.DATENT, 'MM/YYYY') AS PREVISAO,
                        (SELECT SUM(E210EST.QTDEST - E210EST.QTDRES - E210EST.QTDRAE)
                                      FROM E210EST
                                    WHERE E210EST.CODEMP = E075DER.CODEMP
                                      AND E210EST.CODPRO = E075DER.CODPRO
                                      AND E210EST.CODDER = E075DER.CODDER
                                      AND E210EST.CODDEP IN ('490','492','423')) AS QTDCO0,
                        (SELECT USU_TDEMPRO.USU_QTDDEM
                                      FROM USU_TDEMPRO
                                    WHERE USU_CODPRO = E075PRO.CODPRO
                                      AND USU_CODDER = E075DER.CODDER
                                      AND USU_CODEMP = E075PRO.CODEMP
                          AND USU_CODEMP = 1  
                                      AND USU_DATGER BETWEEN TRUNC(SYSDATE, 'MM') AND
                                          LAST_DAY(SYSDATE)) AS PROJETADO,
                                  E420IPO.QTDABE AS QUANTIDADE,
                        (SELECT UNIMED
                                      FROM E403FPR
                                    WHERE E075DER.CODEMP = E403FPR.CODEMP
                                      AND E075DER.CODDER = E403FPR.CODDER
                                      AND E075DER.CODPRO = E403FPR.CODPRO
                                      AND E403FPR.CODEMP = 1
                                  AND E403FPR.CODFOR = 18449) AS UNIFOR, 
                                      (SELECT QTDMIN
                                      FROM E403FPR
                                    WHERE E075DER.CODEMP = E403FPR.CODEMP
                                      AND E075DER.CODDER = E403FPR.CODDER
                                      AND E075DER.CODPRO = E403FPR.CODPRO
                                      AND E403FPR.CODEMP = 1
                                      AND E403FPR.CODFOR = 18449) AS QTD_FOR
                              FROM E075PRO
                            INNER JOIN E075DER
                                ON E075PRO.CODEMP = E075DER.CODEMP
                              AND E075PRO.CODPRO = E075DER.CODPRO
                              AND E075DER.SITDER = 'A'
                          AND E075DER.USU_SKUDEM IS NOT NULL
                              LEFT JOIN E420IPO
                                ON E420IPO.CODEMP = E075PRO.CODEMP
                              AND E420IPO.CODPRO = E075PRO.CODPRO
                              AND E420IPO.CODFIL IN (1, 5)
                              AND E420IPO.DATENT BETWEEN TRUNC(SYSDATE, 'MM') AND
                                  LAST_DAY(ADD_MONTHS(SYSDATE, 5))
                              LEFT JOIN E420OCP
                                ON E420IPO.CODEMP = E420OCP.CODEMP
                              AND E420IPO.CODFIL = E420OCP.CODFIL
                              AND E420IPO.NUMOCP = E420OCP.NUMOCP
                              AND E420OCP.SITOCP NOT IN (4, 5, 9)
                            INNER JOIN E013AGP
                                ON E013AGP.CODEMP = E075PRO.CODEMP
                              AND E013AGP.CODAGP = E075PRO.CODAGC
                              LEFT JOIN E012FAM
                                ON E075PRO.CODEMP = E012FAM.CODEMP
                              AND E075PRO.CODFAM = E012FAM.CODFAM
                            WHERE E075PRO.USU_ORIMER = 'I'
                              AND E075PRO.SITPRO = 'A'
                              AND E075PRO.CODORI = '800'
                              AND E075PRO.CODEMP = 1
                              AND E075PRO.CODAGC NOT IN
                                  ('C200', 'C950', 'C012', 'C015', 'C190', 'C193')
                              -- AND E075PRO.CODPRO IN ('40301200')
                             $whereAgc 
                                          )
                    PIVOT(SUM(QUANTIDADE)
                      FOR PREVISAO IN('$mes1' AS QTDOC0,
                                      '$mes2' AS QTDOC1,
                                      '$mes3' AS QTDOC2,
                                      '$mes4' AS QTDOC3,
                                      '$mes5' AS QTDOC4,
                                      '$mes6' AS QTDOC5))




        ";


        $resultados1 = $oracle->selected($sqlConsumoNovo);
        // print_r(json_encode($resultados1));


        $sqlPar = " SELECT USU_MARKU0 MARKUP0,USU_MARKU1 MARKUP1,USU_MARKU2 MARKUP2,USU_MARKU3 MARKUP3,USU_MARKU4 MARKUP4,USU_MARKU5 MARKUP5  FROM USU_TDEMPAR2 WHERE USU_CODEMP = 1  AND USU_DATGER >= TRUNC(SYSDATE, 'MM') ";
        $resultadoParametros = $oracle->selected($sqlPar);


        $sqlOrcados = " SELECT *
                          FROM (SELECT TO_CHAR(USU_MESANO, 'MM/YYYY') AS MES_ANO, USU_VLRORC
                                  FROM USU_TESTORC
                                WHERE TO_CHAR(USU_MESANO, 'MM/YYYY') BETWEEN
                                      TO_CHAR(TRUNC(SYSDATE, 'MM'), 'MM/YYYY') AND
                                      TO_CHAR(ADD_MONTHS(TRUNC(SYSDATE, 'MM'), 5), 'MM/YYYY')
                                  AND USU_CODREP = 900000
                                  AND USU_SIGUFS = 'SC')
                        PIVOT(SUM(USU_VLRORC)
                          FOR MES_ANO IN('$mes1' AS ORCADO_0,
                                          '$mes2' AS ORCADO_1,
                                          '$mes3' AS ORCADO_2,
                                          '$mes4' AS ORCADO_3,
                                          '$mes5' AS ORCADO_4,
                                          '$mes6' AS ORCADO_5)) ";
        
         $resultadoOrcados = $oracle->selected($sqlOrcados);



     /*---------------------------------------------------------*/

            $sqlRealizado = " SELECT TO_CHAR(NFV.DATEMI, 'MM/YYYY') AS MESANO,
                                      ROUND(SUM(IPV.VLRLIQ -
                                                (IPV.VLRIPI + IPV.VLRICS + IPV.ICMVDE + IPV.ICMVFC)),
                                            0) AS REALIZADO
                                FROM E140IPV IPV
                                  JOIN E140NFV NFV
                                    ON IPV.CODEMP = NFV.CODEMP
                                  AND IPV.CODFIL = NFV.CODFIL
                                  AND IPV.CODSNF = NFV.CODSNF
                                  AND IPV.NUMNFV = NFV.NUMNFV
                                  JOIN E001TNS TNS
                                    ON IPV.CODEMP = TNS.CODEMP
                                  AND IPV.TNSPRO = TNS.CODTNS
                                  JOIN E140IDE IDE
                                    ON IDE.CODEMP = NFV.CODEMP
                                  AND IDE.CODFIL = NFV.CODFIL
                                  AND IDE.CODSNF = NFV.CODSNF
                                  AND IDE.NUMNFV = NFV.NUMNFV
                                  JOIN E075PRO PRO
                                    ON IPV.CODEMP = PRO.CODEMP
                                  AND IPV.CODPRO = PRO.CODPRO
                                  JOIN E013AGP AGP
                                    ON PRO.CODEMP = AGP.CODEMP
                                  AND PRO.CODAGC = AGP.CODAGP
                                  JOIN E075DER DER
                                    ON IPV.CODEMP = DER.CODEMP
                                  AND IPV.CODPRO = DER.CODPRO
                                  AND IPV.CODDER = DER.CODDER
                                WHERE IPV.CODEMP = 1
                                  AND IPV.CODFIL IN (1, 5)
                                  AND TNS.VENFAT = 'S'
                                  AND TNS.VENTCF <> 'I'
                                  AND NFV.SITNFV = '2'
                                  AND IDE.SITDOE = 3
                                  AND NFV.DATEMI BETWEEN TRUNC(SYSDATE, 'MM') AND LAST_DAY(SYSDATE)
                                  AND PRO.USU_ORIMER = 'I'
                                  AND PRO.CODAGC NOT IN ('C200', 'C950', 'C012', 'C015', 'C190', 'C193')
                                GROUP BY TO_CHAR(NFV.DATEMI, 'MM/YYYY')
                                ";

        $resultadoRealizado = $oracle->selected($sqlRealizado);

  /*---------------------------------------------------------*/
      $dadosCombinados = [];

      $item3 = $resultadoParametros[0];
      $item4 = $resultadoOrcados[0];
      $item5 = $resultadoRealizado[0];

      // Assumimos que $resultados2 contém apenas um item
     // $item2 = $resultados2[0];
      

      foreach ($resultados1 as $item1) {

        $sqlConsumoGravado = "

                  SELECT 
                  'OK' AS GRAVADO,
                  USU_TDEMCON.USU_ANDFEC ,
                  USU_TDEMPAR3.USU_MARKU_A AS MARKU_A,
                  USU_TDEMPAR3.USU_MARKU_O AS MARKU_O,
                  USU_TDEMPAR3.USU_SEQCONS,
                  USU_TDEMPAR3.USU_PERREA AS REALIZADO,
                  USU_TDEMPAR3.USU_DESCON,
                  USU_TDEMCON.USU_CODPRO AS CODIGO,
                  USU_TDEMCON.USU_CODDER AS DERIVACAO,
                  USU_TDEMCON.USU_CURABC AS CURVA,
                  CASE 
                    WHEN USU_TDEMCON.USU_SKUDEM = '1' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - COMPRA ATIVA') 
                    WHEN USU_TDEMCON.USU_SKUDEM = '2' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - LANCAMENTO') 
                    WHEN USU_TDEMCON.USU_SKUDEM = '3' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - EM DESCONTINUACAO') 
                    WHEN USU_TDEMCON.USU_SKUDEM = '4' THEN CONCAT(USU_TDEMCON.USU_SKUDEM, ' - DESCONTINUADO') 
                 ELSE ' '  
                END AS DEMANDA,
                  USU_TDEMCON.USU_QTDDEM AS PROJETADO,
                  E075PRO.DESPRO AS DESCRICAO,
                  E075PRO.CODAGC AS COMERCIAL,
                  (SELECT UNIMED
                      FROM E403FPR
                    WHERE USU_TDEMCON.USU_CODEMP = E403FPR.CODEMP
                      AND USU_TDEMCON.USU_CODDER = E403FPR.CODDER
                      AND USU_TDEMCON.USU_CODPRO = E403FPR.CODPRO
                      AND E403FPR.CODEMP = 1
                      AND E403FPR.CODFOR = 18449) AS UNIFOR,
                  (SELECT QTDMIN
                      FROM E403FPR
                    WHERE USU_TDEMCON.USU_CODEMP = E403FPR.CODEMP
                      AND USU_TDEMCON.USU_CODDER = E403FPR.CODDER
                      AND USU_TDEMCON.USU_CODPRO = E403FPR.CODPRO
                      AND E403FPR.CODEMP = 1
                      AND E403FPR.CODFOR = 18449) AS QTD_FOR,
                  USU_TDEMCON.USU_QTDOC0 AS QTDOC0G,
                  USU_TDEMCON.USU_QTDOC1 AS QTDOC1G,
                  USU_TDEMCON.USU_QTDOC2 AS QTDOC2G,
                  USU_TDEMCON.USU_QTDOC3 AS QTDOC3G,
                  USU_TDEMCON.USU_QTDOC4 AS QTDOC4G,
                  USU_TDEMCON.USU_QTDOC5 AS QTDOC5G,
                  USU_TDEMCON.USU_QTDCO0 AS QTDCO0G,
                  USU_TDEMCON.USU_QTDCO1 AS QTDCO1G,
                  USU_TDEMCON.USU_QTDCO2 AS QTDCO2G,
                  USU_TDEMCON.USU_QTDCO3 AS QTDCO3G,
                  USU_TDEMCON.USU_QTDCO4 AS QTDCO4G,
                  USU_TDEMCON.USU_QTDCO5 AS QTDCO5G,
                  USU_TDEMCON.USU_QTDCON AS QTDCON,
                  USU_TDEMCON.USU_QTDMES AS QTDMES,
                  USU_TDEMCON.USU_QTDCOB AS QTDCOB,
                  USU_TDEMCON.USU_OBSALT AS OBSALT    
            FROM USU_TDEMPAR3, USU_TDEMCON, E075PRO
          WHERE TO_CHAR(USU_TDEMPAR3.USU_DATGER , 'MM/YYYY') = '$mesAno'
            AND TO_CHAR(USU_TDEMPAR3.USU_DATGER, 'MM') = TO_CHAR(USU_TDEMCON.USU_DATGER, 'MM')
            AND USU_TDEMPAR3.USU_SEQCONS = USU_TDEMCON.USU_SEQCONS
            AND USU_TDEMCON.USU_CODPRO = E075PRO.CODPRO
            AND USU_TDEMCON.USU_CODEMP = E075PRO.CODEMP
            AND USU_TDEMPAR3. USU_SEQCONS = '$versaoConsumo'
            AND USU_TDEMCON.USU_CODPRO = '$item1->CODIGO'
            AND USU_TDEMCON.USU_CODDER = '$item1->DERIVACAO'  ";



        $resultados2 = $oracle->selected($sqlConsumoGravado);

         //var_dump($resultados2); die();

        if (empty($resultados2))
        {
          $resultados2[] = Array('GRAVADO' => '', 'QTDCON' => '','QTDCOB' => '',
          'QTDOC0G' => '', 'QTDOC1G' => '' , 'QTDOC2G' => '', 'QTDOC3G' => '',
           'QTDOC4G' => '', 'QTDOC5G' => '' , 'QTDCO0G' => '', 'QTDCO1G' => '' ,
            'QTDCO2G' => '', 'QTDCO3G' => '', 'QTDCO4G' => '', 'QTDCO5G' => '' ,
             'QTDMES' => '', 'USU_ANDFEC' => ''  );
        }

          $item2 = $resultados2[0];


          // Criando um novo objeto para combinar os dados
          $novoObjeto = new stdClass();
          
          // Copia os dados de $item1
          foreach ($item1 as $key => $value) {
              $novoObjeto->$key = $value;
          }
  

          foreach ($item2 as $key => $value) {
            $novoObjeto->$key = $value;

          }

          foreach ($item3 as $key => $value) {
            $novoObjeto->$key = $value;
          }

          foreach ($item4 as $key => $value) {
            $novoObjeto->$key = $value;
          }

          foreach ($item5 as $key => $value) {
            $novoObjeto->$key = $value;
          }
            
            
  
          // Adiciona o objeto combinado ao array de resultados
          $dadosCombinados[] = $novoObjeto;

      }


     // var_dump($dadosCombinados); die();


      print_r(json_encode(json_encode($dadosCombinados)));

      //print_r(json_encode($resultados1));

    } catch (PDOException $e) {
        echo "Erro: " . $e->getMessage();
    }
  }  
}



    public static function salvarVersao($codigoUsuario, $nomeVersao, $dadosRecuperadosParametrosConsumo ) {

      $oracle = new db();

      $mesAno =  date('m/Y');
      $dataFormatada = $data = new DateTime();
      
      $marku0 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU0'];
      $marku1 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU1'];
      $marku2 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU2'];
      $marku3 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU3'];
      $marku4 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU4'];
      $marku5 =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU5'];
      $perrup =  $dadosRecuperadosParametrosConsumo[0]['USU_PERRUP'];
      $marku_A =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU_A'];
      $marku_O =  $dadosRecuperadosParametrosConsumo[0]['USU_MARKU_O'];


      $mes1 = clone $dataFormatada;
      $mes1 = $mes1->modify('+0 months')->format('m/Y');
  
      $mes2 = clone $dataFormatada;
      $mes2 = $mes2->modify('+1 months')->format('m/Y');
      
      $mes3 = clone $dataFormatada;
      $mes3 = $mes3->modify('+2 months')->format('m/Y');
      
      $mes4 = clone $dataFormatada;
      $mes4 = $mes4->modify('+3 months')->format('m/Y');
      
      $mes5 = clone $dataFormatada;
      $mes5 = $mes5->modify('+4 months')->format('m/Y');
      
      $mes6 = clone $dataFormatada;
      $mes6 = $mes6->modify('+5 months')->format('m/Y');
      
      $mes7 = clone $dataFormatada;
      $mes7 = $mes7->modify('+6 months')->format('m/Y');

      $sqlOrcados = " SELECT *
      FROM (SELECT TO_CHAR(USU_MESANO, 'MM/YYYY') AS MES_ANO, USU_VLRORC
              FROM USU_TESTORC
            WHERE TO_CHAR(USU_MESANO, 'MM/YYYY') BETWEEN
                  TO_CHAR(TRUNC(SYSDATE, 'MM'), 'MM/YYYY') AND
                  TO_CHAR(ADD_MONTHS(TRUNC(SYSDATE, 'MM'), 5), 'MM/YYYY')
              AND USU_CODREP = 900000
              AND USU_SIGUFS = 'SC')
    PIVOT(SUM(USU_VLRORC)
      FOR MES_ANO IN('$mes1' AS ORCADO_0,
                      '$mes2' AS ORCADO_1,
                      '$mes3' AS ORCADO_2,
                      '$mes4' AS ORCADO_3,
                      '$mes5' AS ORCADO_4,
                      '$mes6' AS ORCADO_5)) ";

      $resultadoOrcados = $oracle->selected($sqlOrcados);

  

try{

                $sqlVersao = "
                INSERT INTO USU_TDEMPAR3 (
                    USU_CODEMP, USU_SEQCONS, USU_DATGER, USU_USUGER, USU_DESCON,
                    USU_ANDFEC, USU_MARKU0, USU_MARKU1, USU_MARKU2, USU_MARKU3,
                    USU_MARKU4, USU_MARKU5, USU_PERRUP, USU_DATALT, USU_USUALT,
                    USU_MARKU_A, USU_MARKU_O,
                    USU_VLROR0,USU_VLROR1,USU_VLROR2,USU_VLROR3,USU_VLROR4,USU_VLROR5
                )
                SELECT
                    1,
                    (
                        SELECT NVL(MAX(USU_SEQCONS), 0) + 1
                        FROM USU_TDEMPAR3
                        WHERE USU_CODEMP = 1 AND TO_CHAR(USU_DATGER, 'MM/YYYY') = :mesAno
                    ),
                    TRUNC(SYSDATE),
                    :codigoUsuario,
                    :nomeVersao,
                    'A',
                    :marku0,
                    :marku1,
                    :marku2,
                    :marku3,
                    :marku4,
                    :marku5,
                    :perrup,
                    TRUNC(SYSDATE),
                    :codigoUsuarioAlt,
                    :marku_A,
                    :marku_O,
                    :USU_VLROR0, :USU_VLROR1, :USU_VLROR2, :USU_VLROR3, :USU_VLROR4, :USU_VLROR5
                FROM DUAL
              ";

              $conexao = conn::getInstance();
              $stmt = $conexao->prepare($sqlVersao);

              // Exemplo: se precisar converter para Windows-1252
              $nomeVersao = iconv("UTF-8", "Windows-1252//IGNORE", $nomeVersao);

              $stmt->bindValue(':mesAno', $mesAno);
              $stmt->bindValue(':codigoUsuario', $codigoUsuario, PDO::PARAM_INT);
              $stmt->bindValue(':nomeVersao', $nomeVersao);
              $stmt->bindValue(':marku0', $marku0);
              $stmt->bindValue(':marku1', $marku1);
              $stmt->bindValue(':marku2', $marku2);
              $stmt->bindValue(':marku3', $marku3);
              $stmt->bindValue(':marku4', $marku4);
              $stmt->bindValue(':marku5', $marku5);
              $stmt->bindValue(':perrup', $perrup);
              $stmt->bindValue(':codigoUsuarioAlt', $codigoUsuario, PDO::PARAM_INT);
              $stmt->bindValue(':marku_A', $marku_A);
              $stmt->bindValue(':marku_O', $marku_O);

              $stmt->bindValue(':USU_VLROR0', $resultadoOrcados[0]->ORCADO_0);
              $stmt->bindValue(':USU_VLROR1', $resultadoOrcados[0]->ORCADO_1);
              $stmt->bindValue(':USU_VLROR2', $resultadoOrcados[0]->ORCADO_2);
              $stmt->bindValue(':USU_VLROR3', $resultadoOrcados[0]->ORCADO_3);
              $stmt->bindValue(':USU_VLROR4', $resultadoOrcados[0]->ORCADO_4);
              $stmt->bindValue(':USU_VLROR5', $resultadoOrcados[0]->ORCADO_5);
              $stmt->execute();


        if ( $stmt->rowCount() > 0 ) {
          $sucesso = true;

        } 
    } catch (PDOException $e) {
        $sucesso = false;
        $erro = "Erro ao gravar dados: " . $e->getMessage() . "\n";

    }


    if ($sucesso) {
      print_r(json_encode(["retorno"=>"Salvo com sucesso!","status"=> 0]));
    } else {
      print_r(json_encode(["retorno"=> 'Erro ao Salvar Dados : '.$erro , "status"=> 1]));
    }

    }


public static function salvarConsumoLinha($arrayDadosLinha,$dataVersao) {   
      
      $sucesso = true;
      $dataAtual = date('d/m/Y');
      $erro = '';
      $executouUpdate = false;


  foreach ($arrayDadosLinha as $json_value) {



          // Extrai os valores necessários
          $USU_SEQCONS = preg_replace("/[.,#$]/", "", $json_value['USU_SEQCONS']) ?? null;
          //$USU_CODPRO = $json_value['USU_CODPRO'] ?? null;
          $USU_CODPRO = isset($json_value['USU_CODPRO']) ? strval($json_value['USU_CODPRO']) : null;
          $USU_CODDER = empty($json_value['USU_CODDER']) ? " " :  $json_value['USU_CODDER'] ;
          $USU_CURABC = $json_value['USU_CURABC'] ?? null;
          $USU_SKUDEM = $json_value['USU_SKUDEM'] ?? null;
          $USU_QTDDEM = preg_replace("/[.,#$]/", "", $json_value['USU_QTDDEM']) ?? null;
          $USU_QTDOC0 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC0']) ?? null;
          $USU_QTDOC1 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC1']) ?? null;
          $USU_QTDOC2 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC2']) ?? null;
          $USU_QTDOC3 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC3']) ?? null;
          $USU_QTDOC4 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC4']) ?? null;
          $USU_QTDOC5 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDOC5']) ?? null;
          $USU_QTDCO0 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO0']) ?? null;
          $USU_QTDCO1 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO1']) ?? null;
          $USU_QTDCO2 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO2']) ?? null;
          $USU_QTDCO3 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO3']) ?? null;
          $USU_QTDCO4 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO4']) ?? null;
          $USU_QTDCO5 = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCO5']) ?? null;
          $USU_QTDCON = preg_replace("/[.,#$]/", "", $json_value['USU_QTDCON']) ?? null;
          $USU_QTDMES =  $json_value['USU_QTDMES'] ?? null;
          $USU_QTDCOB =  $json_value['USU_QTDCOB'] ?? null;
          $USU_OBSALT = $json_value['USU_OBSALT'] ?? null;
          $codigoUsuario = $json_value['codigoUsuario'] ?? null;
          $USU_ANDFEC = $json_value['USU_ANDFEC'] ?? null;


          $mesAno  =  DateTime::createFromFormat('d/m/Y', $dataVersao)->format('m/Y');


          /*
           * grava o reaqlizado do Mes na TDEMPAR3
           * */

          if($json_value['realizadoMes'] !== 'Linha' && !$executouUpdate)
          {

          $sqlUpdateRealizadoMes = " UPDATE USU_TDEMPAR3 SET USU_PERREA = :realizadoMes
          WHERE usu_seqcons = :USU_SEQCONS AND  TO_CHAR(USU_DATGER, 'MM/YYYY') = :MESANO 
          ";

          $conexao = conn::getInstance();
          $stmt = $conexao->prepare($sqlUpdateRealizadoMes);
          $stmt->bindParam(':USU_SEQCONS', $USU_SEQCONS);
          $stmt->bindParam(':MESANO', $mesAno);
          $stmt->bindParam(':realizadoMes',$json_value['realizadoMes']);
          $stmt->execute();

          $executouUpdate = true; 

          
          }

          // Verificar se o dado já existe
          $sqlCheck = "SELECT COUNT(*) FROM USU_TDEMCON 
                       WHERE usu_seqcons = :USU_SEQCONS AND usu_codpro = :USU_CODPRO AND usu_codder = :USU_CODDER AND  TO_CHAR(USU_DATGER, 'MM/YYYY') = :MESANO ";
          $conexao = conn::getInstance();
          $stmtCheck = $conexao->prepare($sqlCheck);
          $stmtCheck->bindParam(':USU_SEQCONS', $USU_SEQCONS);
          $stmtCheck->bindParam(':USU_CODPRO', $USU_CODPRO);
          $stmtCheck->bindParam(':USU_CODDER', $USU_CODDER);
          $stmtCheck->bindParam(':MESANO', $mesAno );
          $stmtCheck->execute();
        
          // Verificar se algum registro foi encontrado
          $result = $stmtCheck->fetchColumn();
        
          // Se o dado não existir, realiza o INSERT
          if ($result == 0 && !empty($USU_CODPRO )) {

      
             // Construção do SQL
            $sqlInsertConsumo = "INSERT INTO USU_TDEMCON 
                              (USU_CODEMP, USU_DATGER, USU_SEQCONS, USU_CODPRO, USU_CODDER, USU_CURABC, USU_SKUDEM, USU_QTDDEM,
                              USU_QTDOC0, USU_QTDOC1, USU_QTDOC2, USU_QTDOC3, USU_QTDOC4, USU_QTDOC5, USU_QTDCO0, USU_QTDCO1,
                              USU_QTDCO2, USU_QTDCO3, USU_QTDCO4, USU_QTDCO5, USU_QTDCON, USU_QTDMES, USU_QTDCOB, USU_OBSALT,
                              USU_USUGER, USU_USUALT, USU_ANDFEC, USU_DATALT)
                            VALUES
                              (1,   TO_DATE(:USU_DATGER, 'DD/MM/YYYY') , :USU_SEQCONS, :USU_CODPRO, :USU_CODDER, :USU_CURABC, :USU_SKUDEM, :USU_QTDDEM, 
                                :USU_QTDOC0, :USU_QTDOC1, :USU_QTDOC2, :USU_QTDOC3, :USU_QTDOC4, :USU_QTDOC5, :USU_QTDCO0, :USU_QTDCO1,
                                :USU_QTDCO2, :USU_QTDCO3,  :USU_QTDCO4 , :USU_QTDCO5, :USU_QTDCON, :USU_QTDMES, :USU_QTDCOB, :USU_OBSALT,
                                :USU_USUGER, :USU_USUALT, :USU_ANDFEC ,   TO_DATE(:USU_DATALT,'DD/MM/YYYY') )
                          ";

               // var_dump($USU_QTDCO5); die();

              //  $USU_QTDCO5= 85;
              //  $USU_QTDCOB = 85;

        try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlInsertConsumo);
            $stmt->bindParam(':USU_SEQCONS', $USU_SEQCONS);
            $stmt->bindParam(':USU_CODPRO', $USU_CODPRO);
            $stmt->bindParam(':USU_CODDER', $USU_CODDER);
            $stmt->bindParam(':USU_CURABC', $USU_CURABC);
            $stmt->bindParam(':USU_SKUDEM', $USU_SKUDEM);
            $stmt->bindParam(':USU_QTDDEM', $USU_QTDDEM);
            $stmt->bindParam(':USU_QTDOC0', $USU_QTDOC0);
            $stmt->bindParam(':USU_QTDOC1', $USU_QTDOC1);
            $stmt->bindParam(':USU_QTDOC2', $USU_QTDOC2);
            $stmt->bindParam(':USU_QTDOC3', $USU_QTDOC3);
            $stmt->bindParam(':USU_QTDOC4', $USU_QTDOC4);
            $stmt->bindParam(':USU_QTDOC5', $USU_QTDOC5);
            $stmt->bindParam(':USU_QTDCO0', $USU_QTDCO0);
            $stmt->bindParam(':USU_QTDCO1', $USU_QTDCO1);
            $stmt->bindParam(':USU_QTDCO2', $USU_QTDCO2);
            $stmt->bindParam(':USU_QTDCO3', $USU_QTDCO3);
            $stmt->bindParam(':USU_QTDCO4', $USU_QTDCO4);
            $stmt->bindParam(':USU_QTDCO5', $USU_QTDCO5);
            $stmt->bindParam(':USU_QTDMES', $USU_QTDMES);
            $stmt->bindParam(':USU_QTDCOB', $USU_QTDCOB);
            $stmt->bindParam(':USU_OBSALT', $USU_OBSALT);
            $stmt->bindParam(':USU_USUGER', $codigoUsuario);
            $stmt->bindParam(':USU_USUALT', $codigoUsuario);
            $stmt->bindParam(':USU_ANDFEC', $USU_ANDFEC);
            $stmt->bindParam(':USU_QTDCON', $USU_QTDCON);
            $stmt->bindParam(':USU_DATGER', $dataVersao);
            $stmt->bindParam(':USU_DATALT', $dataAtual);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);


            if ( $stmt->rowCount() > 0 ) {
              $sucesso = true;

            } 

            } catch (PDOException $e) {
              $erro = "Erro ao atualizar o código $USU_CODPRO: " . $e->getMessage() . "\n";
              $sucesso = false;

            }
      } else {

        //var_dump($USU_CODPRO); die();

           $sqlUpdateConsumo = " UPDATE USU_TDEMCON 
                                  SET USU_QTDCON = :USU_QTDCON , USU_OBSALT = :USU_OBSALT, USU_USUALT = :USU_USUALT,USU_ANDFEC = :USU_ANDFEC, USU_DATALT = TO_DATE(:USU_DATALT,'DD/MM/YYYY')
                                    WHERE usu_seqcons = :USU_SEQCONS AND usu_codpro = :USU_CODPRO AND usu_codder = :USU_CODDER AND  TO_CHAR(USU_DATGER, 'MM/YYYY') = :MESANO 
                                    ";

          try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlUpdateConsumo);
            $stmt->bindParam(':USU_SEQCONS', $USU_SEQCONS);
            $stmt->bindParam(':USU_CODPRO', $USU_CODPRO);
            $stmt->bindParam(':USU_CODDER', $USU_CODDER);
            $stmt->bindParam(':MESANO', $mesAno );
            $stmt->bindParam(':USU_DATALT', $dataAtual );
            $stmt->bindParam(':USU_QTDCON', $USU_QTDCON);
            $stmt->bindParam(':USU_OBSALT', $USU_OBSALT);
            $stmt->bindParam(':USU_USUALT', $codigoUsuario);
            $stmt->bindParam(':USU_ANDFEC', $USU_ANDFEC);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

            if ( $stmt->rowCount() > 0 ) {
              $sucesso = true;

            } 
         
          } catch (PDOException $e) {
          $erro = "Erro ao atualizar o código $USU_CODPRO: " . $e->getMessage() . "\n";
          $sucesso = false;

         }


     }
 }

         // Retorno da resposta

          if ($sucesso) {
              print_r(json_encode(["retorno"=>"Salvo com sucesso!","status"=> 0]));
          } else {
              print_r(json_encode(["retorno"=> 'Erro ao Salvar Dados : '.$erro , "status"=> 1]));
          }

}
            

public static function salvarObservacao($codigoProduto,$versaoAlterada,$dataAlteracao,$obs) {   

      $sucesso = false;
      $dataFormatada = DateTime::createFromFormat('d/m/Y', $dataAlteracao);
      $mesAno = $dataFormatada->format('m/Y');

      //var_dump( $mesAno); die();

      $sqlUpdateObservacao = " UPDATE USU_TDEMCON  SET  USU_OBSALT = :obs WHERE usu_codpro = :codigoProduto and usu_seqcons = :versaoAlterada and TO_CHAR(USU_DATGER , 'MM/YYYY') = :mesAno ";

      try{
      $conexao = conn::getInstance();
      $stmt = $conexao->prepare($sqlUpdateObservacao);
      $stmt->bindParam(':codigoProduto', $codigoProduto);
      $stmt->bindParam(':versaoAlterada', $versaoAlterada);
      $stmt->bindParam(':mesAno', $mesAno);
      $stmt->bindParam(':obs', $obs);

      $stmt->execute();

      if ( $stmt->rowCount() > 0 ) {
      $sucesso = true;

      } 

      } catch (PDOException $e) {
      $erro = "Erro ao atualizar o código $codigoProduto: " . $e->getMessage() . "\n";
      $sucesso = false;

      }

      if ($sucesso) {
        print_r(json_encode(["retorno"=>"Salvo com sucesso!","status"=> 0]));
    } else {
        print_r(json_encode(["retorno"=> 'Erro ao Salvar Dados : '.$erro , "status"=> 1]));
    }


}


}
?>