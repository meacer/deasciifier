/// 
/// CSharp Deasciifier. Based on Dr. Deniz Yuret's
/// turkish-mode for emacs.
/// 
/// Author:     Mustafa Emre Acer
/// Version:    1.0
/// Date:       2010-12-12 05:36
///
using System;
using System.Collections.Generic;
using System.Text;

namespace org.deasciifier
{
    class Deasciifier
    {
        DeasciifierPatterns patterns = null;
        private int turkish_context_size = 20;        
        private String m_text;
        private int num_toggled_chars = 0;

        // Initializes everything
        public void init()
        {
            if (patterns == null) {
                patterns = new DeasciifierPatterns();
            }
            patterns.init();
        }        
        public int get_num_toggled_chars() {
            return num_toggled_chars;
        }

        private String turkish_correct_region(int start, int end)
        {
            num_toggled_chars = 0;
            for (int i = start; i <= end; i++)
            {
                if (turkish_need_correction(i))
                {
                    turkish_toggle_accent(i);
                }
            }
            return m_text;
        }

        private String setCharAt(String text, int index, String s)
        {
            //return text.Substring(0, index) + s + text.Substring(index + 1);
            StringBuilder sb = new StringBuilder(text.Length);
            sb.Append(text.Substring(0, index));
            sb.Append(s);
            sb.Append(text.Substring(index + 1));
            return sb.ToString();
        }

        private void turkish_toggle_accent(int pos)
        {
            String ch = m_text[pos].ToString();
            String alt = patterns.turkish_toggle_accent_table.ContainsKey(ch) ?
                            patterns.turkish_toggle_accent_table[ch] : null;
            if (alt != null)
            {
                // We cannot directly set the character in JS like this:
                // this.text[pos] = alt      
                // So we do this:
                //this.text = this.setCharAt(this.text, pos, alt);
                //m_text[pos] = alt;
                m_text = setCharAt(m_text, pos, alt);
                num_toggled_chars++;
                // TODO: put the string as an array we can manipulate
                // chars directly.
            }
        }

        private bool turkish_need_correction(int pos)
        {
            String ch = m_text[pos].ToString();
            String tr = patterns.turkish_asciify_table.ContainsKey(ch) ?
                    patterns.turkish_asciify_table[ch] : ch;
            bool m = false;
            if (patterns.turkish_pattern_table.ContainsKey(tr.ToLower()))
            {
                Dictionary<String, Int16> pl = patterns.turkish_pattern_table[tr.ToLower()];  // Pattern list                
                m = turkish_match_pattern(pos, pl);  // match
            }
            // if m then char should turn into turkish else stay ascii
            // only exception with capital I when we need the reverse
            if (tr == "I")
            {
                return (ch == tr) ? !m : m;
            }/* else {
              return (ch==tr) ? m: !m;
            }
            return m;*/
            return (ch == tr) ? m : !m;
        }

        private bool turkish_match_pattern(int pos, Dictionary<String, Int16> dlist)
        { // dlist: decision list

            int rank = dlist.Count * 2;
            String str = turkish_get_context(pos, turkish_context_size);
            int start = 0;
            String s;
            int r;  // rank
            int len = str.Length;

            while (start <= turkish_context_size)
            {

                int end = turkish_context_size + 1;
                while (end <= len)
                {
                    s = str.Substring(start, end - start);  // TODO verify
                    if (dlist.ContainsKey(s))
                    {
                        r = dlist[s];            // lookup the pattern
                        if (Math.Abs(r) < Math.Abs(rank))
                        {
                            rank = r;
                        }
                    }
                    end++;
                }
                start++;
            }
            return rank > 0;
        }

        private String turkish_get_context(int pos, int size)
        {

            String s = "";
            bool space = false;
            String c, x;
            int string_size = 2 * size + 1;
            for (int j = 0; j < string_size; j++)
            { // make-string
                s = s + " ";
            }
            s = setCharAt(s, size, "X");
            int i = size + 1;
            int index = pos + 1;
            while (i < s.Length && !space && index < m_text.Length)
            {
                c = m_text[index].ToString();
                //x = turkish_downcase_asciify_table[c];
                x = patterns.turkish_downcase_asciify_table.ContainsKey(c) ?
                      patterns.turkish_downcase_asciify_table[c] : null;
                if (x == null)
                {
                    if (space)
                    {
                        i++;
                    }
                    else
                    {
                        space = true;
                    }
                }
                else
                {
                    s = setCharAt(s, i, x);
                    space = false;
                }
                i++; // this is not the way it's done in turkish-mode, i++ is inside else        
                //}
                index++;
            } // while (i<s.length && s[index]!=' ')
            s = s.Substring(0, i); // TODO verify 

            index = pos; // goto_char(p);
            i = size - 1;
            space = false;

            index--;
            //while (i>=0 && index>0) {
            while (i >= 0 && index >= 0)
            {
                c = m_text[index].ToString();
                x = patterns.turkish_upcase_accents_table.ContainsKey(c) ?
                      patterns.turkish_upcase_accents_table[c] : null;
                if (x == null)
                {
                    if (space)
                    {
                        i--;
                    }
                    else
                    {
                        space = true;
                    }
                }
                else
                {
                    s = setCharAt(s, i, x);
                    space = false;
                }
                i--; // this is not the way it's done in turkish-mode, i-- is inside else
                //}
                index--;
            } // while (i>=0)
            return s;
        }

        public String turkish_correct_last_word(String text)
        {
            m_text = text;
            int end = m_text.Length - 1;
            int start = 0;
            // TODO: We find the last word by looking at spaces. Periods
            // and line breaks also make new words. Check them too.
            if (text[end] == ' ')
            {
                start = m_text.LastIndexOf(' ', end - 2); // TODO verify
            }
            else
            {
                start = m_text.LastIndexOf(' ', end - 1);
            }
            turkish_correct_region(start, end);
            return m_text;
        }

        public String deasciifyRange(String text, int start, int end)
        {
            // TODO: Better performance.
            // We should return an array of toggled character positions,
            // split the text into characters, toggle required characters and join
            // again. This way we get rid of string operations and use less memory.
            if (text == null || text.Trim().Length == 0)
            {
                return text;
            }
            m_text = text;
            turkish_correct_region(start, end);
            return m_text;
        }

        public String deasciify(String text)
        {
            if (text == null || text.Trim().Length == 0)
            {
                return text;
            }
            return deasciifyRange(text, 0, text.Length - 1);
        }
    }
}
