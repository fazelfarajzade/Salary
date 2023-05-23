using System.ComponentModel.DataAnnotations;
using System.Resources;

namespace Salary.API.ValidationAttributes
{
    public class PersianDateAttribute : ValidationAttribute
    {
        // Have to override IsValid
        public override bool IsValid(object? value)
        {
            //  Need to use reflection to get properties of "value"...
            if (value == null)
            {
                return true;
            }
            else if (value.GetType() != typeof(string))
            {
                return false;
            }
            else
            {
                var persianDate = value.ToString();
                var pDate = new Resources.PersianTools.PersianDate(persianDate);
                if (pDate.IsValid)
                    return true;
            }

            // All properties were null.
            return false;
        }
        public override string FormatErrorMessage(string name)
        {
            return $"{name} معتبر نیست.";
        }
    }
}
