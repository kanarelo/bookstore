from django.db import models

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


    def get_rental_charge(self, days_borrowed):
        if self.kind == Book.REGULAR:
            # Regular books for the first 2 days charges 
            # will be $1 per day and $1.5 thereafter

            if days_borrowed > 2:
                return (2 * 1) + ((days_borrowed - 2) * 1.5)
            else:
                return (days_borrowed * 1)

        elif self.kind == Book.FICTION:
            # Minimum changes will b3 considered as $2 
            # if days rented is less than 2 days.

            daily_charge   = 3.0
            minimum_charge = 2.0

            if days_borrowed <= 2:
                return minimum_charge
            else:
                return (days_borrowed * daily_charge)

        elif self.kind == Book.NOVEL:
            # Novel minimum charges are introduced as $4.5 
            # if days rented is less than 3 days

            daily_charge   = 1.5
            minimum_charge = 4.5

            if days_borrowed <= 3:
                return minimum_charge
            else:
                return (days_borrowed * daily_charge)

        