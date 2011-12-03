/** Java code for compilation of Turkish Deasciifier JavaScript patterns.
 *  Runs the pattern compiler JS code and gets the compiled string from the JS.
 * 
 *  @author Mustafa Emre Acer
 *
 */
package com.deasciifier.build;

import org.mozilla.javascript.*;
import java.io.*;

public class PatternCompiler {
  
  static private String readFile(String path) throws IOException {
    BufferedReader br = new BufferedReader(new FileReader(path));
    StringBuilder sb = new StringBuilder();
    String line = null;    
    while ((line=br.readLine())!=null) {
      sb.append(line);
      sb.append("\n");
    }
    return sb.toString();
  }
  
  static private void writeFile(String path, String content) throws IOException {
    BufferedWriter bw = new BufferedWriter(new FileWriter(path));
    bw.write(content);
    bw.close();
  }
  
  public static void main(String args[]) throws IOException {
  
    if (args.length<4) {
      System.out.println("Wrong number of arguments");
      return;
    }
    File jsPath = new File(args[0]);        // The javascript that does the compilation
    File patternPath = new File(args[1]);   // Source patterns
    File templatePath = new File(args[2]);  // Output template
    File outputPath = new File(args[3]);    // Output file path
    String compileSource = readFile(jsPath.getAbsolutePath());
    String patternSource = readFile(patternPath.getAbsolutePath());
    String outputTemplate = readFile(templatePath.getAbsolutePath());

    Context cx = Context.enter();
    cx.setOptimizationLevel(-1);    // Interpreter mode. Otherwise will fail because of 64k java code limit.

    try {
      String scriptSource = patternSource + "\n" + compileSource;
      //String scriptSource = "test={'hello':'world'};";
      
      System.out.println("Running ...");
      Scriptable scope = cx.initStandardObjects();
      Object result = cx.evaluateString(scope, scriptSource, "pattern_output.log", 1, null);
      
      // Get the compiled value:
      Object patternString = scope.get("patternString", scope);
      outputTemplate = outputTemplate.replace("$COMPILED_PATTERNS$", Context.toString(patternString));
      writeFile(outputPath.getAbsolutePath(), outputTemplate);
       
    } catch (Exception e) {
      System.out.println(e.toString());
    } finally {
      Context.exit();
    }
  }
}
