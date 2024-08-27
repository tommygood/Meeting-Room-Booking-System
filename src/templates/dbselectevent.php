<?php
    require_once "dblink.php";

    $json = array();
    $sqlQuery = "SELECT * FROM borrow_list JOIN `member` ON borrow_list.mid = `member`.mid; ";

    $result = mysqli_query($link, $sqlQuery);
    $eventArray = array();
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($eventArray, $row);
    }
    mysqli_free_result($result);

    mysqli_close($link); 
    echo json_encode($eventArray);
?>