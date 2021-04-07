from django.test import TestCase

from .models import Customer, Book


class BooksTestCase(TestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            name="Customer #1")

        self.regular_book = Book.objects.create(
            name="Fundamentals of Accounting",
            kind=Book.REGULAR)
        self.fiction_book = Book.objects.create(
            name="Wolf Hall",
            kind=Book.FICTION)
        self.novel_book = Book.objects.create(
            name="Lord of Flies",
            kind=Book.NOVEL)

        self.days_borrowed = 10

    def test_regular_book_total_rental_charge(self):
        charge = self.regular_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 14)

    def test_fiction_book_total_rental_charge(self):
        charge = self.fiction_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 30)
    
    def test_novel_total_rental_charge(self):
        charge = self.novel_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 15)
