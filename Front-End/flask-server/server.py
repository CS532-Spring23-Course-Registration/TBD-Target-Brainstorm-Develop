from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = {"courses": ["CS 550 6654", "CS 532 6634", "CS 480 2992"]}

@app.route("/courses")
def courses():
    search_term = request.args.get("search")
    if search_term:
        search_results = [result for result in data["courses"] if search_term.lower() in result.lower()]
        return {"courses": search_results}
    else:
        return data

if __name__ =="__main__":
    app.run(debug=True)