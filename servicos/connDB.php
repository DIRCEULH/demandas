<?php
require  './conexaoOracle/conn.php' ;

class db {
    

    public  function select($sql) {

        $conexao = conn::getInstance();
        $stm = $conexao->prepare($sql);
       // $stm->bindParam(':mes1', $mes1, PDO::PARAM_STR);
        $stm->execute();
        $returnData = $stm->fetchAll(PDO::FETCH_OBJ);

            // Converter todos os valores para UTF-8
            foreach ($returnData as $obj) {
                foreach ($obj as $key => $value) {
                    if (is_string($value)) {
                        $obj->$key = iconv('Windows-1252', 'UTF-8//IGNORE', $value);
                    }
                }
            }
            
        return json_encode($returnData);

    }

    public  function selected($sql) {

        $conexao = conn::getInstance();
        $stm = $conexao->prepare($sql);
        $stm->execute();
        $returnData = $stm->fetchAll(PDO::FETCH_OBJ);

        // Converter todos os valores para UTF-8
            foreach ($returnData as $obj) {
                foreach ($obj as $key => $value) {
                    if (is_string($value)) {
                        $obj->$key = iconv('Windows-1252', 'UTF-8//IGNORE', $value);
                    }
                }
            }
                
        return $returnData;

    }

    public  function insert($sql) {
        $conexao = conn::getInstance();
        $stm = $conexao->prepare($sql);
        $stm->execute();
        $stm->fetchAll(PDO::FETCH_OBJ);

    }

    public  function update($sql) {
        $conexao = conn::getInstance();
        $stm = $conexao->prepare($sql);
        $stm->execute();
        $stm->fetchAll(PDO::FETCH_OBJ);

    }

    public  function delete($sql) {
        $conexao = conn::getInstance();
        $stm = $conexao->prepare($sql);
        $stm->execute();
        $stm->fetchAll(PDO::FETCH_OBJ);

    }
}
