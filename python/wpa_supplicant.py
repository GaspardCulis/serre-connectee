'''
A python library to read and modify wpa_supplicant.conf file on raspberry pi.
'''


WPA_SUP_PATH = "/etc/wpa_supplicant/wpa_supplicant.conf"


def get_networks():
    '''
    Get all networks from wpa_supplicant.conf file.
    '''
    networks = []
    with open(WPA_SUP_PATH, 'r') as f:
        in_scope = False
        current = {}
        for line in f:
            line = line.replace('\t', '')
            if line.startswith('network'):
                in_scope = True
            elif in_scope and line.startswith('}'):
                in_scope = False
                networks.append(current)
                current = {}
            elif in_scope:
                current[line.split('=')[0]] = line.split('=')[1].strip()
    return networks


def add_network(ssid, key):
    '''
    Add a network to wpa_supplicant.conf file.
    '''
    with open(WPA_SUP_PATH, 'a') as f:
        f.write('\n')
        f.write('network={\n')
        f.write('\tssid="' + ssid + '"\n')
        f.write('\tpsk="' + key + '"\n')
        f.write('}\n')


def remove_network(ssid):
    removed_something = False
    with open(WPA_SUP_PATH, 'r') as f:
        lines = f.readlines()
        skip = False
        out_lines = []
        for line in lines:
            if not skip:
                out_lines.append(line)
            if line.startswith('}'):
                skip = False
            elif line.strip().startswith('ssid'):
                print(line)
                if line.split('=')[1].strip() == f"\"{ssid}\"":
                    skip = True
                    while not out_lines[-1].startswith('network'):
                        removed_something = True
                        out_lines.pop()
                    out_lines.pop()

    with open(WPA_SUP_PATH, 'w') as f:
        for line in out_lines:
            f.write(line)

    if not removed_something:
        raise Exception("Network not found.")
