<?php
    require_once(dirname(__FILE__) . '/globals.php');

    $aId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $aId = isset($_POST['id']) ? (int)$_POST['id'] : $aId;

    $aEditing = $aId != 0;
    $aEntry = null;
    $aMessage = '';
    $aStatus = 'success';
    $aHideFields = false;

    if($aEditing) {
        $aEntry = ScifiBot\Entity::getById($aId);

        if(!$aEntry) {
            $aMessage = '<strong>Oops!</strong> Entry not found.';
            $aStatus = 'danger';
            $aHideFields = true;
        }
    }

    if(isset($_REQUEST['data'])) {
        $aStmt = null;
        $aEntry = $_REQUEST;
        $aNow = time();

        if($aEditing) {
            $aStmt = ScifiBot\Db::instance()->prepare(
                "UPDATE
                    titles
                SET
                    type = :type,
                    name = :name,
                    publisher = :publisher,
                    year = :year,
                    released = :released,
                    runtime = :runtime,
                    plot = :plot,
                    wikipedia_url = :wikipedia_url,
                    teaser = :teaser,
                    imdb_rating = :imdb_rating,
                    imdb_url = :imdb_url,
                    metascore_rating = :metascore_rating,
                    metascore_url = :metascore_url,
                    rotten_tomatoes_rating = :rotten_tomatoes_rating,
                    rotten_tomatoes_url = :rotten_tomatoes_url,
                    trailer = :trailer,
                    modified = :modified,
                    active = :active
                WHERE
                    id = :id
                ");

            $aStmt->bindParam(':id', $aEntry['id']);
            $aMessage = '<strong>Success!</strong> Entry was updated.';

        } else {
            $aStmt = ScifiBot\Db::instance()->prepare(
                "INSERT INTO titles (
                    type,
                    name,
                    publisher,
                    year,
                    released,
                    runtime,
                    plot,
                    wikipedia_url,
                    teaser,
                    imdb_rating,
                    imdb_url,
                    metascore_rating,
                    metascore_url,
                    rotten_tomatoes_rating,
                    rotten_tomatoes_url,
                    trailer,
                    modified,
                    created,
                    active
                )
                VALUES (
                    :type,
                    :name,
                    :publisher,
                    :year,
                    :released,
                    :runtime,
                    :plot,
                    :wikipedia_url,
                    :teaser,
                    :imdb_rating,
                    :imdb_url,
                    :metascore_rating,
                    :metascore_url,
                    :rotten_tomatoes_rating,
                    :rotten_tomatoes_url,
                    :trailer,
                    :modified,
                    :created,
                    :active
                )");

            $aStmt->bindParam(':created', $aNow);
            $aMessage = '<strong>Success!</strong> Entry was added.';
        }

        $aModified = !empty($aEntry['modified']) ? $aEntry['modified'] : $aNow;

        $aStmt->bindParam(':type',                      $aEntry['type']);
        $aStmt->bindParam(':name',                      $aEntry['name']);
        $aStmt->bindParam(':publisher',                 $aEntry['publisher']);
        $aStmt->bindParam(':year',                      $aEntry['year']);
        $aStmt->bindParam(':released',                  $aEntry['released']);
        $aStmt->bindParam(':runtime',                   $aEntry['runtime']);
        $aStmt->bindParam(':plot',                      $aEntry['plot']);
        $aStmt->bindParam(':wikipedia_url',             $aEntry['wikipedia_url']);
        $aStmt->bindParam(':teaser',                    $aEntry['teaser']);
        $aStmt->bindParam(':imdb_rating',               $aEntry['imdb_rating']);
        $aStmt->bindParam(':imdb_url',                  $aEntry['imdb_url']);
        $aStmt->bindParam(':metascore_rating',          $aEntry['metascore_rating']);
        $aStmt->bindParam(':metascore_url',             $aEntry['metascore_url']);
        $aStmt->bindParam(':rotten_tomatoes_rating',    $aEntry['rotten_tomatoes_rating']);
        $aStmt->bindParam(':rotten_tomatoes_url',       $aEntry['rotten_tomatoes_url']);
        $aStmt->bindParam(':trailer',                   $aEntry['trailer']);
        $aStmt->bindParam(':modified',                  $aModified);
        $aStmt->bindParam(':active',                    $aEntry['active']);

        try {
            $aStmt->execute();
            $aEntry = ScifiBot\Entity::getById($aEntry['id']); // refresh entity data

            if(!$aEditing) {
                $aEntry['id'] = ScifiBot\Db::instance()->lastInsertId();
            }

        } catch(Exception $e) {
            $aMessage = '<strong>Oops!</strong> ' . $e->getMessage();
            $aStatus = 'error';
        }
    }

    ScifiBot\View::render('entry', array(
        'status' => $aStatus,
        'message' => $aMessage,
        'entry' => $aEntry,
        'editing' => $aEditing,
        'hideFields' => $aHideFields
    ));
?>
