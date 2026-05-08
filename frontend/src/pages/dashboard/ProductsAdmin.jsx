import React, { useState, useEffect } from 'react';
import api, { getProducts, createProduct, updateProduct, deleteProduct, getAIRecommendation } from '../../services/api';
import { Sparkles, Plus, AlertCircle, RefreshCw, Palette, Layers, Box, IndianRupee, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    material: '',
    color: '',
    stock: ''
  });
  const [addingProduct, setAddingProduct] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState({});
  const [loadingAiId, setLoadingAiId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Unable to load products. Enable backend to proceed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAddingProduct(true);
      const newProduct = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: formData.image_url || null,
        description: formData.description || null
      };

      await createProduct(newProduct);
      setFormData({ name: '', price: '', material: '', color: '', stock: '', image_url: '', description: '' });
      showToast('New product added to collection');
      await fetchProducts();
    } catch (err) {
      console.error("Failed to add product", err);
      showToast(err.response?.data?.error || "System error. Check connection.", 'error');
    } finally {
      setAddingProduct(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openEdit = (product) => {
    setEditingProduct({
      ...product,
      price: String(product.price ?? ''),
      stock: String(product.stock ?? '')
    });
  };

  const handleEditChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setAddingProduct(true);
      await updateProduct(editingProduct.id, {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock)
      });
      setEditingProduct(null);
      showToast('Product updated');
      await fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Product update failed', 'error');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This also removes related stock logs.`)) return;

    try {
      await deleteProduct(product.id);
      showToast('Product deleted');
      await fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Delete failed', 'error');
    }
  };

  const checkHarmony = async (product) => {
    try {
      setLoadingAiId(product.id);
      const response = await getAIRecommendation({ material: product.material, color: product.color });
      setAiRecommendations((prev) => ({
        ...prev,
        [product.id]: response.suggestions
      }));
    } catch (err) {
      console.error("AI check failed", err);
      setAiRecommendations((prev) => ({
        ...prev,
        [product.id]: "Unable to visualize harmony at this moment."
      }));
    } finally {
      setLoadingAiId(null);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all placeholder:text-[#FFF8F0]/20";

  const fetchFilteredProducts = async (filters) => {
    try {
      setLoading(true);
      const response = await api.get('/products/search', { params: filters });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch filtered products', err);
      setError('Unable to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent text-[#FFF8F0]">
      {toast && (
        <div className={`fixed top-12 right-12 z-[100] flex items-center gap-3 px-6 py-4 rounded-[20px] border border-white/10 shadow-2xl ${toast.type === 'error' ? 'bg-red-500/85' : 'bg-[#A67B5B]/85'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-[#FFDAB9]" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="reveal-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[1px] bg-[#A67B5B]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Inventory Hub</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Product <span className="italic font-light text-[#FFDAB9]">Atelier</span></h1>
          </div>
          <p className="text-[#FFF8F0]/40 max-w-sm text-sm font-light">
            Manage your masterpiece collection and utilize AI to ensure material harmony across every piece.
          </p>
        </div>

        <div className="glass-panel rounded-[40px] p-8 md:p-10 mb-16 border-white/5 reveal-up">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A67B5B] flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Registry of New Acquisitions
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Design Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} placeholder="e.g. Victorian Wingback" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Market Value (Rs)</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`${inputClass} pl-12`} placeholder="45000" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Core Material</label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                <input type="text" name="material" value={formData.material} onChange={handleInputChange} className={`${inputClass} pl-12`} placeholder="Aged Oak" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Finish / Hue</label>
              <div className="relative">
                <Palette className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                <input type="text" name="color" value={formData.color} onChange={handleInputChange} className={`${inputClass} pl-12`} placeholder="Satin Charcoal" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Inventory Depth</label>
              <div className="relative">
                <Box className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className={`${inputClass} pl-12`} placeholder="12" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Asset Imagery (URL)</label>
              <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} className={inputClass} placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="lg:col-span-2 space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50 ml-1">Narrative Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className={`${inputClass} resize-none min-h-[44px]`} placeholder="Describe the masterpiece's essence..." />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={addingProduct} className="w-full bg-[#A67B5B] hover:bg-[#8B654A] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-[#A67B5B]/10 disabled:opacity-50 flex items-center justify-center gap-3">
                {addingProduct ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Commit to Ledger <Plus className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] reveal-up">
          <SearchBar onSearchResults={setProducts} />
          <Filters onApplyFilters={fetchFilteredProducts} />
        </div>

        <div className="flex items-center gap-4 mb-10 reveal-up">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFDAB9] animate-pulse" />
          <h2 className="text-2xl font-serif font-bold">Active Collections</h2>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-6">
            <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Syncing Vault</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-10 rounded-[32px] border-red-500/20 text-red-400 flex flex-col items-center gap-4 reveal-up">
            <AlertCircle className="w-10 h-10" />
            <span className="font-bold tracking-widest uppercase text-xs">{error}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 glass-panel rounded-[60px] border-white/5 reveal-up">
            <Box className="w-20 h-20 text-[#FFDAB9]/10 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3">No Masterpieces Found</h3>
            <p className="text-[#FFF8F0]/30 font-light">Your inventory ledger is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <div key={product.id} className="glass-panel rounded-[48px] border-white/5 hover:border-[#FFDAB9]/20 transition-all duration-500 group overflow-hidden flex flex-col reveal-up">
                <div className="p-8 pb-4 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif font-bold group-hover:text-[#FFDAB9] transition-colors mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/40">{product.material}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                      <span className="text-xl font-serif font-bold text-[#A67B5B]">
                        Rs {Number(product.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-3 text-[#FFDAB9]/60 mb-1">
                        <Palette className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Hue</span>
                      </div>
                      <p className="text-sm font-bold truncate">{product.color}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center gap-3 text-[#FFDAB9]/60 mb-1">
                        <Box className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Status</span>
                      </div>
                      <p className={`text-sm font-bold ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {product.stock > 0 ? `${product.stock} Units` : 'Depleted'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button onClick={() => openEdit(product)} className="bg-white/5 border border-white/10 hover:border-[#FFDAB9]/40 text-[#FFF8F0] py-3 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 hover:bg-white/10 text-xs">
                      <Pencil className="w-4 h-4 text-[#FFDAB9]" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product)} className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-300 hover:text-white py-3 rounded-2xl font-bold transition-all flex justify-center items-center gap-2 text-xs">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  <button onClick={() => checkHarmony(product)} disabled={loadingAiId === product.id} className="w-full bg-white/5 border border-white/10 hover:border-[#FFDAB9]/40 text-[#FFF8F0] py-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-3 hover:bg-white/10">
                    {loadingAiId === product.id ? (
                      <RefreshCw className="w-4 h-4 text-[#FFDAB9] animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#FFDAB9]" />
                    )}
                    Check Harmony
                  </button>

                  {aiRecommendations[product.id] && (
                    <div className="mt-6 overflow-hidden">
                      <div className="p-6 glass-panel rounded-[2rem] border-[#FFDAB9]/30 bg-gradient-to-br from-[#A67B5B]/15 via-white/[0.02] to-transparent shadow-2xl transition-all duration-700">
                        {Array.isArray(aiRecommendations[product.id]) ? (
                          <>
                            <div className="flex items-center justify-between mb-5">
                              <h4 className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9] flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                Curated Harmony
                              </h4>
                            </div>

                            <div className="space-y-2.5">
                              {aiRecommendations[product.id].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-[11px] text-[#FFF8F0]/90 bg-white/5 p-2.5 rounded-xl border border-white/5 hover:border-[#FFDAB9]/20 transition-all">
                                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  </div>
                                  <span className="font-semibold tracking-wide">{item}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-start gap-4 p-2">
                            <AlertCircle className="w-5 h-5 text-amber-400/80 shrink-0" />
                            <p className="text-xs leading-relaxed text-[#FFF8F0]/60 italic font-light">
                              {aiRecommendations[product.id]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-2xl p-8 rounded-[40px]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-serif text-3xl font-bold">Edit Product</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-[#A67B5B] mt-2">Update catalog and inventory fields</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['name', 'Design Name', 'text'],
                ['price', 'Market Value', 'number'],
                ['material', 'Core Material', 'text'],
                ['color', 'Finish / Hue', 'text'],
                ['stock', 'Inventory Depth', 'number'],
                ['image_url', 'Image URL', 'url']
              ].map(([name, label, type]) => (
                <div key={name} className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50">{label}</label>
                  <input name={name} type={type} value={editingProduct[name] || ''} onChange={handleEditChange} className={inputClass} required={['name', 'price', 'material', 'color', 'stock'].includes(name)} />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]/50">Description</label>
                <textarea name="description" value={editingProduct.description || ''} onChange={handleEditChange} className={`${inputClass} min-h-24 resize-none`} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold">Cancel</button>
                <button type="submit" disabled={addingProduct} className="px-8 py-3 rounded-xl bg-[#A67B5B] hover:bg-[#8B654A] text-white text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                  {addingProduct && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
