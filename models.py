
class Customer(object):
    def __init__(self, name=""):
        self.name = name

class Book(object):
    REGULAR = "regular"
    FICTION = "fiction"
    NOVEL   = "novel"

    def __init__(self, name="", kind=REGULAR):
        self.name = name
        self.kind = kind

    @property
    def daily_charge(self):
        if self.kind == Book.REGULAR:
            return 1.5
        elif self.kind == Book.FICTION:
            return 3
        elif self.kind == Book.NOVEL:
            return 1.5

        