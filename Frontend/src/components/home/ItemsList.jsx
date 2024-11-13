import { useEffect, useState, useRef } from "react";
import { getAllJobs, getAllServices } from "../../api/Services.api";
import { PostItem } from "../general/PostItem";
import 'react-alice-carousel/lib/alice-carousel.css';
import AliceCarousel from 'react-alice-carousel';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import '@fontsource/poppins';
import { useNavigate } from "react-router-dom";

export function ItemsList({ isService = true, title = "Servicios" }) {
  const [items, setItems] = useState([]);
  const carousel = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadItems() {
      const response = isService ? await getAllServices() : await getAllJobs();
      setItems(response.data);
    }
    loadItems();
  }, [isService]);

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
      <div className="w-full mx-auto px-10">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title}
          </h2>
        </div>
        <div className="relative">
          <AliceCarousel
            mouseTracking
            items={carouselItems}
            responsive={responsive}
            controlsStrategy="responsive"
            infinite={true}
            disableDotsControls={true} 
            ref={carousel}
            renderPrevButton={() => (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-purple-500 rounded-full p-2 shadow-lg"
                onClick={slidePrev}
                style={{ backgroundColor: '#1a202c' }} 
              >
                <FaArrowLeft size={20} />
              </button>
            )}
            renderNextButton={() => (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-purple-500 rounded-full p-2 shadow-lg"
                onClick={slideNext}
                style={{ backgroundColor: '#1a202c' }} 
              >
                <FaArrowRight size={20} />
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
