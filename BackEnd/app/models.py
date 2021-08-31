from . import db

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    positions = db.Column(db.String(100))
    nextSteps = db.Column(db.String(20))