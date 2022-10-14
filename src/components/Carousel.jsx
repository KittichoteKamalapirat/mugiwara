import { motion } from "framer-motion";

import ex1 from "../img/nfts/4.png";
import ex2 from "../img/nfts/5.png";
import ex3 from "../img/nfts/7.png";
import ex4 from "../img/nfts/10.png";
import ex5 from "../img/nfts/13.png";
import ex6 from "../img/nfts/14.png";
import ex7 from "../img/nfts/20.png";
import ex8 from "../img/nfts/27.png";
import ex9 from "../img/nfts/29.png";
import ex10 from "../img/nfts/31.png";

const images = [ex1, ex4, ex6, ex9, ex3, ex7, ex8, ex2, ex10, ex5];
const Carousel = () => {
  return (
    <div className="mb-32 py-32 bg-grey-50">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-black mb-10 font-extrabold tracking-tight leading-none md:text-3xl xl:text-4xl dark:text-white text-center w-full">
          Collection Examples
        </h2>

        <div class="overflow-x-auto flex">
          {images.map((src) => (
            <img src={src} className="w-52 mx-4" />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Carousel;
Carousel;
