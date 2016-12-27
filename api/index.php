<?php

@include(dirname(__FILE__) . '/config.local.php');
include(dirname(__FILE__) . '/config.php');

$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
$aReturn = array('success' => true, 'method' => $aMethod);

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

switch ($aMethod) {
	case 'titles':
		$aStmt = $aDb->prepare("SELECT * FROM titles WHERE 1");
		$aStmt->execute();

		$aRows = array();

		while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
			$aRows[] = $aRow;
		}

		$aReturn['data'] = $aRows;
		break;

	case 'sync':
		$aSince = isset($_REQUEST['since']) ? $_REQUEST['since'] : '';

		if($aSince == '') {
			$aReturn['success'] = false;
			$aReturn['message'] = 'Missing or invalid "since" param (since=' . $aSince . ')';

		} else {
			$aStmt = $aDb->prepare("SELECT * FROM titles WHERE modified > :since");

			$aStmt->bindParam(':since', $aSince);
			$aStmt->execute();

			$aRows = array();

			while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
				$aRows[] = $aRow;
			}

			$aReturn['data'] = $aRows;
		}
		break;

	default:
		$aReturn = array('failure' => true, 'message' => 'Unknow method');
		break;
}

header('Content-Type: application/json');
echo json_encode($aReturn);

?>
