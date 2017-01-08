<?php
    require_once(dirname(__FILE__) . '/globals.php');

    $aEntries = ScifiBot\Entity::findAll();

    ScifiBot\View::render('entries', array(
        'entries' => $aEntries
    ));
?>
