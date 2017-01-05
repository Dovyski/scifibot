<?php
    require_once(dirname(__FILE__) . '/globals.php');
    require_once(dirname(__FILE__) . '/header.php');

    $aId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $aId = isset($_POST['id']) ? (int)$_POST['id'] : $aId;

    $aEditing = $aId != 0;
    $aEntry = null;
    $aMessage = '';
    $aStatus = 'success';

    if($aEditing) {
        $aEntry = ScifiBot\Entity::getById($aId);
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
?>

<div id="page-wrapper">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header"><?php echo $aEditing ? 'Edit' : 'Add'; ?> entry</h1>
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->

    <?php if($aMessage != '') { ?>
        <div class="alert alert-<?php echo $aStatus; ?>" role="alert"><?php echo $aMessage; ?></div>
    <?php } ?>

    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Entry info
                </div>
                <div class="panel-body">
                    <form role="form" action="entry.php?id=<?php echo @$aEntry['id']; ?>" method="post">
                        <input name="id" type="hidden" value="<?php echo @$aEntry['id']; ?>">
                        <input name="data" type="hidden" value="1">
                        <div class="row">
                            <div class="col-lg-8">
                                <div class="form-group">
                                    <label>Name</label>
                                    <input name="name" class="form-control" value="<?php echo @$aEntry['name']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Type</label>
                                    <select name="type" class="form-control">
                                        <option value="1" <?php echo (@$aEntry['type'] == 1 ? 'selected="selected"' : ''); ?>>Movie</option>
                                        <option value="2" <?php echo (@$aEntry['type'] == 2 ? 'selected="selected"' : ''); ?>>Series</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="form-group">
                                    <label>Publisher</label>
                                    <input name="publisher" class="form-control" value="<?php echo @$aEntry['publisher']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Year</label>
                                    <input name="year" class="form-control" value="<?php echo @$aEntry['year']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Released</label>
                                    <input name="year" class="form-control" value="<?php echo @$aEntry['released']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Runtime (min)</label>
                                    <input name="runtime" class="form-control" value="<?php echo @$aEntry['runtime']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-10">
                                <div class="form-group">
                                    <label>Plot</label>
                                    <textarea name="plot" class="form-control" rows="5"><?php echo @$aEntry['plot']; ?></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Wikipedia URL</label>
                                    <input name="wikipedia_url" class="form-control" value="<?php echo @$aEntry['wikipedia_url']; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Teaser image</label>
                                    <input name="teaser" class="form-control" placeholder="E.g. http://domain.com/image.jpg" value="<?php echo @$aEntry['teaser']; ?>">
                                </div>
                                <div class="form-group">
                                    <label>Trailer</label>
                                    <input name="trailer" class="form-control" placeholder="E.g. http://youtube.com/?v=e39skjfhhf" value="<?php echo @$aEntry['trailer']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label>IMDb rating</label>
                                    <input name="imdb_rating" class="form-control" value="<?php echo @$aEntry['imdb_rating']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <div class="form-group">
                                    <label>IMDb URL</label>
                                    <input name="imdb_url" class="form-control" value="<?php echo @$aEntry['imdb_url']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label>Metascore rating</label>
                                    <input name="metascore_rating" class="form-control" value="<?php echo @$aEntry['metascore_rating']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <div class="form-group">
                                    <label>Metascore URL</label>
                                    <input name="metascore_url" class="form-control" value="<?php echo @$aEntry['metascore_url']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label>Rotten Tomatoes rating</label>
                                    <input name="rotten_tomatoes_rating" class="form-control" value="<?php echo @$aEntry['rotten_tomatoes_rating']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-7">
                                <div class="form-group">
                                    <label>Rotten Tomatoes URL</label>
                                    <input name="rotten_tomatoes_url" class="form-control" value="<?php echo @$aEntry['rotten_tomatoes_url']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Modified</label>
                                    <input name="modified" class="form-control" placeholder="Leave blank to use current date" value="<?php echo @$aEntry['modified']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Created</label>
                                    <input name="created" class="form-control" value="<?php echo @$aEntry['created']; ?>">
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-group">
                                    <label>Active</label>
                                    <input name="active" class="form-control" value="<?php echo @$aEntry['active']; ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-8">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                            <!-- /.col-lg-6 (nested) -->
                        </div>
                    </form>
                    <!-- /.row (nested) -->
                </div>
                <!-- /.panel-body -->
            </div>
            <!-- /.panel -->
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->
</div>
<!-- /#page-wrapper -->

<?php
    require_once(dirname(__FILE__) . '/footer.php');
?>
