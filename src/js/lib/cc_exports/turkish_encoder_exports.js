var turkish_encoder = require('../turkish_encoder');

// Exports for Closure Compiler.
window["TurkishEncoder"] = {
  "encodeJS": turkish_encoder.TurkishEncoder.encodeJS,
  "encodeHTML": turkish_encoder.TurkishEncoder.encodeHTML
};
