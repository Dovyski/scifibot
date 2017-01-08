<?php
    $aData = ScifiBot\View::data();
    $aEntry = $aData['entry'];
?>

<?php require_once(dirname(__FILE__) . '/header.php'); ?>

<div id="page-wrapper">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header"><?php echo $aData['title']; ?></h1>
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->

    <?php if($aData['message'] != '') { ?>
        <div class="alert alert-<?php echo $aData['status']; ?>" role="alert"><?php echo $aData['message']; ?></div>
    <?php } ?>

    <?php if($aData['hideFields'] == false) { ?>

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
    <?php } ?>
</div>
<!-- /#page-wrapper -->

<?php require_once(dirname(__FILE__) . '/footer.php'); ?>
