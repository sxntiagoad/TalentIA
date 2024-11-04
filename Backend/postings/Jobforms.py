from django import forms
from .models import Job

class JobBasicInfoForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'category', 'subcategory', 'nestedcategory']

class JobDetailsForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['description', 'salary', 'location']

class JobRequirementsForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['requirements']

class JobFinalReviewForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['image', 'availability']
