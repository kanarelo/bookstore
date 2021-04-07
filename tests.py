import unittest

from models import Customer, Book
from utils import calculate_book_rental_charge


class BooksTestCase(unittest.TestCase):
    def test_regular_book_total_rental_charge(self):
        self.customer = Customer(
            name="Customer #1")
        self.book = Book(
            name="Fundamentals of Accounting",
            kind=Book.REGULAR)

        self.days_borrowed = 10

        charge = calculate_book_rental_charge(self.book, days_borrowed=self.days_borrowed)

        self.assertEqual(charge, 15)

    
if __name__ == '__main__':
    unittest.main()