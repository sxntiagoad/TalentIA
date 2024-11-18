import axios from 'axios';

const API_URL = 'http://34.55.91.211:8000/postings/api/v1';

const categoriesApi = axios.create({
    baseURL: API_URL
});

// Endpoints para Categorías principales
export const getAllCategories = () => {
    return categoriesApi.get('/categories/');
}

export const getCategoryById = (id) => {
    return categoriesApi.get(`/categories/${id}/`);
}

// Endpoints para Subcategorías
export const getAllSubCategories = () => {
    return categoriesApi.get('/subcategories/');
}

export const getSubCategoryById = (id) => {
    return categoriesApi.get(`/subcategories/${id}/`);
}

export const getSubcategoriesByCategory = (categoryId) => {
    return categoriesApi.get(`/subcategories/category/${categoryId}/`);
}

// Endpoints para Categorías Anidadas
export const getAllNestedCategories = () => {
    return categoriesApi.get('/nestedcategories/');
}

export const getNestedCategoryById = (id) => {
    return categoriesApi.get(`/nestedcategories/${id}/`);
}

export const getNestedCategoriesBySubcategory = (subcategoryId) => {
    return categoriesApi.get(`/nestedcategories/subcategory/${subcategoryId}/`);
}
