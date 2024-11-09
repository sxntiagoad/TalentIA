import axios from 'axios';
export const getAllCategories = () => {
    return axios.get('http://35.224.34.63:8000/postings/api/v1/categories/')
}   // Obtiene todas las categorías
export const getCategoryById = (id) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/categories/${id}/`)
}   // Obtiene una categoría por ID
export const getAllSubCategories = () => {
    return axios.get('http://35.224.34.63:8000/postings/api/v1/subcategories/')
}   // Obtiene todas las subcategorías
export const getSubCategoryById = (id) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/subcategories/${id}/`)
}   // Obtiene una subcategoría por ID
export const getAllNestedCategories = () => {
    return axios.get('http://35.224.34.63:8000/postings/api/v1/nestedcategories/')
}   // Obtiene todas las categorías anidadas
export const getNestedCategoryById = (id) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/nestedcategories/${id}/`)
}   // Obtiene una categoría anidada por ID
export const getSubcategoriesByCategory = (categoryId) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/subcategories/category/${categoryId}/`)
}   // Obtiene todas las subcategorías de una categoría específica
export const getNestedCategoriesBySubcategory = (subcategoryId) => {
    return axios.get(`http://35.224.34.63:8000/postings/api/v1/nestedcategories/subcategory/${subcategoryId}/`)
}
