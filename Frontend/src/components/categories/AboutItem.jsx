import React, { useEffect, useState } from "react";
import { getAllCategories } from '../../api/Categories.api';
import { createReview, getServiceReviews, getJobReviews } from '../../api/Reviews.api';
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCommentAlt, FaHome, FaChevronRight, FaStar } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import ReviewSection from '../Reviews/ReviewSection';
import ChatButton from '../Chat/ChatButton';

export function AboutItem({ item, isService }) {
  const [categories, setCategories] = useState([]);
  const [categoryLookup, setCategoryLookup] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    getAllCategories()
      .then(response => {
        const categoriesData = response.data || [];
        setCategories(categoriesData);
        
        const lookup = {};
        categoriesData.forEach(category => {
          lookup[category.name] = category.id;
        });
        setCategoryLookup(lookup);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    if (item?.id) {
      const fetchReviews = async () => {
        try {
          const response = isService 
            ? await getServiceReviews(item.id)
            : await getJobReviews(item.id);
          setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error al obtener reviews:', error);
          setReviews([]);
        }
      };
      fetchReviews();
    }
  }, [item?.id, isService]);

  const handleReviewSubmit = async (reviewData) => {
    if (!user) {
      alert('Debes iniciar sesión para publicar una review');
      return;
    }

    try {
      const response = await createReview({
        ...reviewData,
        [isService ? 'service' : 'job']: item.id,
      });
      
      if (response.data) {
        const updatedReviews = isService 
          ? await getServiceReviews(item.id)
          : await getJobReviews(item.id);
        
        setReviews(Array.isArray(updatedReviews.data) ? updatedReviews.data : []);
      }
    } catch (error) {
      console.error('Error al crear review:', error);
      const errorMessage = error.response?.data?.error || 'Error al crear la review';
      alert(errorMessage);
    }
  };

  if (!item) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  const title = isService ? item.service_title : item.job_title;
  const description = isService ? item.service_description : item.job_description;
  const category = isService ? item.service_category : item.job_category;
  const subcategory = isService ? item.service_subcategory : item.job_subcategory;
  const nestedcategory = isService ? item.service_nestedcategory : item.job_nestedcategory;
  const name = isService ? 
    `${item.freelancer_name} ${item.freelancer_lastname || ''}`.trim() : 
    item.company_name;
  const avatar = isService ? item.freelancer_avatar : item.company_avatar;
  const location = isService ? item.freelancer_location : item.company_location;
  const language = isService ? item.freelancer_language : item.company_language;
  const image = isService ? item.service_image : item.job_image;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Ruta de navegación */}
      {categories.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/home" className="hover:text-purple-600 transition-colors duration-200">
            <FaHome className="text-gray-400 mr-1" />
          </Link>
          {[category, subcategory, nestedcategory].filter(Boolean).map((cat, index) => (
            <React.Fragment key={index}>
              <FaChevronRight className="text-gray-400" />
              {index === 0 ? (
                <Link
                  to={`/category/${categoryLookup[cat] || '#'}`}
                  className="hover:text-purple-600 transition-colors duration-200"
                >
                  {cat}
                </Link>
              ) : (
                <span className="hover:text-purple-600 transition-colors duration-200">
                  {cat}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </div>

      {/* Información del usuario o empresa */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <img
          src={avatar}
          alt={`Avatar de ${name}`}
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
        />
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <Link 
              to={`/${isService ? 'freelancer' : 'company'}/${item.id}`} 
              className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200"
            >
              {name}
            </Link>
            {user && user.id !== (isService ? item.freelancer?.id : item.company?.id) && (
              <ChatButton 
                otherUser={{
                  id: isService ? item.freelancer?.id : item.company?.id,
                  name: isService ? `${item.freelancer_name} ${item.freelancer_lastname || ''}` : item.company_name,
                  type: isService ? 'freelancer' : 'company',
                  profile_id: isService ? item.freelancer?.id : item.company?.id
                }} 
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center mt-2 sm:mt-0">
              <FaMapMarkerAlt className="mr-2 text-purple-500" />
              {location}
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <FaCommentAlt className="mr-2 text-purple-500" />
              {language}
            </div>
          </div>
        </div>
      </div>

      {/* Imagen del servicio o trabajo */}
      {image && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={image}
            alt={`Imagen de ${title}`}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Reemplazar toda la sección de reviews con el nuevo componente */}
      <ReviewSection
        reviews={reviews}
        onReviewSubmit={handleReviewSubmit}
        isService={isService}
        itemId={item.id}
      />
    </div>
  );
}

export default AboutItem;
