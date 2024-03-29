<?php
    require_once(dirname(__FILE__) . '/globals.php');

    // Get id from URL
    $aId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    // If the form data already contains an id, use that instead
    // of the id provided in the URL.
    $aId = isset($_POST['id']) ? (int)$_POST['id'] : $aId;

    $aDeleting = isset($_GET['delete']);
    $aEditing = $aId != 0 && !$aDeleting;
    $aEntry = null;
    $aMessage = '';
    $aStatus = 'success';
    $aHideFields = false;
    $aTitle = 'Add entry';

    if($aDeleting) {
        $aDeleted = ScifiBot\Entity::delete($aId);

        $aMessage = $aDeleted ? 'Entry was deleted!' : 'Unable to delete entry because it does not exist.';
        $aStatus = $aDeleted ? 'success' : 'danger';
        $aTitle = 'Delete entry';
        $aHideFields = true;

    } else if($aEditing) {
        $aEntry = ScifiBot\Entity::getById($aId);
        $aTitle = 'Edit entry';

        if(!$aEntry) {
            $aMessage = '<strong>Oops!</strong> Entry not found.';
            $aStatus = 'danger';
            $aHideFields = true;
        }
    }

    if(!$aDeleting && isset($_REQUEST['data'])) {
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
                    plot_source_name = :plot_source_name,
                    plot_source_url = :plot_source_url,
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
                    plot_source_name,
                    plot_source_url,
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
                    :plot_source_name,
                    :plot_source_url,
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
        $aStmt->bindParam(':plot_source_name',          $aEntry['plot_source_name']);
        $aStmt->bindParam(':plot_source_url',           $aEntry['plot_source_url']);
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
        'title' => $aTitle,
        'status' => $aStatus,
        'message' => $aMessage,
        'entry' => $aEntry,
        'editing' => $aEditing,
        'deleting' => $aDeleting,
        'hideFields' => $aHideFields
    ));
?>
