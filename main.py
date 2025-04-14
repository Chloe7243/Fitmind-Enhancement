from flask import Flask, render_template, redirect, flash, get_flashed_messages, url_for, request
from model import *
from flask_migrate import Migrate
from flask_wtf import *
from flask_mail import *
from itsdangerous import URLSafeTimedSerializer
import base64
import secrets
from functools import wraps
from sqlalchemy import update
from datetime import datetime, timedelta, timezone
from password_strength import PasswordPolicy


app = Flask(__name__)

app.secret_key = secrets.token_hex(16)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///HealthAdviceGroupDatabase.db"
app.config["SECURITY_PASSWORD_SALT"] = secrets.token_hex(16)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["DEFAULT_SENDER"] = "contact.us.cbbb@gmail.com"
app.config["MAIL_USERNAME"] = "contact.us.cbbb@gmail.com"
app.config["MAIL_PASSWORD"] = "ibclqtbpldsaduam"
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config['RECAPTCHA_PUBLIC_KEY'] = '6LdwgXQkAAAAAME9GrFMARDO_qEXUGMt2wOqIEyL'
app.config['RECAPTCHA_PRIVATE_KEY'] = '6LdwgXQkAAAAAGXaBHLxm2-tT6nprMzNZ5bCfVyQ'

mail = Mail(app)
mail.init_app(app)
db.init_app(app)
migrate = Migrate(app, db)
login.login_view = "login"
login.init_app(app)

# initialises all configured settings #

tokenprotection = CSRFProtect(app)

class SignupForm(FlaskForm):
    recaptcha = RecaptchaField()



def database_reset():
    with app.app_context():
        db.drop_all()
        db.create_all()
        data = UserAccounts.query.all()
        for i in data:
            print(i.username)
            print(i.password_hash)


#database_reset()


@app.route("/")
def base():
    return render_template("index.html")

@app.route("/setting")
def setting():
    return render_template("setting.html")

@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        if current_user.is_authenticated:
            # redirects if user logged in #
            return redirect(url_for('index'))
        return render_template("login.html")
    if request.method == "POST":
        with app.app_context():
            try:
                email = request.form["email"]
                user_data = UserAccounts.query.filter_by(email=email).first()
                # checks database if username exists or not,
                # then checks password against stored hash and logs the user in if both checks are passed #
                if user_data is None or not user_data.check_password(user_password=request.form["password"]):
                    flash("Invalid credentials!")
                    return render_template('login.html')
                login_user(user_data)
                return redirect(url_for('base'))
            except Exception as e:
                flash("An unexpected error occurred when adding your account to our system")
                flash(f'{e}')
                return render_template('login.html')


policy = PasswordPolicy.from_names(
    length=8,  # min length: 8
    uppercase=1,  # need min. 1 uppercase letters
    nonletters=2,  # need min. 2 non-letter characters (digits, specials, anything)
)

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == "GET":
        form = SignupForm()
        if current_user.is_authenticated:
            # redirects if user logged in #
            return redirect("index.html")
        return render_template("register.html", form=form)
    if request.method == "POST":
        if current_user.is_authenticated:
            # redirects if user logged in #
            return redirect("index.html")
        with app.app_context():
            try:
                # requests all data from register form #
                username = request.form["username"]
                email = request.form["email"]
                user_password = request.form["password"]
                confirm_password = request.form["confirm_password"]
                username_presence_check = UserAccounts.query.filter_by(username=username).first()
                email_presence_check = UserAccounts.query.filter_by(username=email).first()
                if username_presence_check is not None or email_presence_check is not None:
                    flash("email or username is already in use")
                    return render_template('register.html')
                # checks no other accounts with same details exist #
                # set of if checks to verify password security #
                password_check = policy.test(user_password)
                if len(password_check) != 0:
                    flash(
                        "passwords must be at least 8 characters, and contain 1 uppercase letter with 2 "
                        "non-alphabetic characters")
                    return render_template('register.html')
                if user_password != confirm_password:
                    flash("Both passwords do not match")
                    return render_template('register.html')
                # adds user to db, but with confirmed and staff set to false #
                user = UserAccounts(username=username, email=email)
                user.set_password(user_password)
                db.session.add(user)
                db.session.commit()
                login_user(user)
                return redirect(url_for('base'))
            except Exception as e:
                flash("An unexpected error occurred when adding your account to our system")
                flash(f'{e}')
                return render_template('register.html')





@app.route("/stress", methods=['GET', 'POST'])
@login_required
def stress():
    if request.method == "GET":
        with app.app_context():
            user_logs = Logs.query.filter_by(made_by=current_user.id)
            stress_logs = [log.to_dict() for log in user_logs]
            return render_template('stress.html', logs=stress_logs)
    if request.method == "POST":
        print("posting!")
        with app.app_context():
            try:
                stress_level = request.form["stress-level"]
                cause = request.form["stress-cause"]
                notes = request.form["additional-notes"]
                log = Logs(made_by=current_user.id, rating=stress_level, cause=cause, user_description=notes)
                db.session.add(log)
                db.session.commit()
                user_logs = Logs.query.filter_by(made_by=current_user.id)
                stress_logs = [log.to_dict() for log in user_logs]
                return render_template('stress.html', logs=stress_logs)
            except Exception as e:
                print(e)
                with app.app_context():
                    user_logs = Logs.query.filter_by(made_by=current_user.id)
                    stress_logs = [log.to_dict() for log in user_logs]
                    return render_template('stress.html', logs=stress_logs)


@app.route('/stress/<id>', methods=['GET'])
@login_required
def delete_note(id):
    if request.method == "GET":
        with app.app_context():
            stress_log = Logs.query.filter_by(log_id=id, made_by=current_user.id).first()
            if stress_log:
                db.session.delete(stress_log)
                db.session.commit()
                user_logs = Logs.query.filter_by(made_by=current_user.id)
                stress_logs = [log.to_dict() for log in user_logs]
                return render_template('stress.html', logs=stress_logs)
            else:
                flash("There was an error removing your log")



@app.route("/exercise", methods=['GET', 'POST'])
@login_required
def exercise():
    if request.method == "GET":
        with app.app_context():
            user_exercise = Exercise.query.filter_by(made_by=current_user.id)
            exercises_data = [exercise.to_dict() for exercise in user_exercise]
            return render_template('exercise.html', exercise=exercises_data)
    if request.method == "POST":
        with app.app_context():
            try:
                exercise = request.form["Exercise"]
                duration = request.form["duration"]
                if exercise == "Custom":
                    exercise = request.form["custom-exercise"]
                print(exercise)
                log = Exercise(made_by=current_user.id, type=exercise, duration=duration)
                db.session.add(log)
                db.session.commit()
                user_exercise = Exercise.query.filter_by(made_by=current_user.id)
                exercises_data = [exercise.to_dict() for exercise in user_exercise]
                db.session.commit()
                return render_template('exercise.html', exercise=exercises_data)
            except Exception as e:
                print(e)
                return render_template('exercise.html')


@app.route('/exercise/<id>', methods=['GET'])
@login_required
def delete_exercise(id):
    if request.method == "GET":
        with app.app_context():
            exercise = Exercise.query.filter_by(log_id=id, made_by=current_user.id).first()
            if exercise:
                db.session.delete(exercise)
                db.session.commit()
                user_exercise = Exercise.query.filter_by(made_by=current_user.id)
                exercises_data = [exercise.to_dict() for exercise in user_exercise]
                return render_template('exercise.html', exercise=exercises_data)
            else:
                flash("There was an error removing your exercise")



@app.route("/notes", methods=['GET', 'POST'])
@login_required
def notes():
    if request.method == "GET":
        with app.app_context():
            user_notes = Exercise.query.filter_by(made_by=current_user.id)
            return render_template('notes.html', exercise=user_notes)
    if request.method == "POST":
        with app.app_context():
            try:
                note_title = request.form["title"]
                note_description = request.form["description"]
                note = Notes(made_by=current_user.id, title=note_title, user_description=note_description)
                db.session.add(note)
                db.session.commit()
                user_notes = Notes.query.filter_by(made_by=current_user.id)
                db.session.commit()
                return render_template('notes.html', exercise=user_notes)
            except Exception as e:
                print(e)
                return render_template('notes.html')



@app.route("/community", methods=['GET', 'POST'])
@login_required
def community():
    if request.method == "GET":
        return render_template("community.html")

@app.route("/notification", methods=['GET', 'POST'])
def notification():
    if request.method == "GET":
        return render_template("notification.html")


@app.route("/profile", methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == "GET":
      return render_template("profile.html")
    if request.method == "POST":
       with app.app_context():
         try:
           uploaded_picture = request.files["uploaded_image"]
           encoded_image = base64.b64encode(uploaded_picture.read())
           string_for_database = encoded_image.decode('utf-8')
           update_query = (update(UserAccounts).where(UserAccounts.id == current_user.id).values(profile_image=string_for_database))
           db.session.execute(update_query)
           db.session.commit()
           return 'uploaded'
         except:
             flash("there was an error when attempting to upload your picture")
             return redirect(url_for('base'))

if __name__ == '__main__':
    app.run(debug=True)

