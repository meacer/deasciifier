/** Java code for compilation of Turkish Deasciifier JavaScript patterns.
 *  Runs the pattern compiler JS code and gets the compiled string from the JS.
 * 
 *  @author Mustafa Emre Acer
 *
 */
package com.deasciifier.build;

import org.mozilla.javascript.*;
import java.io.*;

public class ChromeManifestReader {
  
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

  public static void main(String args[]) throws IOException {
  
    String manifestFile = readFile(args[0]);
    Context cx = Context.enter();
    cx.setOptimizationLevel(-1);    // Interpreter mode. Otherwise will fail because of 64k java code limit.

    try {
      String scriptSource = "manifest = " + manifestFile;
      
      Scriptable scope = cx.initStandardObjects();
      Object result = cx.evaluateString(scope, scriptSource, "manifest_output.log", 1, null);
      
      Scriptable manifest = (Scriptable) scope.get("manifest", scope);
      String version = (String) manifest.get("version", manifest);
      System.out.println(Context.toString(version));
      
    } catch (Exception e) {
      System.out.println(e.toString());
    } finally {
      Context.exit();
    }
  }
}
