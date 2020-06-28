<?php


namespace App\Repository;


use App\Errors\Error;
use App\FileWorker\Fileworker;
use App\Models\Image as Model;
use Illuminate\Support\Facades\Storage;

class ImageRepository extends RepoBase {
    public function __construct() {
        parent::__construct();
    }
    function getModelClass() {
        return Model::class;
    }

    public function getProjectImage($project_id){
        $images = $this->startCondition()
            ->where('project_id',$project_id)
            ->select('id','url')
            ->get();
        foreach ($images as &$image){
            $image->url = Storage::url($image->url);
        }
        return $images;

    }

    public function getImageURL($id){
        $image = $this->startCondition()
            ->find($id);
        if(!$image->isEmpty()){
            if(Storage::exists($image->url)) {
                return Storage::download($image->url);
            }else{
                $fw = new Fileworker();
                $fw->deleteImage($id);
                return Error::file_not_found_and_delete();
            }
        }else{
            return Error::file_not_found();
        }
    }

    public function getImage(){

    }
}