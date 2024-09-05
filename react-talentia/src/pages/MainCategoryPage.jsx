import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import backgroundImage from "../assets/FondoCategoria.png"; // Asegúrate de que la ruta de la imagen sea correcta
import '../index.css'; // Importa el archivo de estilos
import { Navbar } from "../components/general/Navbar"; // Importa el componente Navigation

export function MainCategoryPage() {
  const { name } = useParams(); // Obtiene el nombre de la categoría desde la URL
  const { subCategories, setSubCategories } = useState([]); // Inicializa el estado de las subcategorías
  useEffect(() => {
    async function fetchSubCategories() {
      try {
        const response = await getSubCategoriesByCategory(name); // Obtiene las subcategorías por nombre de categoría 
      } catch (error) {
        
      }
    }
    fetchSubCategories();
  }
  , [name]);
    

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="main-category-page">
        <div 
          className="category-container" 
          style={{ backgroundImage:`url(${backgroundImage})` }} // Usamos la imagen de fondo
        >
          {/* Muestra el nombre de la categoría en el centro del rectángulo */}
          <h1 className="category-title">
            {name}
          </h1>
        </div>
      </div>
    </>
  );
}

export default MainCategoryPage;