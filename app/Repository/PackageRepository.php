<?php


namespace App\Repository;


use App\Models\Package as Model;

class PackageRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }


    function getModelClass()
    {
        return Model::class;
    }

    function getAllPackage()
    {
        $column = [
            'id',
            'name',
            'max_subscribers',
            'cost',
            'max_projects',
        ];
        $packages = $this->startCondition()
            ->select($column)
            ->get();
        return $packages;
    }

    function getPackageById($id)
    {
        $column = [
            'id',
            'name',
            'max_subscribers',
            'cost',
            'max_projects',
        ];
        $package = $this->startCondition()
            ->select($column)
            ->find($id);
        return $package;
    }

    public function getPackageName($id)
    {
        $package_name = $this->startCondition()
            ->find($id);
        return $package_name->name;
    }
}