from django import forms

from .models import Book, Borrowing

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ('name', 'kind')