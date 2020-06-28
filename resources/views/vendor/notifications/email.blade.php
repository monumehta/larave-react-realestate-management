<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html" />
    <meta charset="UTF-8">
</head>
<body style="margin: 0px; direction: rtl; background-color: #F4F3F4; font-family: Arial, sans-serif; font-size:14px;" text="#444444" bgcolor="#F4F3F4" link="#21759B" alink="#21759B" vlink="#21759B" marginheight="0" topmargin="0" marginwidth="0" leftmargin="0">
<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#F4F3F4">
    <tbody>
    <tr>
        <td style="padding: 35px;"><center>
                <table width="550" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
                    <tbody>
                    <tr>
                        <td style="padding: 50px 0; "><center><img class="alignnone size-full wp-image-307" src="{{asset('images/logo.png')}}" alt="" width="267" height="69" /></center></td>
                    </tr>
                    <tr>
                        <td align="left">
                            <div>
                                <table id="content" style=" margin-right: 30px; margin-left: 30px; color: #444; line-height: 1.6; font-size: 14px; font-family: Arial, sans-serif;" border="0" width="490" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div style="padding: 15px 0;">
                                                <!--EMAIL CONTENT-->
                                                <strong>שלום</strong><br />
                                                לאיפוס סיסמה לחצו על הכפתור.<br/><br/>
                                               
                                                {{-- Action Button --}}
                                                @isset($actionText)
                                                <?php
                                                    switch ($level) {
                                                        case 'success':
                                                        case 'error':
                                                            $color = $level;
                                                            break;
                                                        default:
                                                            $color = 'primary';
                                                    }
                                                ?>
                                                @component('mail::button', ['url' => $actionUrl, 'color' => $color])
                                                {{ $actionText }}
                                                @endcomponent
                                                @endisset

                                                <!--EMAIL CONTENT END-->
                                                בברכה,<br />
                                                צוות GoClear<br />
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table id="footer" style="line-height: 1.5; font-size: 14px; font-family: Arial, sans-serif; margin-right: 30px; margin-left: 30px;" border="0" width="490" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                    <tbody>
                                    <tr style="font-size: 11px; color: #999999;">
                                        <td style="border-top: solid 1px #d9d9d9;" colspan="2" align="center"><br />
                                            <div>
                                                <a href="mailto:office@goclear.co.il">office@goclear.co.il</a><br />
                                                כתובת: דרך הראשונים 1 קיבוץ יגור<br />
                                                על מנת להסיר עצמך מרשימת תפוצה זו <a href="#">לחץ כאן</a><br /><br />
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </center></td>
    </tr>
    </tbody>
</table>
</body>
</html>
