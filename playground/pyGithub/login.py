import github 
import os
from flask import Flask, redirect, url_for, session, request
from flask_oauth import OAuth
from flask.json import jsonify


#SECRET_KEY = os.environ.get("AGITHUB_FSKEY", "")

GITHUB_APP_KEY = '754c9740c776a9321668'
GITHUB_APP_SECRET = os.environ.get("AGITHUB_SKEY", "")

app = Flask(__name__)
#app.debug = DEBUG
#app.secret_key = SECRET_KEY
oauth = OAuth()

github = oauth.remote_app(
    'github',
    base_url='https://github.com/',
    authorize_url='https://github.com/login/oauth/',
    request_token_url=None,
    access_token_url= 'https://github.com/login/oauth/access_token',#'/oauth/access_token',
    consumer_key=GITHUB_APP_KEY,
    consumer_secret=GITHUB_APP_SECRET
    #,
    #request_token_params={'scope': 'email'}
)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    return github.authorize(
        callback=url_for(
            'github_auth',
            next=request.args.get('next') or request.refferrer or None,
            _external=True
        )
    )

@app.route('/auth')
def github_auth(resp):
    if resp is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')
    return redirect(url_for('profile'))

@app.route("/profile", methods=["GET"])
def profile():
    gh = github.Github(token)
    repos = ''
    for repo in gh.get_user().get_repos():
        repos += repo

    return jsonify(repos)


if __name__ == "__main__":
    # This allows us to use a plain HTTP callback
    os.environ['DEBUG'] = "1"

    app.secret_key = os.urandom(24)
    app.run(debug=True)
