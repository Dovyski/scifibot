<?php

@include(dirname(__FILE__) . '/config.local.php');
@include(dirname(__FILE__) . '/config.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

$aOptions = array(
    "sql:",
);

$aArgs = getopt('', $aOptions);

if($argc <= 1) {
	echo "ScifiBot - command line manager. \n";
	echo "(c) Copyright 2016, Fernando Bevilacqua. \n\n";
	echo "Usage: \n";
	echo " php ".basename($_SERVER['PHP_SELF']) . " [options]\n\n";
	echo "Options:\n";
	echo " --sql=<path>     Runs the sql commands in the file loaded from <path>.\n";
	echo "\n";
	exit(1);
}

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aSql = isset($aArgs['sql']) ? $aArgs['sql'] : '';

if($aSql != '') {
	 if(!file_exists($aSql)) {
		 echo "File informed by --sql does not exist: '" . $aSql . "'\n";
		 exit(2);
	 }

	 $aLines = file($aSql);
	 $aBuffer = '';
	 $aStatements = 0;

	 foreach($aLines as $aCmd) {
		 $aBuffer .= $aCmd;

		 if(strpos(trim($aCmd), ');') !== false) {
			 $aDb->exec($aBuffer);
			 $aBuffer = '';
			 $aStatements++;
		 }
	 }

	 echo "Success! Performed statements: " . $aStatements . "\n";
	 exit(0);
}

?>
