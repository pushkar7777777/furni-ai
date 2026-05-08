import React from 'react';
import { Truck, RotateCcw, Lock, Shield } from 'lucide-react';

const TrustSection = () => {
  const trustItems = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free shipping on orders above ₹5000. Fast delivery to your doorstep.'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free returns. If not satisfied, return and get full refund.'
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: '100% secure transactions. Your payment information is always encrypted.'
    },
    {
      icon: Shield,
      title: 'Warranty',
      description: '1-2 year warranty on all furniture. Protected against manufacturing defects.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#A67B5B]/5 via-[#3f2919]/5 to-[#1d120c]/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-[1.5rem] border border-white/10 hover:border-[#D4AF37]/40 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/25 transition-colors">
                  <Icon className="w-7 h-7 text-[#D4AF37]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#FFF8F0] mb-2 font-serif">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#FFF8F0]/60 leading-relaxed">
                  {item.description}
                </p>

                {/* Hover Indicator */}
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#D4AF37] to-[#FFDAB9] rounded-full group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#A67B5B]/10 via-[#3f2919]/10 to-[#1d120c]/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-[#FFF8F0] mb-2">
            Why Choose Saikamal Furnitures?
          </h3>
          <p className="text-[#FFF8F0]/70 max-w-2xl mx-auto">
            We bring together master craftsmanship, premium materials, and timeless design. Every piece in our collection is meticulously selected for quality, elegance, and durability. Your perfect home is our mission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
