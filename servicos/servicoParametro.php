

<?php
require 'connDB.php';
header('Content-Type: text/html; charset=UTF-8');
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
class servicoParametro extends db
{


    public static function mostrarParametroDemanda( ) {

   
      $oracle = new db();
    

        
          try {

                    $sql = "	SELECT USU_MESFAT, USU_MESCON, USU_DEPCON, USU_PROCON, USU_PERRUP, TO_CHAR(USU_DATGER,'MM/YYYY') AS USU_DATGER, USU_ANDFEC
                            FROM USU_TDEMPAR
                            WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY')
                            UNION ALL
                            SELECT USU_MESFAT, USU_MESCON, USU_DEPCON, USU_PROCON, USU_PERRUP, TO_CHAR(USU_DATGER,'MM/YYYY') AS USU_DATGER,USU_ANDFEC
                            FROM USU_TDEMPAR
                            WHERE TO_CHAR(USU_DATGER, 'MMYYYY') =
                                TO_CHAR(ADD_MONTHS(SYSDATE, -1), 'MMYYYY')
                            AND NOT EXISTS
                            (SELECT 1
                                  FROM USU_TDEMPAR
                                  WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY'))

                    ";


                    $resultado = $oracle->selected($sql);

                
                    print_r(json_encode(json_encode($resultado)));


              } catch (PDOException $e) {
                  echo "Erro: " . $e->getMessage();
              }


  }


  public static function mostrarParametroConsumo( ) {

   
    $oracle = new db();
  

      
        try {

                  $sql = "SELECT  USU_MARKU0, USU_MARKU1, USU_MARKU2, USU_MARKU3, USU_MARKU4, USU_MARKU5,USU_MARKU_A,USU_MARKU_O, USU_PERRUP, TO_CHAR(USU_DATGER,'MM/YYYY') AS USU_DATGER, USU_ANDFEC
                          FROM USU_TDEMPAR2
                          WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY')
                          UNION ALL
                          SELECT USU_MARKU0, USU_MARKU1, USU_MARKU2, USU_MARKU3, USU_MARKU4, USU_MARKU5,USU_MARKU_A,USU_MARKU_O, USU_PERRUP, TO_CHAR(USU_DATGER,'MM/YYYY') AS USU_DATGER, USU_ANDFEC
                          FROM USU_TDEMPAR2
                          WHERE TO_CHAR(USU_DATGER, 'MMYYYY') =
                                TO_CHAR(ADD_MONTHS(SYSDATE, -1), 'MMYYYY')
                            AND NOT EXISTS
                          (SELECT 1
                                  FROM USU_TDEMPAR2
                                  WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY'))


                         ";


                  $resultado = $oracle->selected($sql);

              
                  print_r(json_encode(json_encode($resultado)));


            } catch (PDOException $e) {
                echo "Erro: " . $e->getMessage();
            }


}
    



public static function salvarParametroDemanda($usu_mesfat,$usu_mescon,$usu_depcon,$usu_perrup, $codigoUsuario) {   

      //var_dump($usu_mesfat.'-'.$usu_mescon.'-'.$usu_depcon.'-'.$usu_perrup.'-'.$codigoUsuario); die();
      
      $sucesso = false;
      $dataAtual = date('d/m/Y');
      $erro = '';

  

          // Verificar se o dado já existe
          $sqlCheck = "SELECT COUNT(*)
                            FROM USU_TDEMPAR
                            WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY') ";
        $conexao = conn::getInstance();
        $stmtCheck = $conexao->prepare($sqlCheck);
        $stmtCheck->execute();
        $result = $stmtCheck->fetchColumn();


          
          // Se o dado não existir, realiza o INSERT
          if ($result == 0 && !empty($usu_mesfat )) {
            
             // Construção do SQL
            $sqlInsert = " INSERT INTO USU_TDEMPAR (
                              USU_MESFAT, USU_MESCON, USU_CODEMP, USU_DEPCON,  USU_PERRUP, USU_DATGER, USU_USUGER, USU_DATALT, USU_USUALT, USU_ANDFEC, USU_PEREST
                            )
                            VALUES (:usu_mesfat, :usu_mescon, 1, :usu_depcon, :usu_perrup, SYSDATE, :codigoUsuario, SYSDATE, :codigoUsuario, 'A', 0) 
                         ";

        try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlInsert);
            $stmt->bindParam(':usu_mesfat', $usu_mesfat);
            $stmt->bindParam(':usu_mescon', $usu_mescon);
            $stmt->bindParam(':usu_depcon', $usu_depcon );
            $stmt->bindParam(':usu_perrup', $usu_perrup);
            $stmt->bindParam(':codigoUsuario', $codigoUsuario);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

      
            if ( $stmt->rowCount() > 0 ) {
              $sucesso = true;

            } 

            } catch (PDOException $e) {
              $erro = "Erro ao atualizar o código $usu_mesfat: " . $e->getMessage() . "\n";
              $sucesso = false;

            }
      } else {

    

           $sqlUpdate = "   UPDATE USU_TDEMPAR
                                SET USU_MESFAT = :usu_mesfat, USU_MESCON = :usu_mescon, USU_DEPCON = :usu_depcon,
                                    USU_PERRUP = :usu_perrup, USU_DATALT = SYSDATE, USU_USUALT = :codigoUsuario
                              WHERE USU_CODEMP = 1
                                AND TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY') 

                        ";

      

          try{
            $conexao = conn::getInstance();
            $stmt = $conexao->prepare($sqlUpdate);
            $stmt->bindParam(':usu_mesfat', $usu_mesfat);
            $stmt->bindParam(':usu_mescon', $usu_mescon);
            $stmt->bindParam(':usu_depcon', $usu_depcon );
            $stmt->bindParam(':usu_perrup', $usu_perrup);
            $stmt->bindParam(':codigoUsuario', $codigoUsuario);
            $stmt->execute();
           // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

            if ( $stmt->rowCount() > 0 ) {
              $sucesso = true;

            } 
         
          } catch (PDOException $e) {
          $erro = "Erro ao atualizar o código $usu_mesfat: " . $e->getMessage() . "\n";
          $sucesso = false;

         }


     }
 

          if ($sucesso) {
              print_r(json_encode(["retorno"=>"Salvo com sucesso!","status"=> 0]));
          } else {
              print_r(json_encode(["retorno"=> 'Erro ao Salvar Dados : '.$erro , "status"=> 1]));
          }

}
            



public static function salvarParametroConsumo($usu_marku0, $usu_marku1, $usu_marku2, $usu_marku3, $usu_marku4, $usu_marku5,$usu_marku_A,$usu_marku_O, $usu_perrupC, $codigoUsuario) {   

  //var_dump($codigoUsuario); die();
  
  $sucesso = false;
  $dataAtual = date('d/m/Y');
  $erro = '';



      // Verificar se o dado já existe
      $sqlCheck = "SELECT COUNT(*)
                        FROM USU_TDEMPAR2
                        WHERE TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY') ";
    $conexao = conn::getInstance();
    $stmtCheck = $conexao->prepare($sqlCheck);
    $stmtCheck->execute();
    $result = $stmtCheck->fetchColumn();


      
      // Se o dado não existir, realiza o INSERT
      if ($result == 0 && !empty($usu_marku0 )) {
        
         // Construção do SQL
        $sqlInsert = "     INSERT INTO USU_TDEMPAR2
                            (USU_CODEMP, USU_MARKU0, USU_MARKU1, USU_MARKU2, USU_MARKU3, USU_MARKU4, USU_MARKU5,USU_MARKU_A,USU_MARKU_O, USU_PERRUP, USU_DATGER,   USU_USUGER,  USU_DATALT, USU_USUALT, USU_ANDFEC)
                            VALUES
                            ( 1 , :usu_marku0, :usu_marku1, :usu_marku2, :usu_marku3,  :usu_marku4, :usu_marku5, :usu_marku_A, :usu_marku_O, :usu_perrupC, SYSDATE, :codigoUsuario, SYSDATE, :codigoUsuario, 'A' )
 
                     ";

    try{
        $conexao = conn::getInstance();
        $stmt = $conexao->prepare($sqlInsert);
        $stmt->bindParam(':usu_marku0',  $usu_marku0);
        $stmt->bindParam(':usu_marku1', $usu_marku1);
        $stmt->bindParam(':usu_marku2', $usu_marku2);
        $stmt->bindParam(':usu_marku3', $usu_marku3);
        $stmt->bindParam(':usu_marku4', $usu_marku4,);
        $stmt->bindParam(':usu_marku5', $usu_marku5);
        $stmt->bindParam(':usu_marku_A', $usu_marku_A);
        $stmt->bindParam(':usu_marku_O', $usu_marku_O);
        $stmt->bindParam(':usu_perrupC', $usu_perrupC);
        $stmt->bindParam(':codigoUsuario', $codigoUsuario);
        $stmt->execute();
       // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

  
        if ( $stmt->rowCount() > 0 ) {
          $sucesso = true;

        } 

        } catch (PDOException $e) {
          $sucesso = false;

         // var_dump($e); die();

        }
  } else {



       $sqlUpdate = "     UPDATE USU_TDEMPAR2
                          SET USU_MARKU0 = :usu_marku0,
                            USU_MARKU1 = :usu_marku1,
                            USU_MARKU2 = :usu_marku2,
                            USU_MARKU3 = :usu_marku3,
                            USU_MARKU4 = :usu_marku4,
                            USU_MARKU5 = :usu_marku5,
                            USU_MARKU_A = :usu_marku_A,
                            USU_MARKU_O = :usu_marku_O, 
                            USU_PERRUP = :usu_perrupC,
                            USU_DATALT = SYSDATE,
                            USU_USUALT = :codigoUsuario,
                            USU_ANDFEC = 'A'
                          WHERE USU_CODEMP = 1
                          AND TO_CHAR(USU_DATGER, 'MMYYYY') = TO_CHAR(SYSDATE, 'MMYYYY')


                    ";

  

      try{
        $conexao = conn::getInstance();
        $stmt = $conexao->prepare($sqlUpdate);
        $stmt->bindParam(':usu_marku0', $usu_marku0);
        $stmt->bindParam(':usu_marku1', $usu_marku1);
        $stmt->bindParam(':usu_marku2', $usu_marku2 );
        $stmt->bindParam(':usu_marku3', $usu_marku3);
        $stmt->bindParam(':usu_marku4', $usu_marku4);
        $stmt->bindParam(':usu_marku5', $usu_marku5);
        $stmt->bindParam(':usu_marku_A', $usu_marku_A);
        $stmt->bindParam(':usu_marku_O', $usu_marku_O);
        $stmt->bindParam(':usu_perrupC', $usu_perrupC);
        $stmt->bindParam(':codigoUsuario', $codigoUsuario);
        $stmt->execute();
       // $returnData = $stmt->fetchAll(PDO::FETCH_OBJ);

        if ( $stmt->rowCount() > 0 ) {
          $sucesso = true;

        } 
     
      } catch (PDOException $e) {
        //var_dump($e); die();
      $erro = "Erro ao atualizar o código $usu_marku0: " . $e->getMessage() . "\n";
      $sucesso = false;

     }


 }


      if ($sucesso) {
          print_r(json_encode(["retorno"=>"Salvo com sucesso!","status"=> 0]));
      } else {
          print_r(json_encode(["retorno"=> 'Erro ao Salvar Dados : '.$erro , "status"=> 1]));
      }

}
 


}
?>