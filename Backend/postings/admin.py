from django.contrib import admin
from .models import Service, Category, Subcategory, NestedCategory, Job, Review

# Inline para mostrar Subcategories en la vista de Category
class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 0  # No mostrar filas extras en blanco

# Inline para mostrar NestedCategories en la vista de Subcategory
class NestedCategoryInline(admin.TabularInline):
    model = NestedCategory
    extra = 0  # No mostrar filas extras en blanco

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    inlines = [SubcategoryInline]  # Mostrar subcategorías en la vista de categoría

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    inlines = [NestedCategoryInline]  # Mostrar nestedcategories en la vista de subcategoría

@admin.register(NestedCategory)
class NestedCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'subcategory')

# Registro de los otros modelos sin modificaciones adicionales
admin.site.register(Service)
admin.site.register(Job)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author', 'rating', 'service', 'job', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('content', 'author__email')