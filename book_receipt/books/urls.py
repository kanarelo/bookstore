from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    
    path('library/', views.index, name='library'),
    path('rentals/', views.index, name='rentals'),

    # crud
    path('books/', views.books, name='list_books'),
    path('books/list/', views.books, name='list_books'),
    path('books/create/', views.books, {'create': True}, name='create_book'),
    path('books/<int:book_id>/', views.books, name='edit_book'),
    path('books/<int:book_id>/', views.books, name='view_book'),

    # process
    path('books/<int:book_id>/borrow/check_in', views.borrow_checkin, name='borrow_checkin'),
    path('books/<int:book_id>/borrow/check_in', views.borrow_checkout, name='borrow_checkout'),
]