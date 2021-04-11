from django import forms

from .models import Book, Customer


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = (
            'name', 
            'kind', 
            'internal_rating', 
            'cover', 
            'author', 
            'featured' )


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ('name', 'email')


class CheckinForm(forms.Form):
    comments = forms.CharField(max_length=400)
    rating = forms.DecimalField(max_digits=6, decimal_places=2)


class CheckoutForm(forms.Form):
    comments = forms.CharField(max_length=400)
    rating = forms.DecimalField(max_digits=6, decimal_places=2)