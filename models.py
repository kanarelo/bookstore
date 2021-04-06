
class Customer(object):
    def __init__(self, name=""):
        self.name = name

class Book(object):
    def __init__(self, name="", kind="regular", daily_charge=1):
        self.name = name
        self.kind = kind

        self.daily_charge = daily_charge