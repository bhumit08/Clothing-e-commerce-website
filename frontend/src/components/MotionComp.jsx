import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';

const MotionComp = () => {
  const column1 = [assets.m1, assets.w4];
  const column2 = [assets.k1, assets.w1, assets.m3];
  const column3 = [assets.k2, assets.m4];

  const motionProps = (direction, index) => ({
    initial: { opacity: 0, y: direction === 'down' ? -50 : 50 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.3, duration: 0.8 },
    whileHover: { scale: 1.05 },
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-14 bg-[#F1F1F0]">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-lg text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold leading-snug text-gray-900">
          Indulge in the <br />
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            extraordinary
          </span>
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          A New Dimension to <span className="font-bold">Style.</span>
        </h2>

        <p className="mt-4 text-gray-500">
          Inspired by the cosmic wonders, we curated a collection that blends elegance,
          innovation, and a touch of magic. Here, it's one small step for Luna, one celestial
          leap for fashion.
        </p>

        <Link to="/collection" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition">
         Explore Collection
         </Link>
      </motion.div>

       <div className="flex justify-center gap-6">
        {/* Left Column */}
        <div className="flex flex-col justify-center gap-8 pt-[60px]">
          {column1.map((img, i) => (
            <motion.div
              key={`left-${i}`}
              className="w-44 h-50 rounded-2xl overflow-hidden bg-white shadow-bottom-blue"
              {...motionProps('down', i)}
            >
              <img src={img} alt={`left-${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          {column2.map((img, i) => (
            <motion.div
              key={`middle-${i}`}
              className="w-44 h-50 rounded-2xl overflow-hidden bg-white shadow-bottom-blue"
              {...motionProps('up', i)}
            >
              <img src={img} alt={`middle-${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center gap-8 pt-[60px]">
          {column3.map((img, i) => (
            <motion.div
              key={`right-${i}`}
              className="w-44 h-50 rounded-2xl overflow-hidden bg-white shadow-bottom-blue"
              {...motionProps('down', i)}
            >
              <img src={img} alt={`right-${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MotionComp;
