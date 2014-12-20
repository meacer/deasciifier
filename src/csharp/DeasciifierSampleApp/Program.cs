using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeasciifierSampleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            org.deasciifier.Deasciifier deasciifier = new org.deasciifier.Deasciifier();
            deasciifier.init();
            Console.WriteLine(deasciifier.deasciify("turkce klavyesi olmayanlar icin bir yazilim."));
        }
    }
}
