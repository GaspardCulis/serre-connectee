import iface
import flask
from flask import request, jsonify

PORT = 6900

app = flask.Flask(__name__)
#app.config["DEBUG"] = True


@app.route('/serre', methods=['GET'])
def home():
    return '''<h1>API pour iface.py</h1>
<p>Pour interagir avec la serre connectée</p>
<h2>Endpoints :</h2>
<ul>
<li>/temp_hum   [GET]</li>
<li>/niveau_eau [GET</li>
<li>/arroser    [POST</li>
</ul>'''


@app.route('/serre/humid_temp', methods=['GET'])
def api_temp_hum():
    if not 'cpt' in request.args:
        return "Error: Pas de capteur fourni.\nExemple : /serre/humid_temp?cpt=ext", 400
    cpt = request.args['cpt']
    if cpt not in ['ext', 'int']:
        return "Error: Capteur inconnu. Ce doit être ext ou int.\nExemple : /serre/humid_temp?cpt=ext", 400
    return jsonify(iface.get_humid_temp(cpt))


@app.route('/serre/niveau_eau', methods=['GET'])
def api_niveau_eau():
    return jsonify(iface.get_water_level())


@app.route('/serre/arroser', methods=['POST'])
def api_arroser():
    ml = request.json['ml']
    if not ml:
        return "Error: Pas de volume fourni.", 400
    try:
        ml = float(ml)
    except ValueError:
        return "Error: Volume incorrect, c pas un nombre ça mon reuf", 400
    if ml < 0:
        return "Error: Volume incorrect, c négatif mon reuf WTF.", 400
    iface.arroser(ml)
    return "OK", 200


app.run()
