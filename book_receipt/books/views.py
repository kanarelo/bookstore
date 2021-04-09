from django.urls import reverse
from django.shortcuts import render, get_object_or_404, redirect

from django.http import JsonResponse
from django.views.decorators.http import require_POST

from .forms import BookForm
from .models import Book, Borrowing


def index(request):
    return redirect(reverse('library'))


def books(request, book_id=None, create=False):
    response = {}
    success = False

    if request.method == "GET":
        if book_id is not None:
            book = get_object_or_404(Book, id=book_id)
            response['book'] = book.as_dict()
        else:
            books = Book.objects.all()
            response['books'] = list(b.as_dict() for b in books)
            
        success = True

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

            response['book'] = book.as_dict()
            
            success = True
        else:
            response['errors'] = form.errors
            
    return JsonResponse({
        'success': success,
        'response': response
    })


@require_POST
def borrow_checkout(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    borrowing = Borrowing.checkout_book(book, customer)


@require_POST
def borrow_checkin(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    borrowing = Borrowing.checkin_book(book, customer)


def library(request):
    recommended_books = Book.objects\
        .filter(featured=True)\
        .order_by('?')[:7] #shuffle books

    return render(request, "library.html", {
        'form': BookForm(),
        'recommended_books': recommended_books,
        'books': recommended_books
    })


def rentals(request):
    return render(request, "rentals.html", {

    })
