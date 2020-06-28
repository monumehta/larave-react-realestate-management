<?php


namespace App\Repositories;


use App\Models\CategoryModel;
use App\Models\PostModel as Model;
use App\Models\TagModel;
//use App\Repositories\Interfaces\BlogRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BlogRepository extends RepoBase {
    public function __construct() {
        parent::__construct();
    }


    function getModelClass() {
        return Model::class;
    }

    /**
     * @param null $perPage
     *
     * @return Collection
     */
    public function all($perPage = null) {
        $columns = [
            'name',
            'slug',
            'image',
            'short_message_html',
            'publish_at',
            'category_id',
            'is_published',
            'id'
        ];
        $posts = $this->startCondition()
//            ->where('is_published', true)
            ->select($columns)
            ->orderBy('publish_at', 'DESC')
            ->with(['category:id,name'])
//            ->toBase()
            ->paginate($perPage);
        return $posts;
    }

    public function getIndexPostsByCategory($category_id, $perPage = null) {
        $columns = [
            'name',
            'slug',
            'image',
            'short_message_html',
            'publish_at',
            'category_id',
            'id'
        ];
        $posts = $this->startCondition()
            ->select($columns)
            ->where([['is_published', '=', true], ['category_id', $category_id]])
            ->with(['category:id,name'])
            ->orderBy('publish_at', 'DESC')
//            ->toSql()
            ->paginate($perPage);
//        dd($posts);
        return $posts;
    }

    public function getIndexPostByTag($tag_id, $perPage = null){
        $columns = [
            'name',
            'slug',
            'image',
            'short_message_html',
            'publish_at',
            'category_id',
            'id'
        ];
        $posts = $this->startCondition()
            ->select($columns)
            ->where([['is_published', '=', true],['tags', 'like', "%\"$tag_id\"%"]])
            ->with(['category:id,name'])
            ->orderBy('publish_at', 'DESC')
//            ->toSql()
            ->paginate($perPage);
//        dd($posts);
        return $posts;
    }

    public function getIndexPosts($perPage = null) {
        $columns = [
            'name',
            'slug',
            'image',
            'short_message_html',
            'publish_at',
            'category_id',
            'id'
        ];
        $posts = $this->startCondition()
            ->where('is_published', true)
            ->select($columns)
            ->orderBy('publish_at', 'DESC')
            ->with(['category:id,name'])
//            ->toBase()
            ->paginate($perPage);
        return $posts;
    }

    public function getLastPosts($count = 3) {
        $columns = [
            'name',
            'slug',
            'image',
            'publish_at'
        ];
        $posts = $this->startCondition()
            ->where('is_published', true)
            ->select($columns)
            ->latest('publish_at')
            ->limit(3)
            ->get();
        return $posts;
    }

    public function getPostBySlug($slug) {
        $columns = [
            'name',
            'slug',
            'publish_at',
            'message_html',
            'tags'
        ];
        $posts = $this->startCondition()
            ->where('slug', $slug)
            ->select($columns)
//            ->with(['tags:id,name'])
//            ->toBase()
//            ->get()
            ->first();
        return $posts;
    }

    public function getFullPostBySlug($slug){
        $post = $this->startCondition()
            ->where('slug',$slug)
//            ->get()
            ->first();
        return $post;
    }

    public function getPostForEdit($slug) {
        $columns = [
            'name',
            'slug',
            'image',
            'short_message_raw',
            'message_raw',
            'publish_at',
            'is_published',
            'category_id',
            'tags',
            'id'
        ];
        $post = $this->startCondition()
            ->where('slug', $slug)
            ->select($columns)
            ->with(['category:id,name'])
//            ->get()
            ->first();
        return $post;
    }

    public function getTagsforPost($tag_arr) {
        $columns = [
            'id',
            'name'
        ];
        $tags = app(TagModel::class)
            ->whereIn('id', $tag_arr)
            ->select($columns)
            ->toBase()
            ->get();
        return $tags;

    }
}