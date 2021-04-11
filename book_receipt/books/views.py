from django.urls import reverse
from django.shortcuts import render, get_object_or_404, redirect

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .forms import BookForm, CustomerForm, CheckinForm
from .models import Book, Borrowing, Customer


def index(request):
    return redirect(reverse('library'))


def books(request, book_id=None, create=False):
    response = {}
    success = False
    status = 200

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
            status = 400
            response['errors'] = form.errors
            
    return JsonResponse({
        'success': success,
        'response': response
    }, status=status)


def borrow_status(request, book_id):
    response = {}
    success = False
    status = 200

    borrowing = get_object_or_404(Borrowing, book__id=book_id)

    return JsonResponse({
        'success': success,
        'borrowing': borrowing.as_dict()
    }, status=status)


@csrf_exempt
@require_POST
def borrow_checkout(request, book_id):
    response = {
        'success': False
    }
    status = 200
    book = get_object_or_404(Book, id=book_id)

    if not book.available:
        status = 400
        response['message'] = 'Cannot check out Book. The Book has already been borrowed'
    else:
        form = CustomerForm(request.POST)
        if form.is_valid():
            customer = form.save()

            borrowing = Borrowing.checkout_book(book, customer)
            response['success'] = True
            response['data'] = borrowing.as_dict()
        else:
            status = 400
            response['errors'] = form.errors

    return JsonResponse(response, status=status)


@csrf_exempt
@require_POST
def borrow_checkin(request, book_id):
    response = {
        'success': False
    }
    status = 200
    book = get_object_or_404(Book, id=book_id)

    if book.available:
        response['message'] = 'Cannot check in Book. The Book is available and not yet borrowed.'
    else:
        form = CheckinForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            borrowing = Borrowing.checkin_book(
                book, 
                comments=data.get('comments'))

            response['success'] = True
            response['data'] = borrowing.as_dict()
        else:
            status = 400
            response['errors'] = form.errors

    return JsonResponse(response, status=status) 


def library_data(request):
    all_books = Book.objects.all()

    recommended_books = all_books\
        .filter(featured=True)\
        .order_by('?')[:7] #shuffle books

    latest_books = all_books\
        .filter(featured=True)\
        .order_by('-created_at')[:7]

    return JsonResponse({
        'success': True,
        'response': {
            'all_books': [
                b.as_dict() for b in all_books
            ],
            'latest_books': [
                b.as_dict() for b in latest_books
            ],
            'recommended_books': [
                b.as_dict() for b in recommended_books
            ]
        }
    })


def library(request):
    recommended_books = Book.objects\
        .filter(featured=True)\
        .order_by('?')[:7] #shuffle books

    return render(request, "library.html")


def rentals(request):
    return render(request, "rentals.html", {

    })
