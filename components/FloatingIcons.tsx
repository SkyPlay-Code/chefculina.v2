import React from 'react';
// Fix: Import `Variants` type from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';

// Fix: Explicitly type iconVariants with `Variants` to resolve type incompatibility.
// This ensures properties like `ease` are correctly interpreted by TypeScript.
const iconVariants: Variants = {
  float: {
    y: ["-10px", "10px"],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

const Icon: React.FC<{ children: React.ReactNode; className: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div
    className={`absolute text-orange-400/50 -z-10 ${className}`}
    variants={iconVariants}
    animate="float"
    style={{ transitionDelay: `${delay}s` }}
  >
    {children}
  </motion.div>
);

const FloatingIcons: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Icon className="top-[10%] left-[5%] w-16 h-16" delay={0.5}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" /></svg>
      </Icon>
      <Icon className="top-[20%] right-[10%] w-20 h-20" delay={1}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 7.5h18M3 12h18m-9 4.5h9" /></svg>
      </Icon>
      <Icon className="bottom-[15%] left-[15%] w-12 h-12" delay={0.2}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.125 1.125 0 0 0-.11 1.963l.135.48a1.125 1.125 0 0 0 1.963-.11l.48-.135a1.125 1.125 0 0 0 .886-1.162l.766-.51a2.25 2.25 0 0 1 1.49-.216l.89.216c.214.058.43.086.65.086.334 0 .65-.148.864-.405l.568-.568a2.25 2.25 0 0 0 0-3.182l-.568-.568a2.25 2.25 0 0 0-.864-.405l-.89-.216a2.25 2.25 0 0 1-1.49.216l-.766.51a1.125 1.125 0 0 0-1.161.886l-.048.143a1.125 1.125 0 0 0-1.963.11l-.48-.135a1.125 1.125 0 0 0-.11-1.963l-.143-.048a1.125 1.125 0 0 0-1.161-.886l-.51.766a2.25 2.25 0 0 1-1.49-.216l.216-.89a2.25 2.25 0 0 0 .405-.864v-.568a2.25 2.25 0 0 0-3.182 0l-.568.568c-.216.216-.405.48-.405.864v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.125 1.125 0 0 0-.11 1.963l.135.48a1.125 1.125 0 0 0 1.963-.11l.48-.135a1.125 1.125 0 0 0 .886-1.162l.766-.51a2.25 2.25 0 0 1 1.49-.216l.89.216c.214.058.43.086.65.086.334 0 .65-.148.864-.405l.568-.568a2.25 2.25 0 0 0 0-3.182l-.568-.568a2.25 2.25 0 0 0-.864-.405l-.89-.216a2.25 2.25 0 0 1-1.49.216l-.766.51a1.125 1.125 0 0 0-1.161.886l-.048.143a1.125 1.125 0 0 0-1.963.11l-.48-.135a1.125 1.125 0 0 0-.11-1.963l-.143-.048a1.125 1.125 0 0 0-1.161-.886l-.51.766a2.25 2.25 0 0 1-1.49-.216l.216-.89a2.25 2.25 0 0 0 .405-.864v-.568a2.25 2.25 0 0 0-3.182-3.182Z" /></svg>
      </Icon>
      <Icon className="bottom-[5%] right-[2%] w-24 h-24" delay={0.8}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9h-9v9Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 0 1 9 9h-9V3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 0 0 9 9V12H3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 0 1 9-9v9H3Z" /></svg>
      </Icon>
    </div>
  );
};

export default FloatingIcons;