<?php
  include_once 'send.php';
  if ($send) {
    header("HTTP/1.0 200 OK");
  } else {
    header("HTTP/1.0 502 Bad Gateway");
  }
?>
<html>
<head>
<title>
<?php
 if ($send) {
    echo('200 OK');
  } else {
    echo('502 Bad Gateway');
  }
?>
</title>
</head>
<body>
</body>
</html>
