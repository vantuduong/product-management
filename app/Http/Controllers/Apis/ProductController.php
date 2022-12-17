<?php

namespace App\Http\Controllers\Apis;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\UploadImageRequest;
use App\Http\Resources\ProductResource;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        return ProductResource::collection(
            Product::searchByName($request->input('name'))
                ->orderBy('created_at', 'desc')
                ->with('images')
                ->paginate(config('common.page_size'))
        );
    }

    /**
     * @param Product $product
     * @return ProductResource
     */
    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    /**
     * @param CreateProductRequest $request
     * @return ProductResource
     */
    public function store(CreateProductRequest $request)
    {
        return new ProductResource(
            Product::create($request->only([
                'name',
                'description',
                'stock_quantity',
                'price'
            ]))
        );
    }

    /**
     * @param UpdateProductRequest $request
     * @param Product $product
     * @return ProductResource
     * @throws \Exception
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        DB::beginTransaction();
        try {
            $product->update($request->only([
                'name',
                'description',
                'stock_quantity',
                'price'
            ]));

            if ($request->hasFile('images')) {
                $imageData = [];
                foreach ($request->file('images') as $image) {
                    $imageData[] = [
                        'name' => $image->getClientOriginalName(),
                        'url' => $image->store('uploads/products', 'public')
                    ];
                }

                $product->images()->createMany($imageData);
            }

            DB::commit();
            return new ProductResource($product);
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
    }

    /**
     * @param Product $product
     * @return ProductResource
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return new ProductResource($product);
    }

    /**
     * @param Product $product
     * @param Image $image
     * @return JsonResource
     */
    public function removeProductImage(Product $product, Image $image)
    {
        if (Storage::disk('public')->exists($image->url)) {
            Storage::disk('public')->delete($image->url);
        }
        $image->delete();

        return new JsonResource([]);
    }
}
