<?php
    require_once(dirname(__FILE__) . '/globals.php');
    require_once(dirname(__FILE__) . '/header.php');
?>

<div id="page-wrapper">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Entries</h1>
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->
    <div class="row">
        <div class="col-lg-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    List of existing titles
                    <a href="entry.php" style="float: right;"><i class="fa fa-plus-circle"></i> Add new entry</a>
                </div>
                <!-- /.panel-heading -->
                <div class="panel-body">
                    <table width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example">
                        <thead>
                            <tr>
                                <th></th>
                                <th style="width: 50%;">Name</th>
                                <th>Type</th>
                                <th>Modified</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                $aStmt = $aDb->prepare("SELECT * FROM titles");
                                $aStmt->execute();

                                $aRows = array();
                                $aNum = 0;

                                while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
                                    echo '<tr class="'.($aNum++ % 2 == 0 ? 'even' : 'odd').'">';
                                        echo '<td><a href="entry.php?id='.$aRow->id.'"><i class="fa fa-edit"></i></a></td>';
                                        echo '<td>'.$aRow->name.'</td>';
                                        echo '<td>'.$aRow->type.'</td>';
                                        echo '<td>'.date('Y-m-d H:i:s', $aRow->modified).'</td>';
                                        echo '<td>'.date('Y-m-d H:i:s', $aRow->created).'</td>';
                                    echo '</tr>';
                                }
                            ?>
                        </tbody>
                    </table>
                    <!-- /.table-responsive -->
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
