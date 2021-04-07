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
        if days_borrowed == 0:
            return 0

        if self.kind == Book.REGULAR:
            # Regular books for the first 2 days charges 
            # will be $1 per day and $1.5 thereafter
            min_daily_charge = 1
            max_daily_charge = 1.5

            if days_borrowed > 2:
                min_charge = (2 * min_daily_charge)
                max_charge = ((days_borrowed - 2) * max_daily_charge)

                return (min_charge + max_charge)
            else:
                return (days_borrowed * min_daily_charge)

        elif self.kind == Book.FICTION:
            # Minimum changes will b3 considered as $2 
            # if days rented is less than 2 days.

            max_daily_charge   = 3.0
            min_daily_charge = 2.0

            if days_borrowed <= 2:
                return min_daily_charge
            else:
                return (days_borrowed * max_daily_charge)

        elif self.kind == Book.NOVEL:
            # Novel minimum charges are introduced as $4.5 
            # if days rented is less than 3 days

            max_daily_charge   = 1.5
            min_daily_charge = 4.5

            if days_borrowed <= 3:
                return min_daily_charge
            else:
                return (days_borrowed * max_daily_charge)

        