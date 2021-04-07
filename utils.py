from models import Book

def calculate_book_rental_charge(book, days_borrowed=0):
    if days_borrowed:
        if days_borrowed > 0:
            return days_borrowed * book.daily_charge

    return 0

