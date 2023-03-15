from sqlalchemy import create_engine #Creating a engine to load database
from sqlalchemy.orm import sessionmaker #Creating a session to access data
from database_setup import Base, User, Posts, Clubs #Importing database

#Loading database
engine = create_engine('sqlite:///campusdiaries.db')
Base.metadata.bind = engine

#Initialising session
DBSession = sessionmaker(bind=engine)
session = DBSession()

currentuser = session.query(User).filter_by(uname = 'sudhakara36543').one()
currentuser.rank = 0
session.commit()

