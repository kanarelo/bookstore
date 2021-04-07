from django.shortcuts import render, get_object_or_404


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

    elif request.method == "POST":
        if book_id is not None:
            pass
        else:
            pass

                    
    return render(request, template_name, context)