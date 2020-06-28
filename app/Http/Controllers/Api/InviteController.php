<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Mail\InviteMailer;
use App\Models\Invite_list;
use App\Models\Project;
use App\Models\Subscriber;
use App\Models\Subscribers_Group;
use App\Models\SubscribersGroupList;
use App\Models\Client;
use App\Parser\SheetParser;
use App\Repository\GroupRepositiry;
use App\Repository\SubscribersRepository;
use App\Twilio\Number;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Exception;


class InviteController extends Controller
{
    public function parse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|max:5120|mimes:xls,xlsx,ods',
            'project_id' => 'required|integer',
            'and_invite' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();
        $parser = new SheetParser();
        $parse = $parser->parse($request);

        if ($valid['and_invite']) {

            return $this->inviteSubs($request, $parse['data'], Helper::getClientId(), $valid['project_id'], $parse['error']);
        }

        return response()->json($parse);

    }

    public function inviteSubs(Request $request, $from_parse = null, $clientID = null, $projectID = null, $parse_errors = null)
    {
        $failed = [];
        $count = 0;
        $add_count = 0;

        if (is_null($from_parse)) {
            $validator = Validator::make($request->all(), [
                'invite_list' => 'required|array',
                'project_id' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $valid = $validator->validated();
            $invites = $valid['invite_list'];
            $client_id = Helper::getClientId();
            $project_id = $valid['project_id'];
        } else {
            $invites = $from_parse;
            $client_id = $clientID;
            $project_id = $projectID;
            $answer['parse_errors'] = $parse_errors;
        }

        foreach ($invites as $invite) {
            $validator = Validator::make($invite, [
                'name' => 'required|string|max:200',
                'group_id' => 'array',
                'email' => 'required|string|email',
                'phone' => 'required'
            ]);

            if ($validator->fails()) {
                $failed[$invite['email']] = $validator->errors();

                continue;
            }


            if (Number::isInvalid($invite['phone'])) {
                $failed[$invite['phone']] = 'invalid phone';

                continue;
            }

            $has_user = User::where('email', $invite['email'])->first();

            if ($has_user) {

                if ($has_user->client_id != Helper::getClientId()) {
                    $failed[$invite['email']] = "you can't invite this user";

                    continue;
                }

                $this->createOneMoreSubscriber($has_user, $project_id);
                $add_count++;

                continue;
            }

            $new_user = $this->createUser($invite, $client_id, $project_id);
            $add_count++;

            if (isset($invite['group_id'])) {
                $errors = [];
                foreach ($invite['group_id'] as $single_group) {
                    $group_check = Subscribers_Group::find($single_group);

                    if (!$group_check || ($client_id != $group_check->client_id)) {
                        $errors[] = [$single_group => 'cant add this'];
                    }

                    $group = new SubscribersGroupList();
                    $group->subscriber_id = $new_user['subs']->id;
                    $group->group_id = $single_group;
                    $group->save();
                }

                if ($errors) {
                    $answer['errors'] = $errors;
                }

            }
            $client = Client::find($client_id);
            $data = [
                'user_name' => $new_user['user']->name,
                'user_email' => $new_user['user']->email,
                'client_name' => $client->company_name,
                'link' => 'http://app.goclear.co.il/password/reset?invite=' . $new_user['link'],
            ];
            Mail::to($new_user['user'])->send(new InviteMailer($data));
            $count++;
        } //end foreach

        $project = Project::find($project_id);

        if (!$project->is_published) {
            $project->is_published = true;
        }

        $sr = new SubscribersRepository();
        $gr = new GroupRepositiry();
        $answer['invited'] = count($invites) . ' הזמינו ' . $count . ' מתוך';
        $answer['added'] = $add_count;
        $answer['failed'] = $failed;
        $answer['subscribers'] = $sr->projectSubscribers($project_id);
        $answer['groups'] = $gr->getGroups($client_id);

        return response()->json($answer, 200);
    }

    private function createOneMoreSubscriber(User $user, int $project_id)
    {
        $existing_subscriber = Subscriber::where('user_id', $user->id)->first();
        $subscriber = Subscriber::create([
            'user_id' => $user->id,
            'client_id' => $user->client_id,
            'project_id' => $project_id,
            'status' => $existing_subscriber->status,
            'is_signed' => false,
        ]);

        return $subscriber;
    }

    private function createFirstSubscriber(User $user, int $project_id)
    {
        $subscriber = Subscriber::create([
            'user_id' => $user->id,
            'client_id' => $user->client_id,
            'project_id' => $project_id,
            'status' => 'invite sent',
            'is_signed' => false,
        ]);

        return $subscriber;
    }

    private function createUser(array $invite, int $client_id, $project_id)
    {
        $pwd = Str::random(10);

        $user = User::create([
            'name' => $invite['name'],
            'email' => $invite['email'],
            'password' => bcrypt($pwd),
            'phone' => $this->removePlus($invite['phone']),
            'type' => User::$SUBSCRIBER,
            'client_id' => $client_id,
        ]);

        $link = Str::random(64);

        $subs = $this->createFirstSubscriber($user, $project_id);

        Invite_list::create([
            'invite_link' => $link,
            'user_id' => $user->id,
            'invite_type' => User::$SUBSCRIBER,
        ]);

        $response = [
            'user' => $user,
            'subs' => $subs,
            'link' => $link,
        ];

        return $response;
    }

    public function checkInviteLink($link)
    {
        $invite = Invite_list::where('invite_link', $link)->first();

        if (is_null($invite)) {
            return response()->json('not found', 404);
        }

        return response()->json('ok', 200);
    }

    public function newPassword(Request $request)
    {
        $invite = Invite_list::where('invite_link', $request->invite_link)->first();

        if (is_null($invite)) {
            return response()->json('not found', 404);
        }

        $user = User::find($invite->user_id);
        $user->password = bcrypt($request->password);
        $user->save();

        $token = $user->createToken('Laravel Password Grant Client')->accessToken;
        $response = ['token' => $token];
        $subs = Subscriber::where('user_id', $user->id)->get();
        foreach ($subs as $sub) {
            $sub->status = 'registered';
            $sub->save();
        }

        try {
            $invite->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }

        return response($response, 200);
    }

    private function removePlus(string $number): string
    {
        if (strpos($number, '+') === 0) {
            return substr($number, 1);
        }
        return $number;
    }
}
