from django.urls import reverse
from django.shortcuts import render, get_object_or_404, redirect

from django.views.decorators.http import require_POST

from .forms import BookForm
from .models import Book, Borrowing


def books(request, book_id=None, create=False):
    context = {}

    if request.method == "GET":
        if create:
            form = BookForm()
            context['form'] = form

            template_name = 'book_form.html'
        else:
            if book_id is not None:
                book = get_object_or_404(Book, id=book_id)

                context['book'] = book

                template_name = 'book_view.html'
            else:
                books = Book.objects.all()

                context['books'] = books
                template_name = 'book_list.html'

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

            return redirect(reverse('list_books'))
        else:
            template_name = 'book_form.html'
            context['form'] = form
            
    return render(request, template_name, context)


@require_POST
def borrow_checkout(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    borrowing = Borrowing.checkout_book(book, customer)

@require_POST
def borrow_checkin(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    borrowing = Borrowing.checkin_book(book, customer)