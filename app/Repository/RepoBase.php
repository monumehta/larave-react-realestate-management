<?php


namespace App\Repository;


class RepoBase
{
    private $model;
    protected function __construct() {
        $this->model = app($this->getModelClass());
    }

    protected function startCondition() {
        return clone $this->model;
    }
}