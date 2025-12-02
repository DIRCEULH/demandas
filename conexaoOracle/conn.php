<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['AmbienteConexao']) || empty($_SESSION['AmbienteConexao'])) {
  $_SESSION['AmbienteConexao'] = 'P';
}

//var_dump( $_SESSION['Ambiente'].'Dirceu' ); die();

if ($_SESSION['AmbienteConexao'] == 'H'){
/*
*Base Homologação
*/
$host = '';
$dbName = '';

/* Usuário Sapiens. Homolog */
$user = base64_decode('==');
$passWord = base64_decode('==');

/* Usuário Demanda. Homolog */
//$user = base64_decode('REVNQU5EQQ==');
//$passWord = base64_decode('ZWplaUxhaDU=');

}

if ($_SESSION['AmbienteConexao'] == 'P'){
/*
*Base Produção
*/
$host = '';
$dbName = '';

/* Usuário Dirceu. Produção */
//$user = base64_decode('VElfRElSQ0VV');
//$passWord = base64_decode('MVY1d0VyN2E5cTlR');

/* Usuário Demanda. Produção  */
$user = base64_decode('==');
$passWord = base64_decode('=');

}


define('SGBD', 'oracle');
define('HOST', $host);
define('DBNAME', $dbName);
define('CHARSET', 'utf8');
define('USER', $user );
define('PASSWORD', $passWord );
define('SERVER', 'windows');

class conn {
    
    /*
     * Atributo estático de conexão
     */
    private static $pdo;

    /*
     * Escondendo o construtor da classe
     */
    private function __construct() {
        //
    }

    /*
     * Método privado para verificar se a extensão PDO do banco de dados escolhido
     * está habilitada
     */
    private static function verificaExtensao() {
        switch (SGBD):
            case 'mysql':
                $extensao = 'pdo_mysql';
                break;
            case 'mssql':
                if (SERVER == 'linux'):
                    $extensao = 'pdo_dblib';
                else:
                    $extensao = 'pdo_sqlsrv';
                endif;
                break;
            case 'postgre':
                $extensao = 'pdo_pgsql';
                break;
            case 'oracle': // Adicionando suporte ao Oracle
                $extensao = 'pdo_oci';
                break;
            default:
                echo "<h1>SGBD não suportado!</h1>";
                exit();
        endswitch;
    
        if (!extension_loaded($extensao)):
            echo "<h1>Extensão {$extensao} não habilitada!</h1>";
            exit();
        endif;
    }

    /*
     * Método estático para retornar uma conexão válida
     * Verifica se já existe uma instância da conexão, caso não, configura uma nova conexão
     */
    public static function getInstance() {

        self::verificaExtensao();

        if (!isset(self::$pdo)) {
            try {
                $opcoes = array(\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES UTF8');
                switch (SGBD) :
                    case 'oracle':
                        self::$pdo = new \PDO(
                            "oci:dbname=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=" . HOST . ")(PORT=1521))
                            (CONNECT_DATA=(SERVICE_NAME=" . DBNAME . ")));charset=WE8MSWIN1252",
                            USER,
                            PASSWORD
                        );
                     
                        self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                        break;
                    case 'mssql':{
                        if(SERVER == 'linux'):
                            self::$pdo = new \PDO("dblib:host=" . HOST . "; database=" . DBNAME . ";", USER, PASSWORD, $opcoes);
                        else:
                            self::$pdo = new \PDO("sqlsrv:server=" . HOST . "; database=" . DBNAME . ";", USER, PASSWORD, $opcoes);
                        endif;
                        break;
                    }
                    case 'postgre':
                        self::$pdo = new \PDO("pgsql:host=" . HOST . "; dbname=" . DBNAME . ";", USER, PASSWORD, $opcoes);
                        break;
                endswitch;
                self::$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                print "Erro: " . $e->getMessage();
            }
        }
        return self::$pdo;
    }

    public static function isConectado(){
        
        if(self::$pdo):
            return true;
        else:
            return false;
        endif;
    }

}



