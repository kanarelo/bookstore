import unittest

from models import Customer, Book
from utils import calculate_book_rental_charge


class BooksTestCase(unittest.TestCase):
    def setUp(self):
        self.customer = Customer(
            name="Customer #1")

        self.days_borrowed = 10

    def test_regular_book_total_rental_charge(self):
        self.book = Book(
            name="Fundamentals of Accounting",
            kind=Book.REGULAR)

        charge = calculate_book_rental_charge(self.book, days_borrowed=self.days_borrowed)
        self.assertEqual(charge, 14)

    def test_fiction_book_total_rental_charge(self):
        self.customer = Customer(
            name="Customer #1")
        self.book = Book(
            name="Wolf Hall",
            kind=Book.FICTION)

        charge = calculate_book_rental_charge(self.book, days_borrowed=self.days_borrowed)
        self.assertEqual(charge, 30)

    
    def test_novel_total_rental_charge(self):
        self.customer = Customer(
            name="Customer #1")
        self.book = Book(
            name="Lord of Flies",
            kind=Book.NOVEL)

        charge = calculate_book_rental_charge(self.book, days_borrowed=self.days_borrowed)
        self.assertEqual(charge, 15)

    
if __name__ == '__main__':
    unittest.main()