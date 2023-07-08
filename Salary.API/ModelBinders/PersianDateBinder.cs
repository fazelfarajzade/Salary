using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using Salary.API.Core.Tools;

namespace Salary.API.ModelBinders
{
    public class PersianDateBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException("bindingContext", "bindingContext is null.");

            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

            if (value == null)
            {
                throw new ArgumentNullException(bindingContext.ModelName);
            }

            CultureInfo cultureInf = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            cultureInf.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, value);

            try
            {

                Tools.PersianDateStrToDateTime()
                var date = value.ConvertTo(typeof(DateTime), cultureInf);

                return date;
            }
            catch (Exception ex)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, ex);
                return null;
            }
        }
    }

    //public class NullableCustomDateBinder : IModelBinder
    //{
    //    public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
    //    {
    //        if (controllerContext == null)
    //            throw new ArgumentNullException("controllerContext", "controllerContext is null.");
    //        if (bindingContext == null)
    //            throw new ArgumentNullException("bindingContext", "bindingContext is null.");

    //        var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

    //        if (value == null) return null;

    //        CultureInfo cultureInf = (CultureInfo)CultureInfo.CurrentCulture.Clone();
    //        cultureInf.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";

    //        bindingContext.ModelState.SetModelValue(bindingContext.ModelName, value);

    //        try
    //        {
    //            var date = value.ConvertTo(typeof(DateTime), cultureInf);

    //            return date;
    //        }
    //        catch (Exception ex)
    //        {
    //            bindingContext.ModelState.AddModelError(bindingContext.ModelName, ex);
    //            return null;
    //        }
    //    }
    //}
}
