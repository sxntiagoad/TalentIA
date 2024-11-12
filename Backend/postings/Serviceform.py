from django import forms
from .models import Service

class ServiceBasicInfoForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['title', 'category', 'subcategory', 'nestedcategory']

class ServiceDetailsForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['description', 'location']

class ServicePricingForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = [
            'basic_active',
            'basic_price',
            'basic_description',
            'basic_delivery_time',
            'basic_revisions',
            'standard_active',
            'standard_price',
            'standard_description',
            'standard_delivery_time',
            'standard_revisions',
            'premium_active',
            'premium_price',
            'premium_description',
            'premium_delivery_time',
            'premium_revisions'
        ]

    def clean(self):
        cleaned_data = super().clean()
        
        # Verificar que al menos un plan esté activo
        if not any([
            cleaned_data.get('basic_active'),
            cleaned_data.get('standard_active'),
            cleaned_data.get('premium_active')
        ]):
            raise forms.ValidationError("Debe activar al menos un plan")

        # Validar campos del plan básico
        if cleaned_data.get('basic_active'):
            basic_fields = {
                'basic_price': 'precio',
                'basic_description': 'descripción',
                'basic_delivery_time': 'tiempo de entrega',
                'basic_revisions': 'número de revisiones'
            }
            for field, name in basic_fields.items():
                if not cleaned_data.get(field):
                    raise forms.ValidationError(f"El {name} es requerido para el plan básico")

        # Validar campos del plan estándar
        if cleaned_data.get('standard_active'):
            standard_fields = {
                'standard_price': 'precio',
                'standard_description': 'descripción',
                'standard_delivery_time': 'tiempo de entrega',
                'standard_revisions': 'número de revisiones'
            }
            for field, name in standard_fields.items():
                if not cleaned_data.get(field):
                    raise forms.ValidationError(f"El {name} es requerido para el plan estándar")

        # Validar campos del plan premium
        if cleaned_data.get('premium_active'):
            premium_fields = {
                'premium_price': 'precio',
                'premium_description': 'descripción',
                'premium_delivery_time': 'tiempo de entrega',
                'premium_revisions': 'número de revisiones'
            }
            for field, name in premium_fields.items():
                if not cleaned_data.get(field):
                    raise forms.ValidationError(f"El {name} es requerido para el plan premium")

        return cleaned_data

class ServiceFinalReviewForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['image', 'availability']

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if image:
            # Validar el tamaño de la imagen (por ejemplo, máximo 5MB)
            if image.size > 5 * 1024 * 1024:
                raise forms.ValidationError("La imagen no debe exceder 5MB")
            
            # Validar el tipo de archivo
            allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
            if image.content_type not in allowed_types:
                raise forms.ValidationError("Solo se permiten archivos JPEG, JPG y PNG")
        
        return image
