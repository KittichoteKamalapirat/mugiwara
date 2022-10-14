import Carousel from "./Carousel";
import { Footer } from "./Footer";
import Hero from "./Hero";
import Install from "./Install";
import Mint from "./Mint";
import Navbar from "./Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Carousel />
      {window.ethereum ? <Mint /> : <Install />}

      <Footer />
    </div>
  );
}

export default Home;
