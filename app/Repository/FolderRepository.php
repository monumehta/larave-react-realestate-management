<?php


namespace App\Repository;


use App\Models\Folder as Model;
use App\Models\Folder;

class FolderRepository extends RepoBase {
    public function __construct() {
        parent::__construct();
    }
    function getModelClass() {
        return Model::class;
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getFolder($id){
        $folder = $this->startCondition()
            ->find($id);
            return $folder;
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getProjectFolders($id){
        $folders = $this->startCondition()
            ->where('project_id',$id)
            ->get();
        return $folders;
    }
}