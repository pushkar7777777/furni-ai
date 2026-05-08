import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Armchair, UtensilsCrossed, Wind, Warehouse, Sofa, TrendingUp } from 'lucide-react';

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: 'Sofas',
      icon: Sofa,
      color: 'from-[#D4AF37] to-[#A67B5B]',
      filter: { material: 'Fabric' },
      image: '🛋️'
    },
    {
      id: 2,
      name: 'Beds',
      icon: Wind,
      color: 'from-[#A67B5B] to-[#8B5E3C]',
      filter: { material: 'Wood' },
      image: '🛏️'
    },
    {
      id: 3,
      name: 'Tables',
      icon: UtensilsCrossed,
      color: 'from-[#8B5E3C] to-[#6B4423]',
      filter: { color: 'Brown' },
      image: '📦'
    },
    {
      id: 4,
      name: 'Chairs',
      icon: Armchair,
      color: 'from-[#6B4423] to-[#4A2F1A]',
      filter: { material: 'Metal' },
      image: '🪑'
    },
    {
      id: 5,
      name: 'Storage',
      icon: Warehouse,
      color: 'from-[#FFDAB9] to-[#D4AF37]',
      filter: { stock: '1-100' },
      image: '📦'
    },
    {
      id: 6,
      name: 'All Products',
      icon: TrendingUp,
      color: 'from-[#D4AF37] to-[#A67B5B]',
      filter: {},
      image: '⭐'
    }
  ];

  const handleCategoryClick = (filter) => {
    const params = new URLSearchParams();
    if (filter.material) params.set('material', filter.material);
    if (filter.color) params.set('color', filter.color);
    if (filter.stock) params.set('stock', filter.stock);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <section id="collections" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#3f2919]/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#FFF8F0] mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-[#FFF8F0]/60 max-w-2xl mx-auto">
            Explore our curated collection of furniture for every room and style
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.filter)}
                className="group overflow-hidden rounded-[2rem] border border-white/10 hover:border-[#FFDAB9]/40 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${category.color} p-8 space-y-6 transition-all duration-300 group-hover:scale-105 min-h-[280px] flex flex-col justify-between relative overflow-hidden`}>
                  {/* Backdrop effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-white font-serif mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/75 text-sm">
                        Discover {category.name.toLowerCase()} collection
                      </p>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="relative z-10 flex items-center text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
