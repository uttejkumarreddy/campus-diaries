from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory, json, jsonify, Response
from sqlalchemy import create_engine #Creating a engine to load database
from sqlalchemy.orm import sessionmaker #Creating a session to access data
from database_setup import Base, User, Posts, Clubs #Importing database
from passlib.hash import sha256_crypt #For password encryption
import re #For email verification
from werkzeug.utils import secure_filename #For file uploads and storage
import gc #importing garbage collection
import os #importing operating system

# from flask.ext.images import resized_img_src #resizing images in templates

#uploading images to this folder
UPLOAD_POSTPICS = 'D:\Workspaces\cd\images\postpics'
UPLOAD_PROFILEPIC = 'D:\Workspaces\cd\images\profilepics'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

#app configuration
app = Flask(__name__, static_url_path='')
app.secret_key='super secret key'
app.config['UPLOAD_POSTPICS']    = UPLOAD_POSTPICS
app.config['UPLOAD_PROFILEPIC'] = UPLOAD_PROFILEPIC
# images = Images(app)

#Loading database
engine = create_engine('sqlite:///campusdiaries.db')
Base.metadata.bind = engine

#Initialising datasession
DBSession = sessionmaker(bind=engine)
dbsession = DBSession()

#validating filenames
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods = ['GET','POST'])
# @app.route('/sendposts/', methods = ['GET','POST'])
def mainpage():
    #getting posts
    posts = dbsession.query(Posts).filter_by(modstatus = 1).all()
    #reversing posts order
    posts = reversed(posts)
    #sending posts
    return render_template('index.html', posts = posts)

#sending image called for
@app.route('/uploads/<filename>')
def send_image(filename):
    return send_from_directory(app.config['UPLOAD_POSTPICS'],
                               filename)

#Registration page rendering
#New users Registration
@app.route('/register/', methods = ['GET', 'POST'])
def registrationPage():

    if request.method == 'GET':
        return render_template('signup.html')

    if request.method == 'POST':
        #Taking in values from the form
        rollnumber = request.form['rollno']
        uname      = request.form['username']
        email      = request.form['email']
        password   = request.form['psw']
        reenterpsw = request.form['confirm']
        dateofbirth= request.form['dob']

        #verifying email syntax
        addressToVerify = request.form['email']
        match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', addressToVerify)
        if match == None:
    	       return ("Email syntax entered wrong")

        #verifying if the password is entered correctly
        if password != reenterpsw:
            return ("Passwords do not match")

        #verifying unique roll number entry
        checkinguser = User()
        checkinguser = dbsession.query(User).filter_by(rollnumber=rollnumber).first()
        if  checkinguser != None:
            return ("A student with that roll number already exists")

        #All test conditions passed
        #Creating new User object to push into database
        newuser = User(
                    rollnumber = rollnumber,
                    uname      = uname,
                    email      = email,
                    password   = sha256_crypt.encrypt((str(password))),
                    dob        = dateofbirth
                    )

        #Comitting data to the database
        dbsession.add(newuser)
        dbsession.commit()

        #Rendering the main index page
        return render_template('index.html')

#validating user credentials
@app.route('/login/', methods = ['GET','POST'])
def login():

    #passing if get method is got
    if request.method == 'GET':

        return "invalid login"

    #validating entered user credentials
    if request.method == 'POST':
        #retrieving values
        data = request.data.decode("utf-8")
        res  = json.loads(data)
        rollnumber = str(res["rollnumber"])
        password = str(res["password"])
        #getting the user from database
        logginginuser = dbsession.query(User).filter_by(rollnumber = rollnumber).first()
        #checking Passwords
        if logginginuser == None:

            return "error"
        #Logged in
        if sha256_crypt.verify(password, logginginuser.password):
            session['logged_in'] = True
            session['user_id']   = rollnumber
            session['user_name'] = logginginuser.uname
            session['rank']      = logginginuser.rank
            request.redirect = url_for('mainpage')
            return "login"
        else:

            return "error"

#Logging out
@app.route('/logout/')
def logout():
    session.pop('logged_in', None)
    session.clear()
    flash('You have successfully logged out')
    gc.collect()
    return redirect(url_for('mainpage'))

#Creating a new post
@app.route('/newpost/', methods = ['GET','POST'])
def newpost():
    #returning new post html page
    if request.method == 'GET':
        return render_template('newpost.html')

    #taking in new post data
    if request.method == 'POST':
        title     = request.form['title']
        startdate = request.form['startdate']
        enddate   = request.form['enddate']
        shortdesc = request.form['shortdes']
        longdesc  = request.form['longdes']
        contact   = request.form['contact']
        club      = request.form['club']

    #initialising postpic
        postpic = "D:\Workspaces\Campus Diaries\static\images\noimage.png"

    #taking image
        if 'file' not in request.files:
            pass
        else:
            file = request.files['file']
            if file.filename=='':
                pass
            else:
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(app.config['UPLOAD_POSTPICS'], filename))
                    postpic = filename
    # return redirect(url_for('send_image', filename = filename))
    #validations
    postinguser = dbsession.query(User).filter_by(rollnumber = session['user_id']).first()
    if postinguser == None:
        return "You must be logged in to post"

    #creating new post
    newpost = Posts(
                postedby = int(session['user_id']),
                club     = club,
                title    = title,
                shortdesc= shortdesc,
                longdesc = longdesc,
                startdate= startdate,
                enddate  = enddate,
                postpic  = postpic,
                contact  = contact
            )

    #adding post to database
    dbsession.add(newpost)
    dbsession.commit()

    return redirect(url_for('mainpage'))

#make moderator page
@app.route('/makemoderator/', methods = ['GET'])
def makemoderator():
    if request.method == 'GET':
        allusers = dbsession.query(User).filter_by(rank = 0).all()
        #shiva
        allusers = reversed(allusers)
        return render_template('makemoderator.html', users = allusers)

#Making a student moderator
@app.route('/ismoderated/', methods = ['GET','POST'])
def ismoderated():
    if request.method == 'POST':
        #getting rollnumber through jquery
        data = request.data.decode("utf-8")
        try:
            newmoderator = dbsession.query(User).filter_by(rollnumber = int(data)).first()

            if newmoderator == None:
                return

            newmoderator.rank = 1
            dbsession.commit()
            return
        #failure
        except Exception as e:
            return (str(e))
    else:
        # return render_template('moderate')
        return "done"

#moderator page
@app.route('/moderate/', methods = ['GET', 'POST'])
def moderate():
    if request.method == 'GET':
        allposts = dbsession.query(Posts).filter_by(modstatus = 0).all()
        #shiva
        allposts = reversed(allposts)
        return render_template('moderate.html', posts = allposts)

#Checking if post is approved or disapproved
@app.route('/isapproved/', methods = ['GET','POST'])
def isapproved():
    if request.method == 'POST':
        #getting data through jquery
        data = request.data.decode("utf-8")
        status,postid = data.split(".")
        try:
            #finding post in database
            updatemodstatus = dbsession.query(Posts).filter_by(postid = postid).first()

            #if the post number is not found in db
            if updatemodstatus == None:
                # return render_template('moderate')
                return "done"
            #checking status: if approved
            if str(status) == '1':
                updatemodstatus.modstatus   = 1
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
            #checking status: if disapproved
            if str(status) == '-1':
                updatemodstatus.modstatus   = -1
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
        #failure
        except Exception as e:
            return (str(e))
    else:
        # return render_template('moderate')
        return "done"

#added by shiva
@app.route('/tools/')
def tools():
        return redirect(url_for('pending_posts_web'))


@app.route('/pending_posts_web/')
def pending_posts_web():
    posts = dbsession.query(Posts).filter_by(modstatus = 0).all()
    #reversing posts order
    posts = reversed(posts)
    #sending posts
    return render_template('pending_posts_web.html', posts = posts)

@app.route('/rejected_posts_web/')
def rejected_posts_web():
    posts = dbsession.query(Posts).filter_by(modstatus = -1).all()
    #reversing posts order
    posts = reversed(posts)
    #sending posts
    return render_template('rejected_posts_web.html', posts = posts)

@app.route('/approved_posts_web/')
def approved_posts_web():
    posts = dbsession.query(Posts).filter_by(modstatus = 1).all()
    #reversing posts order
    posts = reversed(posts)
    #sending posts
    return render_template('approved_posts_web.html', posts = posts)

@app.route('/all_users_web/')
def all_users_web():
    allusers = dbsession.query(User).filter_by(rank = 0).all()
    allusers = reversed(allusers)
    return render_template('all_users_web.html', allusers = allusers)

@app.route('/moderators_web/')
def moderators_web():
    moderators = dbsession.query(User).filter_by(rank = 1).all()
    moderators = reversed(moderators)
    return render_template('moderators_web.html', moderators = moderators)

@app.route('/admins_web/')
def admins_web():
    admins = dbsession.query(User).filter_by(rank = 2).all()
    admins = reversed(admins)
    return render_template('admins_web.html', admins = admins)




@app.route('/changed_post_status_web/', methods = ['GET','POST'])
def change_post_status_web():
    if request.method == 'POST':
        #getting data through jquery
        data = request.data.decode("utf-8")
        status,postid = data.split(".")
        try:
            #finding post in database
            updatemodstatus = dbsession.query(Posts).filter_by(postid = postid).first()

            #if the post number is not found in db
            if updatemodstatus == None:
                # return render_template('moderate')
                return "done"
            #checking status: if approved
            if str(status) == '1':
                updatemodstatus.modstatus   = 1
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
            if str(status) == '0':
                updatemodstatus.modstatus   = 0
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
            #checking status: if disapproved
            if str(status) == '-1':
                updatemodstatus.modstatus   = -1
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
            if str(status) == '-2':
                updatemodstatus.modstatus   = -2
                updatemodstatus.moderatedby = session['user_id']
                dbsession.commit()
                # return render_template('moderate')
                return "done"
        #failure
        except Exception as e:
            return (str(e))
    else:
        # return render_template('moderate')
        return "done"

@app.route('/change_user_rank/' , methods = ['GET','POST'])
def change_user_rank():
    if request.method == 'POST':
        #getting data through jquery
        data = request.data.decode("utf-8")
        rank,rollnumber = data.split(".")
        try:
            #the try block
            #finding user in database
            updaterank = dbsession.query(User).filter_by(rollnumber = rollnumber).first()
            if str(rank) == '0':
                updaterank.rank = 0
                dbsession.commit()
                return "done"
            if str(rank) == '1':
                updaterank.rank = 1
                dbsession.commit()
                return "done"
            if str(rank) == '2':
                updaterank.rank = 2
                dbsession.commit()
                return "done"

        #failure
        except Exception as e:
            return (str(e))
    else:
        return "done"


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)
