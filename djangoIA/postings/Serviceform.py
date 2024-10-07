from django import forms
from .models import Service

class ServiceBasicInfoForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['title', 'category', 'subcategory', 'nestedcategory']

class ServiceDetailsForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['description', 'price', 'location']

# class ServiceRequirementsForm(forms.ModelForm):
#     class Meta:
#         model = Service
#         fields = ['requirements']
#los servicios no tienen requirements SOLUCIONAR o dejar asi

class ServiceFinalReviewForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['image', 'availability']
