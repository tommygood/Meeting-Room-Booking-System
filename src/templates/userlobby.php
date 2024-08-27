<?php
    require_once ('./dblink.php');
?>
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>userlobby</title>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.min.css" rel="stylesheet">
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
    <script src="../templates/userlobby1.js">    </script>
     <!-- sweetAlert2 origin code-->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js"></script>
  <!-- fullcalendar origin code-->
  <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js'></script>
    <link rel="stylesheet" type="text/css" href="./css/userlobby.css">

</head>
<body>
    <div id="hamburger-menu" class="hamburger-menu">
        <!-- 我的會議頁面 -->
        <div  id= "hamburger-content" class="hamburger-content" >
            <h3 class="hamburger-title">我的會議</h3>
            <div class="hamburger-list">
            </div>
            <div id="hamburger-requestbutton" class="hamburger-requestbutton">
                <h3 class="hamburger-title" style="color:white">預約申請</h3>
            </div>
        </div>


        <!-- 申請頁面 -->
        <div id= "hamburger-requestpage" class="hamburger-content" style="display:none">
            <h3 class="hamburger-title">送出申請</h3>

        </div>
    </div>
    
    

    <div id='lobby' class="lobby">
        <div id="hamburger-button" class="hamburger-button" onclick=""> </div>
        <!-- 月曆 -->
            <div id="calendar" class="calendar"></div>
    </div>



    <!-- 彈出視窗 -->
    <div id="popup" class="popup"> 
        <div class="popup-content">
            <h1 id="popup-datetitle" class="popup-datetitle">8/20會議</h1>
            <div class="popup-list">
                <div class="popup-content_box">
                    <h3 class="popup-subtitle">
                    
                    </h3>
                    </div>

                </div>
            <button class="popup-btn" onclick="hidepopup()">確定</button>
        </div>
    </div>
</body>