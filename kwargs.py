import glob
from pprint import pprint
import json
from yaml import load as parse_yaml


STOPWORDS = [
    'a', 'cannot', 'into', 'our', 'thus', 'about', 'co', 'i', 'is', 'ours', 'to', 'above',
    'could', 'it', 'ourselves', 'together', 'across', 'down', 'its', 'out', 'too',
    'after', 'during', 'itself', 'over', 'toward', 'afterwards', 'each', 'last', 'own',
    'towards', 'again', 'eg', 'latter', 'per', 'under', 'against', 'either', 'latterly',
    'perhaps', 'until', 'all', 'else', 'least', 'rather', 'up', 'almost', 'elsewhere',
    'less', 'same', 'upon', 'alone', 'enough', 'ltd', 'seem', 'us', 'along', 'etc',
    'many', 'seemed', 'very', 'already', 'even', 'may', 'seeming', 'via', 'also', 'ever',
    'me', 'seems', 'was', 'although', 'every', 'meanwhile', 'several', 'we', 'always',
    'everyone', 'might', 'she', 'well', 'among', 'everything', 'more', 'should', 'were',
    'amongst', 'everywhere', 'moreover', 'since', 'what', 'an', 'except', 'most', 'so',
    'whatever', 'and', 'few', 'mostly', 'some', 'when', 'another', 'first', 'much',
    'somehow', 'whence', 'any', 'for', 'must', 'someone', 'whenever', 'anyhow',
    'former', 'my', 'something', 'where', 'anyone', 'formerly', 'myself', 'sometime',
    'whereafter', 'anything', 'from', 'namely', 'sometimes', 'whereas', 'anywhere',
    'further', 'neither', 'somewhere', 'whereby', 'are', 'had', 'never', 'still',
    'wherein', 'around', 'has', 'nevertheless', 'such', 'whereupon', 'as', 'have',
    'next', 'than', 'wherever', 'at', 'he', 'no', 'that', 'whether', 'be', 'hence',
    'nobody', 'the', 'whither', 'became', 'her', 'none', 'their', 'which', 'because',
    'here', 'noone', 'them', 'while', 'become', 'hereafter', 'nor', 'themselves', 'who',
    'becomes', 'hereby', 'not', 'then', 'whoever', 'becoming', 'herein', 'nothing',
    'thence', 'whole', 'been', 'hereupon', 'now', 'there', 'whom', 'before', 'hers',
    'nowhere', 'thereafter', 'whose', 'beforehand', 'herself', 'of', 'thereby', 'why',
    'behind', 'him', 'off', 'therefore', 'will', 'being', 'himself', 'often', 'therein',
    'with', 'below', 'his', 'on', 'thereupon', 'within', 'beside', 'how', 'once',
    'these', 'without', 'besides', 'however', 'one', 'they', 'would', 'between', 'i',
    'only', 'this', 'yet', 'beyond', 'ie', 'onto', 'those', 'you', 'both', 'if', 'or',
    'though', 'your', 'but', 'in', 'other', 'through', 'yours', 'by', 'inc', 'others',
    'throughout', 'yourself', 'can', 'indeed', 'otherwise', 'thru', 'yourselves', '\n', '\t'
]


def get_dict_topn(adict, n):
    return [(k,adict[k]) for count,k in enumerate(sorted(adict, key=lambda x: adict[x])[::-1]) if count<n]


def get_meta(filestring):
    empty, meta, post = filestring.split('---')
    meta_dict = parse_yaml(meta)
    return meta_dict


def get_post_words(filestring):
    empty, meta, post = filestring.split('---')

    """
    Remove code blocks which are wrapped in ``` from our post words dictionary. 
    Code blocks turn our relevant post words into useless syntax and nonsense.
    """

    nocodepost = reduce(lambda x,y: x+' '+y,
                        map(lambda x: x[1],
                            filter(lambda x: x[0] % 2 == 0,
                                   enumerate(post.split('```')))))

    print nocodepost
    words = nocodepost.split(' ')  #post
    filtered_words = filter(lambda x: x.strip().lower() not in STOPWORDS, words)
    word_dict = {}
    for word in filtered_words:
        new_word = word.strip().lower()
        if new_word in word_dict:
            word_dict[new_word] += 1
        else:
            word_dict[new_word] = 1
    pprint(word_dict)
    return word_dict


def each_file(files, filename, f, posts=True):
    data = f.read()
    meta_data = get_meta(data)
    topn = get_dict_topn(get_post_words(data), 10)
    filt_topn = filter(lambda x: x[1]>1, topn)
    _keywords = dict(filt_topn)

    if "tags" in meta_data:
        keywords = map(lambda x: x, _keywords).extend([meta_data["tags"]])
        meta_data.pop("tags")
    else:
        keywords = map(lambda x: x, _keywords)

    mod_filename = filename.split('/')[-1].split('.md')[0]
    if posts:
        args = filename.replace('.md', '')
        args = args.lstrip('_posts/.').split('-')
        thedate = args[0:3]
        thepost = args[3:]
        theurl = '/'.join(thedate) + '/' + '-'.join(thepost)
        theurl = '/' + theurl + '.html'
    else:
        theurl = '/' + filename.strip('.md').strip('/') + '/'

    keywords = keywords+['post'] if keywords is not None else ['post']
    keywords = filter(lambda x: x != '' and x != ' ', keywords)
    titlewords = map(lambda x: x.lower(), meta_data['title'].split(' '))
    keywords = keywords + titlewords
    meta_data["filename"] = mod_filename.lower()
    meta_data["url"] = theurl
    meta_data["keywords"] = keywords
    if 'date' in meta_data:
        meta_data.pop('date')
    files.append(meta_data)
    pprint(meta_data)
    return None


def main():
    files = []
    for filename in glob.glob('./_posts/./*.md'):
        with open(filename, 'r') as f:
            each_file(files, filename, f)

    otherfiles = ['./about.md']
    for filename in otherfiles:
        with open(filename, 'r') as f:
            each_file(files, filename, f, False)

    # pprint(files)
    with open('./assets/js/searchdata.js', 'w') as f:
        f.write('blog_data= ')
        f.write(json.dumps(files, sort_keys=True, indent=4, separators=(',',': ')))


if __name__ == '__main__':
    main()
