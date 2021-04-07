from models import Book

def calculate_book_rental_charge(book, days_borrowed=0):
    if days_borrowed:
        if days_borrowed > 0:
            return book.get_rental_charge(days_borrowed)

    return 0

