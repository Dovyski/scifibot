<?php

@include(dirname(__FILE__) . '/../config.local.php');
include(dirname(__FILE__) . '/../config.php');

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
