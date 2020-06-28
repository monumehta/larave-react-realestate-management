<?php


namespace App\Repository;


use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Models\Background as Model;
use Illuminate\Support\Facades\Storage;

class BackgroundRepository extends RepoBase
{
    public function __construct()
    {
        parent::__construct();
    }

    function getModelClass()
    {
        return Model::class;
    }

    public function getAllBG()
    {
        $bg = $this->startCondition()
            ->select('id', 'name', 'img_url', 'preview_url')
            ->get();
        return response()->json($bg);
    }

    public function getAllBGID()
    {
        $bgs = $this->startCondition()
            ->select('id', 'name', 'preview_url')
            ->get();
        foreach ($bgs as &$bg) {
            $bg->preview_url = Storage::url($bg->preview_url);
        }
        return $bgs;
    }

    public function getBGInfo($id)
    {
        $column = [
            'id',
            'name',
            'img_url',
            'preview_url'
        ];
        $bg = $this->startCondition()
            ->select($column)
            ->find($id);
        if ($bg) {
            return $bg;
        } else {
            return Error::file_not_found();
        }
    }

    public function getBG($id)
    {
        $bg = $this->startCondition()
            ->select('id', 'img_url', 'preview_url')
            ->find($id);
        if ($bg) {
            if (Storage::exists($bg->img_url)) {
                return Storage::url($bg->img_url);
            } else {
                if (Storage::exists($bg->preview_url)) {
//                    Storage::delete($bg->preview_url);
                }
//                $bg->delete();
                return Error::file_not_found_and_delete();
            }
        } else {
            return Error::file_not_found();
        }
    }

    public function getPre($id)
    {
        $bg = $this->startCondition()
            ->select('id', 'img_url', 'preview_url')
            ->find($id);
        if ($bg) {
            if (Storage::exists($bg->preview_url)) {
                return Storage::url($bg->preview_url);
//                return Storage::download($bg->preview_url);
            } else {
                if (Storage::exists($bg->img_url)) {
                    Storage::delete($bg->img_url);
                }
                $bg->delete();
                return Error::file_not_found_and_delete();
            }
        } else {
            return Error::file_not_found();
        }
    }
}