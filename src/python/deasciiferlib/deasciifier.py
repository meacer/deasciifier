'''
Python Deasciifier - Python port of Deniz Yuret's Turkish Deasciifier for emacs

Author:  Mustafa Emre Acer
Version: 1.0
Date:    July 24, 2010
'''

#import logging
from turkish_tables import *

class Deasciifier(object):
  
  def __init__(self):    
    self.turkish_context_size = 10
    self.toggle_positions = []
  
  def turkish_correct_region(self, start, end):
    for i in range(start, end):
      if self.turkish_need_correction(i):
        self.turkish_toggle_accent(i)
    return self.text
  
  
  def turkish_toggle_accent(self, pos):    
    alt = None
    if TurkishTables.turkish_toggle_accent_table.has_key(self.text[pos]):
      alt = TurkishTables.turkish_toggle_accent_table[self.text[pos]]
      self.text[pos] = alt
      self.toggle_positions.append(pos) # Only store the position
    else:
      #logging.error("TOGGLE ACCENT NOT FOUND for " + self.text[pos])
      raise Exception("TOGGLE ACCENT NOT FOUND for " + self.text[pos])
      
  def turkish_need_correction(self, pos):
    
    ch = self.text[pos]    
    if TurkishTables.turkish_asciify_table.has_key(ch): 
      tr = TurkishTables.turkish_asciify_table[ch]    
    else:
      tr = ch
    
    m = False
    if TurkishTables.turkish_pattern_table.has_key(tr.lower()):
      pl = TurkishTables.turkish_pattern_table[tr.lower()];      # Pattern list        
      m = self.turkish_match_pattern(pos, pl);          # match
    
    # if m then char should turn into turkish else stay ascii
    # only exception with capital I when we need the reverse
    if tr==u'I':
      if ch==tr:
        return not m
      else:
        return m
    
    #else:
    if ch==tr:
      return m
    else:
      return not m        
  
  def turkish_match_pattern(self, pos, dlist): # dlist: decision list
    
    rank = len(dlist) * 2;
    text = self.turkish_get_context(pos, self.turkish_context_size)
    
    start = 0
    s = u''
    r = None
    str_len = len(text);
    
    while start<=self.turkish_context_size:
      end = self.turkish_context_size + 1      
      while end<=str_len:

        s = text[start:end]  # TODO: Check against lisp substring
        
        r = None
        substr = u''.join(s)
        if dlist.has_key(substr):
          r = dlist[substr]          # lookup the pattern
          
        if (r is not None) and abs(r)<abs(rank):
          rank = r;
        
        end += 1        
      # while (end<=len) 
      start += 1 
    # while (start<=this.turkish_context_size)
    return rank>0
  
  def turkish_get_context(self, pos, size):
    
    s = u''
    c = u''
    x = u''
    space = False
    
    string_size = 2*size + 1;
    s = [u' '] * string_size              # make-string  
    s[size] = u'X'
    
    i = size+1
    current_char = pos
    text_len = len(self.text)
     
    while i<len(s) and current_char<text_len-1 and self.text[current_char]!=u' ':
    
      current_char+=1   # TODO: increment here or at the end of the loop?            
      c = self.text[current_char]
      space = (c==u' ')
      x = None
      if TurkishTables.turkish_downcase_asciify_table.has_key(c):
        x = TurkishTables.turkish_downcase_asciify_table[c]    # get the lowercase version of the character
      
      if x is None:
        if space:
          i+=1
        else:
          # space = true;
          s[i] = u' '
      else:
        s[i] = x
      
      i+=1
      space = False            
      
      
    # while (i<s.length && s[current_char]!=' ')
    s = s[0:i]
    
    current_char = pos # goto_char(p);
    i = size-1
    space = False
    
    while i>=0 and current_char>0: # TODO: add (and not end of buffer)
      current_char -= 1      
      c = self.text[current_char]
      space = (c==u' ')
      
      x = None
      if TurkishTables.turkish_upcase_accents_table.has_key(c): # get the uppercase version of the character
        x = TurkishTables.turkish_upcase_accents_table[c]
      
      if x is None:
        if space:
          i-=1
        else:
          # space = true;
          s[i] = u' '
      else:
        s[i] = x
      i-=1
      space = False      
      
    # while (i>=0)    
    #logging.info("Context at pos " + str(pos) + ", size " + str(size) + ": (" + ''.join(s) + ")")
    return s
  
  
  def turkish_correct_last_word(self, text):
    
    self.set_text(text)
    end = len(self.text)-1
    start = 0
    # TODO: We find the last word by looking at spaces. Periods
    # and line breaks also make new words. Check them too.    
    if self.text[end]==u' ':
      start = self.text.rfind(u' ', 0, end-1)
    else:
      start = self.text.rfind(u' ', 0, end);
    
    self.turkish_correct_region(start, end)
    return u''.join(self.text);
  
  def set_text(self, text):
    self.text = [u' '] * len(text)
    for i in range(0,len(text)):
      self.text[i] = text[i]
      
  def deasciify(self, text):        
    self.set_text(text)
    self.turkish_correct_region(0, len(self.text)-1);
    return u''.join(self.text);
  
  # Only returns positions:
  def deasciify_positions(self, text):
    self.deasciify(text)
    return self.toggle_positions
  
  
    