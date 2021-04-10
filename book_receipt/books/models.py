from django.db import models, transaction
from django.utils import timezone


class Customer(models.Model):
    name = models.CharField(max_length=50)


class Book(models.Model):
    REGULAR = "regular"
    FICTION = "fiction"
    NOVEL   = "novel"

    KINDS = (
        (REGULAR, "Regular"),
        (FICTION, "Fiction"),
        (NOVEL, "Novel"))
    
    name = models.CharField(max_length=50)
    kind = models.CharField(max_length=10, choices=KINDS)

    internal_rating = models.DecimalField(max_digits=6, decimal_places=2, null=True)

    #meta
    cover = models.ImageField(upload_to='books/covers', null=True)
    author = models.CharField(max_length=100, null=True)

    featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    def __str__(self):
        return self.title

    @property
    def rating(self):
        borrowings = self.borrowings.all()

        if borrowings.count() > 0:
            return sum(
                b.rating for b in borrowings
            ) / borrowings.count()
        
        return 0

    @property
    def rating_icons(self):
        icons = []
        rating = self.internal_rating or self.rating or 0

        for i in range(int(rating)):
            icons.append('full')

        if rating > 0 and not float(rating).is_integer():
            icons.append('half')

        return icons

    @property
    def title(self):
        return self.name

    def as_dict(self):
        return {
            'title': self.title,
            'kind': self.get_kind_display()
        }

    def get_rental_cost(self, days_borrowed):
        if days_borrowed == 0:
            return 0

        if self.kind == Book.REGULAR:
            # Regular books for the first 2 days charges 
            # will be $1 per day and $1.5 thereafter
            min_daily_charge = 1 #$1
            max_daily_charge = 1.5 #$1.5

            minimum_charge_days = 2

            if days_borrowed > minimum_charge_days:
                min_charge = (minimum_charge_days * min_daily_charge)
                max_charge = ((days_borrowed - minimum_charge_days) * max_daily_charge)

                return (min_charge + max_charge)
            else:
                return (days_borrowed * min_daily_charge)

        elif self.kind == Book.FICTION:
            # Minimum changes will b3 considered as $2 
            # if days rented is less than 2 days.

            max_daily_charge = 3.0
            min_daily_charge = 2.0

            minimum_charge_days = 2

            if days_borrowed <= minimum_charge_days:
                return min_daily_charge
            else:
                return (days_borrowed * max_daily_charge)

        elif self.kind == Book.NOVEL:
            # Novel minimum charges are introduced as $4.5 
            # if days rented is less than 3 days

            min_charge = 4.5
            daily_charge = 1.5

            minimum_charge_days = 3

            if days_borrowed <= minimum_charge_days:
                return min_charge
            else:
                return (days_borrowed * daily_charge)

        return 0


class Borrowing(models.Model):
    book = models.ForeignKey('Book', models.CASCADE, related_name="borrowings")
    customer = models.ForeignKey('Customer', models.CASCADE)

    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True)

    date_borrowed = models.DateTimeField()
    date_returned = models.DateTimeField(null=True)

    borrow_charge = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    date_paid  = models.DateTimeField(null=True)

    comments = models.CharField(max_length=150, 
        null=True, help_text="Comment on status/condition of book")

    def as_dict(self):
        return {
            'book_id': self.book.id,
            'customer_id': self.customer.id,
            'date_borrowed': self.date_borrowed.isoformat() if self.date_borrowed else None,
            'date_returned': self.date_returned.isoformat() if self.date_returned else None,
            'currency': 'USD $',
            'borrow_charge': self.borrow_charge,
            'date_paid': self.date_paid.isoformat() if self.date_paid else None,
            'comments': self.comments
        }

    @staticmethod
    def checkout_book(book, customer):
        with transaction.atomic():
            borrowing = Borrowing.objects.create(
                book=book,
                customer=customer,
                date_borrowed=timezone.now())

            return borrowing
    
    @staticmethod
    def checkin_book(book, customer, comments):
        with transaction.atomic():
            borrowing = Borrowing.objects.get(
                book=book,
                customer=customer,
                date_returned__isnull=True)
            borrowing.comments = f"{borrowing.comments or ''}\n{comments}"
            
            # calculate borrow cost
            borrowing.date_returned = timezone.now()
            days_borrowed = (borrowing.date_returned - borrowing.date_borrowed).days
            borrowing.borrow_charge = book.get_rental_cost(days_borrowed)

            # save to db
            borrowing.save()

            return borrowing

