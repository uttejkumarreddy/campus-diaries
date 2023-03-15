from sqlalchemy import create_engine #Creating a engine to load database
from sqlalchemy.orm import sessionmaker #Creating a session to access data
from database_setup import Base, User, Posts, Clubs #Importing database

#Loading database
engine = create_engine('sqlite:///campusdiaries.db')
Base.metadata.bind = engine

#Initialising session
DBSession = sessionmaker(bind=engine)
session = DBSession()

users = session.query(User).all()
posts = session.query(Posts).all()

for i in users:
    print (i.uname)
    print (i.rank)
    print (i.rollnumber)
    
#for j in posts:
   # print (j.postid)
  #  print (j.modstatus)
 #   print(j.shortdesc)
#    print (j.postpic)
