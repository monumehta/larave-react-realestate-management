<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Custom\ClientRequest;
use App\Mail\ChangePackage;
use App\Mail\RegistrationMailer;
use App\Models\Client;
use App\Models\Subscriber;
use App\Repository\ClientRepository;
use App\Repository\PackageRepository;
use App\Repository\UserRepositiry;
use App\User;
use App\Models\Customer;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Auth;

class ClientController extends Controller
{
    private $user_info = [
        'access_level' => 0,
        'user_name' => 'administrator',
        'client_id' => 'administrator',
    ];
    private $clientRepo;
    private $packageRepo;
    private $userRepo;

    public function __construct(ClientRepository $clientRepository, PackageRepository $packageRepository, UserRepositiry $userRepositiry)
    {
        $this->clientRepo = $clientRepository;
        $this->packageRepo = $packageRepository;
        $this->userRepo = $userRepositiry;
    }

    //get all clients for admin
    public function index()
    {
        $user = User::auth();
        if($user->type == 0) {
            $clients = $this->clientRepo->getClients();
        } else {
            if ($user->type == 1) {
                $clients = $this->clientRepo->getClient($user->client_id);

            } else {
                $package = null;
                $projects = [];
            }
        } 

        $packages =[];

        $user_info = $this->user_info;

        $data = [
            'clients' => $clients,
            'packages' => $packages
        ];
        $response = [
            'user_info' => $user_info,
            'data' => $data
        ];
        return response()->json($response);
    }

    public function search(ClientRequest $request)
    {
        $clients = $this->clientRepo->getSearchClients($request->searchVal);
        
        // $packages = $this->packageRepo->getAllPackage();

        $user_info = $this->user_info;

        $data = [
            'clients' => $clients,
            // 'packages' => $packages
        ];
        $response = [
            'user_info' => $user_info,
            'data' => $data
        ];
        return response()->json($response);
    }

    public function show(int $id)
    {
        $client = $this->clientRepo->getClientById($id);
        $user_info = $this->user_info;
        $data = [
            'client' => $client,
        ];
        $response = [
            'user_info' => $user_info,
            'data' => $data
        ];
        return response()->json($response);
    }

    public function create(ClientRequest $request)
    {
        $validator = Validator::make($request->all(),
            [
                'company_name' => 'required|string|max:200',
                'company_email' => 'required|string|email|unique:clients,company_email',
                'company_phone' => 'sometimes|required|string|max:15|unique:clients,company_phone1',
                'company_package' => 'required|integer|exists:packages,id',
                'full_name' => 'required',
                'total_free' => 'required',
                'status' => 'sometimes|required',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();
        $client = Client::create([
            'company_name' => $valid['company_name'],
            'company_email' => $valid['company_email'],
            'company_phone1' => $valid['company_phone'],
            'company_package' => $valid['company_package'],
            'total_free' => $valid['total_free'],
            'full_name' => $valid['full_name'],
            'status' => $valid['status'],
        ]);

        $pwd = Str::random(10);
        $user = User::create([
            'name' => $valid['full_name'],
            'email' => $valid['company_email'],
            'password' => bcrypt($pwd),
            'type' => User::$CLIENT,
            'client_id' => $client->id,
            // 'email_verified_at' => Carbon::now(),
        ]);

        $data = [
            'user_email' => $user->email,
            'client_name' => $client->company_name,
            'login' => $user->email,
            'password' => $pwd,
            'company_name' => $client->company_name,
        ];
        Mail::to($user->email)->send(new RegistrationMailer($data));

        return response()->json(['client_id' => $client->id, 'user_id' => $user->id]);
        // return response()->json(['client_id' => $client->id]);

    }

    public function editInfo()
    {
        $client = $this->clientRepo->getClientInfo();
        $user = $this->userRepo->getClientUser();

        $data = [
            'company_name' => $client->company_name,
            'contact_person_name' => $user->name,
            'phone_1' => $client->company_phone1,
            'company_email' => $client->company_email,
            'package' => $client->package->name,
        ];

        return response()->json($data, 200);
    }

    public function insertImage(ClientRequest $request) {
        $request->validate([
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);
        $fileName = time().'.'.$request->image->extension();  
        try {
            $request->image->move(public_path('uploads'), $fileName);        
        } catch (\Throwable $th) {
            //throw $th;
        }
        return response()->json(['status'=>true, 'fileName'=>$fileName], 200);
    }

    public function update(ClientRequest $request, $id)
    {
        $user = $this->userRepo->getClientUserById($id);
        if (!$user) {
            return Error::wrong_param();
        }
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:200',
            'full_name' => 'required|string|max:200',
            'company_email' => 'required|string|email|unique:clients,company_email,' . $id,
            'company_phone' => 'sometimes|required|string|max:15|unique:clients,company_phone1,' . $id,
            'company_package' => 'required|integer|exists:packages,id',
            'total_free' => 'required', 
            'status' => 'sometimes|required|integer',
            // 'user_name' => 'required|string|max:200',
            // 'user_email' => 'required|string|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $valid = $validator->validated();

        Client::find($id)
            ->update([
                'company_name' => $valid['company_name'],
                'company_email' => $valid['company_email'],
                'company_phone1' => $valid['company_phone'],
                'company_package' => $valid['company_package'],
                'total_free' => $valid['total_free'],
                'status' => $valid['status'],
                'package_status' => Client::PACKAGE_APPROVED,
                'company_logo'=> $request->company_logo,
            ]);
        $user->update([
            'name' => $valid['full_name'],
            'email' => $valid['company_email'],
        ]);

        return response()->json('client updated');
    }

    public function clientUpdate(ClientRequest $request)
    {
        $validator = Validator::make($request->all(),
            [
                'company_name' => 'string|max:200',
                'company_email' => 'string|email|unique:clients,company_email,' . Helper::getClientId(),
                'company_phone1' => 'string|max:40',
                'company_phone2' => 'string|max:40',
                'company_phone3' => 'string|max:40',
                'company_phone4' => 'string|max:40',
            ]
        );
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        Client::find(Helper::getClientId())
            ->update($validator->validated());

        if ($request->has('user_name')) {
            $user = $this->userRepo->getClientUser();
            $user->name = $request->user_name;
            $user->save();
        }

        return response()->json('done', 201);
    }

    public function logoUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'image|max:1024',

        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $fw = new Fileworker();
        $client = Client::find(Helper::getClientId());
        $client->company_logo = $fw->uploadLogo($request);
        $client->save();
        return response()->json('done', 201);
    }


    public function getLogo()
    {
        $client = Client::find(Helper::getClientId());
        return response()->json(Storage::url($client->company_logo), 200);
    }


    public function selectPackage(ClientRequest $request)
    {
        $client = Client::find(Helper::getClientId());
        $user = $this->userRepo->getClientUser();
        $packageRepo = new PackageRepository();
        $client->package_status = $request->package;
        $data = [
            'new' => false,
            'client_name' => $user->name,
            'company_name' => $client->company_name,
            'package' => $packageRepo->getPackageName($request->package),
            'company_email' => $client->company_email,
            'company_phone' => $client->company_phone1,
            'user_email' => $user->email,
        ];

        if ($client->status == Client::WAITING_FOR_CONFIRMATION) {
            $data['new'] = true;
        }

        $admin = User::find(1);
        Mail::to($admin)->send(new ChangePackage($data));
        switch ($request->package) {
            case 1:
                $client->package_status = Client::WAITING_FOR_PACKAGE_1;
                break;
            case 2:
                $client->package_status = Client::WAITING_FOR_PACKAGE_2;
                break;
            case 3:
                $client->package_status = Client::WAITING_FOR_PACKAGE_3;
                break;
            case 4:
                $client->package_status = Client::WAITING_FOR_PACKAGE_4;
                break;
            case 5:
                $client->package_status = Client::WAITING_FOR_PACKAGE_5;
                break;
        }
        $client->save();
        return response()->json('done', 201);
    }

    public function getPackages()
    {
        $client = Client::find(Helper::getClientId());
        $packages = $this->packageRepo->getAllPackage();
        $data['packages'] = $packages;
        if($client->package_status == 0){
            $data['selected_package'] = $client->company_package;
        }else{
            $data['selected_package'] = $client->package_status;
        }

        return response()->json($data, 200);
    }

    public function deleteSubscriber(int $id)
    {
        $subs = Customer::find($id);

        // if ($subs->client_id != Auth::user()->client_id || $subs->client_id != 0) {
        //     return Error::access_denied();
        // }
        
        $user = User::where('customer_id',$subs->id);
        try {
            $user->delete();
            $subs->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }
        return response()->json('done', 201);
    }

    public function delete($id)
    {
        $client = Client::find($id);
        try {
            $client->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }
        return response()->json('done', 200);
    }
}