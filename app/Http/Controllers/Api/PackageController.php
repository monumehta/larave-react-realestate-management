<?php

namespace App\Http\Controllers\Api;

use App\Errors\Error;
use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Repository\PackageRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    private $packageRepo;

    public function __construct(PackageRepository $packageRepository)
    {
        $this->packageRepo = $packageRepository;
    }


    public function index()
    {
        $projects = $this->packageRepo->getAllPackage();
        return response()->json($projects, 200);

    }

    public function getPackage($id)
    {
        $project = $this->packageRepo->getPackageById($id);
        return response()->json($project, 200);
    }

    public function updatePackage(Request $request, $id)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|100',
            'max_subscribers' => 'required|string|100',
            'cost' => 'required|string|100',
            'max_projects' => 'required|string|100',
        ]);
        $valid = $validation->validated();
        $package = Package::find($id);
        if ($package) {
            $package->update($valid);
            return response()->json('ok', 200);
        }
        return Error::packageNotFound();
    }

    public function newPackage(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|100',
            'max_subscribers' => 'required|string|100',
            'cost' => 'required|string|100',
            'max_projects' => 'required|string|100',
        ]);
        $valid = $validation->validated();
        $package = Package::create($valid);
        return response()->json($package, 201);
    }

    public function deletePackage($id)
    {
        $package = Package::find($id);
        if ($package) {
            try {
                $package->delete();
            } catch (Exception $exception) {
                return Error::mysqlException($exception->getMessage());
            }
            return response()->json('ok', 201);
        }
        return Error::packageNotFound();
    }
}
