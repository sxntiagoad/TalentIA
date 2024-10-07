import { useEffect, useState, useRef } from "react";
import { getAllJobs, getAllServices } from "../../api/Services.api";
import { PostItem } from "../general/PostItem";
import 'react-alice-carousel/lib/alice-carousel.css';
import AliceCarousel from 'react-alice-carousel';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import '@fontsource/poppins';

export function ItemsList({ isService = true, title = "Servicios" }) {
  const [items, setItems] = useState([]);
  const carousel = useRef(null);

  useEffect(() => {
    async function loadItems() {
      const response = isService ? await getAllServices() : await getAllJobs();
      setItems(response.data);
      console.log(response.data);
    }
    loadItems();
  }, []);

  const slidePrev = () => {
    if (carousel.current) {
      carousel.current.slidePrev();
    }
  };

  const slideNext = () => {
    if (carousel.current) {
      carousel.current.slideNext();
    }
  };

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
    1200: { items: 4 },
    1400: { items: 5 }
  };

  const carouselItems = items.map((item) => (
    <div key={item.id} className="px-4">
      <PostItem item={item} isService={isService} />
    </div>
  ));

  return (
    <div className="py-4">
      {/* Contenedor Principal */}
      <div className="w-full mx-auto px-10"> {/* Remueve max-w-6xl y reduce px */}
        {/* Subcontenedor más ancho y centrado */}
        <h2 className="text-3xl font-semibold text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h2>
        <div className="relative">
          <AliceCarousel
            mouseTracking
            items={carouselItems}
            responsive={responsive}
            controlsStrategy="responsive"
            infinite={true}
            disableDotsControls={true} 
            ref={carousel}
            renderPrevButton={() => null} // Eliminar flechas predeterminadas
            renderNextButton={() => null} // Eliminar flechas predeterminadas
          />
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-purple-500 rounded-full p-2 shadow-lg"
            onClick={slideNext}
            style={{ backgroundColor: '#1a202c' }} 
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}