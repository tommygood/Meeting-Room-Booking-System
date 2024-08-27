<?php
$host = 'localhost:3306';
$dbuser ='test';
$dbpassword = '!test1234';
$dbname = 'conference';
$link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);
if($link){
    mysqli_query($link,'SET NAMES utf8');
}
else {
    echo "不正確連接資料庫</br>" . mysqli_connect_error();
}
?>