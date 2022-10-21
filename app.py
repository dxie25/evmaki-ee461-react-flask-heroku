import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='', static_folder='ui/build/')

@app.route('/')
def index():
    return send_from_directory('ui/build/', 'index.html')

@app.route('/api/<string:projectId>/checkIn/<int:qty>', methods=['POST'])
def checkIn_hardware(projectId: str, qty: int):
    return f'{qty} hardware checked in'

@app.route('/api/<string:projectId>/checkOut/<int:qty>', methods=['POST'])
def checkOut_hardware(projectId: str, qty: int):
    return f'{qty} hardware checked out'

@app.route('/api/<string:projectId>/joinProject', methods=['POST'])
def joinProject(projectId: str):
    return f'Joined {projectId}'

@app.route('/api/<string:projectId>/leaveProject', methods=['POST'])
def leaveProject(projectId: str):
    return f'Left {projectId}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))