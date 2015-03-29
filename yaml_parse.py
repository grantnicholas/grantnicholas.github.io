from pprint import pprint
import yaml

"""
Shield your eyes from the hack that is using eval to convert the yaml strings to 
a python dictionary and then converting the python dictionary to json.
"""


def _eval(val):
    exceptions = {'true': True, 'false': False}
    if val in exceptions:
        return exceptions[val]
    else:
        try:
            eval(val)
        except NameError:
            return eval(val)
        else:
            return eval(val)


def _parse_yaml(astr):
    cleaned_str = astr.strip().split("\n")
    toml_dict = dict([expr.split(':') for expr in cleaned_str])
    pprint(toml_dict)
    py_dict = {k.strip(): _eval(v.strip()) for k, v in toml_dict.iteritems()}
    return py_dict


def parse_yaml(astr):
    return yaml.load(astr)


def main():
    test_toml = """
    key  : 0
    key1 : str1
    key2 : str2
    alist  : [hi]
    alist2 : [1]
    alist3 : [0, hi, 1]
    """
    pprint(parse_yaml(test_toml))


if __name__ == '__main__':
    main()
