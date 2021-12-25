using System;
using Xunit;

namespace JSClassRealizer.Tests
{
    public class MZRealizerTest
    {
        [Theory]
        [InlineData("Window_Scrollable.prototype = Object.create(Window_Base.prototype);", true)]
        [InlineData("function Window_Scrollable() {", false)]
        [InlineData("Window_Scrollable.prototype.initialize = function(rect) {", false)]
        [InlineData("    Window_Base.prototype.initialize.call(this, rect);", false)]
        [InlineData("    this.initialize(...arguments);", false)]
        [InlineData("Window_Scrollable.prototype.constructor = Window_Scrollable;", false)]
        public void Test_HasParentInfo(string line, bool expected)
        {
            var aRealizer = new MZRealizer();

            bool actual = aRealizer.HasParentInfo(line);

            Assert.Equal(expected, actual);
        }
        [Theory]
        [InlineData("Window_StatusParams.prototype = Object.create(Window_StatusBase.prototype);", "Window_StatusBase", "Window_StatusParams")]
        public void Test_GetParentInfo(string line, string parent, string child)
        {
            var aRealizer = new MZRealizer();

            var aParentInfo = aRealizer.GetParentInfo(line);

            Assert.Equal(parent, aParentInfo.Parent);
            Assert.Equal(child, aParentInfo.Child);
        }

        [Theory]
        [InlineData("function Window_Scrollable() {", true)]
        [InlineData("Window_Scrollable.prototype.initialize = function(rect) {", false)]
        [InlineData("    Window_Base.prototype.initialize.call(this, rect);", false)]
        [InlineData("    this.initialize(...arguments);", false)]
        [InlineData("Window_Scrollable.prototype = Object.create(Window_Base.prototype);", false)]
        [InlineData("Window_Scrollable.prototype.constructor = Window_Scrollable;", false)]
        public void Test_IsClass(string line, bool expected)
        {
            var aRealizer = new MZRealizer();

            bool actual = aRealizer.IsClass(line);

            Assert.Equal(expected, actual);
        }
        [Theory]
        [InlineData("function Window_Scrollable() {", "Window_Scrollable")]
        public void Test_GetClassName(string line, string className)
        {
            var aRealizer = new MZRealizer();

            string actual = aRealizer.GetClassName(line);

            Assert.Equal(className, actual);
        }


        [Theory]
        [InlineData("Window_Scrollable.prototype.initialize = function(rect) {", true)]
        [InlineData("    Window_Base.prototype.initialize.call(this, rect);", false)]
        [InlineData("function Window_Scrollable() {", false)]
        [InlineData("    this.initialize(...arguments);", false)]
        [InlineData("Window_Scrollable.prototype = Object.create(Window_Base.prototype);", false)]
        [InlineData("Window_Scrollable.prototype.constructor = Window_Scrollable;", false)]
        public void Test_IsMethod(string line, bool expected)
        {
            var aRealizer = new MZRealizer();

            bool actual = aRealizer.IsMethod(line);

            Assert.Equal(expected, actual);
        }


        [Theory]
        [InlineData("Window_Scrollable.prototype.scrollTo = function(x, y) {", "Window_Scrollable", "scrollTo(x, y)")]
        [InlineData("Window_Scrollable.prototype.scrollBaseY = function()", "Window_Scrollable", "scrollBaseY()")]
        public void Test_GetMethod(string line, string className, string method)
        {
            var aRealizer = new MZRealizer();

            var aMethodInfo = aRealizer.GetMethodInfo(line);

            Assert.Equal(className, aMethodInfo.ClassName);
            Assert.Equal(method, aMethodInfo.Method);
        }

    }
}
