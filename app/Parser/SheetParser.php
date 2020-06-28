<?php


namespace App\Parser;


use App\Helper\Helper;
use App\Twilio\Number;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class SheetParser
{

    public function parse($request)
    {
        $spreadsheet = IOFactory::load($request->document);
        $cellColl = $spreadsheet->getActiveSheet()->getCellCollection();
        $arr = [];
        $err = [];
        $max = $cellColl->getHighestRow();
        for ($Row = 1; $Row <= $max; $Row++) {
            $cellA = 'A';
            $cellB = 'B';
            $cellC = 'C';
            $name = $cellColl->get($cellA . $Row);
            $email = $cellColl->get($cellB . $Row);
            $phone = $cellColl->get($cellC . $Row);
            if ($name && $email && $phone) {
                $name = $cellColl->get($cellA . $Row)->getValue();
                $email = $cellColl->get($cellB . $Row)->getValue();
                $phone = $cellColl->get($cellC . $Row)->getValue();
                $validator = Validator::make(['email' => $email, 'phone' => $phone], [
                    'email' => 'required|email',
//                    'phone' => 'required|regex:/\b\d{9}\b/',
                ]);
//                $chekPhone = Number::isInvalid($phone);
                /*if (!$chekPhone) {
                    $err[] = ['Row_' . $Row => 'incorrect phone'];
                } else */
                if ($validator->fails()) {
                    $err[] = ['Row_' . $Row => $validator->errors()];
                } else {
                    if ($name && $email && $phone) {
                        $mail = User::where('email', '=', $email)->first();
                        if (is_null($mail)) {
                            $arr[] = [
                                'name' => $name,
                                'email' => $email,
                                'phone' => $phone
                            ];
                        } else {
                            if ($mail->client_id == Helper::getClientId()) {
                                $err[] = ['Row_' . $Row => ['parse_error' => 'you already have this subscriber']];
                            } else {
                                $err[] = ['Row_' . $Row => ['parse_error' => 'you cant invite this subscriber']];
                            }
                        }
                    } else {
                        $err[] = ['Row_' . $Row => ['parse_error' => 'u have error in this line ']];
                    }
                }
            } else {
                $err[] = ['Row_' . $Row => ['parse_error' => 'u have error in this line ']];
            }
        }
        $arr2 = [
            'data' => $arr,
            'error' => $err,
            'message' => 'обработано ' . count($arr) . 'строк из ' . $max
        ];
        return $arr2;
    }

}