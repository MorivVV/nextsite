<?php
$login = ($_COOKIE['USER']);
$hash_user = md5(microtime().$_SERVER['REMOTE_ADDR'].$_SERVER['HTTP_USER_AGENT']);//информация о браузере, адресе и пароле пользователя


setcookie("USER" , $row['USER_NAME'], time()+36000, "/");//продлеваем сессию на час
setcookie("PASS" , $password, time()+36000, "/");
setcookie("HASHIP", $hash_user, time()+36000, "/");//установка куки с информацией о браузере, адресе и пароле пользователя