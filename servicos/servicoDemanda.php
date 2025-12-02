

<?php
require 'connDB.php';
header('Content-Type: text/html; charset=UTF-8');
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
class servicoDemanda extends db
{


    public static function mostrarDemanda($dateRegistration, $codagc ) {

        $oracle = new db();

        $whereAgc= '';
        $whereCodDep = '';

        $dataAtual = date('m/Y',strtotime($dateRegistration)); 
        $dataMesFiltro = date('m',strtotime($dateRegistration)); 
        $dataAnoFiltro = date('Y',strtotime($dateRegistration)); 

        $data = DateTime::createFromFormat('m/Y', $dataAtual);

        $mes1 =     $data->modify('-6 months')->format('m/Y');
        $mes2 =     $data->modify('+1 months')->format('m/Y') ;
        $mes3 =     $data->modify('+1 months')->format('m/Y');
        $mes4 =     $data->modify('+1 months')->format('m/Y');
        $mes5 =     $data->modify('+1 months')->format('m/Y');
        $mes6 =     $data->modify('+1 months')->format('m/Y');
        $mes7 =     $data->modify('+0 months')->format('m/Y');


       if (!empty($codagc)) {

        $codagcFormatado = implode(", ", array_map(function($item) {
          return "'" . trim($item) . "'";
      }, explode(",", $codagc)));

        $whereAgc = " AND E075PRO.CODAGC IN ( $codagcFormatado ) ";

       }

           // Verificar se o dado depositos e parametros já existe
           $sqlCheck = "SELECT USU_DEPCON
           FROM USU_TDEMPAR
           WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY') ";
           $conexao = conn::getInstance();
           $stmtCheck = $conexao->prepare($sqlCheck);
           $stmtCheck->execute();
          //  $result = $stmtCheck->fetchColumn();
           $returnData = $stmtCheck->fetchAll(PDO::FETCH_OBJ);
           //var_dump($returnData[0]->USU_DEPCON  ); die();

          // Se o dado existir filtra no sql
          if (!empty($returnData[0]->USU_DEPCON) ) {

            $codDepFormatado = implode(", ", array_map(function($item) {
              return "'" . trim($item) . "'";
          }, explode(",", $returnData[0]->USU_DEPCON)));

            $whereCodDep = "  AND  E210EST.CODDEP IN ( $codDepFormatado) ";
          } else {

            $whereCodDep = "  AND  E210EST.CODDEP IN ('490','493','423') ";
            
          }

          // var_dump( $whereCodDep );die();

        
try {

         $sql = "


        SELECT *
  FROM (SELECT Q.CODIGO,
              COALESCE( Q.DERIVACAO , ' ') DERIVACAO,
               Q.FAMILIA,
               Q.COMERCIAL,
               Q.LANCAMENTO,
               CASE 
                    WHEN Q.DEMANDA = '1' THEN CONCAT(Q.DEMANDA, '- COMPRA ATIVA') 
                    WHEN Q.DEMANDA = '2' THEN CONCAT(Q.DEMANDA, '- LANCAMENTO') 
                    WHEN Q.DEMANDA = '3' THEN CONCAT(Q.DEMANDA, '- EM DESCONTINUACAO') 
                    WHEN Q.DEMANDA = '4' THEN CONCAT(Q.DEMANDA, '- DESCONTINUADO') 
                    ELSE ' '  
                END AS DEMANDA,
               Q.DESCRICAO,
               Q.CURVA,
               Q.MESANO,
               Q.QUANTIDADE,
               F.FATURAMENTO,
               Q.ESTOQUE,
               Q.ORDENS
          FROM (
                -- Subquery de QUANTIDADE
                SELECT E075PRO.CODPRO AS CODIGO,
                        E075DER.CODDER AS DERIVACAO,
                        E012FAM.DESFAM AS FAMILIA,
                        E013AGP.CODAGP AS COMERCIAL,
                        COALESCE((SELECT  TO_CHAR(MIN(E440IPC.DATGER), 'YYYY')
                                   FROM E440IPC
                                  WHERE E440IPC.CODPRO = E075PRO.CODPRO
                                    AND E440IPC.CODEMP = 1),
                                 (SELECT TO_CHAR(MIN(E420IPO.DATGER), 'YYYY')
                                    FROM E420IPO
                                   WHERE E420IPO.CODPRO = E075PRO.CODPRO
                                     AND E420IPO.CODEMP = 1)) AS LANCAMENTO,
                        E075DER.USU_SKUDEM AS DEMANDA,
                        E075PRO.DESPRO AS DESCRICAO,
                        E075DER.CURABC AS CURVA,
                        TO_CHAR(E140NFV.DATEMI, 'MM/YYYY') AS MESANO,
                        COALESCE(SUM(E140IPV.QTDFAT), 0) AS QUANTIDADE,
                        (SELECT SUM(E210EST.QTDEST - E210EST.QTDRES -
                                    E210EST.QTDRAE)
                           FROM E210EST
                          WHERE E210EST.CODEMP = E075DER.CODEMP
                            AND E210EST.CODPRO = E075DER.CODPRO
                            AND E210EST.CODDER = E075DER.CODDER
                            $whereCodDep ) AS ESTOQUE, 
                              (SELECT SUM(E420IPO.QTDPED - E420IPO.QTDREC -
                                  E420IPO.QTDCAN)
                          FROM E420OCP, E420IPO
                         WHERE E420OCP.CODEMP = E420IPO.CODEMP
                           AND E420OCP.CODFIL = E420IPO.CODFIL
                           AND E420OCP.NUMOCP = E420IPO.NUMOCP
                           AND E420IPO.CODEMP = E075DER.CODEMP
                           AND E420IPO.CODPRO = E075DER.CODPRO
                           AND E420IPO.CODDER = E075DER.CODDER
                           AND E420OCP.CODEMP = 1
                           AND E420OCP.SITOCP IN (1, 2, 3)) AS ORDENS
                  FROM E075PRO
                  LEFT JOIN E140IPV
                    ON E140IPV.CODEMP = E075PRO.CODEMP
                   AND E140IPV.CODPRO = E075PRO.CODPRO
                   AND E140IPV.CODFIL IN (1, 5)
                   AND E140IPV.CODEMP = 1
                  LEFT JOIN E140NFV
                    ON E140IPV.CODEMP = E140NFV.CODEMP
                   AND E140IPV.CODFIL = E140NFV.CODFIL
                   AND E140IPV.CODSNF = E140NFV.CODSNF
                   AND E140IPV.NUMNFV = E140NFV.NUMNFV
                  LEFT JOIN E001TNS
                    ON E140IPV.CODEMP = E001TNS.CODEMP
                   AND E140IPV.TNSPRO = E001TNS.CODTNS
                  LEFT JOIN E140IDE
                    ON E140IDE.CODEMP = E140NFV.CODEMP
                   AND E140IDE.CODFIL = E140NFV.CODFIL
                   AND E140IDE.CODSNF = E140NFV.CODSNF
                   AND E140IDE.NUMNFV = E140NFV.NUMNFV
                 INNER JOIN E013AGP
                    ON E013AGP.CODEMP = E075PRO.CODEMP
                   AND E013AGP.CODAGP = E075PRO.CODAGC
                  LEFT JOIN E075DER
                    ON E140IPV.CODEMP = E075DER.CODEMP
                   AND E140IPV.CODPRO = E075DER.CODPRO
                   AND E140IPV.CODDER = E075DER.CODDER
                  LEFT JOIN E012FAM
                    ON E075PRO.CODEMP = E012FAM.CODEMP
                   AND E075PRO.CODFAM = E012FAM.CODFAM
                 WHERE (E001TNS.VENFAT IN ('S') OR E001TNS.VENFAT IS NULL)
                   AND (E001TNS.VENTCF NOT IN ('I') OR E001TNS.VENTCF IS NULL)
                   AND (E140NFV.SITNFV IN ('2') OR E140NFV.SITNFV IS NULL)
                   AND (E140IDE.SITDOE IN (3) OR E140IDE.SITDOE IS NULL)
                   AND (E075DER.SITDER = 'A' OR E075DER.SITDER IS NULL)
                   AND (E140NFV.DATEMI BETWEEN
                       TRUNC(ADD_MONTHS(SYSDATE, -7), 'MM') AND
                       LAST_DAY(SYSDATE) OR E140NFV.DATEMI IS NULL)
                   AND E075PRO.USU_ORIMER = 'I'
                   AND E075PRO.SITPRO = 'A'
                   AND E075PRO.CODEMP = 1
                   AND E075PRO.CODAGC NOT IN
                       ('C200', 'C950', 'C012', 'C015', 'C190', 'C193')
                   AND E075DER.USU_SKUDEM IS NOT NULL    
                        $whereAgc 
                       --  AND E075PRO.CODAGC in ('C400','C109')
                 GROUP BY E075PRO.CODPRO,
                           TO_CHAR(E140NFV.DATEMI, 'MM/YYYY'),
                           E012FAM.DESFAM,
                           E013AGP.CODAGP,
                           E075PRO.DESPRO,
                           E075DER.CURABC,
                           E075DER.USU_SKUDEM,
                           E075DER.CODPRO,
                           E075DER.CODDER,
                           E075DER.CODEMP) Q
          FULL OUTER JOIN (
                          -- Subquery de FATURAMENTO
                          SELECT E075PRO.CODPRO AS CODIGO,
                                E075DER.CODDER AS DERIVACAO,
                                  TO_CHAR(E140NFV.DATEMI, 'MM/YYYY') AS MESANO,
                                  ROUND(SUM(E140IPV.VLRLIQ -
                                            (E140IPV.VLRIPI + E140IPV.VLRICS +
                                            E140IPV.ICMVDE + E140IPV.ICMVFC)),
                                        2) AS FATURAMENTO
                            FROM E075PRO
                            LEFT JOIN E140IPV
                              ON E140IPV.CODEMP = E075PRO.CODEMP
                             AND E140IPV.CODPRO = E075PRO.CODPRO
                             AND E140IPV.CODFIL IN (1, 5)
                             AND E140IPV.CODEMP = 1
                            LEFT JOIN E140NFV
                              ON E140IPV.CODEMP = E140NFV.CODEMP
                             AND E140IPV.CODFIL = E140NFV.CODFIL
                             AND E140IPV.CODSNF = E140NFV.CODSNF
                             AND E140IPV.NUMNFV = E140NFV.NUMNFV
                            LEFT JOIN E001TNS
                              ON E140IPV.CODEMP = E001TNS.CODEMP
                             AND E140IPV.TNSPRO = E001TNS.CODTNS
                            LEFT JOIN E140IDE
                              ON E140IDE.CODEMP = E140NFV.CODEMP
                             AND E140IDE.CODFIL = E140NFV.CODFIL
                             AND E140IDE.CODSNF = E140NFV.CODSNF
                             AND E140IDE.NUMNFV = E140NFV.NUMNFV
                           INNER JOIN E013AGP
                              ON E013AGP.CODEMP = E075PRO.CODEMP
                             AND E013AGP.CODAGP = E075PRO.CODAGC
                            LEFT JOIN E075DER
                              ON E140IPV.CODEMP = E075DER.CODEMP
                             AND E140IPV.CODPRO = E075DER.CODPRO
                             AND E140IPV.CODDER = E075DER.CODDER
                            LEFT JOIN E012FAM
                              ON E075PRO.CODEMP = E012FAM.CODEMP
                             AND E075PRO.CODFAM = E012FAM.CODFAM
                           WHERE (E001TNS.VENFAT IN ('S') OR
                                 E001TNS.VENFAT IS NULL)
                             AND (E001TNS.VENTCF NOT IN ('I') OR
                                 E001TNS.VENTCF IS NULL)
                             AND (E140NFV.SITNFV IN ('2') OR
                                 E140NFV.SITNFV IS NULL)
                             AND (E140IDE.SITDOE IN (3) OR
                                 E140IDE.SITDOE IS NULL)
                             AND (E075DER.SITDER = 'A' OR
                                 E075DER.SITDER IS NULL)
                             AND (E140NFV.DATEMI BETWEEN
                                 TRUNC(ADD_MONTHS(SYSDATE, -7), 'MM') AND
                                 LAST_DAY(SYSDATE) OR E140NFV.DATEMI IS NULL)
                             AND E075PRO.USU_ORIMER = 'I'
                             AND E075PRO.SITPRO = 'A'
                             AND E075PRO.CODEMP = 1
                             AND E075PRO.CODAGC NOT IN
                                 ('C200',
                                  'C950',
                                  'C012',
                                  'C015',
                                  'C190',
                                  'C193')
                            AND E075DER.USU_SKUDEM IS NOT NULL
                                  $whereAgc
                                 -- AND E075PRO.CODAGC in ('C400','C109')
                           GROUP BY E075PRO.CODPRO,
                           E075DER.CODDER,
                                     TO_CHAR(E140NFV.DATEMI, 'MM/YYYY')) F
            ON Q.CODIGO = F.CODIGO
           AND Q.MESANO = F.MESANO) Resultado
PIVOT(SUM(QUANTIDADE), SUM(FATURAMENTO) AS FAT
   FOR MESANO IN( 
                 '$mes1' AS MES1,
                 '$mes2' AS MES2,
                 '$mes3' AS MES3,
                 '$mes4' AS MES4,
                 '$mes5' AS MES5,
                 '$mes6' AS MES6,
                 '$mes7' AS MES7
                 ))
        ";


        $resultados1 = $oracle->selected($sql);
        // print_r(json_encode($resultados1));

        $sqlPar = "SELECT USU_MESFAT, USU_MESCON, USU_PERRUP  FROM USU_TDEMPAR WHERE USU_CODEMP = 1  AND USU_DATGER >= TRUNC(SYSDATE, 'MM')";
        $resultados2 = $oracle->selected($sqlPar);
        // print_r(json_encode($resultados2));

        

     /*---------------------------------------------------------*/
      $dadosCombinados = [];

      // Assumimos que $resultados2 contém apenas um item
      $item2 = $resultados2[0];
      

      // Agora, vamos adicionar os dados do segundo array em cada objeto do primeiro
      foreach ($resultados1 as $item1) {

        $sqlProjetado = "SELECT USU_QTDDEM, USU_OBSALT, USU_ANDFEC FROM USU_TDEMPRO
                          WHERE USU_CODEMP = 1
                          AND USU_CODPRO = '$item1->CODIGO'
                          AND USU_CODDER = '$item1->DERIVACAO'
                      AND EXTRACT(MONTH FROM USU_DATPRO) = '$dataMesFiltro'
                      AND EXTRACT(YEAR FROM USU_DATPRO) = '$dataAnoFiltro'
                        
                        ";
        $resultados3 = $oracle->selected($sqlProjetado);

       // var_dump( $sqlProjetado); 

       

        if (empty($resultados3))
        {
          $resultados3[] = Array('USU_QTDDEM' => '' , 'USU_OBSALT' => '' , 'USU_ANDFEC' => '' );
        }

          $item3 = $resultados3[0];


          $sqlProjetadoUmMes = "SELECT USU_QTDDEM  QTDDEMPROJ 
          , (SELECT USU_QTDDEM  
             FROM USU_TDEMPRO
             WHERE USU_CODEMP = 1
             AND USU_CODPRO = '$item1->CODIGO'
             AND USU_CODDER = '$item1->DERIVACAO'
             AND USU_QTDDEM > 0
             AND USU_DATPRO = TRUNC(ADD_MONTHS(SYSDATE, -2), 'MM')
              ) AS  QTDDEMPROJANT
             FROM USU_TDEMPRO
             WHERE USU_CODEMP = 1
             AND USU_CODPRO = '$item1->CODIGO'
             AND USU_CODDER = '$item1->DERIVACAO'
             AND USU_QTDDEM > 0
             AND USU_DATPRO = TRUNC(ADD_MONTHS(SYSDATE, -1), 'MM') 
          
            ";
          $resultados4 = $oracle->selected($sqlProjetadoUmMes);



          if (empty($resultados4))
          {
          $resultados4[] = Array('QTDDEMPROJ' => '', 'QTDDEMPROJANT' => ''  );
          }

          $item4 = $resultados4[0];


          // Estoque mensal para pintar valor de estoque em vermelho

          $sqlEstoqueVermelho = "SELECT *
                                  FROM (SELECT 
                                              TO_CHAR(TRUNC(USU_MESANO, 'MM'), 'MM/YYYY') AS MESANO,
                                              COALESCE(USU_QTDEST,0) AS POSEST
                                          FROM USU_TE210SFE
                                        WHERE USU_MESANO >= TRUNC(ADD_MONTHS(SYSDATE, -6), 'MM')
                                        AND USU_CODEMP = 1
                                        AND USU_CODPRO = '$item1->CODIGO' 
                                         AND USU_CODDER = '$item1->DERIVACAO'
                                        )
                                PIVOT(SUM(POSEST)
                                  FOR MESANO IN (
            '$mes1' AS POSMES1,
            '$mes2' AS POSMES2,
            '$mes3' AS POSMES3,
            '$mes4' AS POSMES4,
            '$mes5' AS POSMES5,
            '$mes6' AS POSMES6
        ))
         ";
       $resultados5 = $oracle->selected($sqlEstoqueVermelho);



       if (empty($resultados5))
       {
       $resultados5[] = Array('POSMES1' => '' ,'POSMES2' => '' ,'POSMES3' => '','POSMES4' => '' ,'POSMES5' => '' ,'POSMES6' => ''   );
       }

       $item5 = $resultados5[0];

          // Criando um novo objeto para combinar os dados
          $novoObjeto = new stdClass();
          
          // Copia os dados de $item1
          foreach ($item1 as $key => $value) {
              $novoObjeto->$key = $value;
          }
  
          // Copia os dados de $item2 (que contém os dados para adicionar)
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

      print_r(json_encode(json_encode($dadosCombinados)));


    } catch (PDOException $e) {
        echo "Erro: " . $e->getMessage();
    }
    
    }


public static function salvarDemanda($json_values, $codigoUsuario, $bloqParam) {   

     // var_dump($json_values); die();
      
      $sucesso = false;
      $dataAtual = date('d/m/Y');
      $erro = '';

      if($bloqParam == 'bloquear'){

            $sqlUpdate = "   UPDATE USU_TDEMPAR
                              SET USU_ANDFEC = 'F'
                              WHERE USU_CODEMP = 1
                              AND TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY') 

                        ";

            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlUpdate);
            $stmt->execute();


      }

  foreach ($json_values as $json_value) {
          // Extrai os valores necessários
          $codigo = $json_value['CODIGO'] ?? null;
          $derivacao = $json_value['DERIVACAO'] ?? null;
          $fatProjetado = $json_value['PROJETADO'] ?? null;
          $observacao = trim($json_value['OBSERVACAO'] ?? '');
          $estoque = $json_value['ESTOQUE'] ?? null;
          $quantidadeDemanda = $json_value['QTDDEM'] ?? '';
          $projetado = preg_replace("/[.,#$]/", "", $fatProjetado);
          $projetadoFechado = $json_value['USU_ANDFEC'] ?? '';

          // Exemplo: se precisar converter para Windows-1252
          $observacao = iconv("UTF-8", "Windows-1252//IGNORE", $observacao);


          // Verificar se o dado já existe
          $sqlCheck = "SELECT COUNT(*) FROM USU_TDEMPRO WHERE USU_CODPRO = :codigo  AND USU_CODDER = :derivacao AND EXTRACT(MONTH FROM USU_DATPRO) = EXTRACT(MONTH FROM TO_DATE(:dataAtual, 'DD/MM/YYYY')) AND EXTRACT(YEAR FROM USU_DATPRO) = EXTRACT(YEAR FROM TO_DATE(:dataAtual, 'DD/MM/YYYY'))";
          $conexao = conn::getInstance();
          $stmtCheck = $conexao->prepare($sqlCheck);
          $stmtCheck->bindParam(':codigo', $codigo);
          $stmtCheck->bindParam(':derivacao', $derivacao);
          $stmtCheck->bindParam(':dataAtual', $dataAtual);
          $stmtCheck->execute();

          // Verificar se algum registro foi encontrado
          $result = $stmtCheck->fetchColumn();
          
          // Se o dado não existir, realiza o INSERT
          if ($result == 0 && !empty($codigo )) {

                   

             // Construção do SQL
            $sqlInsert = "INSERT INTO USU_TDEMPRO (USU_CODEMP, USU_CODPRO, USU_CODDER, USU_DATPRO, USU_DATGER, USU_USUGER, USU_DATALT, USU_USUALT, USU_QTDSUG, USU_QTDDEM, USU_OBSALT, USU_QTDEST, USU_ANDFEC)
            VALUES (1, :codigo, :derivacao, TO_DATE(:dataAtual, 'DD/MM/YYYY'), TO_DATE(:dataAtual, 'DD/MM/YYYY'), :codigoUsuario, TO_DATE(:dataAtual, 'DD/MM/YYYY'), :codigoUsuario, :quantidadeDemanda, :projetado, :observacao, :estoque, :projetadoFechado)";

               //var_dump(  $sqlInsert ); die();

        try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlInsert);
            $stmt->bindParam(':codigo', $codigo);
            $stmt->bindParam(':derivacao', $derivacao);
            $stmt->bindParam(':dataAtual', $dataAtual);
            $stmt->bindParam(':projetado', $projetado, PDO::PARAM_STR);
            $stmt->bindParam(':observacao', $observacao);
            $stmt->bindParam(':estoque', $estoque);
            $stmt->bindParam(':quantidadeDemanda', $quantidadeDemanda);
            $stmt->bindParam(':projetadoFechado', $projetadoFechado);
            $stmt->bindParam(':codigoUsuario', $codigoUsuario);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);


            if ( $stmt->rowCount() > 0 ) {
            
              $sucesso = true;

            } 

            } catch (PDOException $e) {
              $erro = "Erro ao atualizar o código $codigo: " . $e->getMessage() . "\n";
              $sucesso = false;

            }
      } else {

    

           $sqlUpdate = " UPDATE USU_TDEMPRO
             SET
               USU_DATALT =  TO_DATE(:dataAtual, 'DD/MM/YYYY') ,
               USU_USUALT = '389' ,
               USU_QTDDEM = :projetado,
               USU_OBSALT = :observacao,
               USU_ANDFEC = :projetadoFechado
             WHERE
               USU_CODEMP = 1
               AND USU_CODPRO = :codigo
               AND USU_CODDER = :derivacao
               AND EXTRACT(MONTH FROM USU_DATPRO) = EXTRACT(MONTH FROM TO_DATE(:dataAtual, 'DD/MM/YYYY'))
               AND EXTRACT(YEAR FROM USU_DATPRO) = EXTRACT(YEAR FROM TO_DATE(:dataAtual, 'DD/MM/YYYY'))
               ";

              // var_dump($projetado );

          try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlUpdate);
            $stmt->bindParam(':codigo', $codigo);
            $stmt->bindParam(':derivacao', $derivacao);
            $stmt->bindParam(':dataAtual', $dataAtual);
            $stmt->bindParam(':projetado', $projetado , PDO::PARAM_STR);
            $stmt->bindParam(':observacao', $observacao);
            $stmt->bindParam(':projetadoFechado', $projetadoFechado);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

            if ( $stmt->rowCount() > 0 ) {
              $sucesso = true;

            } 
         
          } catch (PDOException $e) {
          $erro = "Erro ao atualizar o código $codigo: " . $e->getMessage() . "\n";
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
            

 


}
?>