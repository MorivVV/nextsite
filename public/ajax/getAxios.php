<?php
include_once "ajaxConnect.php";

writeLogs("==================" . $_SERVER['REMOTE_ADDR'] . "==============", 'Axios.txt');
// получаем параметр запрашиваемого запроса
if (isset($_POST['sqlname'])){
  $sqlname = $_POST['sqlname'];
}else{
  if (isset($_GET['sqlname'])){
    $sqlname = $_GET['sqlname'];
  }else{
    return;
  }
}
writeLogs("Запрос sqlname = $sqlname", 'Axios.txt');
// получаем из БД текст запроса и параметры
$stm = $pdo->prepare("SELECT 
ssq.sql_query QUERY
, ssq.sql_params PARAMS
, ssq.result RESULT
, ssq.need_token AUTH
FROM sys_sql_query ssq
WHERE ssq.sql_name = ?");
$stm->execute(array($sqlname));
if ($row = $stm->fetch()){
  $sqlQuery = $row['QUERY'];
  $sqlParams = $row['PARAMS'];
  $sqlResult = $row['RESULT'];
  $sqlAUTH = $row['AUTH'];
}else{
  return;
}
writeLogs("sqlAUTH = $sqlAUTH", 'Axios.txt');
if ($sqlAUTH == 1) {
  writeLogs("Требуется авторизация", 'Axios.txt');
  $userHash = $_COOKIE['HASHIP'];
  $login = $_COOKIE['USER'];
  $stm = $pdo->prepare("SELECT count(u.ID) CNT
  FROM bd_users u
  WHERE u.USER_NAME = ?
  AND u.SESSEION_HASH = ?");
  $stm->execute(array($login, $userHash));
  $res = 0;
  if ($row = $stm->fetch()){
    $res = $row['CNT'];
  }
  if ($res != 1){
    writeLogs("Авторизация не пройдена", 'Axios.txt');
    return;
  }
  writeLogs("Авторизация успешно пройдена", 'Axios.txt');
}

writeLogs("$sqlQuery", 'Axios.txt');
// извлекаем из параметов имена переменных, с которыми нам нужно выполнить запрос
if ($sqlParams === ''){
  $paramList = array();
}else {
  $paramList = explode(',', $sqlParams);
}
$bindParams = array();
// получаем нужные параметры из запроса пост
foreach ($paramList as $sourceParam) {
  if (mb_strpos($sourceParam, ':') === 1){
    $param = mb_substr($sourceParam, 2);
  }else{
    $param = $sourceParam;
  }
  if (isset($_POST[$param])){
    writeLogs("Параметр $param =" . $_POST[$param], 'Axios.txt');
    $postValue = $_POST[$param];
    // проверяем наличие списка параметров для in в запросах SELECT
    if (substr($sqlQuery,0,6) !== "SELECT" ||  strpos($postValue,',') === false ){
      $bindParams[$sourceParam] = $postValue;
    }else{
      $postValue = explode(',', $postValue);
      // если нашли запятую, то создаем несколько переменных с индесом
      $inParams = '';
      foreach ($postValue as $key => $value) {
        $bindParams[$sourceParam . $key] = $value;
        // in (:kod_group) OR :kod_group = -2
        if ($inParams !== ''){
          $inParams .= ', ';
        }
        $inParams .= ":" . $param . $key;
      }
      writeLogs("Список параметров по разрбору $inParams", 'Axios.txt');
      $sqlQuery = str_replace("in (:$param)", "in ($inParams)", $sqlQuery);
      $bindParams[$sourceParam] = -1;
    }
  }else{
    $bindParams[$sourceParam] = -2;
  }
}
writeLogs($sqlQuery, 'Axios.txt');
writeLogs(json_encode($bindParams), 'Axios.txt');

$stm = $pdo->prepare($sqlQuery);
foreach($bindParams as $key => $value){
  $pdoParam = PDO::PARAM_INT;
  if (strpos($key,':') === 1 ){
    switch (mb_substr($key, 0, 1)) {
      case 's':
        $pdoParam = PDO::PARAM_STR;
        break;
      case 'i':
        $pdoParam = PDO::PARAM_INT;
        break;
      case 'l':
        $pdoParam = PDO::PARAM_LOB;
        break;
      default:
        $pdoParam = PDO::PARAM_INT;
        break;
    }
    $key = mb_substr($key, 2);
  }
  ${$key} = $value;
  $stm->bindParam(":$key", ${$key}, $pdoParam);
  writeLogs("\$stm->bindParam(':$key', $$key, PDO::PARAM_INT)", 'Axios.txt');
}

$stm->execute();
// $stm->execute($bindParams);

// проверяем наличие ошибок
$arr = $stm->errorInfo();
if ($arr[0] !== "00000"){
  writeLogs(json_encode($arr), 'AxiosErrors.txt');
}

$dataAudit = array();
if (substr($sqlQuery,0,6) === 'SELECT'){
    while ($row = $stm->fetch()){
      if (isset($row['ID'])){
        $dataAudit[$row['ID']] = $row;
      }else{
        $dataAudit []= $row;
      }
  }
}else{
  $dataAudit["count"] = $stm->rowCount();
}
if ($sqlResult === 'json') {
  echo json_encode($dataAudit);
}else{
  echo $dataAudit[0][$sqlResult];
}
