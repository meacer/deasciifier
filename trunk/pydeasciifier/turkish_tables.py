# -*- coding: utf-8 -*-

#import logging
from decision_lists import *

TURKISH_I_DOT = u'\u0130' #'İ'
TURKISH_i_DOTLESS =  u'\u0131'  #'ı'

START_CHAR = u'a'
END_CHAR = u'z'

turkish_char_alist = {
  u'c':u'\u00e7',  #u'ç',
  u'C':u'\u00c7',  #u'Ç',
  
  u'g':u'\u011f',  #u'ğ',
  u'G':u'\u011e',  #u'Ğ',
  
  u'i':u'\u0131',  #u'ı',
  u'I':u'\u0130',  #u'İ',
  
  u'o':u'\u00f6',  #u'ö',
  u'O':u'\u00d6',  #u'Ö',
  
  u's':u'\u015f',  #u'ş',
  u'S':u'\u015e',  #u'Ş',
  
  u'u':u'\u00fc',  #u'ü',
  u'U':u'\u00dc'   #u'Ü'  
}

class TurkishTables:
  turkish_asciify_table = {}
  turkish_downcase_asciify_table = {}
  turkish_upcase_accents_table = {}
  turkish_toggle_accent_table = {}
  turkish_pattern_hash = {}
  
  @classmethod
  def init_tables(cls):
    cls.make_turkish_asciify_table()
    cls.make_turkish_downcase_asciify_table()
    cls.make_turkish_upcase_accents_table()
    cls.make_turkish_toggle_accent_table()
    cls.make_pattern_hash(turkish_decision_list)
    
  @classmethod
  def make_turkish_asciify_table(cls):
    ct = {}
    for i in turkish_char_alist:
      ct[turkish_char_alist[i]] = i
    cls.turkish_asciify_table = ct
    #logging.info("CREATED turkish_asciify_table")

  @classmethod
  def make_turkish_downcase_asciify_table(cls):
    ct = {}
    ch = START_CHAR
    # initialize for all characters in English alphabet
    while ch<=END_CHAR:
      ct[ch] = ch
      ct[ch.upper()] = ch
      #ch = chr(ord(ch)+1)  # next char
      ch = unichr(ord(ch)+1)  # next char   - unicode         
    # now check the characters in turkish alphabet
    for i in turkish_char_alist:
      ct[turkish_char_alist[i] ] = i.lower()
    cls.turkish_downcase_asciify_table = ct
    #logging.info("CREATED turkish_downcase_asciify_table")
  
  @classmethod
  def make_turkish_upcase_accents_table(cls):
    ct = {}
    ch = START_CHAR
    # initialize for all characters in English alphabet
    while ch<=END_CHAR:
      ct[ch] = ch
      ct[ch.upper()] = ch
      #ch = chr(ord(ch)+1)  # next char
      ch = unichr(ord(ch)+1)  # next char    
    # now check the characters in turkish alphabet (same as downcase table except for .toUpperCase)
    for i in turkish_char_alist:
      ct[ turkish_char_alist[i] ] = i.upper()
    
    ct[u'i'] = u'i'
    ct[u'I'] = u'I'
    # We will do this part a bit different. Since we have only one
    # correspondence for every character in turkish_char_alist,
    # we will just set the values directly:
    ct[TURKISH_I_DOT] = u'i'
    ct[TURKISH_i_DOTLESS] = u'I'
    cls.turkish_upcase_accents_table = ct
    #logging.info("CREATED turkish_upcase_accents_table")
  
  @classmethod
  def make_turkish_toggle_accent_table(cls):
    ct = {}
    for i in turkish_char_alist:
      ct[i] = turkish_char_alist[i]  # ascii to turkish
      ct[turkish_char_alist[i]] = i  # turkish to ascii    
    cls.turkish_toggle_accent_table = ct
    #logging.info("CREATED turkish_toggle_accent_table")

  @classmethod
  def make_pattern_hash(cls, alist):
    pt = {}
    for i in alist:     # loop through chars c,s,i,g...
      lst = alist[i]
      pt[i] = {}
      rank = 0
      for k in lst: # loop through patterns
        key = k.keys()[0]
        value = k.values()[0]
        if value==1:
          pt[i][key] = rank
        else:
          pt[i][key] = -rank        
        rank += 1      
    cls.turkish_pattern_table = pt
    #logging.info("CREATED turkish_pattern_table")

#  @classmethod
#  def debug_tables(cls):
#    cls.log_dict(cls.turkish_asciify_table, "ASCIIFY")
#    cls.log_dict(cls.turkish_downcase_asciify_table, "DOWNCASE ASCIIFY")
#    cls.log_dict(cls.turkish_upcase_accents_table, "UPCASE ACCENTS");
#    cls.log_dict(cls.turkish_toggle_accent_table, "TOGGLE ACCENT TABLE");
#    cls.log_dict(cls.turkish_asciify_table, "TURKISH ASCIIFY")
#
#  @classmethod
#  def log_dict(cls, dict, name=None):
#    if name:
#      logging.info(name)
#    for i in dict:
#      logging.info("%s : %s" % (i,dict[i]))

TurkishTables.init_tables()
