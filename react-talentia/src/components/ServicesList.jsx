import { useEffect, useState } from "react";
import { getAllJobs, getAllServices } from "../api/Services.api";
import { PostItem } from "./PostItem";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function ServicesList({ isService = true }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      const response = isService ? await getAllServices() : await getAllJobs()
      setItems(response.data);
    }
    loadItems();
  }, []);

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow-lg"
      onClick={onClick}
    >
      <FaArrowRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow-lg"
      onClick={onClick}
    >
      <FaArrowLeft size={20} />
    </button>
  );

  // Configuración del slider
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Mostrar 4 ítems en pantallas grandes
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Mostrar 3 ítems en pantallas medianas
          centerMode: true, // Centrar los ítems
          centerPadding: "0px", // Ajustar el padding para centrar los ítems
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Mostrar 2 ítems en pantallas pequeñas
          centerMode: true,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Mostrar 1 ítem en pantallas muy pequeñas
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <div className="relative flex justify-center items-center">
      <Slider {...settings} className="w-full">
        {items.map((item) => (
          <div key={item.id} className="px-0"> {/* Eliminar padding horizontal */}
            <div className="flex justify-center">
            <PostItem item={item} isService={isService} /> {/* Usar isService */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
