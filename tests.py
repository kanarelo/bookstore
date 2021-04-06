import unittest

from models import Customer, Book
from utils import calculate_book_rental_charge


class BooksTestCase(unittest.TestCase):
    def setUp(self):
        self.customer = Customer(
            name="Customer #1")
        self.book = Book(
            name="Fundamentals of Accounting",
            kind="regular")

        self.days_borrowed = 10

    def test_per_day_rental_charge_is_a_dollar(self):
        charge = calculate_book_rental_charge(self.book, days_borrowed=self.days_borrowed)

        self.assertEquals(charge, 10)

    
if __name__ == '__main__':
    unittest.main()