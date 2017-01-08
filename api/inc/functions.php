<?php

namespace ScifiBot;

class Db {
	private static $mDb;

	public static function init() {
		self::$mDb = new \PDO('sqlite:' . DB_FILE);
		self::$mDb->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
	}

	public static function instance() {
		return self::$mDb;
	}
}

class Entity {
	public static function getById($theId) {
		$aStmt = Db::instance()->prepare("SELECT * FROM titles WHERE id = :id");

        $aStmt->bindParam(':id', $theId);
        $aStmt->execute();

        return $aStmt->fetch(\PDO::FETCH_ASSOC);
	}

	public static function findAll($theIncludeInactive = true) {
		$aEntries = array();
		$aStmt = Db::instance()->prepare("SELECT * FROM titles WHERE " . ($theIncludeInactive ? '1' : ' active = 1'));
        $aStmt->execute();

		while($aRow = $aStmt->fetch(\PDO::FETCH_OBJ)) {
			$aEntries[] = $aRow;
		}

        return $aEntries;
	}
}

?>
