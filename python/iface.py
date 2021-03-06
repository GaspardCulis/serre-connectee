"""
C'et la ou tu communiques avec tous tes composants
"""

#import wiringpi
from time import sleep
#import Adafruit_DHT
import getopt
import sys
import random


# Tu peut trouver les references des pins ici :
# https://pinout.xyz/pinout/wiringpi
# Les bons numeros sont ceux avec WiringPi devant (ecrit en petit)

# wiringpi.wiringPiSetup()

# La tu modifie avec les pins que tu veut , modifie que les numeros et pas les noms !

pins_sortie = {"pompe_eau": 0, "ventilateur_sec": 2, "ventilateur_humid": 3,
               "ventilateur_temp": 4, "ventilateur_air_ext": 5, "chaud": 6, "froid": 10}

pins_entree = {"hum/temp_ext": 12, "hum/temp_int": 13, "niv_eau": 14}

DEBUG = True  # Pour avoir des resultats de test sans avoir les capteurs qui marchent

busy = False

millilitres_par_seconde = 5  # Modifie avec la valeur que tu as trouve

# A partir de la pas touche.
"""
for i in pins_sortie.items():
    wiringpi.pinMode(i[1], 1)
"""
# Inputs

# Parameres :
#   capteur : "ext" ou "int" pour exterieur ou interieur
# Retourne :
#   [humidite et temperature]


def get_humid_temp(capteur, dht=11):  # capteur : soit "int" soit "ext"
    pin_capteur = pins_entree["hum/temp_"+capteur]
    if DEBUG:
        return random.randint(0, 100), random.randint(12, 40)

    if dht == 11:
        sensor = Adafruit_DHT.DHT11
    else:
        sensor = Adafruit_DHT.DHT22
    try:
        humid = sensor.humidity
        temp = sensor.temperature
    except:
        if DEBUG:
            humid, temp = 30, 27
        else:
            humid, temp = "error", "error"
    return humid, temp

# Parametres :
#    Rien lol
# Retourne :
#    Le niveau d'eau en pourcentage (de 0 a 100)


def get_water_level():
    if DEBUG:
        return random.randint(0, 100)


# Parametres :
#   ml : nombre de millilitres a arroser
def arroser(ml):
    global busy
    if busy:
        raise Exception("Busy")
    busy = True
    print("Debut de l\'arrosage.")
    #wiringpi.digitalWrite(pins_sortie["pompe_eau"], 1)
    sleep(ml / millilitres_par_seconde)
    #wiringpi.digitalWrite(pins_sortie["pompe_eau"], 0)
    print("Fin de l\'arrosage.")
    busy = False
    return "ok"


def boucle_froid(temp_voulue):
    wiringpi.digitalWrite(pins_sortie["ventilateur_temp"], 1)
    idc, temp = get_humid_temp("int")
    while temp > temp_voulue:
        wiringpi.digitalWrite(pins_sortie["froid"], 1)
        sleep(10)
        wiringpi.digitalWrite(pins_sortie["froid"], 0)
        sleep(45)
        idc, temp = get_humid_temp("int")
    wiringpi.digitalWrite(pins_sortie["ventilateur_temp"], 0)


def boucle_chaud(temp_voulue):
    wiringpi.digitalWrite(pins_sortie["chaud"], 1)
    wiringpi.digitalWrite(pins_sortie["ventilateur_temp"], 1)
    idc, temp = get_humid_temp("int")
    while temp < temp_voulue:
        sleep(5)
        idc, temp = get_humid_temp("int")
    wiringpi.digitalWrite(pins_sortie["chaud"], 0)
    wiringpi.digitalWrite(pins_sortie["ventilateur_temp"], 0)


def thermostat(temp_voulue):  # Va aller a la temperature voulue
    if DEBUG:
        print("Thermostat execut??")
        return
    idc, temp = get_humid_temp("int")
    if temp == temp_voulue:
        return
    if temp > temp_voulue:
        boucle_froid(temp_voulue)
    else:
        boucle_chaud(temp_voulue)
