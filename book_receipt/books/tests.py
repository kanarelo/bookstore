from django.test import TestCase
from django.urls import reverse

from .models import Customer, Book



class RentalStoreWebAppTestCase(TestCase):
    def test_list_views_returns_list_and_200_ok_when_empty(self):
        response = self.client.get(reverse('list_books'))
        
        self.assertEqual(response.status_code, 200)
        self.assertQuerysetEqual(response.context['books'], [])
        self.assertTemplateUsed(response, 'book_list.html')

    def test_list_views_returns_list_and_200_ok_when_populated(self):
        book1 = Book.objects.create(name="Fundamentals of Accounting", kind=Book.REGULAR)
        book2 = Book.objects.create(name="Wolf Hall", kind=Book.FICTION)
        book3 = Book.objects.create(name="Lord of Flies", kind=Book.NOVEL)

        response = self.client.get(reverse('list_books'))
        self.assertEqual(response.status_code, 200)
        self.assertQuerysetEqual(list(response.context['books']), [book1, book2, book3])
        self.assertTemplateUsed(response, 'book_list.html')

    def test_list_views_returns_book_and_200_ok_when_populated(self):
        book = Book.objects.create(name="Fundamentals of Accounting", kind=Book.REGULAR)
        
        response = self.client.get(reverse('view_book', kwargs={'book_id': book.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['book'], book)
        self.assertTemplateUsed(response, 'book_view.html')

    def test_post_book_redirects_when_populated(self):
        response = self.client.post(reverse('create_book'), {
            'name': 'Fundamentals of Accounting',
            'kind': Book.REGULAR
        })
        
        book = Book.objects.get()

        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('view_book', kwargs={'book_id': book.pk}))


class RentalStoreTestCase(TestCase):
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

    def test_regular_book_total_rental_cost(self):
        charge = self.regular_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 14)

    def test_fiction_book_total_rental_cost(self):
        charge = self.fiction_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 30)
    
    def test_novel_total_rental_cost(self):
        charge = self.novel_book.get_rental_cost(self.days_borrowed)

        self.assertEqual(charge, 15)
