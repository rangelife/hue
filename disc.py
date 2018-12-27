import discoverhue
found = discoverhue.find_bridges()
for bridge in found:
    print('    Bridge ID {br} at {ip}'.format(br=bridge, ip=found[bridge]))

