import React from "react";
import "./BrandMarquee.css";

const brands = [
  "ZARA", "GUCCI", "H&M", "PRADA", "UNIQLO", "BURBERRY",
  "LOUIS VUITTON", "NIKE", "ADIDAS", "LEVI’S"
];

const BrandMarquee = () => {
  return (
    <div className="brand-marquee-wrapper">
      <div className="brand-marquee">
        {[...brands, ...brands].map((brand, i) => (
          <span key={i} className="brand-name">{brand}</span>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
