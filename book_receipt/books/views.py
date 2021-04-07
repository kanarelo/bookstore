from django.urls import reverse
from django.shortcuts import render, get_object_or_404, redirect

from .forms import BookForm
from .models import Book

def books(request, book_id=None):
    context = {}

    if request.method == "GET":
        if book_id is not None:
            book = get_object_or_404(Book, id=book_id)

            context['book'] = book
            template_name = 'book_view.html'
        else:
            books = Book.objects.all()

            context['books'] = books
            template_name = 'book_list.html'

        return render(request, template_name, context)

    elif request.method == "POST":
        if book_id is not None:
            book = get_object_or_404(Book, id=book_id)
        else:
            book = Book()

        form = BookForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data

            book.name = data.get('name')
            book.kind = data.get('kind')

            book.save()

            return redirect(reverse('view_book', kwargs={'book_id': book.pk}))
        else:
            template_name = 'book_view.html'
            return render(request, template_name, context)

