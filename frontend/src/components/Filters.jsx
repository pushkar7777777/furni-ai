import React, { useState } from 'react';

const Filters = ({ onApplyFilters }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [sort, setSort] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ minPrice, maxPrice, material, color, sort });
  };

  return (
    <div className="glass-panel p-8 rounded-[32px] border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#A67B5B]/10 transition-all duration-700" />
      
      <div className="flex items-center gap-3 mb-8">
         <div className="w-8 h-[1px] bg-[#A67B5B]" />
         <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]">Refine Collection</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Price Horizon</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all placeholder:text-white/10"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Materiality</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1d120c]">All Materials</option>
            <option value="wood" className="bg-[#1d120c]">Heritage Wood</option>
            <option value="metal" className="bg-[#1d120c]">Forged Metal</option>
            <option value="plastic" className="bg-[#1d120c]">Modern Polymers</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Chromatic Tone</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1d120c]">All Tones</option>
            <option value="black" className="bg-[#1d120c]">Obsidian</option>
            <option value="white" className="bg-[#1d120c]">Floral White</option>
            <option value="brown" className="bg-[#1d120c]">Royal Walnut</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Sequence</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1d120c]">Natural Order</option>
            <option value="price_asc" className="bg-[#1d120c]">Value: Ascending</option>
            <option value="price_desc" className="bg-[#1d120c]">Value: Descending</option>
            <option value="newest" className="bg-[#1d120c]">Latest Manifests</option>
          </select>
        </div>

        <button
          onClick={handleApplyFilters}
          className="w-full bg-[#A67B5B] text-[#FFF8F0] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#8B654A] transition-all shadow-xl shadow-[#A67B5B]/10 hover:translate-y-[-2px] active:translate-y-0"
        >
          Apply Refinements
        </button>
      </div>
    </div>
  );
};

export default Filters;