<?php
$SSE = +$_COOKIE["sse"] | 0;

//SSE <= 5
//ограничение количество писем в час с одного браузера
if((isset($_POST['phone']) && $_POST['phone'] != "")  && $SSE <= 5 ) {
    $to = 'test@test.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
    $subject = 'Grand komfort'; //Загаловок сообщения
    $message = '<html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Откуда: '.$subject.'</p>
                        <p>Таргет: '.(isset($_POST['target']) ? $_POST['target'] : '').'</p>
                        <p>Имя: '.(isset($_POST['name']) ? $_POST['name'] : '').'</p>
                        <p>Телефон: '.$_POST['phone'].'</p>
                        <p>Почта: '.(isset($_POST['mail']) ? $_POST['mail'] : '').'</p>
                        <br>
                        <p>IP: '.$_SERVER['REMOTE_ADDR'].'</p>
                        <p>Time: '.date("H:i:s", time()+10800).'</p>
                    </body>
                </html>'; //Текст нашего сообщения можно использовать HTML теги
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    //$headers .= "From: wordpress@domain.ru \r\n"; //иногда требуется если письма не приходят
    mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
    setcookie("sse", ++$SSE, time()+3600, '/', null, null, true);
    $send = true;
} else {
    $send = false;
}

?>
