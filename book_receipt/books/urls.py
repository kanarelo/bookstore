from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.books, name='list_books'),
    path('list/', views.books, name='list_books'),
    path('create/', views.books, {'create': True}, name='create_book'),
    path('<int:book_id>/', views.books, name='edit_book'),
    path('<int:book_id>/', views.books, name='view_book'),

    path('<int:book_id>/borrow/check_in', views.borrow_checkin, name='borrow_checkin'),
    path('<int:book_id>/borrow/check_in', views.borrow_checkout, name='borrow_checkout'),
]