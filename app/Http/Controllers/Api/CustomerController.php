<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Custom\CustomerRequest;
use App\Mail\ChangePackage;
use App\Mail\InviteMailer;
use App\Models\Client;
use App\Models\Subscriber;
use App\Repository\ClientRepository;
use App\Repository\PackageRepository;
use App\Repository\UserRepositiry;
use App\User;
use App\Models\Customer;
use Carbon\Carbon;
use Exception;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CustomerController extends Controller
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
        if($user->type == 0)
            $customers = Customer::get();
        else if($user->type==1)
            $customers = Customer::where('client_id',$user->client_id)->get();
        else 
            $customers =[];
        return response()->json($customers);
    }

    public function show(int $id)
    {
        $customers = Customer::find($id);
        return response()->json($customers);
    }

    public function create(CustomerRequest $request)
    {
        $validator = Validator::make($request->all(),
            [
                // 'project_id' => 'required|integer',
                'full_name' => 'required|string|max:200',
                'mobile' => 'required|string|max:15|unique:users,phone',
                'email' => 'required|string|email|unique:users,email',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();
        
        $customer = Customer::create([
            "project_id" => $request->project_id,
            "client_id" => $request->manager_id,
            "group_id" => $request->group_id,
            "total_free" => $request->total_free,
            "full_name" => $request->full_name,
            "mobile" => $request->mobile,
            "email" => $request->email,
            "updated" => $request->updated,
            "country_apartment" => $request->country_apartment,
            "mailing_address" => $request->mailing_address,
            "street" => $request->street,
            "building_number" => $request->building_number,
            "entress" => $request->entress,
            "block" => $request->block,
            "smooth" => $request->smooth,
            "sub_divistion" => $request->sub_divistion,
            "percentage_of_ownership" => $request->percentage_of_ownership,
            "apartment" => $request->apartment,
            "floor" => $request->floor,
            "current_apartment_area" => $request->current_apartment_area,
            "current_apartment_type" => $request->current_apartment_type,
            "additional_space" => $request->additional_space,
            "balcony_area" => $request->balcony_area,
            "storage_space" => $request->storage_space,
            "parking" => $request->parking,
            "warning" => $request->warning,
            "customer_status" => $request->customer_status,
            "date_of_signature" => $request->date_of_signature,
            "remarks" => $request->remarks,
            "documentation" => json_encode($request->documentation),
            "inquiries" => json_encode($request->inquiries)
        ]);

        $pwd = Str::random(10);
        $user = User::create([
            'name' => $valid['full_name'],
            'email' => $valid['email'],
            "client_id" => $request->manager_id,
            'phone' => $request->mobile,
            'password' => bcrypt($pwd),
            'type' => User::$CUSTOMER,
            'customer_id' => $customer->id,
            'project_id' => $request->project_id,
            'email_verified_at' => Carbon::now(),
        ]);

        $client = Client::find($user->client_id);

        $token = Str::random(64);

        DB::table(config('auth.passwords.users.table'))->insert([
            'email' => $user->email, 
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $data = [
            'user_name' => $user->name,
            'user_email' =>$user->email,
            'client_name' => $client->company_name,
            'link' => env('APP_URL').'/password/reset/'.$token.'?email='. urlencode($user->email),
        ];
        Mail::to($user->email)->send(new InviteMailer($data));

        return response()->json(['customer_id' => $customer->id, 'user_id' => $user->id]);
    }
    

    public function searchByClient(CustomerRequest $request, $id)
    {
        $user = User::auth();
        if($user->type == 0){        
            $customers = Customer:: where('client_id',$id)->with('group')
            ->where('full_name', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('mobile', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('email', 'LIKE', "%{$request->searchVal}%") 
            ->get();

        } else if($user->type==1) {
            $customers = Customer:: where('client_id',$id)->with('group')
            ->where('client_id',$user->client_id)
            ->orwhere('full_name', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('mobile', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('email', 'LIKE', "%{$request->searchVal}%") 
            ->get();

        } else {
            $customers =[];
        }
        
        return response()->json($customers);
    }
    
    public function search(CustomerRequest $request)
    {
        $user = User::auth();
        if($user->type == 0){

        
            $customers = Customer:: where('full_name', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('mobile', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('email', 'LIKE', "%{$request->searchVal}%") 
            ->get();

        } else if($user->type==1) {
            $customers = Customer:: where('client_id',$user->client_id)
            ->orwhere('full_name', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('mobile', 'LIKE', "%{$request->searchVal}%") 
            ->orWhere('email', 'LIKE', "%{$request->searchVal}%") 
            ->get();

        } else {
            $customers =[];
        }
        
        return response()->json($customers);
    }
    

    public function customerByClient(int $id)
    {
        $customers = Customer::where('client_id',$id)->with('group')->get();
        return response()->json($customers);
    }

    public function customerByClientAndGroup(CustomerRequest $request, int $id)
    {
        $customers = Customer::where('client_id',$id)->where('group_id', $request->group_id)->with('group')->get();
        return response()->json($customers);
    }

    public function customerByProjectAndGroup(CustomerRequest $request, int $id)
    {
        $customers = Customer::where('project_id',$id)->where('group_id', $request->group_id)->with('group')->get();
        return response()->json($customers);
    }

    
    public function customerByProject(int $id)
    {
        $customers = Customer::where('project_id',$id)->with('group')->get();
        return response()->json($customers);
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

    public function updateInquiry(CustomerRequest $request, $id)
    {
        $customer = Customer::find($id);
        if($customer) {

            if(!empty(json_decode($customer->inquiries,true))) {
                $enq = array_merge(json_decode($customer->inquiries, true),$request->inquiries);
                $enq = array_merge(json_decode($customer->inquiries, true),$request->inquiries);
                $customer->inquiries = json_encode($enq);
            } else {
                $customer->inquiries = json_encode($request->inquiries);
            }

            $customer->save();
        }

        return response()->json('client updated', 200);
    }

    public function update(CustomerRequest $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:200',
            'mobile' => 'required|string|max:10',
            'email' => 'required|string|email|unique:users,email,'.$id,
            
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $valid = $validator->validated();

        Customer::find($id)
            ->update([
                "project_id" => $request->project_id,
                "client_id" => $request->manager_id,
                "group_id" => $request->group_id,
                "total_free" => $request->total_free,
                "full_name" => $request->full_name,
                "mobile" => $request->mobile,
                "email" => $request->email,
                "updated" => $request->updated,
                "country_apartment" => $request->country_apartment,
                "mailing_address" => $request->mailing_address,
                "street" => $request->street,
                "building_number" => $request->building_number,
                "entress" => $request->entress,
                "block" => $request->block,
                "smooth" => $request->smooth,
                "sub_divistion" => $request->sub_divistion,
                "percentage_of_ownership" => $request->percentage_of_ownership,
                "apartment" => $request->apartment,
                "floor" => $request->floor,
                "current_apartment_area" => $request->current_apartment_area,
                "current_apartment_type" => $request->current_apartment_type,
                "additional_space" => $request->additional_space,
                "balcony_area" => $request->balcony_area,
                "storage_space" => $request->storage_space,
                "parking" => $request->parking,
                "warning" => $request->warning,
                "customer_status" => $request->customer_status,
                "date_of_signature" => $request->date_of_signature,
                "remarks" => $request->remarks,
                "documentation" => json_encode($request->documentation),
                "inquiries" => json_encode($request->inquiries)
            ]);
            

        User::where('customer_id', $id)
          ->update([
            'name' => $request->full_name,
            'email' => $request->email,
            "phone" => $request->mobile,
          ]);

        return response()->json('client updated', 200);
    }

    public function updateGroup(CustomerRequest $request, $id)
    {

        Customer::find($id)
            ->update([
                "group_id" => $request->group_id,
            ]);
        return response()->json('client updated', 200);
    }



    public function delete($id)
    {
        $customer = Customer::find($id);
        try {
            $customer->delete();
            $user = User::where('customer_id',$id)->delete();
        } catch (Exception $exception) {
            return Error::mysqlException($exception->getMessage());
        }
        return response()->json('done', 200);
    }


    public function import(CustomerRequest $request)
    {
        // dd($request->all());    
        $validator = Validator::make($request->all(),
            [
                'client_id' => 'required|integer',
                'project_id' => 'required|integer',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $valid = $validator->validated();

        if(count($request->data)>0) {
            foreach ($request->data as $key => $data) {

                try {
                    $customer = Customer::create([
                        "project_id" => $request->project_id,
                        "client_id" => $request->client_id,
                        "group_id" => $data['group_id']?$data['group_id']:0,
                        "total_free" => $data['total_free']?$data['total_free']:0,
                        "full_name" => $data['full_name']?$data['full_name']:'',
                        "mobile" => $data['mobile']?$data['mobile']:'',
                        "email" => $data['email']?$data['email']:'',
                        "updated" => $data['updated']?$data['updated']:'',
                        "country_apartment" => $data['country_apartment']?$data['country_apartment']:'',
                        "mailing_address" => $data['mailing_address']?$data['mailing_address']:'',
                        "street" => $data['street']?$data['street']:'',
                        "building_number" => $data['building_number']?$data['building_number']:'',
                        "entress" => $data['entress']?$data['entress']:'',
                        "block" => $data['block']?$data['block']:'',
                        "smooth" => $data['smooth']?$data['smooth']:'',
                        "sub_divistion" => $data['sub_divistion']?$data['sub_divistion']:'',
                        "percentage_of_ownership" => $data['percentage_of_ownership']?$data['percentage_of_ownership']:'',
                        "apartment" => $data['apartment']?$data['apartment']:'',
                        "floor" => $data['floor']?$data['floor']:'',
                        "current_apartment_area" => $data['current_apartment_area']?$data['current_apartment_area']:'',
                        "current_apartment_type" => $data['current_apartment_type']?$data['current_apartment_type']:'',
                        "additional_space" => $data['additional_space']?$data['additional_space']:'',
                        "balcony_area" => $data['balcony_area']?$data['balcony_area']:'',
                        "storage_space" => $data['storage_space']?$data['storage_space']:'',
                        "parking" => $data['parking']?$data['parking']:'',
                        "warning" => $data['warning']?$data['warning']:'',
                        "date_of_signature" => $data['date_of_signature']?$data['date_of_signature']:'',
                        "remarks" => $data['remarks']?$data['remarks']:'',
                        "documentation" => $data['documentation']?$data['documentation']:[],
                        "inquiries" => $data['inquiries']?$data['inquiries']:[],
                        "status" => $data['status']?$data['status']:'',
                        "customer_status" => $data['customer_status']?$data['customer_status']:'',
                    ]);
            
                    $pwd = Str::random(10);
                    $user = User::create([
                        'name' => $data['full_name']?$data['full_name']:'',
                        'email' => $data['email']?$data['email']:'',
                        "client_id" => $request->client_id,
                        'password' => bcrypt($pwd),
                        'type' => User::$CUSTOMER,
                        'customer_id' => $customer->id,
                        'project_id' => $request->project_id,
                        'email_verified_at' => Carbon::now(),
                    ]);
    
                    
                    // $data = [
                    //     'user_email' => $user->email,
                    //     'client_name' => $user->name,
                    //     'login' => $user->email,
                    //     'password' => $pwd,
                    //     'company_name' => $user->name,
                    // ];
                    // Mail::to($user->email)->send(new InviteMailer($data));
            
                } catch (\Throwable $th) {
                    throw $th;
                }
                
            }
            
        }
        $customers = Customer::where('project_id',$request->project_id)->with('group')->get();
                

        return response()->json(['data' => $customers]);

    }
}
