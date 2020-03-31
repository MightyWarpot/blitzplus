from flask import Flask, render_template
import sys
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    #users.clear()
    #messages.clear()
    #channels.clear()
    app.run(port=(sys.argv[1] if len(sys.argv) > 1 else 5000), debug=True)