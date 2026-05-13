/**
 * Admin New Product Page
 *
 * @description Form page for creating new products in the catalog.
 * Provides comprehensive product creation with multiple fields and validations.
 *
 * @route /admin/products/new
 *
 * @features
 * - Product information form (name, description, price)
 * - Category selection
 * - Stock management
 * - Product images upload
 * - Product visibility settings
 * - Featured product designation
 * - Real-time validation
 *
 * @access Admin users only
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Star,
  ShoppingCart,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    images: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    stock: "",
    featured: false,
    tags: [] as string[],
    isActive: true,
  });

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        stock: parseInt(formData.stock, 10),
      };

      console.log("Submitting product data:", payload);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log("API Response:", result);

      if (result.success) {
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else {
        // Show validation errors in detail
        if (result.details && Array.isArray(result.details)) {
          console.log("Validation errors:", result.details);
          result.details.forEach((err: any) => {
            const field = err.path.join(".");
            toast.error(`${field}: ${err.message}`);
          });
          setError("Please fix the validation errors above");
        } else {
          console.log("Error (no details):", result.error);
          toast.error(result.error || "Failed to create product");
          setError(result.error || "Failed to create product");
        }
      }
    } catch (err) {
      toast.error("Failed to create product");
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()],
      });
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim()],
      });
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (formData.images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setUploading(true);
    const filesArray = Array.from(files);
    const totalFiles = filesArray.length;
    const uploadedUrls: string[] = [];

    try {
      // Upload files sequentially to show progress
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];

        // Update progress
        setUploadProgress({
          current: i + 1,
          total: totalFiles,
          fileName: file.name,
        });

        // Check file size (4MB limit)
        if (file.size > 4 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max 4MB per image.`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }

          const data = await response.json();
          uploadedUrls.push(data.url);

          // Show progress toast
          toast.success(`Uploaded ${file.name} (${i + 1}/${totalFiles})`);
        } catch (error) {
          console.error(`Upload error for ${file.name}:`, error);
          toast.error(
            error instanceof Error
              ? error.message
              : `Failed to upload ${file.name}`,
          );
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        toast.success(
          `✓ Successfully uploaded ${uploadedUrls.length} of ${totalFiles} image(s)`,
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      // Reset the file input
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-gray-600 mt-1">
                Create a stunning product listing for your store
              </p>
            </div>
            <Link href="/admin/products">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 mx-6">
            {error}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 px-6 pb-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter product description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (£) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compare at Price (£)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.compareAtPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            compareAtPrice: e.target.value,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <Input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Images *
                </h2>

                <div className="space-y-4">
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          Uploading {uploadProgress.fileName}...
                        </span>
                        <span className="text-sm font-semibold text-blue-900">
                          {uploadProgress.current} / {uploadProgress.total}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Please wait while your images are being uploaded to
                        Cloudinary...
                      </p>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || formData.images.length >= 10}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex flex-col items-center ${
                        uploading || formData.images.length >= 10
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {uploading
                          ? uploadProgress
                            ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`
                            : "Uploading..."
                          : "Click to upload images"}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Upload up to 10 images (Max 4MB each)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Variants
                </h2>

                <div className="space-y-4">
                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colors
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addColor())
                        }
                        placeholder="e.g., Black, White, Red"
                      />
                      <Button
                        type="button"
                        onClick={addColor}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                    {formData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.colors.map((color) => (
                          <span
                            key={color}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-2 text-gray-600 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sizes
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addSize())
                        }
                        placeholder="e.g., S, M, L, XL"
                      />
                      <Button type="button" onClick={addSize} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.sizes.map((size) => (
                          <span
                            key={size}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-2 text-gray-600 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Settings
                </h2>

                <div className="space-y-4">
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        placeholder="e.g., new-arrival, trending, sale"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-gray-600 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Featured Product
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    loading || uploading || formData.images.length === 0
                  }
                  className="bg-beige-700 hover:bg-beige-800"
                >
                  {loading
                    ? "Creating..."
                    : uploading
                      ? "Uploading images..."
                      : "Create Product"}
                </Button>
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Preview Card */}
            <div className="bg-white rounded-xl shadow-lg border border-beige-200 overflow-hidden sticky top-6">
              <div className="bg-linear-to-br from-beige-600 to-beige-600 text-white p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Live Preview</h3>
                </div>
                <p className="text-beige-100 text-sm">
                  See how your product will look
                </p>
              </div>

              <div className="p-4">
                {/* Product Image Preview */}
                <div className="relative bg-linear-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden aspect-square mb-4 border-2 border-gray-200">
                  {formData.images.length > 0 ? (
                    <>
                      <img
                        src={formData.images[0]}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      {formData.featured && (
                        <div className="absolute top-3 left-3 bg-beige-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          Featured
                        </div>
                      )}
                      {formData.compareAtPrice &&
                        parseFloat(formData.compareAtPrice) >
                          parseFloat(formData.price || "0") && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            -
                            {Math.round(
                              ((parseFloat(formData.compareAtPrice) -
                                parseFloat(formData.price || "0")) /
                                parseFloat(formData.compareAtPrice)) *
                                100,
                            )}
                            %
                          </div>
                        )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <Upload className="w-12 h-12 mb-2" />
                      <p className="text-sm font-medium">No image uploaded</p>
                      <p className="text-xs">Upload an image to preview</p>
                    </div>
                  )}
                </div>

                {/* Image Gallery Preview */}
                {formData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {formData.images.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {formData.images.length > 4 && idx === 3 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                            +{formData.images.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Info Preview */}
                <div className="space-y-3">
                  <h4 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {formData.name || "Product Name"}
                  </h4>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-beige-700">
                      £{formData.price || "0.00"}
                    </span>
                    {formData.compareAtPrice &&
                      parseFloat(formData.compareAtPrice) >
                        parseFloat(formData.price || "0") && (
                        <span className="text-sm text-gray-400 line-through">
                          £{formData.compareAtPrice}
                        </span>
                      )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData.description || "No description yet"}
                  </p>

                  {/* Variants Preview */}
                  {(formData.colors.length > 0 ||
                    formData.sizes.length > 0) && (
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      {formData.colors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Colors:
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {formData.colors.slice(0, 3).map((color, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-beige-100 text-beige-700 px-2 py-0.5 rounded-full"
                              >
                                {color}
                              </span>
                            ))}
                            {formData.colors.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{formData.colors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {formData.sizes.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Sizes:
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {formData.sizes.slice(0, 4).map((size, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-300"
                              >
                                {size}
                              </span>
                            ))}
                            {formData.sizes.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{formData.sizes.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Add Button Preview */}
                  <Button
                    className="w-full bg-beige-700 hover:bg-beige-800 mt-4"
                    disabled
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Completion Checklist */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-beige-600" />
                <h3 className="font-bold text-gray-900">
                  Completion Checklist
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Product Name", check: formData.name },
                  { label: "Description", check: formData.description },
                  { label: "Price", check: formData.price },
                  { label: "Category", check: formData.category },
                  { label: "Stock Quantity", check: formData.stock },
                  {
                    label: "At least 1 image",
                    check: formData.images.length > 0,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.check ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-300" />
                    )}
                    <span
                      className={`text-sm ${item.check ? "text-gray-900 font-medium" : "text-gray-400"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-beige-700">
                    {Math.round(
                      ([
                        formData.name,
                        formData.description,
                        formData.price,
                        formData.category,
                        formData.stock,
                        formData.images.length > 0,
                      ].filter(Boolean).length /
                        6) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-beige-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${([formData.name, formData.description, formData.price, formData.category, formData.stock, formData.images.length > 0].filter(Boolean).length / 6) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-linear-to-br from-beige-50 to-beige-50 rounded-xl border border-beige-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-beige-600" />
                <h3 className="font-bold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-beige-600 mt-0.5 shrink-0" />
                  <span>
                    Use high-quality images (at least 1000x1000px) for better
                    engagement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-beige-600 mt-0.5 shrink-0" />
                  <span>Mark as Featured to display on homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShoppingCart className="w-4 h-4 text-beige-600 mt-0.5 shrink-0" />
                  <span>Add multiple images to show different angles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
