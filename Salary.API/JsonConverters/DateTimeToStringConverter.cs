using Salary.API.Core.Tools;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Salary.API.JsonConverters
{
    public class DateTimeToStringConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options) =>
            throw new NotImplementedException();

        public override void Write(
            Utf8JsonWriter writer,
            DateTime value,
            JsonSerializerOptions options) =>
                writer.WriteStringValue(value.ToPersianDate(Resources.PersianTools.DateTypes.Persian).YMD);
    }
}
