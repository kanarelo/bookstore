from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.books, name='list_books'),
    path('list/', views.books, name='list_books'),
    path('create/', views.books, name='create_book'),
    path('<int:book_id>/', views.books, name='view_book'),
]