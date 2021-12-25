using System;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace JSClassRealizer
{
    class Program
    {
        static void Main(string[] args)
        {
            var aMZRealizer = new MZRealizer();

            var filePaths = Directory.GetFiles(GetFileFolder(args));
            foreach (string filePath in filePaths)
            {
                foreach (string line in File.ReadAllLines(filePath))
                {
                    if (aMZRealizer.IsClass(line)) aMZRealizer.AddClass(aMZRealizer.GetClassName(line));
                    if (aMZRealizer.IsMethod(line)) aMZRealizer.AddMethodInfo(aMZRealizer.GetMethodInfo(line));
                    if (aMZRealizer.HasParentInfo(line)) aMZRealizer.AddParentInfo(aMZRealizer.GetParentInfo(line));
                }
            }

            //var staticsClass = aRealizer.GetStaticsClass();
            //var extensions = aRealizer.GetExtensions();
            File.WriteAllText("classes.json", JsonSerializer.Serialize(aMZRealizer.ExportJsonObject()));
            ShowMessage("success!");
        }

        private static void ShowMessage(string message)
        {
            Console.WriteLine($"[{DateTime.Now:yyyy:MM:dd HH:mm:ss}] {message}");
        }

        private static string GetFileFolder(string[] args)
        {
            if (args?.Any() ?? false) return args[0];
            ShowMessage("folder of mz's js calss:");
            return Console.ReadLine();
        }
    }
}
