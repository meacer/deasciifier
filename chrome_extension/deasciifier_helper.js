// Seperators:
function is_seperator(c) {
  return (c==' ' || c=='\n' || c=='.' || c==',' || c==';' || c=='?' || c=='!' ||
      c=='(' || c==')' || c=='*' || c=='&' || c=='@' || c=='-');
}
// In order: <space>,.?-@;*()
//var seperatingKeyCodes = {32:1, 188:1, 190:1, 191:1, 189:1, 50:1, 186:1, 56:1, 57:1, 48:1};
function is_keycode_seperator(c) {
  return c==32 || c==13 || c==188 || c==190 || c==191 || c==189 || 
    c==50 || c==186 || c==56 || c==57 || c==48;
}
// Finds the first word seperator before the current cursor position.
function find_last_word_seperator(text, cursor_pos) {
  if (cursor_pos>=text.length) {
    cursor_pos = text.length-1;
  }
  for (var i=cursor_pos; i>0; i--) {
    // find a seperator with a normal character before it:
    if (is_seperator(text.charAt(i)) && !is_seperator(text.charAt(i-1))) {
      return i;
    }
  }
  return 0;
}
// Converts the word right before the cursor position:
function deasciify_word_at_cursor(text, cursor_pos) {
  var firstSpace = find_last_word_seperator(text, cursor_pos);
  var secondSpace = 0;
  if (firstSpace>0) {
    secondSpace = find_last_word_seperator(text, firstSpace-1);
  }
  // Word is between firstSpace and secondSpace:
  return deasciifier.deasciifyRange(text, secondSpace, firstSpace);
}
