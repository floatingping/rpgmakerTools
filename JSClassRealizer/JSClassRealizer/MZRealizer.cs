using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JSClassRealizer
{
    public class MZRealizer
    {
        private readonly HashSet<string> _hashClass = new HashSet<string>();
        private readonly Dictionary<string, ClassInfo> _dictClass = new Dictionary<string, ClassInfo>();


        public Dictionary<string, ClassInfo> ExportJsonObject()
        {
            return _dictClass
                .Where(c => !c.Value.HasParent())
                .ToDictionary(c => c.Key, c => c.Value);
        }

        public List<string> GetStaticsClass()
        {
            return _hashClass.Where(c => !_dictClass.ContainsKey(c)).ToList();
        }
        public List<string> GetExtensions()
        {
            return _dictClass.Where(c => !_hashClass.Contains(c.Key)).Select(c => c.Key).ToList();
        }

        public void AddClass(string className)
        {
            _hashClass.Add(className);
        }

        public void AddParentInfo(ParentInfo aParentInfo)
        {
            _dictClass.TryAdd(aParentInfo.Parent, new ClassInfo(aParentInfo.Parent));
            _dictClass.TryAdd(aParentInfo.Child, new ClassInfo(aParentInfo.Child));
            _dictClass[aParentInfo.Parent].AddChild(aParentInfo.Child, _dictClass[aParentInfo.Child]);

            if (!_dictClass[aParentInfo.Child].HasParent())
            {
                _dictClass[aParentInfo.Child].UpdateParent(_dictClass[aParentInfo.Parent]);
            }
        }
        public void AddMethodInfo(MethodInfo aMethodInfo)
        {
            _dictClass.TryAdd(aMethodInfo.ClassName, new ClassInfo(aMethodInfo.ClassName));
            _dictClass[aMethodInfo.ClassName].AddMethods(aMethodInfo.Method);
        }


        public class ClassInfo
        {
            public ClassInfo(string className)
            {
                ClassName = className;
                _childs = new Dictionary<string, ClassInfo>();
                _methods = new HashSet<string>();
                _parent = null;
            }

            public string ClassName { get; }

            public object Childs => _childs;
            public object Methods => _methods;

            private ClassInfo _parent;
            private readonly Dictionary<string, ClassInfo> _childs;
            private readonly HashSet<string> _methods;

            public bool HasParent()
            {
                return _parent != null;
            }
            public void UpdateParent(ClassInfo parent)
            {
                _parent = parent;
            }

            public void AddChild(string childClassName, ClassInfo aClassInfo)
            {
                _childs.TryAdd(childClassName, aClassInfo);
            }
            public void AddMethods(string methodName)
            {
                _methods.Add(methodName);
            }
        }

        public class MethodInfo
        {
            public MethodInfo(string className, string methodName, string methodPara)
            {
                ClassName = className;
                Method = methodName + methodPara;
            }

            public string ClassName { get; }
            public string Method { get; }
        }

        public class ParentInfo
        {
            public ParentInfo(string parent, string child)
            {
                Parent = parent;
                Child = child;
            }

            public string Parent { get; }
            public string Child { get; }
        }


        public bool HasParentInfo(string line)
        {
            if (string.IsNullOrWhiteSpace(line)) return false;
            return line.IndexOf(".prototype") < line.IndexOf("Object.create(");
        }
        public ParentInfo GetParentInfo(string line)
        {
            string lineTrim = line.Trim();
            string child = lineTrim.Split(".prototype")[0];
            string parent = lineTrim.Split("create(")[1].Split(".")[0];
            return new ParentInfo(parent, child);
        }


        public bool IsClass(string line)
        {
            if (string.IsNullOrWhiteSpace(line)) return false;
            return line.Trim().StartsWith("function ");
        }
        public string GetClassName(string line)
        {
            return line.Split("function ")[1].Split("(")[0];
        }

        public bool IsMethod(string line)
        {
            if (string.IsNullOrWhiteSpace(line)) return false;
            return line.Contains(".prototype.") && line.Contains("= function(");
        }
        public MethodInfo GetMethodInfo(string line)
        {
            string name = line.Split(".prototype.")[0];
            string methodName = line.Split(".prototype.")[1].Split("=")[0].Trim();
            string methodPara = line.Split("function")[1].Split(")")[0] + ")";
            return new MethodInfo(name, methodName, methodPara);
        }
    }
}
