import github
import os
from flask import Flask, redirect, url_for, session, request, render_template
from flask_oauth import OAuth
from flask.json import jsonify


SECRET_KEY = os.environ.get("API_KEY", "")

GITHUB_APP_KEY = '754c9740c776a9321668'
GITHUB_APP_SECRET = os.environ.get("GITHUB_SECRET", "")

app = Flask(__name__)
#app.debug = DEBUG
app.secret_key = SECRET_KEY
oauth = OAuth()

github = oauth.remote_app(
    'github',
    base_url='https://github.com/login/oauth/',#'https://github.com/',
    authorize_url='https://github.com/login/oauth/authorize',#
    request_token_url=None,
    access_token_url= 'https://github.com/login/oauth/access_token',#'/oauth/access_token',
    consumer_key=GITHUB_APP_KEY,
    consumer_secret=GITHUB_APP_SECRET
    #,
    #request_token_params={'scope': 'email'}
)

@app.route('/')
def index():
    print('1')
    return render_template("index.html")
    #return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    print('2')
    return github.authorize(
        callback=url_for(
            'github_auth',
            next=request.args.get('next') or request.referrer or None,
            _external=True
        )
    )

@app.route('/auth')
def github_auth(resp):
    print('3')
    if resp is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')
    return redirect(url_for('profile'))

@app.route("/profile", methods=["GET"])
def profile():
    print('4')
    gh = github.Github(token)
    repos = ''
    for repo in gh.get_user().get_repos():
        repos += repo

    return jsonify(repos)


if __name__ == "__main__":
    # This allows us to use a plain HTTP callback
    os.environ['DEBUG'] = "1"
    print('0')
    app.secret_key = os.urandom(24)
    app.run(debug=True)
